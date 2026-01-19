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
      expect(newPill).not.toBeNull();
      expect(newPill?.textContent).toBe('NEW');
    });

    it('should not show "NEW" pill if older than custom duration', async () => {
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
              published: new Date(now.getTime() - 70 * 60 * 1000).toISOString(), // 70 minutes old
            },
          ],
        },
      } as HassEntity;
      element.hass = hass;
      element.setConfig({ ...config, new_pill_duration_hours: 1 }); // Custom duration of 1 hour
      await element.updateComplete;

      const newPill = element.shadowRoot?.querySelector('.new-pill');
      expect(newPill).toBeNull();
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
});
