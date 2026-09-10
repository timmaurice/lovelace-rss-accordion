import { test, expect } from './fixtures/hass';
import { removeState, setState, useDashboard } from './helpers/homeassistant';
import { feedChannel, feedEntry, feedSensor } from './helpers/feed';

/**
 * The branch this suite was written alongside carries a stored-XSS fix: feed
 * content is remote, attacker-influenced input, and the card puts it into
 * `.innerHTML`. Inside the Home Assistant frontend origin that is a session
 * takeover, not a cosmetic bug.
 *
 * The unit tests already assert what `sanitizeHtml()` returns. What they cannot
 * assert is that the payload does not RUN: jsdom does not fetch images, does
 * not execute injected scripts the way a browser does, and does not navigate
 * `javascript:` URLs. Only a real browser proves that, which is what this file
 * is for.
 */
const FEED = 'sensor.e2e_xss_feed';

/** The payload writes here if anything at all executes. */
const FLAG = '__e2eXssExecuted';

const PUBLISHED = new Date('2026-03-05T12:00:00Z');

/**
 * Hostile HTML with harmless markup wrapped around it, so the same assertion
 * run proves both halves of the sanitizer's job: the dangerous parts are gone
 * and the ordinary formatting a feed relies on is not.
 */
const HOSTILE_SUMMARY = [
  '<p>Harmless <b>intro</b> paragraph.</p>',
  `<script>window.${FLAG} = 'inline-script';</script>`,
  `<img src="x" onerror="window.${FLAG} = 'img-onerror';" alt="broken">`,
  `<a href="javascript:window.${FLAG} = 'javascript-href';void 0">tap me</a>`,
  `<iframe src="javascript:window.parent.${FLAG} = 'iframe';"></iframe>`,
  '<p>Harmless <a href="https://example.com/safe">outro link</a>.</p>',
].join('');

const HOSTILE_TITLE = "Payload <script>window.__e2eXssExecuted = 'title';</script>";

const CHANNEL = feedChannel({
  title: 'Hostile Feed',
  link: 'https://example.com/',
  // The channel description travels a different path than the item summary - it
  // is bound as text, not as innerHTML - so a payload here must come out as
  // visible characters rather than as markup.
  subtitle: `Channel <script>window.${FLAG} = 'channel';</script> subtitle`,
  updated: PUBLISHED,
});

let urlPath: string;

test.beforeAll(async () => {
  const sensor = feedSensor(
    [
      feedEntry({
        title: HOSTILE_TITLE,
        link: 'https://example.com/hostile',
        summary: HOSTILE_SUMMARY,
        published: PUBLISHED,
        id: 'e2e-hostile',
      }),
    ],
    CHANNEL,
  );
  await setState(FEED, sensor.state, sensor.attributes);

  urlPath = await useDashboard('xss', {
    views: [
      {
        title: 'Hostile',
        cards: [
          {
            type: 'custom:rss-accordion',
            title: 'E2E hostile feed',
            entity: FEED,
            show_channel_info: true,
            // With a hero image the card strips every <img> out of the summary
            // before it is sanitized, which would hide the img payload from
            // this test rather than defuse it.
            show_item_image: false,
            // The payload has to be in the document to be able to fire, so the
            // panel is open from the start.
            open_behavior: 'all',
          },
        ],
      },
    ],
  });
});

test.afterAll(async () => {
  await removeState(FEED);
});

