import { test, expect } from './fixtures/hass';
import { BUNDLE_NAME, BUNDLE_URL, resources, useDashboard } from './helpers/homeassistant';

const CARD_NAME = 'rss-accordion';
const EDITOR_NAME = 'rss-accordion-editor';
const DUPLICATE_MARKER = 'e2e-duplicate';

test.describe('Lovelace resource registration', () => {
  test('has exactly one resource for the card bundle', async () => {
    // `docker-compose.yml` mounts dist/ as /config/www, so the bundle is served
    // as /local/rss-accordion.js and the instance registers it once. Two
    // entries load the bundle twice, and an unguarded customElements.define()
    // then throws while the module is being evaluated.
    const ours = (await resources()).filter((resource) => resource.url.split('?')[0].endsWith(`/${BUNDLE_NAME}`));

    expect(ours).toHaveLength(1);
    expect(ours[0].url).toBe(BUNDLE_URL);
  });

  test('serves the bundle and defines card and editor without a clash', async ({ page, consoleErrors }) => {
    const urlPath = await useDashboard('resources', { views: [{ title: 'Empty', cards: [] }] });

    await page.goto(`/${urlPath}/0`);
    await page.waitForFunction((name) => customElements.get(name) !== undefined, CARD_NAME, {
      timeout: 60_000,
    });

    // The editor is a separate element in the same bundle: asking the card for
    // its config element is what opening the editor does, and it is where a
    // duplicate define() would blow up.
    await page.evaluate(async (name) => {
      const constructor = customElements.get(name) as unknown as {
        getConfigElement(): Promise<HTMLElement>;
      };
      await constructor.getConfigElement();
    }, CARD_NAME);
    await expect.poll(() => page.evaluate((name) => !!customElements.get(name), EDITOR_NAME)).toBe(true);

    expect(consoleErrors.filter((text) => /has already been used/i.test(text))).toEqual([]);
  });

  test('survives the bundle being registered a second time', async ({ page, consoleErrors }) => {
    // A duplicate Lovelace resource entry is a real support case, and until the
    // guarded registration it took the card down: the second evaluation of the
    // module called customElements.define() again and threw "the name
    // rss-accordion has already been used" - so the card never registered and
    // the user lost the whole card rather than seeing an error.
    //
    // The second registration is made in the browser rather than through
    // `lovelace/resources/create`. Appending a module script for the bundle is
    // byte for byte what the frontend's resource loader does for a `module`
    // resource, so the browser sees exactly the duplicate-resource situation -
    // and unlike a real second resource entry it leaves nothing behind in the
    // shared instance that a developer would have to clean up by hand. An
    // instance running Lovelace in YAML mode (`resource_mode: yaml`) makes that
    // the only option anyway: the resource collection is read-only there and
    // Home Assistant answers the create command with `unknown_command`.
    const urlPath = await useDashboard('resources-duplicate', { views: [{ title: 'Empty', cards: [] }] });

    await page.goto(`/${urlPath}/0`);
    await page.waitForFunction((name) => customElements.get(name) !== undefined, CARD_NAME, { timeout: 60_000 });

    try {
      await page.evaluate(
        async ([bundle, marker]) => {
          const script = document.createElement('script');
          script.type = 'module';
          // A query string is what makes it a second module: same file, second
          // evaluation - the effect a second resource entry has.
          script.src = `/local/${bundle}?${marker}`;
          script.dataset.e2eDuplicate = 'true';
          await new Promise<void>((resolve, reject) => {
            script.addEventListener('load', () => resolve());
            script.addEventListener('error', () => reject(new Error('the duplicate resource failed to load')));
            document.head.append(script);
          });
        },
        [BUNDLE_NAME, DUPLICATE_MARKER],
      );

      // The guard is what keeps this true; without it the define() above throws
      // and the console carries the clash.
      expect(consoleErrors.filter((text) => /has already been used/i.test(text))).toEqual([]);
      expect(consoleErrors.filter((text) => /rss-accordion/i.test(text))).toEqual([]);

      // The card is still the element the first load registered, and the card
      // picker still lists it once - the second half of that same fix.
      await expect
        .poll(() =>
          page.evaluate((name) => {
            const registry = (window as unknown as { customCards?: { type: string }[] }).customCards ?? [];
            return registry.filter((card) => card.type === name).length;
          }, CARD_NAME),
        )
        .toBe(1);

      // And it still works: the editor resolves after the second load too.
      await page.evaluate(async (name) => {
        const constructor = customElements.get(name) as unknown as {
          getConfigElement(): Promise<HTMLElement>;
        };
        await constructor.getConfigElement();
      }, CARD_NAME);
      await expect.poll(() => page.evaluate((name) => !!customElements.get(name), EDITOR_NAME)).toBe(true);
    } finally {
      // Leave the page as we found it, so nothing downstream inherits a
      // double-loaded frontend.
      await page.evaluate(() => {
        document.querySelectorAll('script[data-e2e-duplicate]').forEach((script) => script.remove());
      });
    }
  });
});
