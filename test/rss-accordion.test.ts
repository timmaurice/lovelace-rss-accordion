import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/rss-accordion';
import type { RssAccordion } from '../src/rss-accordion';
import { HomeAssistant, RssAccordionConfig, HassEntity, AudioProgress } from '../src/types';
import { StorageHelper } from '../src/storage-helper';
import { formatDate } from '../src/utils';

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
    it('should render an audio player if item has an audio URL', async () => {
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
              audio: 'http://example.com/episode.mp3',
            },
          ],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig(config); // show_audio_player defaults to true
      await element.updateComplete;

      const audioPlayer = element.shadowRoot?.querySelector<HTMLAudioElement>('audio');
      expect(audioPlayer).not.toBeNull();
      expect(audioPlayer?.src).toBe('http://example.com/episode.mp3');
    });

    it('should not render an audio player if item has no audio URL', async () => {
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

      const audioPlayer = element.shadowRoot?.querySelector('audio');
      expect(audioPlayer).toBeNull();
    });

    it('should not render an audio player if show_audio_player is false', async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: {
          entries: [{ title: 'Test 1', link: '#', audio: 'http://a.com/a.mp3', published: new Date().toISOString() }],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig({ ...config, show_audio_player: false });
      await element.updateComplete;

      const audioPlayer = element.shadowRoot?.querySelector<HTMLAudioElement>('audio');
      expect(audioPlayer).toBeNull();
    });
  });

  describe('audio persistence', () => {
    const audioUrl = 'http://example.com/episode.mp3';
    let audioProgressMock: AudioProgress | null = null;

    beforeEach(() => {
      // Mock StorageHelper for audio
      audioProgressMock = null;
      vi.spyOn(StorageHelper.prototype, 'getAudioProgress').mockImplementation(() => audioProgressMock);
      vi.spyOn(StorageHelper.prototype, 'setAudioProgress').mockImplementation((_url, progress) => {
        audioProgressMock = progress;
      });

      // Set up a feed item with audio
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

    it('should save audio progress on timeupdate after interval', async () => {
      const setAudioProgressSpy = vi.spyOn(StorageHelper.prototype, 'setAudioProgress').mockImplementation(() => {});
      vi.useFakeTimers();
      element.setConfig(config);
      await element.updateComplete;

      const audioEl = element.shadowRoot?.querySelector('audio');
      expect(audioEl).not.toBeNull();

      // This first timeupdate will not save because the faked time is less than the interval
      audioEl!.dispatchEvent(new Event('timeupdate'));
      expect(setAudioProgressSpy).not.toHaveBeenCalled();

      // Advance time past the save interval (5000ms)
      vi.advanceTimersByTime(5001);

      // This timeupdate should trigger a save
      audioEl!.currentTime = 30;
      audioEl!.dispatchEvent(new Event('timeupdate'));

      expect(setAudioProgressSpy).toHaveBeenCalledWith(audioUrl, {
        currentTime: 30,
        completed: false,
      });

      vi.useRealTimers();
    });

    it('should load audio progress on loadedmetadata', async () => {
      audioProgressMock = { currentTime: 60, completed: false };
      element.setConfig(config);
      await element.updateComplete;

      const audioEl = element.shadowRoot?.querySelector('audio');
      audioEl!.dispatchEvent(new Event('loadedmetadata'));
      await element.updateComplete;

      expect(audioEl!.currentTime).toBe(60);
    });

    it('should mark audio as completed and show icon on "ended" event', async () => {
      element.setConfig(config);
      await element.updateComplete;

      let listenedIcon = element.shadowRoot?.querySelector('.listened-icon');
      expect(listenedIcon).toBeNull();

      const audioEl = element.shadowRoot?.querySelector('audio');
      audioEl!.dispatchEvent(new Event('ended'));
      await element.updateComplete;

      // Check that setAudioProgress was called with completed status
      expect(audioProgressMock?.completed).toBe(true);
      expect(audioProgressMock?.completedAt).toBeDefined();
      expect(typeof audioProgressMock?.completedAt).toBe('string');

      listenedIcon = element.shadowRoot?.querySelector('.listened-icon');
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

    it('should not load progress for a completed audio', async () => {
      audioProgressMock = { currentTime: 120, completed: true };
      element.setConfig(config);
      await element.updateComplete;

      const audioEl = element.shadowRoot?.querySelector('audio');
      expect(audioEl).not.toBeNull();

      audioEl!.currentTime = 10; // Set a non-zero time to see if it gets overwritten
      audioEl!.dispatchEvent(new Event('loadedmetadata'));
      await element.updateComplete;

      // currentTime should not be changed because the track is marked as completed
      expect(audioEl!.currentTime).toBe(10);
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

  describe('audio playback coordination', () => {
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

    let players: HTMLAudioElement[];

    beforeEach(async () => {
      hass.states['sensor.test_feed'] = {
        entity_id: 'sensor.test_feed',
        state: 'ok',
        attributes: { entries },
      } as HassEntity;
      element.hass = hass;
      element.setConfig({ ...config, allow_multiple: true });
      await element.updateComplete;

      players = [...(element.shadowRoot?.querySelectorAll<HTMLAudioElement>('audio') ?? [])];
      expect(players.length).toBe(2);
      // JSDOM has no media stack: it reports every element as paused and its
      // pause() is a stub, so both sides of the coordination are mocked in.
      players.forEach((player) => {
        Object.defineProperty(player, 'paused', { value: false, configurable: true });
        vi.spyOn(player, 'pause').mockImplementation(() => {});
      });
    });

    it('should pause the other players when one starts', async () => {
      players[1].dispatchEvent(new Event('play'));

      expect(players[0].pause).toHaveBeenCalled();
      expect(players[1].pause).not.toHaveBeenCalled();
    });

    it('should pause the player of an item that is collapsed', async () => {
      const header = element.shadowRoot?.querySelector<HTMLElement>('.accordion-item .accordion-header');
      header?.click();
      await element.updateComplete;
      expect(element.shadowRoot?.querySelector<HTMLDetailsElement>('.accordion-item')?.open).toBe(true);

      header?.click();
      await element.updateComplete;

      expect(players[0].pause).toHaveBeenCalled();
    });

    /** The pause is deferred by a task, so let that task run. */
    const settleTeardown = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

    it('should pause playback when the card leaves the DOM', async () => {
      document.body.removeChild(element);
      await settleTeardown();

      expect(players[0].pause).toHaveBeenCalled();
      expect(players[1].pause).toHaveBeenCalled();

      // afterEach removes the element again.
      document.body.appendChild(element);
    });

    // Home Assistant re-parents cards: a masonry view rebuilds its columns on a
    // column-count change (a window resize, the sidebar toggling) and a sections
    // drag-reorder re-appends the node. Each of those disconnects the card, and
    // a podcast the user deliberately started must survive it.
    it('should keep playing when the card is only re-parented', async () => {
      const column = document.createElement('div');
      document.body.appendChild(column);

      document.body.removeChild(element);
      column.appendChild(element);
      await settleTeardown();

      expect(players[0].pause).not.toHaveBeenCalled();
      expect(players[1].pause).not.toHaveBeenCalled();

      // afterEach removes the element from document.body.
      column.removeChild(element);
      document.body.removeChild(column);
      document.body.appendChild(element);
    });

    it('should still pause when a re-parented card is later torn down', async () => {
      const column = document.createElement('div');
      document.body.appendChild(column);

      document.body.removeChild(element);
      column.appendChild(element);
      await settleTeardown();
      expect(players[0].pause).not.toHaveBeenCalled();

      column.removeChild(element);
      await settleTeardown();

      expect(players[0].pause).toHaveBeenCalled();
      expect(players[1].pause).toHaveBeenCalled();

      document.body.removeChild(column);
      document.body.appendChild(element);
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

    it('should fall back to a placeholder entity when no feed entity exists', () => {
      const stub = (element.constructor as typeof RssAccordion).getStubConfig(hass, []);
      expect(stub.entity).toBe('sensor.your_rss_feed_sensor');
    });

    // Home Assistant reads both off the card element it created - `hui-card`
    // does `if (this._element.getGridOptions)` - so a static method is never
    // seen and the card silently keeps the default sizing.
    it('should expose grid options on the instance for sections views', () => {
      expect(element.getGridOptions()).toEqual({
        columns: 12,
        rows: 'auto',
        min_columns: 6,
        min_rows: 1,
      });
    });

    it('should expose the pre-2024.11 layout options on the instance', () => {
      expect(element.getLayoutOptions()).toEqual({
        grid_rows: 3,
        grid_columns: 12,
        grid_min_rows: 1,
        grid_min_columns: 6,
      });
    });

    it('should not hide the sizing API behind the constructor', () => {
      const ctor = element.constructor as unknown as Record<string, unknown>;
      expect(ctor.getGridOptions).toBeUndefined();
      expect(ctor.getLayoutOptions).toBeUndefined();
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
