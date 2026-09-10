import { test, expect } from './fixtures/hass';
import { removeState, setState, useDashboard } from './helpers/homeassistant';
import { feedEntry, feedSensor, feedparserDate, pngBytes } from './helpers/feed';

/**
 * The behaviour a browser is needed for and a unit test cannot reach.
 *
 * Two of these are live-update bugs: the card kept the expanded panel by
 * position, so an entry arriving at the top of the feed inherited the open
 * panel of whatever the user had opened, and the inline `max-height` measured
 * for the old body was applied to the new one. jsdom can be made to show the
 * first half of that; only a real browser lays out the panel, so only here does
 * "the body the user is reading is still the one on screen" mean anything.
 *
 * The rest are the shapes a feed is not obliged to have: no date, no title, no
 * link, or an entity that is simply down.
 */
const FEED = 'sensor.e2e_robust_feed';
const BROKEN = 'sensor.e2e_robust_unavailable';

const OLDER = new Date('2026-03-01T08:05:00Z');
const NEWER = new Date('2026-03-02T10:15:00Z');
const NEWEST = new Date('2026-03-03T09:00:00Z');

const OLDER_ENTRY = feedEntry({
  title: 'Older story',
  link: 'https://example.com/older',
  summary: '<p>The older body.</p>',
  published: OLDER,
  id: 'e2e-robust-older',
});

const NEWER_ENTRY = feedEntry({
  title: 'Newer story',
  link: 'https://example.com/newer',
  summary: '<p>The newer body.</p>',
  published: NEWER,
  id: 'e2e-robust-newer',
});

/** Pushed in mid-test, so it takes over the top slot of the list. */
const NEWEST_ENTRY = feedEntry({
  title: 'Newest story',
  link: 'https://example.com/newest',
  summary: '<p>The newest body.</p>',
  published: NEWEST,
  id: 'e2e-robust-newest',
});

/**
 * The awkward shapes, written out rather than built by the helper: the helper
 * describes a complete entry, and what is under test here is what happens when
 * the feed leaves things out.
 */
const NO_DATE_ENTRY = {
  title: 'Entry without a date',
  link: 'https://example.com/no-date',
  summary: '<p>No date anywhere.</p>',
  id: 'e2e-robust-no-date',
};

const NO_TITLE_ENTRY = {
  link: 'https://example.com/no-title',
  summary: '<p>No title either.</p>',
  published: feedparserDate(OLDER),
  id: 'e2e-robust-no-title',
};

const NO_LINK_ENTRY = {
  summary: '<p>Neither title nor link.</p>',
  published: feedparserDate(new Date('2026-02-28T08:00:00Z')),
  id: 'e2e-robust-no-link',
};

async function seed(entries: Record<string, unknown>[]): Promise<void> {
  const sensor = feedSensor(entries);
  await setState(FEED, sensor.state, sensor.attributes);
}

let urlPath: string;

test.beforeAll(async () => {
  await seed([OLDER_ENTRY, NEWER_ENTRY]);
  await setState(BROKEN, 'unavailable');

  urlPath = await useDashboard('robustness', {
    views: [
      {
        title: 'Feed',
        cards: [
          {
            type: 'custom:rss-accordion',
            title: 'E2E robustness',
            entity: FEED,
            open_behavior: 'none',
            allow_multiple: true,
          },
        ],
      },
      {
        title: 'Down',
        cards: [{ type: 'custom:rss-accordion', title: 'E2E down', entity: BROKEN }],
      },
    ],
  });
});

test.afterAll(async () => {
  await removeState(FEED);
  await removeState(BROKEN);
});

test.describe('A feed that changes under the card', () => {
  test('keeps the panel the user opened open when a newer entry arrives', async ({ page, consoleErrors }) => {
    await seed([OLDER_ENTRY, NEWER_ENTRY]);
    await page.goto(`/${urlPath}/0`);

    const card = page.locator('rss-accordion');
    await expect(card.locator('.accordion-item')).toHaveCount(2, { timeout: 60_000 });

    // Open the entry that currently sits at the top.
    const opened = card.locator('.accordion-item').first();
    await opened.locator('.accordion-header').click();
    await expect(opened.locator('.accordion-content')).toBeVisible();
    await expect(opened.locator('.item-summary')).toContainText('The newer body');

    await seed([OLDER_ENTRY, NEWER_ENTRY, NEWEST_ENTRY]);

    // The new entry takes position 0 ...
    await expect(card.locator('.accordion-item')).toHaveCount(3, { timeout: 30_000 });
    await expect(card.locator('.accordion-header .title-link')).toHaveText([
      'Newest story',
      'Newer story',
      'Older story',
    ]);

    // ... but the open panel stays with the entry the user opened, and the body
    // on screen is still that entry's body rather than the new one's.
    const open = card.locator('.accordion-item[open]');
    await expect(open).toHaveCount(1);
    await expect(open.locator('.title-link')).toHaveText('Newer story');
    await expect(open.locator('.item-summary')).toContainText('The newer body');
    await expect(open.locator('.accordion-content')).toBeVisible();

    // And the panel is measured for the content it holds, not left with the
    // height of whatever was rendered there before.
    const clipped = await open.locator('.accordion-content').evaluate((el) => el.scrollHeight > el.clientHeight + 1);
    expect(clipped).toBe(false);

    await expect(card.locator('.accordion-item').first().locator('.accordion-content')).toBeHidden();
    expect(consoleErrors).toEqual([]);
  });
});

