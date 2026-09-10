import { test, expect } from './fixtures/hass';
import { removeState, setState, useDashboard } from './helpers/homeassistant';
import { feedChannel, feedEntry, feedSensor } from './helpers/feed';

const FEED = 'sensor.e2e_card_feed';

/**
 * Fixed dates in the past, so neither entry earns the "NEW" pill and the order
 * the card sorts them into is a fixed expectation rather than a race with the
 * clock.
 */
const NEWER = new Date('2026-03-02T10:15:00Z');
const OLDER = new Date('2026-03-01T08:05:00Z');
const CHANNEL_UPDATED = new Date('2026-03-02T11:00:00Z');

const ENTRIES = [
  feedEntry({
    title: 'Second story',
    link: 'https://example.com/second',
    summary: '<p>The <b>older</b> body.</p>',
    published: OLDER,
    id: 'e2e-second',
    tags: ['Tech'],
  }),
  feedEntry({
    title: 'First story',
    link: 'https://example.com/first',
    summary: '<p>The <b>newer</b> body, with a <a href="https://example.com/deep">link</a>.</p>',
    published: NEWER,
    id: 'e2e-first',
    tags: ['News'],
  }),
];

const CHANNEL = feedChannel({
  title: 'E2E Feed',
  link: 'https://example.com/',
  subtitle: 'Everything that fits',
  updated: CHANNEL_UPDATED,
});

let urlPath: string;

test.beforeAll(async () => {
  const sensor = feedSensor(ENTRIES, CHANNEL);
  await setState(FEED, sensor.state, sensor.attributes);

  urlPath = await useDashboard('card', {
    views: [
      {
        title: 'Feed',
        cards: [
          {
            type: 'custom:rss-accordion',
            title: 'E2E accordion',
            entity: FEED,
            show_channel_info: true,
            // Nothing is expanded up front, so the expansion test below asserts
            // a state the card actually changed into.
            open_behavior: 'none',
          },
        ],
      },
      { title: 'Elsewhere', cards: [{ type: 'markdown', content: 'nothing here' }] },
    ],
  });
});

test.afterAll(async () => {
  await removeState(FEED);
});

test.describe('The card on a real dashboard', () => {
  test('renders the channel and one accordion item per feed entry', async ({ page, consoleErrors }) => {
    await page.goto(`/${urlPath}/0`);

    // Assert on what the card paints, not on the custom element itself: the
    // host has no box of its own, so Playwright rightly calls it hidden.
    const card = page.locator('rss-accordion');
    await expect(card.locator('ha-card')).toBeVisible({ timeout: 60_000 });

    await expect(card.locator('.channel-title')).toHaveText('E2E Feed');
    await expect(card.locator('.channel-description')).toHaveText('Everything that fits');

    // Newest first - the card re-sorts, so the order below is not the order the
    // entries were seeded in.
    await expect(card.locator('.accordion-item')).toHaveCount(2);
    await expect(card.locator('.accordion-header .title-link')).toHaveText(['First story', 'Second story']);

    // The titles are links to the articles, opened without handing over the
    // opener.
    const firstTitle = card.locator('.accordion-header .title-link').first();
    await expect(firstTitle).toHaveAttribute('href', 'https://example.com/first');
    await expect(firstTitle).toHaveAttribute('target', '_blank');
    await expect(firstTitle).toHaveAttribute('rel', 'noopener noreferrer');

    // Nothing in the feed is recent, so no entry is flagged as new.
    await expect(card.locator('.new-pill')).toHaveCount(0);
    await expect(card.locator('.card-content .warning')).toHaveCount(0);
    expect(consoleErrors).toEqual([]);
  });

  test('shows an item body only once it is expanded', async ({ page }) => {
    await page.goto(`/${urlPath}/0`);
    const card = page.locator('rss-accordion');
    await expect(card.locator('.accordion-item')).toHaveCount(2, { timeout: 60_000 });

    const first = card.locator('.accordion-item').first();
    const body = first.locator('.accordion-content');
    // Collapsed content is a zero-height overflow-hidden box inside a closed
    // <details>, so "not visible" is the real user-facing state, not a proxy.
    await expect(body).toBeHidden();

    await first.locator('.accordion-header').click();

    await expect(body).toBeVisible();
    await expect(body.locator('.item-summary')).toContainText('The newer body, with a link.');
    // The summary is HTML that went through the sanitizer, and its harmless
    // markup has to survive that.
    await expect(body.locator('.item-summary b')).toHaveText('newer');
    await expect(body.locator('.item-summary a')).toHaveAttribute('href', 'https://example.com/deep');
    await expect(body.locator('.item-link')).toBeVisible();

    // The date lives inside the panel, so this is the first point at which it
    // is painted at all. `published` arrives as feedparser's formatted string
    // rather than as an ISO timestamp, and the card has to parse and re-render
    // it - anything it fails to parse comes out as "Invalid Date". The
    // assertion is on the day it names, not on the whole string: the card
    // formats with `toLocaleString`, and current ICU puts a narrow no-break
    // space in front of the AM/PM marker.
    const date = body.locator('.item-published');
    await expect(date).toBeVisible();
    await expect(date).toHaveText(/Mar 0?2,? 2026/);
    await expect(date).not.toHaveText(/invalid/i);

    // The other item is untouched: nothing opened it, and it is not the card's
    // "expand everything" mode.
    await expect(card.locator('.accordion-item').nth(1).locator('.accordion-content')).toBeHidden();
  });

  test('comes back after leaving the view and returning', async ({ page }) => {
    // Views are torn out of the DOM on a switch, and this card measures the
    // expanded panel against the DOM it just painted. A card that does not
    // rebuild on the way back comes back as an empty box, and no unit test sees
    // that.
    await page.goto(`/${urlPath}/0`);
    const card = page.locator('rss-accordion');
    await expect(card.locator('.accordion-item')).toHaveCount(2, { timeout: 60_000 });

    await page.getByRole('tab', { name: 'Elsewhere' }).click();
    await expect(page.locator('rss-accordion')).toHaveCount(0);

    await page.getByRole('tab', { name: 'Feed' }).click();
    await expect(card.locator('ha-card')).toBeVisible({ timeout: 30_000 });
    await expect(card.locator('.accordion-item')).toHaveCount(2);
    await expect(card.locator('.channel-title')).toHaveText('E2E Feed');

    // And it is still interactive, not just painted.
    const first = card.locator('.accordion-item').first();
    await first.locator('.accordion-header').click();
    await expect(first.locator('.accordion-content')).toBeVisible();
    await expect(first.locator('.item-summary')).toContainText('The newer body');
  });
});
