import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/rss-accordion';
import type { RssAccordion } from '../src/rss-accordion';
import { HomeAssistant, RssAccordionConfig, HassEntity, AudioProgress } from '../src/types';
import { StorageHelper } from '../src/storage-helper';
import { formatDate } from '../src/utils';
import { BrowserAudioPlayer } from '../src/audio-player';
import { FakeAudio, installFakePlayer } from './fake-audio';

// Mock console.info
vi.spyOn(console, 'info').mockImplementation(() => {});

// Mock ResizeObserver, which is not available in JSDOM
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Define a minimal interface for the ha-card element to satisfy TypeScript
interface HaCard extends HTMLElement {
  header?: string;
}

describe('RssAccordion', () => {
  let element: RssAccordion;
  let hass: HomeAssistant;
  let config: RssAccordionConfig;

  beforeEach(() => {
    hass = {
      localize: (key: string) => key,
      states: {},
      language: 'en',
      locale: {
        language: 'en',
        number_format: 'comma_decimal',
        time_format: '12',
      },
    } as HomeAssistant;

    config = {
      type: 'custom:rss-accordion',
      entity: 'sensor.test_feed',
    };

    element = document.createElement('rss-accordion') as RssAccordion;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should create the component instance', () => {
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName.toLowerCase()).toBe('rss-accordion');
  });

  it('should throw an error if no entity is provided', () => {
    expect(() => element.setConfig({ type: 'custom:rss-accordion', entity: '' })).toThrow(
      'You need to define an entity',
    );
  });

  it('should render a title if provided', async () => {
    element.hass = hass;
    element.setConfig({ ...config, title: 'My RSS Feed' });
    await element.updateComplete;

    const card = element.shadowRoot?.querySelector<HaCard>('ha-card');
    expect(card?.header).toBe('My RSS Feed');
  });

  it('should render items from the entity attribute', async () => {
    hass.states['sensor.test_feed'] = {
      entity_id: 'sensor.test_feed',
      state: 'ok',
      attributes: {
        entries: [
          {
            title: 'Test 1',
            link: '#1',
            summary: 'Summary 1',
            published: new Date('2023-01-01T12:00:00Z').toISOString(),
          },
          {
            title: 'Test 2',
            link: '#2',
            summary: 'Summary 2',
            published: new Date('2023-01-02T12:00:00Z').toISOString(),
          },
        ],
      },
    } as HassEntity;
    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const items = element.shadowRoot?.querySelectorAll('.accordion-item');
    expect(items?.length).toBe(2);
    const firstTitle = items?.[0].querySelector('.header-main > a.title-link'); // Newest item (Test 2) should be first
    expect(firstTitle?.textContent?.trim()).toBe('Test 2');
    const firstContent = items?.[0].querySelector('.accordion-content > .item-summary');
    expect(firstContent?.innerHTML).toBe('Summary 2');
  });

  it('should respect max_items config', async () => {
    hass.states['sensor.test_feed'] = {
      entity_id: 'sensor.test_feed',
      state: 'ok',
      attributes: {
        entries: [
          {
            title: 'Test 1',
            link: '#1',
            summary: 'Summary 1',
            published: new Date('2023-01-01T12:00:00Z').toISOString(),
          },
          {
            title: 'Test 2',
            link: '#2',
            summary: 'Summary 2',
            published: new Date('2023-01-02T12:00:00Z').toISOString(),
          },
        ],
      },
    } as HassEntity;
    element.hass = hass;
    element.setConfig({ ...config, max_items: 1 });
    await element.updateComplete;

    const items = element.shadowRoot?.querySelectorAll('.accordion-item');
    expect(items?.length).toBe(1);
  });

  it('should respect max_items_per_entity config and fetch the newest items', async () => {
    hass.states['sensor.test_feed'] = {
      entity_id: 'sensor.test_feed',
      state: 'ok',
      attributes: {
        entries: [
          {
            title: 'Test 1 (Oldest)',
            link: '#1',
            summary: 'Summary 1',
            published: new Date('2023-01-01T12:00:00Z').toISOString(),
          },
          {
            title: 'Test 2 (Middle)',
            link: '#2',
            summary: 'Summary 2',
            published: new Date('2023-01-02T12:00:00Z').toISOString(),
          },
          {
            title: 'Test 3 (Newest)',
            link: '#3',
            summary: 'Summary 3',
            published: new Date('2023-01-03T12:00:00Z').toISOString(),
          },
        ],
      },
    } as HassEntity;
    element.hass = hass;
    // Limit to 2 items per entity
    element.setConfig({ ...config, max_items_per_entity: 2 });
    await element.updateComplete;

    const items = element.shadowRoot?.querySelectorAll('.accordion-item');
    expect(items?.length).toBe(2);
    // The items shown should be the NEWEST two items, even though the raw array has the oldest first.
    const titles = Array.from(items || []).map((item) => item.querySelector('.title-link')?.textContent?.trim());
    expect(titles).toContain('Test 3 (Newest)');
    expect(titles).toContain('Test 2 (Middle)');
    expect(titles).not.toContain('Test 1 (Oldest)');
  });

  it('should use description if summary is not available', async () => {
    hass.states['sensor.test_feed'] = {
      entity_id: 'sensor.test_feed',
      state: 'ok',
      attributes: {
        entries: [{ title: 'Test 1', link: '#', description: 'Description 1', published: new Date().toISOString() }],
      },
    } as HassEntity;
    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const content = element.shadowRoot?.querySelector('.accordion-content > .item-summary');
    expect(content?.innerHTML).toBe('Description 1');
  });

  it('should fallback to updated if published is not available', async () => {
    hass.states['sensor.test_feed'] = {
      entity_id: 'sensor.test_feed',
      state: 'ok',
      attributes: {
        entries: [{ title: 'Test 1', link: '#', description: 'Description 1', updated: new Date().toISOString() }],
      },
    } as HassEntity;
    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const publishedEl = element.shadowRoot?.querySelector('.item-published');
    expect(publishedEl?.textContent).not.toBe('Invalid Date');
    expect(publishedEl?.textContent?.length).toBeGreaterThan(0);
  });

  it('should prefer summary over description if both are available', async () => {
    hass.states['sensor.test_feed'] = {
      entity_id: 'sensor.test_feed',
      state: 'ok',
      attributes: {
        entries: [
          {
            title: 'Test 1',
            link: '#',
            summary: 'Summary 1',
            description: 'Description 1',
            published: new Date().toISOString(),
          },
        ],
      },
    } as HassEntity;
    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const content = element.shadowRoot?.querySelector('.accordion-content > .item-summary');
    expect(content?.innerHTML).toBe('Summary 1');
  });

  it('should render an image if available', async () => {
    hass.states['sensor.test_feed'] = {
      entity_id: 'sensor.test_feed',
      state: 'ok',
      attributes: {
        entries: [
          {
            title: 'Test 1',
            link: '#',
            summary: 'Summary 1',
            published: new Date().toISOString(),
            image: 'http://example.com/image.jpg',
          },
        ],
      },
    } as HassEntity;
    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const image = element.shadowRoot?.querySelector<HTMLImageElement>('.item-image');
    expect(image).not.toBeNull();
    expect(image?.src).toBe('http://example.com/image.jpg');
    expect(image?.alt).toBe('Test 1');
  });

  it('should not render an image if not available', async () => {
    hass.states['sensor.test_feed'] = {
      entity_id: 'sensor.test_feed',
      state: 'ok',
      attributes: {
        entries: [{ title: 'Test 1', link: '#', summary: 'Summary 1', published: new Date().toISOString() }],
      },
    } as HassEntity;
    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const image = element.shadowRoot?.querySelector('.item-image');
    expect(image).toBeNull();
  });

  it('should not render an image if show_item_image is false', async () => {
    hass.states['sensor.test_feed'] = {
      entity_id: 'sensor.test_feed',
      state: 'ok',
      attributes: {
        entries: [
          {
            title: 'Test 1',
            link: '#',
            summary: 'Summary 1',
            published: new Date().toISOString(),
            image: 'http://example.com/image.jpg',
          },
        ],
      },
    } as HassEntity;
    element.hass = hass;
    element.setConfig({ ...config, show_item_image: false });
    await element.updateComplete;

    const image = element.shadowRoot?.querySelector<HTMLImageElement>('.item-image');
    expect(image).toBeNull();
  });

  describe('with event entity', () => {
    const baseEventState: HassEntity = {
      entity_id: 'event.test_feed_event',
      state: new Date('2023-01-01T12:00:00Z').toISOString(),
      attributes: {
        event_type: 'feedreader',
        title: 'Event Test 1',
        link: '#event',
        description: 'Event Description 1',
      },
    };

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));

      config = {
        type: 'custom:rss-accordion',
        entity: 'event.test_feed_event',
      };

      // Use a deep copy to ensure each test is isolated
      hass.states['event.test_feed_event'] = JSON.parse(JSON.stringify(baseEventState)) as HassEntity;
      element.hass = hass;
      element.setConfig(config);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should render a single item from event attributes', async () => {
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.accordion-item');
      expect(items?.length).toBe(1);
      const firstTitle = items?.[0].querySelector('.header-main > a.title-link');
      expect(firstTitle?.textContent?.trim()).toBe('Event Test 1');
      const firstContent = items?.[0].querySelector('.accordion-content > .item-summary');
      expect(firstContent?.innerHTML).toBe('Event Description 1');
    });

    it('should use the entity state as the published date', async () => {
      const publishedDate = new Date('2023-01-01T12:00:00Z');
      hass.states['event.test_feed_event'].state = publishedDate.toISOString();
      element.hass = { ...hass }; // re-assign to trigger update
      await element.updateComplete;

      const publishedEl = element.shadowRoot?.querySelector('.item-published');
      // The exact format is locale-dependent, so we check for key components.
      // With language 'en', we expect a short month name.
      expect(publishedEl?.textContent).toContain('Jan');
      expect(publishedEl?.textContent).toContain('01');
      expect(publishedEl?.textContent).toContain('2023');
    });

    it('should not render if title or link is missing', async () => {
      // Simulate a state update from Home Assistant.
      // For the component's `shouldUpdate` to trigger, the `hass.states[entity]`
      // object reference must change. We achieve this by creating a new `hass` object
      // with a new `states` object that contains the modified entity state.
      const newEntityState = JSON.parse(JSON.stringify(hass.states['event.test_feed_event']));
      delete newEntityState.attributes.link;

      element.hass = {
        ...hass,
        states: { ...hass.states, 'event.test_feed_event': newEntityState },
      };
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.accordion-item');
      expect(items?.length).toBe(0);
    });

    it('should correctly calculate card size for an event entity', () => {
      expect(element.getCardSize()).toBe(1); // 1 for the item

      element.setConfig({ ...config, title: 'Event Feed' });
      expect(element.getCardSize()).toBe(2); // 1 for title, 1 for item
    });
  });

  describe('image handling', () => {
    it('should strip images from summary if item.image is present', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [
            {
              title: 'Test 1',
              link: '#',
              summary: 'Summary with <img src="summary.jpg"> an image.',
              published: new Date().toISOString(),
              image: 'hero.jpg',
            },
          ],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const heroImage = element.shadowRoot?.querySelector<HTMLImageElement>('.item-image');
      expect(heroImage).not.toBeNull();
      expect(heroImage?.src).toContain('hero.jpg');

      const content = element.shadowRoot?.querySelector('.accordion-content > .item-summary');
      expect(content?.innerHTML).toBe('Summary with  an image.');
    });

    it('should not strip images from summary if item.image is not present', async () => {
      const summaryHtml = 'Summary with <img src="test.jpg"> an image.';
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [{ title: 'Test 1', link: '#', summary: summaryHtml, published: new Date().toISOString() }],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const heroImage = element.shadowRoot?.querySelector<HTMLImageElement>('.item-image');
      expect(heroImage).toBeNull();

      const content = element.shadowRoot?.querySelector('.accordion-content > .item-summary');
      expect(content?.innerHTML).toBe(summaryHtml);
    });
  });

  describe('audio player rendering', () => {
    const feedWith = (entry: Record<string, unknown>): HassEntity =>
      ({
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: { entries: [{ title: 'Test 1', link: '#', published: new Date().toISOString(), ...entry }] },
      }) as HassEntity;

    it('should render player controls, not a media element, if item has an audio URL', async () => {
      hass.states['sensor.test_feed'] = feedWith({ audio: 'http://example.com/episode.mp3' });
      element.hass = hass;
      element.setConfig(config); // show_audio_player defaults to true
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('.audio-player .audio-play')).not.toBeNull();
      expect(element.shadowRoot?.querySelector('.audio-player .audio-seek')).not.toBeNull();
      expect(element.shadowRoot?.querySelector('audio')).toBeNull();
    });

    it('should not render a player if item has no audio URL', async () => {
      hass.states['sensor.test_feed'] = feedWith({});
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('.audio-player')).toBeNull();
    });

    it('should not render a player if show_audio_player is false', async () => {
      hass.states['sensor.test_feed'] = feedWith({ audio: 'http://a.com/a.mp3' });
      element.hass = hass;
      element.setConfig({ ...config, show_audio_player: false });
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('.audio-player')).toBeNull();
    });

    it('should show the saved position of an episode that is not loaded', async () => {
      localStorage.clear();
      hass.states['sensor.test_feed'] = feedWith({ audio: 'http://a.com/a.mp3' });
      element.hass = hass;
      element.setConfig(config);
      new StorageHelper('sensor.test_feed').setAudioProgress('http://a.com/a.mp3', {
        currentTime: 75,
        completed: false,
        duration: 3725,
      });
      element.requestUpdate();
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('.audio-position')?.textContent).toBe('1:15');
      expect(element.shadowRoot?.querySelector('.audio-duration')?.textContent).toBe('1:02:05');
      localStorage.clear();
    });
  });

  describe('listened marker', () => {
    const audioUrl = 'http://example.com/episode.mp3';
    let audioProgressMock: AudioProgress | null = null;

    beforeEach(() => {
      audioProgressMock = null;
      vi.spyOn(StorageHelper.prototype, 'getAudioProgress').mockImplementation(() => audioProgressMock);
      vi.spyOn(StorageHelper.prototype, 'setAudioProgress').mockImplementation((_url, progress) => {
        audioProgressMock = progress;
      });

      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [
            {
              title: 'Podcast Episode',
              link: '#',
              summary: 'An episode with audio.',
              published: new Date().toISOString(),
              audio: audioUrl,
            },
          ],
        },
      } as HassEntity;

      element.hass = hass;
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should mark audio as completed and show icon when the episode ends', async () => {
      const { audio } = installFakePlayer();
      // Re-connect so the card subscribes to this test's player.
      document.body.removeChild(element);
      document.body.appendChild(element);
      element.setConfig(config);
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('.listened-icon')).toBeNull();

      element.shadowRoot?.querySelector<HTMLButtonElement>('.audio-play')?.click();
      await element.updateComplete;
      audio.el.dispatchEvent(new Event('ended'));
      await element.updateComplete;

      expect(audioProgressMock?.completed).toBe(true);
      expect(typeof audioProgressMock?.completedAt).toBe('string');

      const listenedIcon = element.shadowRoot?.querySelector('.listened-icon');
      expect(listenedIcon).not.toBeNull();
      expect(listenedIcon?.getAttribute('icon')).toBe('mdi:check-circle-outline');
      expect(listenedIcon?.getAttribute('title')).toContain('Listened on:');
    });

    it('should display listened icon on initial render if audio is completed', async () => {
      audioProgressMock = { currentTime: 0, completed: true, completedAt: new Date().toISOString() };
      element.setConfig(config);
      await element.updateComplete;

      const listenedIcon = element.shadowRoot?.querySelector('.listened-icon');
      expect(listenedIcon).not.toBeNull();
      expect(listenedIcon?.getAttribute('title')).toContain('Listened on:');
    });

    it('should fall back to the plain label when the stored date is unparsable', async () => {
      // completedAt comes out of localStorage, written by whatever version of
      // this card finished the episode. An unparsable one formats to nothing,
      // and the tooltip read "Listened on: " with the sentence left hanging.
      audioProgressMock = { currentTime: 0, completed: true, completedAt: 'not a date' };
      element.setConfig(config);
      await element.updateComplete;

      const listenedIcon = element.shadowRoot?.querySelector('.listened-icon');
      expect(listenedIcon).not.toBeNull();
      expect(listenedIcon?.getAttribute('title')).toBe('Listened');
    });
  });
  describe('item description', () => {
    const teaser = '<img align="left" hspace="5" src="https://example.com/small.jpg" />...';
    const entry = (fields: Record<string, unknown>) => ({
      title: 'Story',
      link: 'https://example.com/story',
      published: '2023-01-01T12:00:00Z',
      image: 'https://example.com/big.jpg',
      ...fields,
    });
    const render = async (fields: Record<string, unknown>, extra: Partial<RssAccordionConfig> = {}) => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: { entries: [entry(fields)] },
      } as HassEntity;
      element.hass = hass;
      element.setConfig({ ...config, ...extra });
      await element.updateComplete;
      return element.shadowRoot?.querySelector('.item-summary');
    };

    it('should not render a teaser summary that is only an image and an ellipsis', async () => {
      expect(await render({ summary: teaser })).toBeNull();
    });

    it('should fall back to description when the summary has no text', async () => {
      const summary = await render({ summary: teaser, description: 'The real text.' });
      expect(summary?.textContent).toBe('The real text.');
    });

    it('should prefer a summary with text over description', async () => {
      const summary = await render({ summary: '<p>Summary text.</p>', description: 'Description text.' });
      expect(summary?.textContent).toBe('Summary text.');
    });

    it('should read the configured description_attribute', async () => {
      const summary = await render(
        { summary: teaser, gera_description: 'The article text.' },
        { description_attribute: 'gera_description' },
      );
      expect(summary?.textContent).toBe('The article text.');
    });

    it('should fall back when an item lacks the configured attribute', async () => {
      const summary = await render({ summary: '<p>Summary text.</p>' }, { description_attribute: 'gera_description' });
      expect(summary?.textContent).toBe('Summary text.');
    });

    it('should sanitize the configured attribute like any other content', async () => {
      const summary = await render(
        { gera_description: '<p>Text</p><img src="x" onerror="alert(1)"><script>alert(2)</script>' },
        { description_attribute: 'gera_description', show_item_image: false },
      );
      expect(summary?.innerHTML).not.toContain('onerror');
      expect(summary?.innerHTML).not.toContain('<script');
      expect(summary?.textContent).toContain('Text');
    });

    it('should read the configured attribute from an event entity', async () => {
      hass.states['event.news'] = {
        entity_id: 'event.news',
        state: '2023-01-01T12:00:00Z',
        attributes: { title: 'Story', link: 'https://example.com/story', teaser_text: 'From the event.' },
      } as HassEntity;
      element.hass = hass;
      element.setConfig({ type: 'custom:rss-accordion', entity: 'event.news', description_attribute: 'teaser_text' });
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('.item-summary')?.textContent).toBe('From the event.');
    });
  });

  describe('bookmarking', () => {
    let bookmarksMock: Record<string, string>;
    let storageHelper: StorageHelper;
    const feedItem1 = {
      title: 'Bookmark Item 1',
      link: 'http://example.com/item1',
      summary: 'Summary 1',
      published: new Date('2023-01-01T10:00:00Z').toISOString(),
    };
    const feedItem2 = {
      title: 'Bookmark Item 2',
      link: 'http://example.com/item2',
      summary: 'Summary 2',
      published: new Date('2023-01-02T10:00:00Z').toISOString(),
    };

    beforeEach(() => {
      // Create an instance for test-side logic
      storageHelper = new StorageHelper(config.entity || 'sensor.test_feed');

      // Mock StorageHelper for bookmarks
      bookmarksMock = {};
      vi.spyOn(StorageHelper.prototype, 'isBookmarked').mockImplementation((item) => {
        const key = storageHelper.getBookmarkKey(item);
        return !!bookmarksMock[key];
      });
      vi.spyOn(StorageHelper.prototype, 'setBookmark').mockImplementation((item, bookmarked) => {
        const key = storageHelper.getBookmarkKey(item);
        if (bookmarked) {
          bookmarksMock[key] = JSON.stringify(item);
        } else {
          delete bookmarksMock[key];
        }
      });
      vi.spyOn(StorageHelper.prototype, 'getBookmarkedItems').mockImplementation(() => {
        return Object.values(bookmarksMock).map((itemStr) => JSON.parse(itemStr));
      });

      // Set up a feed with multiple items
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [feedItem1, feedItem2],
        },
      } as HassEntity;

      element.hass = hass;
      // Enable bookmarking for these tests
      element.setConfig({ ...config, show_bookmarks: true });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should not render bookmarking UI if show_bookmarks is false', async () => {
      element.setConfig({ ...config, show_bookmarks: false });
      await element.updateComplete;

      const bookmarkButton = element.shadowRoot?.querySelector('.bookmark-button');
      expect(bookmarkButton).toBeNull();
    });

    it('should toggle bookmark on and save to localStorage', async () => {
      await element.updateComplete;

      const bookmarkButton = element.shadowRoot?.querySelector<HTMLElement>('.bookmark-button');
      let bookmarkIcon = bookmarkButton?.querySelector('ha-icon');
      expect(bookmarkButton).not.toBeNull();
      expect(bookmarkIcon?.getAttribute('icon')).toBe('mdi:star-outline');
      // The first item in the DOM is feedItem2 because it's newer
      const bookmarkKey = storageHelper.getBookmarkKey(feedItem2);
      expect(bookmarksMock[bookmarkKey]).toBeUndefined();

      // Click to bookmark
      bookmarkButton?.click();
      await element.updateComplete;

      // Check localStorage and UI
      const storedItem = bookmarksMock[bookmarkKey];
      expect(storedItem).not.toBeNull();
      const parsedItem = JSON.parse(storedItem!);
      expect(parsedItem.title).toBe(feedItem2.title);
      expect(parsedItem.link).toBe(feedItem2.link);
      expect(parsedItem.summary).toBe(feedItem2.summary);
      expect(parsedItem.published).toBe(feedItem2.published);
      bookmarkIcon = element.shadowRoot?.querySelector<HTMLElement>('.bookmark-button')?.querySelector('ha-icon');
      expect(bookmarkIcon?.getAttribute('icon')).toBe('mdi:star');
    });

    it('should show a disabled filter button when there are no bookmarks, and enable it after bookmarking', async () => {
      await element.updateComplete;
      const filterButton = element.shadowRoot?.querySelector<HTMLButtonElement>('.bookmark-filter-button');
      expect(filterButton, 'Filter button should exist').not.toBeNull();
      // In JSDOM, the `disabled` property might not be immediately reflected. Checking the attribute is more reliable.
      expect(filterButton?.hasAttribute('disabled'), 'Filter button should be disabled initially').toBe(true);

      // Bookmark an item (feedItem2, the newest, is the first in the list)
      const bookmarkButton = element.shadowRoot?.querySelector<HTMLElement>('.bookmark-button');
      bookmarkButton?.click();
      await element.updateComplete;

      // The same button should now be enabled.
      expect(filterButton?.hasAttribute('disabled'), 'Filter button should be enabled after bookmarking').toBe(false);
    });

    it('should filter to show only bookmarked items when filter is clicked', async () => {
      await element.updateComplete;

      // Bookmark the first item (feedItem2, the newest)
      const bookmarkButton1 = element.shadowRoot?.querySelector<HTMLElement>('.bookmark-button');
      bookmarkButton1?.click();
      await element.updateComplete;

      let items = element.shadowRoot?.querySelectorAll('.accordion-item');
      expect(items?.length).toBe(2);

      // Click the filter button
      const filterButton = element.shadowRoot?.querySelector<HTMLElement>('.bookmark-filter-button');
      filterButton?.click();
      await element.updateComplete;

      items = element.shadowRoot?.querySelectorAll('.accordion-item');
      expect(items?.length).toBe(1);
      // The bookmarked item was feedItem2, so it should be the only one visible
      expect(items?.[0].querySelector('.title-link')?.textContent?.trim()).toBe(feedItem2.title);
    });

    it('should outline the filter button and fill it once the filter is on', async () => {
      // ha-button is Web Awesome's button: it picks its look from `appearance`
      // and ignores mwc-button's `outlined`, so the button used to render
      // filled in the brand colour whether the filter was on or off.
      await element.updateComplete;
      element.shadowRoot?.querySelector<HTMLElement>('.bookmark-button')?.click();
      await element.updateComplete;

      const filterButton = element.shadowRoot!.querySelector<HTMLElement>('.bookmark-filter-button')!;
      expect(filterButton.hasAttribute('outlined')).toBe(false);
      expect(filterButton.getAttribute('appearance')).toBe('outlined');

      filterButton.click();
      await element.updateComplete;

      expect(filterButton.getAttribute('appearance')).toBe('accent');
    });

    it('re-opens only one panel when a filtered-out entry returns', async () => {
      // A panel the bookmark filter hides is not in the DOM, so opening another
      // one cannot collapse it - only its key can be dropped, and nothing was
      // dropping it. Turning the filter off brought it back open beside the one
      // the user had actually left open.
      element.setConfig({ ...config, show_bookmarks: true, allow_multiple: false, open_behavior: 'none' });
      await element.updateComplete;

      const items = (): HTMLDetailsElement[] => [
        ...element.shadowRoot!.querySelectorAll<HTMLDetailsElement>('.accordion-item'),
      ];
      const filterButton = (): HTMLElement =>
        element.shadowRoot!.querySelector<HTMLElement>('.bookmark-filter-button')!;
      const openHeader = (details: HTMLDetailsElement): void =>
        details.querySelector<HTMLElement>('.accordion-header')!.click();

      // feedItem2 is the newer one and renders first; bookmark the other.
      element.shadowRoot!.querySelectorAll<HTMLElement>('.bookmark-button')[1].click();
      await element.updateComplete;

      // The user opens the entry that is not bookmarked.
      openHeader(items()[0]);
      await element.updateComplete;
      expect(items()[0].hasAttribute('open')).toBe(true);

      // Filter on: that entry leaves the DOM while its key stays behind.
      filterButton().click();
      await element.updateComplete;
      expect(items()).toHaveLength(1);

      // The user opens the bookmarked entry instead.
      openHeader(items()[0]);
      await element.updateComplete;

      // Filter off: the first entry comes back.
      filterButton().click();
      await element.updateComplete;
      expect(items()).toHaveLength(2);

      const open = items().filter((details) => details.hasAttribute('open'));
      expect(open).toHaveLength(1);
      expect(open[0].querySelector('.title-link')?.textContent?.trim()).toBe(feedItem1.title);
    });

    it('should show bookmarked item even if it disappears from feed', async () => {
      await element.updateComplete;

      // Bookmark the first item (feedItem2, the newest)
      const bookmarkButton1 = element.shadowRoot?.querySelector<HTMLElement>('.bookmark-button');
      bookmarkButton1?.click();
      await element.updateComplete;

      // Check that feedItem2 is bookmarked
      expect(bookmarksMock[storageHelper.getBookmarkKey(feedItem2)]).not.toBeUndefined();

      // Now, update the feed so the bookmarked item (feedItem2) is gone
      hass.states['sensor.test_feed'] = {
        ...(hass.states['sensor.test_feed'] as HassEntity),
        attributes: {
          entries: [feedItem1], // Only feedItem1 remains in the live feed
        },
      };
      element.hass = { ...hass }; // Trigger update
      await element.updateComplete;

      // The bookmarked item (feedItem2) should still be visible, along with the other item from the live feed (feedItem1)
      const items = element.shadowRoot?.querySelectorAll('.accordion-item');
      expect(items?.length).toBe(2);
      const titles = Array.from(items || []).map((item) => item.querySelector('.title-link')?.textContent?.trim());
      expect(titles).toContain(feedItem1.title);
      expect(titles).toContain(feedItem2.title);
    });
  });

  describe('UI Features', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should show a "NEW" pill for items younger than 30 minutes', async () => {
      const now = new Date();
      vi.setSystemTime(now);

      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [
            {
              title: 'New Item',
              link: '#',
              summary: 'This is new',
              published: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
            },
          ],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const newPill = element.shadowRoot?.querySelector('.new-pill');
      expect(newPill).not.toBeNull();
      expect(newPill?.textContent).toBe('NEW');
    });

    it('should not show a "NEW" pill for items 1 hour or older', async () => {
      const now = new Date();
      vi.setSystemTime(now);

      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [
            {
              title: 'Old Item',
              link: '#',
              summary: 'This is old',
              published: new Date(now.getTime() - 61 * 60 * 1000).toISOString(), // 61 minutes old
            },
          ],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const newPill = element.shadowRoot?.querySelector('.new-pill');
      expect(newPill).toBeNull();
    });

    it('should use custom duration for "NEW" pill if configured', async () => {
      const now = new Date();
      vi.setSystemTime(now);

      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [
            {
              title: 'Newish Item',
              link: '#',
              summary: 'This is newish',
              published: new Date(now.getTime() - 90 * 60 * 1000).toISOString(), // 90 minutes old
            },
          ],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig({ ...config, new_pill_duration_hours: 2 }); // Custom duration of 2 hours
      await element.updateComplete;

      const newPill = element.shadowRoot?.querySelector('.new-pill');
      // 90 min < 120 min. So it IS new.
      // logic: isNew = ageInMinutes >= 0 && ageInMinutes < newPillDurationHours * 60;
      // 90 < 120 is true. So it SHOULD be there.
      expect(newPill).not.toBeNull();
    });
  });

  describe('channel info rendering', () => {
    beforeEach(() => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [{ title: 'Item 1', link: '#', published: new Date().toISOString() }],
          channel: {
            title: 'My Channel',
            description: 'My Channel Description',
            image: 'http://example.com/channel.png',
            link: 'http://example.com/channel',
            published: new Date('2023-01-01T10:00:00Z').toISOString(),
          },
        },
      } as HassEntity;
    });

    it('should not render channel info by default', async () => {
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const channelInfo = element.shadowRoot?.querySelector('.channel-info');
      expect(channelInfo).toBeNull();
    });

    it('should render channel info when show_channel_info is true', async () => {
      element.hass = hass;
      element.setConfig({ ...config, show_channel_info: true });
      await element.updateComplete;

      const channelInfo = element.shadowRoot?.querySelector('.channel-info');
      expect(channelInfo).not.toBeNull();
      expect(channelInfo?.querySelector('.channel-title')?.textContent?.trim()).toBe('My Channel');
      expect(channelInfo?.querySelector('.channel-description')?.textContent?.trim()).toBe('My Channel Description');
      expect(channelInfo?.querySelector<HTMLImageElement>('.channel-image')?.src).toBe(
        'http://example.com/channel.png',
      );
      expect(channelInfo?.querySelector<HTMLAnchorElement>('.channel-link')?.href).toBe('http://example.com/channel');
    });

    it('should not render channel description when show_channel_description is false', async () => {
      element.hass = hass;
      element.setConfig({ ...config, show_channel_info: true, show_channel_description: false });
      await element.updateComplete;

      const description = element.shadowRoot?.querySelector('.channel-description');
      expect(description).toBeNull();
    });

    it('should show "show more" button and truncate text when channel description is long', async () => {
      element.hass = hass;
      element.setConfig({
        ...config,
        show_channel_info: true,
        max_channel_description_length: 10,
      });
      await element.updateComplete;

      const description = element.shadowRoot?.querySelector('.channel-description');
      const toggleBtn = element.shadowRoot?.querySelector('.toggle-description');
      expect(description?.textContent?.trim()).toBe('My Channel...');
      expect(toggleBtn).not.toBeNull();
      expect(toggleBtn?.textContent?.trim()).toBe('Show more');
    });

    it('should expand channel description when toggle button is clicked', async () => {
      element.hass = hass;
      element.setConfig({
        ...config,
        show_channel_info: true,
        max_channel_description_length: 10,
      });
      await element.updateComplete;

      const container = element.shadowRoot?.querySelector('.channel-description-container');
      const toggleBtn = element.shadowRoot?.querySelector<HTMLElement>('.toggle-description');

      expect(container?.classList.contains('expanded')).toBe(false);

      toggleBtn?.click();
      await element.updateComplete;

      expect(container?.classList.contains('expanded')).toBe(true);
      expect(toggleBtn?.textContent?.trim()).toBe('Show less');
    });

    it('should not render channel published date by default', async () => {
      element.hass = hass;
      element.setConfig({ ...config, show_channel_info: true });
      await element.updateComplete;

      const channelPublished = element.shadowRoot?.querySelector('.channel-published');
      expect(channelPublished).toBeNull();
    });

    it('should render channel published date when show_published_date is true', async () => {
      element.hass = hass;
      element.setConfig({ ...config, show_channel_info: true, show_published_date: true });
      await element.updateComplete;

      const channelPublished = element.shadowRoot?.querySelector('.channel-published');
      expect(channelPublished).not.toBeNull();
      expect(channelPublished?.textContent).toContain('Last updated');
      expect(channelPublished?.textContent).toContain('Jan'); // From '2023-01-01'
    });

    it('should add cropped-image class when crop_channel_image is true', async () => {
      element.hass = hass;
      element.setConfig({ ...config, show_channel_info: true, crop_channel_image: true });
      await element.updateComplete;

      const channelInfo = element.shadowRoot?.querySelector('.channel-info');
      expect(channelInfo?.classList.contains('cropped-image')).toBe(true);
    });

    it('should correctly calculate card size with channel info', () => {
      element.hass = hass;
      element.setConfig({ ...config, show_channel_info: true });
      // 1 for item + 2 for channel info
      expect(element.getCardSize()).toBe(3);
    });
  });

  describe('accordion interaction', () => {
    beforeEach(async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [{ title: 'Test 1', link: '#', summary: 'Summary 1', published: new Date().toISOString() }],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;
    });

    it('should not toggle accordion when the title link is clicked', async () => {
      const details = element.shadowRoot?.querySelector<HTMLDetailsElement>('.accordion-item');
      const titleLink = details?.querySelector<HTMLAnchorElement>('a.title-link');

      expect(details?.open).toBe(false);

      const clickEvent = new MouseEvent('click', { bubbles: true, composed: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

      titleLink?.dispatchEvent(clickEvent);
      await element.updateComplete;

      expect(details?.open).toBe(false);
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should toggle accordion when the summary area (not the link) is clicked', async () => {
      const details = element.shadowRoot?.querySelector<HTMLDetailsElement>('.accordion-item');
      const summary = details?.querySelector<HTMLElement>('.accordion-header');

      expect(details?.open).toBe(false);

      summary?.click();
      await element.updateComplete;

      expect(details?.open).toBe(true);
    });
  });

  describe('formatDate utility', () => {
    const testDate = new Date('2023-10-27T20:30:00Z');

    it('should use 12-hour format when hass.locale.time_format is "12"', () => {
      hass.locale = { language: 'en-US', number_format: 'comma_decimal', time_format: '12' };
      const formatted = formatDate(testDate, hass);
      // Note: The exact output depends on the test environment's timezone.
      // This checks for the presence of AM/PM, which is characteristic of 12-hour format.
      expect(formatted.toLowerCase()).toMatch(/am|pm/);
    });

    it('should use 24-hour format when hass.locale.time_format is "24"', () => {
      hass.locale = { language: 'en-US', number_format: 'comma_decimal', time_format: '24' };
      const formatted = formatDate(testDate, hass);
      // This checks that AM/PM is not present, which is characteristic of 24-hour format.
      expect(formatted.toLowerCase()).not.toMatch(/am|pm/);
    });

    it('should use browser default when hass.locale.time_format is "system"', () => {
      hass.locale = { language: 'en-US', number_format: 'comma_decimal', time_format: 'system' };
      // We can't know what the default is, but we can ensure it doesn't crash.
      expect(() => formatDate(testDate, hass)).not.toThrow();
    });

    it('should use 2-digit day format for consistency', () => {
      hass.locale = { language: 'en-US', number_format: 'comma_decimal', time_format: 'system' };
      const date = new Date('2023-01-01T20:00:00Z'); // 1st of month
      const formatted = formatDate(date, hass);
      expect(formatted).toContain('01');
    });

    it('should format channel published date correctly', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [{ title: 'Item 1', link: '#', published: new Date().toISOString() }],
          channel: {
            published: '2023-01-01T10:00:00Z',
          },
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig({ ...config, show_channel_info: true, show_published_date: true });
      await element.updateComplete;

      const channelPublished = element.shadowRoot?.querySelector('.channel-published');
      expect(channelPublished).not.toBeNull();
      expect(channelPublished?.textContent).toContain('Jan');
      expect(channelPublished?.textContent).toContain('01');
    });
  });

  describe('multiple entities support', () => {
    it('should render items from multiple entities sorted by date', async () => {
      hass.states['sensor.feed1'] = {
        entity_id: 'sensor.feed1',
        state: 'ok',
        attributes: {
          entries: [
            {
              title: 'Feed 1 Item 1',
              link: '#1',
              published: new Date('2023-01-01T10:00:00Z').toISOString(),
            },
          ],
        },
      } as HassEntity;

      hass.states['sensor.feed2'] = {
        entity_id: 'sensor.feed2',
        state: 'ok',
        attributes: {
          entries: [
            {
              title: 'Feed 2 Item 1',
              link: '#2',
              published: new Date('2023-01-01T11:00:00Z').toISOString(),
            },
          ],
        },
      } as HassEntity;

      element.hass = hass;
      element.setConfig({
        type: 'custom:rss-accordion',
        entities: ['sensor.feed1', 'sensor.feed2'],
      });
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.accordion-item');
      expect(items?.length).toBe(2);

      // Feed 2 Item 1 is newer (11:00) than Feed 1 Item 1 (10:00), so it should be first
      const firstTitle = items?.[0].querySelector('.header-main > a.title-link');
      expect(firstTitle?.textContent?.trim()).toBe('Feed 2 Item 1');

      const secondTitle = items?.[1].querySelector('.header-main > a.title-link');
      expect(secondTitle?.textContent?.trim()).toBe('Feed 1 Item 1');
    });
  });

  describe('show_source option', () => {
    beforeEach(() => {
      hass.states['sensor.feed1'] = {
        entity_id: 'sensor.feed1',
        state: 'ok',
        attributes: {
          friendly_name: 'Feed 1',
          entries: [{ title: 'Item 1', link: '#1', published: new Date().toISOString() }],
        },
      } as HassEntity;

      hass.states['sensor.feed2'] = {
        entity_id: 'sensor.feed2',
        state: 'ok',
        attributes: {
          friendly_name: 'Feed 2',
          entries: [{ title: 'Item 2', link: '#2', published: new Date().toISOString() }],
        },
      } as HassEntity;
    });

    it('should show source for multiple entities by default', async () => {
      element.hass = hass;
      element.setConfig({
        type: 'custom:rss-accordion',
        entities: ['sensor.feed1', 'sensor.feed2'],
      });
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.accordion-item');
      expect(items?.length).toBe(2);
      const source = items?.[0].querySelector('.item-source');
      expect(source).not.toBeNull();
      expect(source?.textContent).toContain('Feed');
    });

    it('should hide source for multiple entities if explicitly disabled', async () => {
      element.hass = hass;
      element.setConfig({
        type: 'custom:rss-accordion',
        entities: ['sensor.feed1', 'sensor.feed2'],
        show_source: false,
      });
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.accordion-item');
      expect(items?.length).toBe(2);
      const source = items?.[0].querySelector('.item-source');
      expect(source).toBeNull();
    });

    it('should hide source for single entity by default', async () => {
      element.hass = hass;
      element.setConfig({
        type: 'custom:rss-accordion',
        entity: 'sensor.feed1',
      });
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.accordion-item');
      expect(items?.length).toBe(1);
      const source = items?.[0].querySelector('.item-source');
      expect(source).toBeNull();
    });

    it('should show source for single entity if explicitly enabled', async () => {
      element.hass = hass;
      element.setConfig({
        type: 'custom:rss-accordion',
        entity: 'sensor.feed1',
        show_source: true,
      });
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.accordion-item');
      expect(items?.length).toBe(1);
      const source = items?.[0].querySelector('.item-source');
      expect(source).not.toBeNull();
      expect(source?.textContent).toContain('Feed 1');
    });

    it('should name the source the way Home Assistant composes entity names', async () => {
      // friendly_name is fixed when the state is written and does not follow
      // the device and entity names the user set in the registry.
      const formatEntityName = vi.fn<NonNullable<HomeAssistant['formatEntityName']>>(() => 'Local news');
      element.hass = { ...hass, formatEntityName };
      element.setConfig({ type: 'custom:rss-accordion', entity: 'sensor.feed1', show_source: true });
      await element.updateComplete;

      const source = element.shadowRoot?.querySelector('.item-source');
      expect(source?.textContent).toContain('Local news');
      expect(source?.textContent).not.toContain('Feed 1');
      expect(formatEntityName).toHaveBeenCalledWith(hass.states['sensor.feed1'], [
        { type: 'device' },
        { type: 'entity' },
      ]);
    });

    it('should fall back to the friendly name when the formatter has no name to give', async () => {
      element.hass = { ...hass, formatEntityName: () => '' };
      element.setConfig({ type: 'custom:rss-accordion', entity: 'sensor.feed1', show_source: true });
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('.item-source')?.textContent).toContain('Feed 1');
    });

    it('should prioritize item category over entity name if available', async () => {
      ((hass.states['sensor.feed1'].attributes.entries as unknown[])[0] as Record<string, unknown>).category =
        'Custom Category';
      element.hass = { ...hass };
      element.setConfig({
        type: 'custom:rss-accordion',
        entity: 'sensor.feed1',
        show_source: true,
      });
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll('.accordion-item');
      expect(items?.length).toBe(1);
      const source = items?.[0].querySelector('.item-source');
      expect(source).not.toBeNull();
      expect(source?.textContent).toContain('Custom Category');
      expect(source?.textContent).not.toContain('Feed 1');
    });
  });

  describe('auto-refresh', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should start a refresh timer if refresh_interval is configured', async () => {
      const callServiceSpy = vi.fn();
      element.hass = { ...hass, callService: callServiceSpy };
      element.setConfig({ ...config, refresh_interval: 30 }); // 30 minutes
      await element.updateComplete;

      expect(callServiceSpy).not.toHaveBeenCalled();

      // fast-forward 30 minutes
      vi.advanceTimersByTime(30 * 60 * 1000);

      expect(callServiceSpy).toHaveBeenCalledWith('homeassistant', 'update_entity', {
        entity_id: 'sensor.test_feed',
      });
    });

    it('should not start a refresh timer if refresh_interval is 0 or undefined', async () => {
      const callServiceSpy = vi.fn();
      element.hass = { ...hass, callService: callServiceSpy };
      element.setConfig({ ...config, refresh_interval: 0 });
      await element.updateComplete;

      vi.advanceTimersByTime(60 * 60 * 1000); // 1 hour
      expect(callServiceSpy).not.toHaveBeenCalled();

      element.setConfig({ ...config, refresh_interval: undefined });
      await element.updateComplete;

      vi.advanceTimersByTime(60 * 60 * 1000);
      expect(callServiceSpy).not.toHaveBeenCalled();
    });

    it('should clear refresh timer on disconnect', async () => {
      const callServiceSpy = vi.fn();
      element.hass = { ...hass, callService: callServiceSpy };
      element.setConfig({ ...config, refresh_interval: 30 });
      await element.updateComplete;

      element.disconnectedCallback();

      // fast-forward 30 minutes
      vi.advanceTimersByTime(30 * 60 * 1000);

      expect(callServiceSpy).not.toHaveBeenCalled();
    });

    it('should refresh multiple entities if configured', async () => {
      const callServiceSpy = vi.fn();
      element.hass = { ...hass, callService: callServiceSpy };
      element.setConfig({ ...config, entities: ['sensor.feed1', 'sensor.feed2'], refresh_interval: 15 });
      await element.updateComplete;

      vi.advanceTimersByTime(15 * 60 * 1000);

      expect(callServiceSpy).toHaveBeenCalledTimes(2);
      expect(callServiceSpy).toHaveBeenCalledWith('homeassistant', 'update_entity', {
        entity_id: 'sensor.feed1',
      });
      expect(callServiceSpy).toHaveBeenCalledWith('homeassistant', 'update_entity', {
        entity_id: 'sensor.feed2',
      });
    });
  });

  describe('open_behavior', () => {
    beforeEach(() => {
      vi.useFakeTimers();

      // Remove the automatically created element so we can create it with the correct initial config
      if (element.parentElement) {
        document.body.removeChild(element);
      }

      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [
            {
              title: 'Item 1',
              link: '#1',
              summary: 'Summary 1',
              published: new Date('2023-01-02T10:00:00Z').toISOString(),
            },
            {
              title: 'Item 2',
              link: '#2',
              summary: 'Summary 2',
              published: new Date('2023-01-01T10:00:00Z').toISOString(),
            },
          ],
        },
      } as HassEntity;
    });

    afterEach(() => {
      vi.useRealTimers();
      // Only remove if it was attached. The outer afterEach will also attempt removal on whatever `element` is pointing to.
      if (element && element.parentElement) {
        document.body.removeChild(element);
      }
      // Provide a dummy element to prevent outer afterEach from throwing if we did something weird
      element = document.createElement('rss-accordion') as RssAccordion;
      document.body.appendChild(element);
    });

    it('should open the latest item if open_behavior is "latest"', async () => {
      element = document.createElement('rss-accordion') as RssAccordion;
      element.hass = hass;
      element.setConfig({ ...config, open_behavior: 'latest' });
      document.body.appendChild(element);
      await element.updateComplete;

      // Fast-forward setTimeout in firstUpdated
      vi.runAllTimers();
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item');
      expect(items?.length).toBe(2);
      expect(items?.[0].open).toBe(true); // Item 1 (newest)
      expect(items?.[1].open).toBe(false); // Item 2
    });

    it('should fall back to latest if initial_open is true and open_behavior is unset', async () => {
      element = document.createElement('rss-accordion') as RssAccordion;
      element.hass = hass;
      element.setConfig({ ...config, initial_open: true });
      document.body.appendChild(element);
      await element.updateComplete;

      vi.runAllTimers();
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item');
      expect(items?.length).toBe(2);
      expect(items?.[0].open).toBe(true);
      expect(items?.[1].open).toBe(false);
    });

    it('should open all items if open_behavior is "all"', async () => {
      element = document.createElement('rss-accordion') as RssAccordion;
      element.hass = hass;
      element.setConfig({ ...config, open_behavior: 'all' });
      document.body.appendChild(element);
      await element.updateComplete;

      vi.runAllTimers();
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item');
      expect(items?.length).toBe(2);
      expect(items?.[0].open).toBe(true);
      expect(items?.[1].open).toBe(true);
    });

    it('should keep all items closed if open_behavior is "none"', async () => {
      element = document.createElement('rss-accordion') as RssAccordion;
      element.hass = hass;
      element.setConfig({ ...config, open_behavior: 'none' });
      document.body.appendChild(element);
      await element.updateComplete;

      vi.runAllTimers();
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item');
      expect(items?.length).toBe(2);
      expect(items?.[0].open).toBe(false);
      expect(items?.[1].open).toBe(false);
    });
  });

  describe('keyed open state', () => {
    const OLDER = {
      title: 'Older story',
      link: 'https://example.com/older',
      summary: 'Older body',
      published: '2023-01-01T12:00:00Z',
    };
    const NEWER = {
      title: 'Newer story',
      link: 'https://example.com/newer',
      summary: 'Newer body',
      published: '2023-01-02T12:00:00Z',
    };
    const NEWEST = {
      title: 'Newest story',
      link: 'https://example.com/newest',
      summary: 'Newest body',
      published: '2023-01-03T12:00:00Z',
    };

    const feedState = (entries: Record<string, unknown>[]): HassEntity =>
      ({
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: { entries },
      }) as HassEntity;

    it('should keep the item the user opened open when a newer entry arrives', async () => {
      hass.states['sensor.test_feed'] = feedState([OLDER, NEWER]);
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const header = element.shadowRoot?.querySelector<HTMLElement>('.accordion-item .accordion-header');
      header?.click();
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector<HTMLDetailsElement>('.accordion-item')?.open).toBe(true);

      // A new entry pushes into the feed and takes over position 0.
      element.hass = {
        ...hass,
        states: { ...hass.states, 'sensor.test_feed': feedState([OLDER, NEWER, NEWEST]) },
      } as HomeAssistant;
      await element.updateComplete;

      const items = element.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item');
      expect(items?.length).toBe(3);
      expect([...(items ?? [])].map((item) => item.querySelector('.title-link')?.textContent?.trim())).toEqual([
        'Newest story',
        'Newer story',
        'Older story',
      ]);

      // The panel belongs to the entry the user opened, not to slot 0.
      const open = element.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item[open]');
      expect(open?.length).toBe(1);
      expect(open?.[0].querySelector('.title-link')?.textContent?.trim()).toBe('Newer story');
      expect(items?.[0].open).toBe(false);
    });

    it('should keep the item open when the same entry moves down the list', async () => {
      hass.states['sensor.test_feed'] = feedState([OLDER, NEWER]);
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      // Open the older entry, which sits at the bottom.
      const items = element.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item');
      items?.[1].querySelector<HTMLElement>('.accordion-header')?.click();
      await element.updateComplete;

      element.hass = {
        ...hass,
        states: { ...hass.states, 'sensor.test_feed': feedState([OLDER, NEWER, NEWEST]) },
      } as HomeAssistant;
      await element.updateComplete;

      const open = element.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item[open]');
      expect(open?.length).toBe(1);
      expect(open?.[0].querySelector('.title-link')?.textContent?.trim()).toBe('Older story');
    });
  });

  describe('card size with an entities list', () => {
    it('should size itself from the aggregated items, not from `entity`', async () => {
      hass.states['sensor.feed_a'] = {
        entity_id: 'sensor.feed_a',
        state: 'ok',
        attributes: {
          entries: [
            { title: 'A1', link: 'https://example.com/a1', published: '2023-01-01T12:00:00Z' },
            { title: 'A2', link: 'https://example.com/a2', published: '2023-01-02T12:00:00Z' },
          ],
        },
      } as HassEntity;
      hass.states['sensor.feed_b'] = {
        entity_id: 'sensor.feed_b',
        state: 'ok',
        attributes: {
          entries: [{ title: 'B1', link: 'https://example.com/b1', published: '2023-01-03T12:00:00Z' }],
        },
      } as HassEntity;

      element.hass = hass;
      element.setConfig({ type: 'custom:rss-accordion', entities: ['sensor.feed_a', 'sensor.feed_b'] });
      await element.updateComplete;

      expect(element.shadowRoot?.querySelectorAll('.accordion-item').length).toBe(3);
      expect(element.getCardSize()).toBe(3);
    });
  });

  describe('playback in the browser', () => {
    const entries = [
      {
        title: 'Episode 1',
        link: 'https://example.com/e1',
        published: '2023-01-02T12:00:00Z',
        audio: 'https://example.com/e1.mp3',
      },
      {
        title: 'Episode 2',
        link: 'https://example.com/e2',
        published: '2023-01-01T12:00:00Z',
        audio: 'https://example.com/e2.mp3',
      },
    ];

    let player: BrowserAudioPlayer;
    let audio: FakeAudio;

    const playButtons = (card: RssAccordion = element): HTMLButtonElement[] => [
      ...(card.shadowRoot?.querySelectorAll<HTMLButtonElement>('.audio-play') ?? []),
    ];
    const icons = (card: RssAccordion = element): (string | null)[] =>
      playButtons(card).map((b) => b.querySelector('ha-icon')?.getAttribute('icon') ?? null);

    beforeEach(async () => {
      localStorage.clear();
      ({ player, audio } = installFakePlayer());
      // Re-connect so the card subscribes to this test's player.
      document.body.removeChild(element);
      document.body.appendChild(element);

      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: { entries },
      } as HassEntity;
      element.hass = hass;
      element.setConfig({ ...config, allow_multiple: true });
      await element.updateComplete;
      expect(playButtons().length).toBe(2);
    });

    it('should start the episode in the shared player', async () => {
      playButtons()[0].click();
      await element.updateComplete;

      expect(audio.el.play).toHaveBeenCalled();
      expect(player.state.url).toBe('https://example.com/e1.mp3');
      expect(icons()).toEqual(['mdi:pause', 'mdi:play']);
    });

    it('should pause from the same button', async () => {
      playButtons()[0].click();
      await element.updateComplete;
      playButtons()[0].click();
      await element.updateComplete;

      expect(audio.el.pause).toHaveBeenCalled();
      expect(icons()).toEqual(['mdi:play', 'mdi:play']);
    });

    it('should play one episode at a time', async () => {
      playButtons()[0].click();
      await element.updateComplete;
      playButtons()[1].click();
      await element.updateComplete;

      expect(player.state.url).toBe('https://example.com/e2.mp3');
      expect(icons()).toEqual(['mdi:play', 'mdi:pause']);
    });

    it('should keep playing when an item is collapsed', async () => {
      const header = element.shadowRoot?.querySelector<HTMLElement>('.accordion-item .accordion-header');
      header?.click();
      await element.updateComplete;
      playButtons()[0].click();
      await element.updateComplete;

      header?.click();
      await element.updateComplete;

      expect(audio.el.pause).not.toHaveBeenCalled();
      expect(player.state.playing).toBe(true);
    });

    const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

    it('should keep playing when the card leaves the DOM', async () => {
      playButtons()[0].click();
      await element.updateComplete;

      document.body.removeChild(element);
      await settle();

      expect(audio.el.pause).not.toHaveBeenCalled();
      expect(player.state.playing).toBe(true);

      // afterEach removes the element again.
      document.body.appendChild(element);
    });

    it('should show a running episode on a card created afterwards', async () => {
      playButtons()[0].click();
      await element.updateComplete;
      document.body.removeChild(element);

      const next = document.createElement('rss-accordion') as RssAccordion;
      next.hass = hass;
      next.setConfig({ ...config, allow_multiple: true });
      document.body.appendChild(next);
      await next.updateComplete;

      expect(icons(next)).toEqual(['mdi:pause', 'mdi:play']);

      player.pause();
      await next.updateComplete;
      expect(icons(next)).toEqual(['mdi:play', 'mdi:play']);

      document.body.removeChild(next);
      document.body.appendChild(element);
    });

    it('should stop listening to the player once disconnected', async () => {
      document.body.removeChild(element);
      const update = vi.spyOn(element, 'requestUpdate');

      playButtons()[0].click();
      audio.advanceTo(12);

      expect(update).not.toHaveBeenCalled();
      document.body.appendChild(element);
    });

    it('should seek from the seek bar and the skip buttons', async () => {
      playButtons()[0].click();
      audio.setDuration(600);
      await element.updateComplete;

      const seek = element.shadowRoot!.querySelector<HTMLInputElement>('.audio-seek')!;
      expect(seek.disabled).toBe(false);
      seek.value = '200';
      seek.dispatchEvent(new Event('change'));
      expect(audio.el.currentTime).toBe(200);

      element.shadowRoot!.querySelector<HTMLButtonElement>('.audio-forward')!.click();
      expect(audio.el.currentTime).toBe(230);
      element.shadowRoot!.querySelector<HTMLButtonElement>('.audio-rewind')!.click();
      expect(audio.el.currentTime).toBe(215);
    });

    it('should not let the playhead fight a seek bar that is being dragged', async () => {
      playButtons()[0].click();
      audio.setDuration(600);
      await element.updateComplete;

      const seek = element.shadowRoot!.querySelector<HTMLInputElement>('.audio-seek')!;
      seek.value = '300';
      seek.dispatchEvent(new Event('input'));
      audio.advanceTo(5);
      await element.updateComplete;

      expect(seek.value).toBe('300');
    });
  });

  describe('playback on a media player', () => {
    const url = 'https://example.com/e1.mp3';
    let callService: ReturnType<typeof vi.fn<HomeAssistant['callService']>>;
    let audio: FakeAudio;

    const speaker = (state: string, attributes: Record<string, unknown> = {}): HassEntity =>
      ({
        entity_id: 'media_player.kitchen',
        state,
        attributes: { friendly_name: 'Kitchen', supported_features: 2 | 1 | 512, ...attributes },
      }) as HassEntity;

    const setSpeaker = async (stateObj: HassEntity): Promise<void> => {
      hass = { ...hass, states: { ...hass.states, 'media_player.kitchen': stateObj } } as HomeAssistant;
      element.hass = hass;
      await element.updateComplete;
    };

    const button = (selector: string): HTMLButtonElement =>
      element.shadowRoot!.querySelector<HTMLButtonElement>(selector)!;

    beforeEach(async () => {
      localStorage.clear();
      ({ audio } = installFakePlayer());
      callService = vi.fn<HomeAssistant['callService']>().mockResolvedValue(undefined);
      hass.callService = callService;
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [
            { title: 'Episode 1', link: 'https://example.com/e1', published: '2023-01-02T12:00:00Z', audio: url },
          ],
        },
      } as HassEntity;
      hass.states['media_player.kitchen'] = speaker('idle');
      element.hass = hass;
      element.setConfig({ ...config, audio_target: 'media_player.kitchen' });
      await element.updateComplete;
    });

    it('should hand the episode to the speaker instead of the browser', async () => {
      button('.audio-play').click();

      expect(callService).toHaveBeenCalledWith(
        'media_player',
        'play_media',
        {
          entity_id: 'media_player.kitchen',
          media_content_id: url,
          media_content_type: 'music',
          extra: { title: 'Episode 1' },
        },
        undefined,
        true,
      );
      expect(audio.el.play).not.toHaveBeenCalled();
      expect(element.shadowRoot?.querySelector('.audio-target')?.textContent).toContain('Kitchen');
    });

    it('should name the speaker the way Home Assistant composes entity names', async () => {
      element.hass = { ...hass, formatEntityName: () => 'Kitchen Speaker' };
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('.audio-target')?.textContent).toContain('Kitchen Speaker');
    });

    it('should follow the speaker and pause it', async () => {
      await setSpeaker(speaker('playing', { media_content_id: url, media_duration: 600, media_position: 0 }));

      expect(button('.audio-play').querySelector('ha-icon')?.getAttribute('icon')).toBe('mdi:pause');
      button('.audio-play').click();
      expect(callService).toHaveBeenCalledWith(
        'media_player',
        'media_pause',
        { entity_id: 'media_player.kitchen' },
        undefined,
        true,
      );
    });

    it('should resume a paused episode rather than restart it', async () => {
      await setSpeaker(speaker('paused', { media_content_id: url, media_duration: 600, media_position: 42 }));

      button('.audio-play').click();
      expect(callService).toHaveBeenCalledWith(
        'media_player',
        'media_play',
        { entity_id: 'media_player.kitchen' },
        undefined,
        true,
      );
      expect(callService).not.toHaveBeenCalledWith('media_player', 'play_media', expect.anything());
    });

    it('should seek to the saved position once the speaker has started', async () => {
      new StorageHelper('sensor.test_feed').setAudioProgress(url, { currentTime: 120, completed: false });

      button('.audio-play').click();
      expect(callService).not.toHaveBeenCalledWith('media_player', 'media_seek', expect.anything());

      await setSpeaker(speaker('playing', { media_content_id: url, media_duration: 600, media_position: 0 }));
      // Automatic, so no error toast if the speaker refuses it.
      expect(callService).toHaveBeenCalledWith(
        'media_player',
        'media_seek',
        { entity_id: 'media_player.kitchen', seek_position: 120 },
        undefined,
        false,
      );
    });

    it('should seek on the speaker', async () => {
      await setSpeaker(speaker('paused', { media_content_id: url, media_duration: 600, media_position: 100 }));

      button('.audio-forward').click();
      expect(callService).toHaveBeenCalledWith(
        'media_player',
        'media_seek',
        { entity_id: 'media_player.kitchen', seek_position: 130 },
        undefined,
        true,
      );
    });

    it('should stop offering seeking once the speaker has refused a seek', async () => {
      await setSpeaker(speaker('paused', { media_content_id: url, media_duration: 600, media_position: 100 }));
      vi.spyOn(console, 'error').mockImplementation(() => {});
      callService.mockRejectedValueOnce(new Error('NotImplementedError'));

      button('.audio-forward').click();
      await new Promise((resolve) => setTimeout(resolve, 0));
      await element.updateComplete;

      expect(button('.audio-forward').disabled).toBe(true);
      expect(element.shadowRoot!.querySelector<HTMLInputElement>('.audio-seek')!.disabled).toBe(true);
    });

    it('should not offer seeking on a speaker that cannot seek', async () => {
      await setSpeaker(
        speaker('playing', { media_content_id: url, media_duration: 600, media_position: 0, supported_features: 1 }),
      );

      expect(button('.audio-forward').disabled).toBe(true);
      expect(element.shadowRoot!.querySelector<HTMLInputElement>('.audio-seek')!.disabled).toBe(true);
    });

    it('should show an unavailable speaker and not try to play on it', async () => {
      await setSpeaker(speaker('unavailable'));

      expect(button('.audio-play').disabled).toBe(true);
      expect(element.shadowRoot?.querySelector('.audio-target.unavailable')?.textContent).toContain(
        'Speaker unavailable: media_player.kitchen',
      );
    });

    it('should treat something else playing on the speaker as not ours', async () => {
      await setSpeaker(speaker('playing', { media_content_id: 'spotify:track:1', media_position: 0 }));

      expect(button('.audio-play').querySelector('ha-icon')?.getAttribute('icon')).toBe('mdi:play');
      expect(button('.audio-forward').disabled).toBe(true);
    });

    it('should save the speaker position while the card is on screen', async () => {
      vi.useFakeTimers();
      try {
        const start = Date.now();
        await setSpeaker(
          speaker('playing', {
            media_content_id: url,
            media_duration: 600,
            media_position: 50,
            media_position_updated_at: new Date(start).toISOString(),
          }),
        );

        vi.advanceTimersByTime(3000);
        expect(new StorageHelper('sensor.test_feed').getAudioProgress(url)?.currentTime).toBeCloseTo(51, 0);
      } finally {
        vi.useRealTimers();
      }
    });

    const playing = (position: number, duration: number, updatedAt: number): HassEntity =>
      speaker('playing', {
        media_content_id: url,
        media_duration: duration,
        media_position: position,
        media_position_updated_at: new Date(updatedAt).toISOString(),
      });

    it('should not mark an episode listened from the previous media position', async () => {
      vi.useFakeTimers();
      try {
        button('.audio-play').click();
        // The demo players keep counting from what they played before.
        await setSpeaker(playing(1055, 300, Date.now()));
        vi.advanceTimersByTime(3000);

        expect(new StorageHelper('sensor.test_feed').getAudioProgress(url)).toBeNull();
        expect(element.shadowRoot?.querySelector('.listened-icon')).toBeNull();
      } finally {
        vi.useRealTimers();
      }
    });

    it('should ignore a position reported before the episode was started', async () => {
      vi.useFakeTimers();
      try {
        const before = Date.now() - 60_000;
        button('.audio-play').click();
        await setSpeaker(playing(200, 300, before));
        vi.advanceTimersByTime(3000);

        expect(new StorageHelper('sensor.test_feed').getAudioProgress(url)).toBeNull();
      } finally {
        vi.useRealTimers();
      }
    });

    it('should mark the episode listened when it plays to the end', async () => {
      vi.useFakeTimers();
      try {
        button('.audio-play').click();
        await setSpeaker(playing(100, 300, Date.now()));
        vi.advanceTimersByTime(1000);
        await setSpeaker(playing(295, 300, Date.now()));
        vi.advanceTimersByTime(6000);
        await element.updateComplete;

        expect(new StorageHelper('sensor.test_feed').getAudioProgress(url)?.completed).toBe(true);
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('measuring an open panel', () => {
    /**
     * jsdom lays nothing out and loads nothing, so both halves of a measurement
     * are scripted: the panel reports the height the test wants, and an image
     * counts as loaded only when the test says so.
     *
     * The switch sits on the prototype rather than on an instance, because the
     * image under test is one lit creates during a render - it does not exist
     * yet at the point the test would have to reach for it, and it is measured
     * before the test gets control back. Not loaded is the default for the same
     * reason.
     */
    const loaded = new WeakSet<HTMLImageElement>();
    let originalComplete: PropertyDescriptor | undefined;

    beforeEach(() => {
      originalComplete = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'complete');
      Object.defineProperty(HTMLImageElement.prototype, 'complete', {
        configurable: true,
        get(this: HTMLImageElement) {
          return loaded.has(this);
        },
      });
    });

    afterEach(() => {
      if (originalComplete) {
        Object.defineProperty(HTMLImageElement.prototype, 'complete', originalComplete);
      }
    });

    /** Arrives on load, the way a real picture does. */
    const arrive = (img: HTMLImageElement): void => {
      loaded.add(img);
      img.dispatchEvent(new Event('load'));
    };

    const feedState = (image?: string): HassEntity =>
      ({
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [
            {
              title: 'Story',
              link: 'https://example.com/story',
              published: '2023-01-01T12:00:00Z',
              summary: '<p>The body.</p>',
              ...(image ? { image } : {}),
            },
          ],
        },
      }) as HassEntity;

    /** Enough animation frames for a measurement and its transition reset. */
    const frames = async (): Promise<void> => {
      for (let i = 0; i < 4; i++) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    };

    it('waits for the picture a re-rendered body gained before measuring', async () => {
      element.hass = { ...hass, states: { 'sensor.test_feed': feedState() } };
      element.setConfig({ ...config, open_behavior: 'none' });
      await element.updateComplete;

      const details = element.shadowRoot!.querySelector<HTMLDetailsElement>('.accordion-item')!;
      const content = details.querySelector<HTMLElement>('.accordion-content')!;

      let panelHeight = 300;
      Object.defineProperty(content, 'scrollHeight', { get: () => panelHeight, configurable: true });

      // The user opens an entry that carries no picture at all.
      details.querySelector<HTMLElement>('.accordion-header')!.click();
      await frames();
      expect(content.style.maxHeight).toBe('300px');

      // The feed rewrites the entry. Link and published are unchanged, so the
      // item key and with it this very DOM node survive - but the body now
      // carries a picture, and until it arrives the panel measures short.
      panelHeight = 120;
      element.hass = { ...hass, states: { 'sensor.test_feed': feedState('https://example.com/one.png') } };
      await element.updateComplete;
      await frames();

      const img = details.querySelector<HTMLImageElement>('img.item-image')!;
      expect(img).toBeTruthy();

      // The panel is the same one, still open, and never took the short height.
      expect(element.shadowRoot!.querySelector('.accordion-item')).toBe(details);
      expect(details.open).toBe(true);
      expect(content.style.maxHeight).toBe('300px');

      // Once the picture is there the panel is measured around it.
      panelHeight = 420;
      arrive(img);
      await frames();
      expect(content.style.maxHeight).toBe('420px');
    });

    it('does not re-open a panel the user closed while its image was loading', async () => {
      element.hass = { ...hass, states: { 'sensor.test_feed': feedState('https://example.com/one.png') } };
      element.setConfig({ ...config, open_behavior: 'none' });
      await element.updateComplete;

      const details = element.shadowRoot!.querySelector<HTMLDetailsElement>('.accordion-item')!;
      const content = details.querySelector<HTMLElement>('.accordion-content')!;
      const img = details.querySelector<HTMLImageElement>('img.item-image')!;
      Object.defineProperty(content, 'scrollHeight', { get: () => 300, configurable: true });

      const header = details.querySelector<HTMLElement>('.accordion-header')!;
      header.click();
      await frames();
      // Still waiting for the picture, so no height has been written yet.
      expect(content.style.maxHeight).toBe('');

      header.click(); // The user gives up and collapses it again.
      arrive(img);
      await frames();

      expect(content.style.maxHeight).toBe('0px');
    });
  });

  describe('closing a panel while the card re-renders', () => {
    const entry = {
      title: 'Story',
      link: 'https://example.com/story',
      published: '2023-01-01T12:00:00Z',
      summary: '<p>The body.</p>',
    };

    const feed = (state: string): HassEntity =>
      ({ entity_id: 'sensor.test_feed', state, attributes: { entries: [entry] } }) as HassEntity;

    it('lets the collapse animation finish', async () => {
      element.hass = { ...hass, states: { 'sensor.test_feed': feed('ok') } };
      element.setConfig({ ...config, open_behavior: 'none' });
      await element.updateComplete;

      const details = element.shadowRoot!.querySelector<HTMLDetailsElement>('.accordion-item')!;
      const content = details.querySelector<HTMLElement>('.accordion-content')!;
      const header = details.querySelector<HTMLElement>('.accordion-header')!;

      header.click();
      await element.updateComplete;
      expect(details.hasAttribute('open')).toBe(true);

      // The close animates: max-height goes to zero now, the open attribute
      // comes off when the transition ends.
      header.click();
      expect(content.style.maxHeight).toBe('0px');
      expect(details.hasAttribute('open')).toBe(true);

      // A feed update lands mid-animation. updated() used to strip the open
      // attribute here and the panel vanished instead of collapsing.
      element.hass = { ...hass, states: { 'sensor.test_feed': feed('updated') } };
      await element.updateComplete;
      expect(element.shadowRoot!.querySelector('.accordion-item')).toBe(details);
      expect(details.hasAttribute('open')).toBe(true);

      // The animation finishes on its own terms.
      content.dispatchEvent(new Event('transitionend'));
      expect(details.hasAttribute('open')).toBe(false);
    });
  });

  describe('keys of entries that left the feed', () => {
    const older = {
      title: 'Older',
      link: 'https://example.com/older',
      published: '2023-01-01T10:00:00Z',
      summary: '<p>Older.</p>',
    };
    const newer = {
      title: 'Newer',
      link: 'https://example.com/newer',
      published: '2023-01-02T10:00:00Z',
      summary: '<p>Newer.</p>',
    };

    const feed = (entries: Record<string, unknown>[]): HassEntity =>
      ({ entity_id: 'sensor.test_feed', state: 'ok', attributes: { entries } }) as HassEntity;

    const publish = async (entries: Record<string, unknown>[]): Promise<void> => {
      element.hass = { ...hass, states: { 'sensor.test_feed': feed(entries) } };
      await element.updateComplete;
    };

    /** The two sets are private, and their size is the whole point of this. */
    const keySets = (): { open: Set<string>; seen: Set<string> } => {
      const internals = element as unknown as { _openKeys: Set<string>; _seenKeys: Set<string> };
      return { open: internals._openKeys, seen: internals._seenKeys };
    };

    const items = (): HTMLDetailsElement[] => [
      ...element.shadowRoot!.querySelectorAll<HTMLDetailsElement>('.accordion-item'),
    ];

    it('forgets them, instead of re-opening them when they come back', async () => {
      element.setConfig({ ...config, open_behavior: 'none' });
      await publish([newer, older]);

      // The user opens the newer entry, which renders first.
      items()[0].querySelector<HTMLElement>('.accordion-header')!.click();
      await element.updateComplete;
      expect(items()[0].hasAttribute('open')).toBe(true);
      expect(keySets().open.size).toBe(1);

      // It scrolls out of the feed while it is still open.
      await publish([older]);
      expect(items()).toHaveLength(1);
      expect(keySets().open.size).toBe(0);
      expect(keySets().seen.size).toBe(1);

      // The feed offers it again. Nothing asked for it to be open.
      await publish([newer, older]);
      expect(items()).toHaveLength(2);
      expect(items().some((details) => details.hasAttribute('open'))).toBe(false);
      expect(keySets().seen.size).toBe(2);
    });

    it('keeps them while the entity is briefly unavailable', async () => {
      element.setConfig({ ...config, open_behavior: 'none' });
      await publish([newer, older]);

      items()[0].querySelector<HTMLElement>('.accordion-header')!.click();
      await element.updateComplete;
      expect(keySets().open.size).toBe(1);

      element.hass = {
        ...hass,
        states: { 'sensor.test_feed': { entity_id: 'sensor.test_feed', state: 'unavailable', attributes: {} } },
      } as HomeAssistant;
      await element.updateComplete;

      // An entity that is down is not the feed dropping everything it had.
      expect(keySets().open.size).toBe(1);

      await publish([newer, older]);
      expect(items()[0].hasAttribute('open')).toBe(true);
    });
  });

  describe('entries with missing fields', () => {
    it('should render no date row for an entry without a date', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [{ title: 'No date', link: 'https://example.com/no-date', summary: 'Body' }],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const published = element.shadowRoot?.querySelector('.item-published');
      expect(published).toBeNull();
      expect(element.shadowRoot?.textContent).not.toContain('Invalid Date');
    });

    it('should fall back to a placeholder title for an entry without a title', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [{ link: 'https://example.com/untitled', summary: 'Body', published: '2023-01-01T12:00:00Z' }],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const title = element.shadowRoot?.querySelector('.title-link');
      expect(title?.textContent?.trim()).toBe('Untitled entry');
    });

    it('should render a title-less, link-less entry as plain text, not as a link', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [{ summary: 'Body', published: '2023-01-01T12:00:00Z' }],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      // An empty href points at the dashboard itself, so clicking the header
      // would reload the page.
      expect(element.shadowRoot?.querySelector('a.title-link')).toBeNull();
      expect(element.shadowRoot?.querySelector('.item-link')).toBeNull();
      const title = element.shadowRoot?.querySelector('span.title-link');
      expect(title?.textContent?.trim()).toBe('Untitled entry');
    });
  });

  describe('empty states', () => {
    it('should say the entity is unavailable rather than that the feed is empty', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'unavailable',
        attributes: {},
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const warning = element.shadowRoot?.querySelector('.card-content.warning');
      expect(warning?.textContent).toContain('Entity unavailable');
      expect(warning?.textContent).toContain('sensor.test_feed');
    });

    it('should say an entity carries no feed entries at all', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'above_horizon',
        attributes: { friendly_name: 'Not a feed' },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const warning = element.shadowRoot?.querySelector('.card-content.warning');
      expect(warning?.textContent).toContain('no feed entries');
      expect(warning?.textContent).toContain('sensor.test_feed');
    });

    it('should keep the plain empty-feed message for a feed entity with no entries', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: { entries: [] },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector('.card-content.warning')).toBeNull();
      expect(element.shadowRoot?.querySelector('.card-content i')?.textContent).toContain('No entries available');
    });
  });

  it('should survive hass arriving before setConfig', async () => {
    // Home Assistant sets hass on a freshly created card and only then calls
    // setConfig. updated() runs for that first update too, with no config
    // behind it and no DOM to re-apply anything to.
    const errors: unknown[] = [];
    const onRejection = (event: PromiseRejectionEvent): void => {
      errors.push(event.reason);
    };
    window.addEventListener('unhandledrejection', onRejection);

    element.hass = hass;
    await element.updateComplete;
    await Promise.resolve();

    window.removeEventListener('unhandledrejection', onRejection);
    expect(errors).toEqual([]);
    expect(element.shadowRoot?.querySelector('ha-card')).toBeNull();
  });

  describe('item keys', () => {
    // updated() used to skip an item whose key was falsy, which could not
    // happen: the key is built by interpolation, so the emptiest entry there is
    // still keys as "undefined|undefined". Pinning that here, because it is the
    // reason that branch is gone.
    it('are never empty, even for an entry with nothing to key on', () => {
      const helper = new StorageHelper('sensor.test_feed');

      expect(helper.getBookmarkKey({} as unknown as Parameters<StorageHelper['getBookmarkKey']>[0])).toBe(
        'undefined|undefined',
      );
      expect(
        helper.getBookmarkKey({ link: 'https://example.com/a' } as Parameters<StorageHelper['getBookmarkKey']>[0]),
      ).toBe('https://example.com/a|undefined');
    });
  });

  describe('card picker metadata', () => {
    it('should stub a configuration with a real feed entity', () => {
      hass.states['sensor.not_a_feed'] = {
        entity_id: 'sensor.not_a_feed',
        state: 'ok',
        attributes: {},
      } as HassEntity;
      hass.states['sensor.real_feed'] = {
        entity_id: 'sensor.real_feed',
        state: 'ok',
        attributes: { entries: [{ title: 'One', link: 'https://example.com/one' }] },
      } as HassEntity;

      const stub = (element.constructor as typeof RssAccordion).getStubConfig(hass, [
        'sensor.not_a_feed',
        'sensor.real_feed',
      ]);

      expect(stub.entity).toBe('sensor.real_feed');
    });

    it('should skip an entity whose feed attribute is not a list', () => {
      // The picker tested these for truthiness while rendering requires an
      // array, so an entity like this became the preview and the user's first
      // sight of the card was "Entity has no feed entries".
      hass.states['sensor.scalar_items'] = {
        entity_id: 'sensor.scalar_items',
        state: 'ok',
        attributes: { items: 12 },
      } as HassEntity;
      hass.states['sensor.object_entries'] = {
        entity_id: 'sensor.object_entries',
        state: 'ok',
        attributes: { entries: { title: 'One' } },
      } as HassEntity;
      hass.states['sensor.real_feed'] = {
        entity_id: 'sensor.real_feed',
        state: 'ok',
        attributes: { entries: [{ title: 'One', link: 'https://example.com/one' }] },
      } as HassEntity;

      const stub = (element.constructor as typeof RssAccordion).getStubConfig(hass, [
        'sensor.scalar_items',
        'sensor.object_entries',
        'sensor.real_feed',
      ]);

      expect(stub.entity).toBe('sensor.real_feed');
    });

    it('should stub an event entity, which the card also reads', () => {
      hass.states['sensor.not_a_feed'] = {
        entity_id: 'sensor.not_a_feed',
        state: 'ok',
        attributes: {},
      } as HassEntity;
      hass.states['event.podcast'] = {
        entity_id: 'event.podcast',
        state: '2023-01-01T12:00:00Z',
        attributes: { title: 'Episode', link: 'https://example.com/episode' },
      } as HassEntity;

      const stub = (element.constructor as typeof RssAccordion).getStubConfig(hass, [
        'sensor.not_a_feed',
        'event.podcast',
      ]);

      expect(stub.entity).toBe('event.podcast');
    });

    it('should ask the card picker for a live preview', () => {
      // Without `preview` the picker lists the card by name only, so the stub
      // entity getStubConfig picks for that preview is never seen.
      const entry = window.customCards?.find((card) => card.type === 'rss-accordion');
      expect(entry?.preview).toBe(true);
    });

    describe('entity suggestions', () => {
      const suggest = (entityId: string): { config: Record<string, unknown> } | null => {
        const entry = window.customCards?.find((card) => card.type === 'rss-accordion');
        return entry!.getEntitySuggestion!(hass, entityId);
      };
      const entries = [{ title: 'One', link: 'https://example.com/one' }];

      it('should suggest the card for a feedparser sensor, with the stub config', () => {
        hass.states['sensor.local_news'] = {
          entity_id: 'sensor.local_news',
          state: '1',
          attributes: { entries },
        } as HassEntity;
        hass.entities = { 'sensor.local_news': { entity_id: 'sensor.local_news', platform: 'feedparser' } };

        const stub = (element.constructor as typeof RssAccordion).getStubConfig(hass, ['sensor.local_news']);
        // The suggestion's preview has to be the card the picker would otherwise add.
        expect(suggest('sensor.local_news')).toEqual({ config: { type: 'custom:rss-accordion', ...stub } });
      });

      it('should recognise a feedparser sensor that has no registry entry by its attribution', () => {
        // YAML sensors of the original feedparser have no unique_id, so no platform to go by.
        hass.states['sensor.local_news'] = {
          entity_id: 'sensor.local_news',
          state: '1',
          attributes: { attribution: 'Data retrieved using RSS feedparser', entries },
        } as HassEntity;

        expect(suggest('sensor.local_news')?.config.entity).toBe('sensor.local_news');
      });

      it('should suggest the card for a feedreader event entity', () => {
        hass.states['event.local_news'] = {
          entity_id: 'event.local_news',
          state: '2026-03-01T08:00:00.000+00:00',
          attributes: { event_types: ['feedreader'], event_type: 'feedreader', title: 'One' },
        } as HassEntity;

        expect(suggest('event.local_news')).toEqual({
          config: { type: 'custom:rss-accordion', entity: 'event.local_news', max_items: 5 },
        });
      });

      it('should not suggest the card for entities that are not clearly feeds', () => {
        // The card reads these, but the suggestion panel is only useful while it stays short.
        hass.states['sensor.other_list'] = {
          entity_id: 'sensor.other_list',
          state: '1',
          attributes: { entries },
        } as HassEntity;
        hass.states['event.doorbell'] = {
          entity_id: 'event.doorbell',
          state: '2026-03-01T08:00:00.000+00:00',
          attributes: { event_types: ['ring'] },
        } as HassEntity;
        // A feedparser sensor that is unavailable has no entries to preview.
        hass.states['sensor.broken_feed'] = {
          entity_id: 'sensor.broken_feed',
          state: 'unavailable',
          attributes: {},
        } as HassEntity;
        hass.entities = { 'sensor.broken_feed': { entity_id: 'sensor.broken_feed', platform: 'feedparser' } };

        expect(suggest('sensor.other_list')).toBeNull();
        expect(suggest('event.doorbell')).toBeNull();
        expect(suggest('sensor.broken_feed')).toBeNull();
        expect(suggest('sensor.missing')).toBeNull();
      });
    });

    it('should fall back to a placeholder entity when no feed entity exists', () => {
      const stub = (element.constructor as typeof RssAccordion).getStubConfig(hass, []);
      expect(stub.entity).toBe('sensor.your_rss_feed_sensor');
    });

    // Home Assistant reads this off the card element it created - `hui-card`
    // does `if (this._element.getGridOptions)` - so a static method is never
    // seen and the card silently keeps the default sizing.
    it('should expose grid options on the instance for sections views', () => {
      expect(element.getGridOptions()).toEqual({
        columns: 'full',
        rows: 'auto',
        min_columns: 6,
        min_rows: 1,
      });
    });

    it('should not hide the sizing API behind the constructor', () => {
      const ctor = element.constructor as unknown as Record<string, unknown>;
      expect(ctor.getGridOptions).toBeUndefined();
    });
  });

  describe('image error handling', () => {
    it('should hide a channel image that fails to load and drop the cropped layout', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [{ title: 'Item', link: 'https://example.com/item', published: '2023-01-01T12:00:00Z' }],
          channel: { title: 'Channel', image: 'https://example.com/broken.png' },
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig({ ...config, show_channel_info: true, crop_channel_image: true });
      await element.updateComplete;

      const image = element.shadowRoot?.querySelector<HTMLImageElement>('.channel-image');
      expect(image).not.toBeNull();
      expect(element.shadowRoot?.querySelector('.channel-info.cropped-image')).not.toBeNull();

      image?.dispatchEvent(new Event('error'));
      await element.updateComplete;

      expect(image?.classList.contains('image-failed')).toBe(true);
      expect(element.shadowRoot?.querySelector('.channel-info.cropped-image')).toBeNull();

      // The crop used to be removed by reaching into the class attribute lit
      // owns. That held only while lit had no reason to rewrite it: toggling
      // the crop off and on gives the binding a new value, and the crop came
      // back around a picture that was still hidden.
      element.setConfig({ ...config, show_channel_info: true, crop_channel_image: false });
      await element.updateComplete;
      element.setConfig({ ...config, show_channel_info: true, crop_channel_image: true });
      await element.updateComplete;

      expect(element.shadowRoot?.querySelector<HTMLImageElement>('.channel-image')).toBe(image);
      expect(image?.classList.contains('image-failed')).toBe(true);
      expect(element.shadowRoot?.querySelector('.channel-info.cropped-image')).toBeNull();
    });

    it('should show a channel image again once it loads', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [{ title: 'Item', link: 'https://example.com/item', published: '2023-01-01T12:00:00Z' }],
          channel: { title: 'Channel', image: 'https://example.com/broken.png' },
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig({ ...config, show_channel_info: true, crop_channel_image: true });
      await element.updateComplete;

      const image = element.shadowRoot?.querySelector<HTMLImageElement>('.channel-image');
      image?.dispatchEvent(new Event('error'));
      await element.updateComplete;
      expect(element.shadowRoot?.querySelector('.channel-info.cropped-image')).toBeNull();

      // Nodes outlive their contents, so a src that rebinds to something that
      // works has to be able to undo this.
      image?.dispatchEvent(new Event('load'));
      await element.updateComplete;

      expect(image?.classList.contains('image-failed')).toBe(false);
      expect(element.shadowRoot?.querySelector('.channel-info.cropped-image')).not.toBeNull();
    });

    it('should hide an item image that fails to load', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [
            {
              title: 'Item',
              link: 'https://example.com/item',
              published: '2023-01-01T12:00:00Z',
              image: 'https://example.com/broken.png',
            },
          ],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config);
      await element.updateComplete;

      const image = element.shadowRoot?.querySelector<HTMLImageElement>('.item-image');
      image?.dispatchEvent(new Event('error'));

      expect(image?.classList.contains('image-failed')).toBe(true);

      // Items are keyed, so this node outlives the entry's contents. A feed
      // that rewrites the entry around a picture that works has to be able to
      // bring it back - without a load handler the <img> stayed hidden for the
      // life of the card.
      image?.dispatchEvent(new Event('load'));

      expect(image?.classList.contains('image-failed')).toBe(false);
    });
  });

  describe('bookmark filter button', () => {
    /**
     * `ha-button` renamed its size tokens in 2026.7: `small` up to 2026.6,
     * `s` from 2026.7. Neither release understands the other's token and
     * neither complains about one - it is dropped and the button falls back to
     * its default size. The card supports 2026.4 upwards, so it has to speak
     * both.
     */
    const sizeOn = async (version: string | undefined): Promise<string | null> => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [{ title: 'Item', link: 'https://example.com/item', published: '2023-01-01T12:00:00Z' }],
        },
      } as HassEntity;
      element.hass = { ...hass, config: version === undefined ? undefined : { version } };
      element.setConfig({ ...config, show_bookmarks: true });
      await element.updateComplete;

      return element.shadowRoot?.querySelector('ha-button.bookmark-filter-button')?.getAttribute('size') ?? null;
    };

    it('uses the pre-rename token on the cores that only know it', async () => {
      expect(await sizeOn('2026.4.0')).toBe('small');
      expect(await sizeOn('2026.6.3')).toBe('small');
    });

    it('uses the renamed token from 2026.7 on', async () => {
      expect(await sizeOn('2026.7.0')).toBe('s');
      expect(await sizeOn('2026.12.1')).toBe('s');
      expect(await sizeOn('2027.1.0')).toBe('s');
    });

    it('falls back to the current token when the core version is unreadable', async () => {
      expect(await sizeOn(undefined)).toBe('s');
      expect(await sizeOn('dev')).toBe('s');
    });
  });

  describe('Duplicate resource registration', () => {
    it('should not throw when the bundle is evaluated a second time', async () => {
      // A duplicate Lovelace resource entry loads the bundle twice. Without the
      // guarded define() the second evaluation throws while the module is still
      // being evaluated, so the card never registers and the user loses the
      // whole card instead of seeing an error.
      vi.resetModules();
      await expect(import('../src/rss-accordion')).resolves.toBeDefined();
    });

    it('should register the card in customCards only once when loaded twice', async () => {
      vi.resetModules();
      await import('../src/rss-accordion');

      const entries = (window.customCards ?? []).filter((card) => card.type === 'rss-accordion');
      expect(entries).toHaveLength(1);
    });

    it('should not throw when the editor module is evaluated a second time', async () => {
      // The editor lives in the same bundle and is defined the same way, so it
      // is the second element a duplicate load would trip over.
      vi.resetModules();
      await expect(import('../src/editor')).resolves.toBeDefined();
      vi.resetModules();
      await expect(import('../src/editor')).resolves.toBeDefined();
    });
  });
});