test.describe('A body that re-renders around a new image', () => {
  /**
   * A panel is measured for the body it holds, and an `<img>` the browser has
   * not decoded yet contributes no height at all. A feed that rewrites an entry
   * without touching its link or its published date keeps the item key, so the
   * DOM node - and the open panel with it - survives, and the rewritten body is
   * measured while its picture is still in flight: `max-height` is pinned to
   * the height without it and nothing measures it again.
   *
   * The entry gains a picture rather than swapping one, because swapping does
   * not reproduce it: an `<img>` whose `src` is rebound keeps painting the
   * previous image, at the previous size, until the new one arrives, so the
   * panel never measures short. A picture that was not there before has no such
   * stand-in and occupies nothing.
   */
  const IMAGE = '/local/rss-accordion-e2e/late.png';

  const illustrated = (image?: string): Record<string, unknown> =>
    feedEntry({
      title: 'Illustrated story',
      link: 'https://example.com/illustrated',
      summary: '<p>The illustrated body.</p>',
      published: NEWER,
      id: 'e2e-robust-illustrated',
      ...(image ? { image } : {}),
    });

  test('measures the panel around the new picture, not around its absence', async ({ page, consoleErrors }) => {
    // Held back deliberately. The defect only exists while a picture is still
    // in flight, so the delay is the test condition, not a convenience.
    const body = pngBytes(400, 300, [20, 90, 200]);
    await page.route(`**${IMAGE}`, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({ status: 200, contentType: 'image/png', body });
    });

    await seed([illustrated()]);
    await page.goto(`/${urlPath}/0`);

    const card = page.locator('rss-accordion');
    await expect(card.locator('.accordion-item')).toHaveCount(1, { timeout: 60_000 });

    const item = card.locator('.accordion-item');
    const content = item.locator('.accordion-content');

    await item.locator('.accordion-header').click();
    await expect(content).toBeVisible();
    await expect(item.locator('img.item-image')).toHaveCount(0);

    /**
     * Whether the panel is tall enough for everything inside it.
     *
     * Polled rather than sampled once: a panel that opens by hand animates to
     * its height, and a single read lands mid-transition and reports a clip
     * that is not one. The failure this guards against is a `max-height` that
     * is pinned short and never corrected, so it survives any amount of
     * waiting - polling costs nothing but the settling time.
     */
    const fits = async (): Promise<boolean> =>
      content.evaluate(async (el) => {
        await Promise.all([...el.querySelectorAll('img')].map((img) => img.decode().catch(() => undefined)));
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return el.scrollHeight <= el.clientHeight + 1;
      });

    await expect.poll(fits, { timeout: 15_000 }).toBe(true);

    // Same link and same published date, so the same key and the same node -
    // but a body that now carries a picture, and one still on its way.
    await seed([illustrated(IMAGE)]);
    await expect(item.locator('img.item-image')).toHaveAttribute('src', IMAGE, { timeout: 30_000 });

    // The panel is still the one the user opened, and it still fits its body.
    await expect(item).toHaveAttribute('open', '');
    await expect.poll(fits, { timeout: 15_000 }).toBe(true);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe('Entries the feed left incomplete', () => {
  test('renders a dateless, titleless, linkless entry without artefacts', async ({ page, consoleErrors }) => {
    await seed([NO_DATE_ENTRY, NO_TITLE_ENTRY, NO_LINK_ENTRY]);
    await page.goto(`/${urlPath}/0`);

    const card = page.locator('rss-accordion');
    await expect(card.locator('.accordion-item')).toHaveCount(3, { timeout: 60_000 });

    // Nothing anywhere reads "Invalid Date" - the row is left out instead.
    await expect(card.locator('ha-card')).not.toContainText(/invalid date/i);

    const noDate = card.locator('.accordion-item', { hasText: 'Entry without a date' });
    await noDate.locator('.accordion-header').click();
    await expect(noDate.locator('.item-summary')).toContainText('No date anywhere');
    await expect(noDate.locator('.item-published')).toHaveCount(0);

    // A missing title becomes a placeholder, so the header is not an empty row.
    const noTitle = card.locator('.accordion-item', { hasText: 'No title either' });
    await expect(noTitle.locator('.title-link')).toHaveText(/\S/);

    // A missing link is not rendered as an anchor at all: an empty href points
    // at the dashboard, so clicking it would reload the page.
    const noLink = card.locator('.accordion-item').last();
    await expect(noLink.locator('span.title-link')).toHaveCount(1);
    await expect(noLink.locator('a.title-link')).toHaveCount(0);

    const before = page.url();
    await noLink.locator('.accordion-header').click();
    await expect(noLink.locator('.accordion-content')).toBeVisible();
    await expect(noLink.locator('.item-link')).toHaveCount(0);
    expect(page.url()).toBe(before);

    expect(consoleErrors).toEqual([]);
  });
});

test.describe('An entity that is down', () => {
  test('says the entity is unavailable instead of blaming the feed', async ({ page }) => {
    await page.goto(`/${urlPath}/1`);

    const card = page.locator('rss-accordion');
    await expect(card.locator('ha-card')).toBeVisible({ timeout: 60_000 });

    const warning = card.locator('.card-content.warning');
    await expect(warning).toBeVisible();
    await expect(warning).toContainText(BROKEN);
    await expect(warning).not.toContainText(/no entries available/i);
  });
});