test.describe('Hostile feed HTML', () => {
  test('does not execute anything the feed sent', async ({ page, consoleErrors }) => {
    // The flag is planted before any of the page's own scripts run, so it is
    // observably absent rather than merely never created - a payload that fired
    // and then failed would still leave it set.
    await page.addInitScript((flag) => {
      (window as unknown as Record<string, unknown>)[flag] = undefined;
    }, FLAG);

    await page.goto(`/${urlPath}/0`);
    const card = page.locator('rss-accordion');
    const summary = card.locator('.item-summary');
    await expect(summary).toBeVisible({ timeout: 60_000 });

    const flagValue = () => page.evaluate((flag) => (window as unknown as Record<string, unknown>)[flag], FLAG);
    expect(await flagValue()).toBeUndefined();

    // Clicking the `javascript:` link is the only way to find out whether the
    // href really is gone: an href the sanitizer left behind would navigate the
    // frame and run the payload on click, and nothing about the rendered DOM
    // would look different beforehand.
    // Located by its text, not by its class: the allow-list drops `class` too,
    // so the marker put on it in the payload is not in the rendered DOM.
    const payloadLink = summary.locator('a', { hasText: 'tap me' });
    await expect(payloadLink).toHaveCount(1);
    await expect(payloadLink).not.toHaveAttribute('href', /javascript:/i);
    await payloadLink.click();
    // A `javascript:` navigation is synchronous, an image error is not - give
    // both a chance to have happened before believing the flag.
    await page.waitForTimeout(1000);
    expect(await flagValue()).toBeUndefined();

    // A reload re-renders the whole payload from the stored state, which is
    // what "stored XSS" means: the entity keeps it, so every visit is a fresh
    // attempt.
    await page.reload();
    await expect(card.locator('.item-summary')).toBeVisible({ timeout: 60_000 });
    await page.waitForTimeout(1000);
    expect(await flagValue()).toBeUndefined();

    // The stripped `<img src="x">` cannot load, and the browser logs that -
    // which is itself the proof that `onerror` was removed rather than fired.
    // Nothing else may be on the console, and no error may have escaped into
    // the page.
    const unexpected = consoleErrors.filter((text) => !/failed to load resource|net::ERR|404/i.test(text));
    expect(unexpected).toEqual([]);
  });

  test('strips the dangerous elements and attributes out of the rendered DOM', async ({ page }) => {
    await page.goto(`/${urlPath}/0`);
    const card = page.locator('rss-accordion');
    await expect(card.locator('.item-summary')).toBeVisible({ timeout: 60_000 });

    // Read through the locator, not through `document.querySelector`: the card
    // sits several shadow roots deep inside the dashboard, and only Playwright's
    // locators pierce those.
    const rendered = await card.locator('.item-summary').evaluate((body) => {
      const elements = [...body.querySelectorAll('*')];
      return {
        tags: [...new Set(elements.map((element) => element.tagName.toLowerCase()))].sort(),
        attributes: [
          ...new Set(elements.flatMap((element) => [...element.attributes].map((attribute) => attribute.name))),
        ].sort(),
        urls: elements
          .map((element) => element.getAttribute('href') ?? element.getAttribute('src'))
          .filter((value): value is string => value !== null),
        html: body.innerHTML,
      };
    });

    // Neither the elements the payload needs...
    expect(rendered.tags).not.toContain('script');
    expect(rendered.tags).not.toContain('iframe');
    // ...nor a single event handler survived.
    for (const attribute of rendered.attributes) expect(attribute).not.toMatch(/^on/i);
    expect(rendered.attributes).not.toContain('onerror');
    expect(rendered.attributes).not.toContain('style');

    // No URL anywhere in the rendered body carries a script scheme, and the
    // payload's source text is not sitting in the DOM waiting to be re-parsed.
    for (const url of rendered.urls) expect(url).not.toMatch(/^\s*javascript:/i);
    expect(rendered.html).not.toMatch(/<script/i);
    expect(rendered.html).not.toMatch(/<iframe/i);
    expect(rendered.html).not.toMatch(/onerror/i);

    // And the harmless markup around the payload is untouched: the sanitizer
    // has to be a filter, not a "strip everything" fallback.
    const summary = card.locator('.item-summary');
    await expect(summary).toContainText('Harmless intro paragraph.');
    await expect(summary.locator('p')).toHaveCount(2);
    await expect(summary.locator('b').first()).toHaveText('intro');
    const safeLink = summary.locator('a[href="https://example.com/safe"]');
    await expect(safeLink).toHaveText('outro link');
    await expect(safeLink).toHaveAttribute('target', '_blank');
    await expect(safeLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('shows a hostile title and channel description as text, not as markup', async ({ page }) => {
    await page.addInitScript((flag) => {
      (window as unknown as Record<string, unknown>)[flag] = undefined;
    }, FLAG);

    await page.goto(`/${urlPath}/0`);
    const card = page.locator('rss-accordion');
    const title = card.locator('.accordion-header .title-link');
    await expect(title).toBeVisible({ timeout: 60_000 });

    // Lit binds these as text nodes, so the payload has to be readable on
    // screen. If it were ever bound as HTML instead, the text would be gone and
    // this assertion would be the one that notices.
    await expect(title).toContainText('<script>');
    await expect(card.locator('.channel-description')).toContainText('<script>');
    expect(await page.evaluate((flag) => (window as unknown as Record<string, unknown>)[flag], FLAG)).toBeUndefined();
  });
});
