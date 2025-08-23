import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/rss-accordion';
import type { RssAccordion } from '../src/rss-accordion';
import { HomeAssistant, RssAccordionConfig, HassEntity } from '../src/types';

// Mock console.info
vi.spyOn(console, 'info').mockImplementation(() => {});

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
          { title: 'Test 1', link: '#', summary: 'Summary 1', published: new Date().toISOString() },
          { title: 'Test 2', link: '#', summary: 'Summary 2', published: new Date().toISOString() },
        ],
      },
    } as HassEntity;
    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;

    const items = element.shadowRoot?.querySelectorAll('.accordion-item');
    expect(items?.length).toBe(2);
    const firstTitle = items?.[0].querySelector('.header-main > a.title-link');
    expect(firstTitle?.textContent?.trim()).toBe('Test 1');
    const firstContent = items?.[0].querySelector('.accordion-content > .item-summary');
    expect(firstContent?.innerHTML).toBe('Summary 1');
  });

  it('should respect max_items config', async () => {
    hass.states['sensor.test_feed'] = {
      entity_id: 'sensor.test_feed',
      state: 'ok',
      attributes: {
        entries: [
          { title: 'Test 1', link: '#', summary: 'Summary 1', published: new Date().toISOString() },
          { title: 'Test 2', link: '#', summary: 'Summary 2', published: new Date().toISOString() },
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
      delete hass.states['event.test_feed_event'].attributes.link;
      element.hass = { ...hass };
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

  describe('date formatting', () => {
    it('should use 12-hour format when hass.locale.time_format is "12"', () => {
      hass.locale = { language: 'en', number_format: 'comma_decimal', time_format: '12' };
      element.hass = hass;
      element.setConfig(config);
      const options = element['_getDateTimeFormatOptions']();
      expect(options.hour12).toBe(true);
    });

    it('should use 24-hour format when hass.locale.time_format is "24"', () => {
      hass.locale = { language: 'en', number_format: 'comma_decimal', time_format: '24' };
      element.hass = hass;
      element.setConfig(config);
      const options = element['_getDateTimeFormatOptions']();
      expect(options.hour12).toBe(false);
    });

    it('should use browser default when hass.locale.time_format is "system"', () => {
      hass.locale = { language: 'en', number_format: 'comma_decimal', time_format: 'system' };
      element.hass = hass;
      element.setConfig(config);
      const options = element['_getDateTimeFormatOptions']();
      expect(options.hour12).toBeUndefined();
    });

    it('should use 2-digit day format for consistency', () => {
      hass.locale = { language: 'en', number_format: 'comma_decimal', time_format: 'system' };
      element.hass = hass;
      element.setConfig(config);
      const options = element['_getDateTimeFormatOptions']();
      expect(options.day).toBe('2-digit');
    });
  });
});
