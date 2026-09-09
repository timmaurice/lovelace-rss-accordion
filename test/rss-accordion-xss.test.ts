import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../src/rss-accordion';
import type { RssAccordion } from '../src/rss-accordion';
import { HomeAssistant, RssAccordionConfig, HassEntity } from '../src/types';

vi.spyOn(console, 'info').mockImplementation(() => {});

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

describe('RssAccordion XSS hardening', () => {
  let element: RssAccordion;
  let hass: HomeAssistant;
  let config: RssAccordionConfig;

  beforeEach(() => {
    hass = {
      localize: (key: string) => key,
      states: {},
      language: 'en',
      locale: { language: 'en', number_format: 'comma_decimal', time_format: '12' },
    } as HomeAssistant;

    config = { type: 'custom:rss-accordion', entity: 'sensor.test_feed', show_item_image: false };

    element = document.createElement('rss-accordion') as RssAccordion;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  const setFeed = async (entry: Record<string, unknown>, channel: Record<string, unknown> = {}): Promise<void> => {
    hass.states['sensor.test_feed'] = {
      entity_id: 'sensor.test_feed',
      state: 'ok',
      attributes: {
        entries: [{ title: 'Entry', link: 'https://example.com', published: new Date().toISOString(), ...entry }],
        ...channel,
      },
    } as HassEntity;
    element.hass = hass;
    element.setConfig(config);
    await element.updateComplete;
  };

  it('strips scripts and event handlers from the item summary', async () => {
    await setFeed({
      summary:
        'Summary <img src="x" onerror="window.__xss = 1"> <a href="javascript:window.__xss = 1">js link</a><script>window.__xss = 1;</script>',
    });

    const summary = element.shadowRoot?.querySelector('.item-summary');
    expect(summary?.innerHTML).not.toContain('onerror');
    expect(summary?.innerHTML).not.toContain('javascript:');
    expect(summary?.innerHTML).not.toContain('<script');
    expect(summary?.querySelector('a')?.getAttribute('href')).toBeNull();
    expect(summary?.textContent).toContain('Summary');
  });

  it('keeps harmless formatting and rewrites links to open safely', async () => {
    await setFeed({ summary: '<p>Read <a href="https://example.com/post">more</a></p>' });

    const link = element.shadowRoot?.querySelector('.item-summary a');
    expect(link?.getAttribute('href')).toBe('https://example.com/post');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link?.getAttribute('target')).toBe('_blank');
  });

  it('does not render a javascript: item link as an anchor', async () => {
    await setFeed({ link: 'javascript:window.__xss = 1', summary: 'Summary' });

    expect(element.shadowRoot?.querySelector('a.title-link')).toBeNull();
    expect(element.shadowRoot?.querySelector('a.item-link')).toBeNull();
    expect(element.shadowRoot?.querySelector('.title-link')?.textContent?.trim()).toBe('Entry');
  });

  it('does not render a javascript: channel link', async () => {
    await setFeed({}, { link: 'javascript:window.__xss = 1', title: 'Channel' });

    expect(element.shadowRoot?.querySelector('a.channel-link')).toBeNull();
  });

  it('ignores an unsafe item image source', async () => {
    config = { ...config, show_item_image: true };
    await setFeed({ image: 'javascript:window.__xss = 1', summary: 'Summary' });

    expect(element.shadowRoot?.querySelector('img.item-image')).toBeNull();
  });
});
