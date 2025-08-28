import { LitElement, TemplateResult, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCard,
  LovelaceCardEditor,
  RssAccordionConfig,
  FeedEntry,
} from './types.js';
import { localize } from './localize';
import { formatDate } from './utils';
import styles from './styles/card.styles.scss';

const ELEMENT_NAME = 'rss-accordion';
const EDITOR_ELEMENT_NAME = `${ELEMENT_NAME}-editor`;

console.info(
  `%c RSS-ACCORDION %c v__CARD_VERSION__ `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

declare global {
  interface Window {
    customCards?: {
      type: string;
      name: string;
      description: string;
      documentationURL: string;
      preview?: boolean;
    }[];
  }
}

interface LovelaceCardHelpers {
  createCardElement(config: LovelaceCardConfig): Promise<LovelaceCard>;
}

interface CustomWindow extends Window {
  loadCardHelpers?: () => Promise<LovelaceCardHelpers>;
}

type LovelaceCardConstructor = {
  new (): LovelaceCard;
  getConfigElement(): Promise<LovelaceCardEditor>;
};

@customElement(ELEMENT_NAME)
export class RssAccordion extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: RssAccordionConfig;
  private _resizeObserver?: ResizeObserver;

  public setConfig(config: RssAccordionConfig): void {
    if (!config || !config.entity) {
      throw new Error('You need to define an entity');
    }
    this._config = config;
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    // Ensure that the required Home Assistant components are loaded before creating the editor
    // by loading a core editor that uses them. This card requires Home Assistant 2023.4+
    // which provides `loadCardHelpers`.
    const loadHelpers = (window as CustomWindow).loadCardHelpers;
    if (!loadHelpers) {
      throw new Error('This card requires Home Assistant 2023.4+ and `loadCardHelpers` is not available.');
    }
    const helpers = await loadHelpers();
    // This is a trick to load the editor dependencies (e.g., ha-entity-picker)
    // by creating an instance of an entities card and triggering its editor to load.
    const entitiesCard = await helpers.createCardElement({ type: 'entities', entities: [] });
    await (entitiesCard.constructor as LovelaceCardConstructor).getConfigElement();

    await import('./editor.js');
    return document.createElement(EDITOR_ELEMENT_NAME) as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {
      entity: 'sensor.your_rss_feed_sensor',
      max_items: 5,
    };
  }

  public getCardSize(): number {
    if (!this.hass || !this._config?.entity) {
      return 1;
    }

    const allItems = this._getFeedItems();
    const numItems = allItems.length;
    const maxItems = this._config.max_items ?? numItems;
    const displayItems = Math.min(numItems, maxItems);

    let size = (this._config.title ? 1 : 0) + (displayItems || 1);

    const stateObj = this.hass.states[this._config.entity];
    const channel = stateObj?.attributes.channel as Record<string, unknown> | undefined;

    const showChannelBlock =
      this._config.show_channel_info &&
      channel &&
      (channel.title ||
        channel.description ||
        channel.subtitle ||
        channel.image ||
        channel.link ||
        (this._config.show_published_date && channel.published));

    if (showChannelBlock) {
      size += 2; // Add 2 for the channel info block
    }

    return size;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    // Using ResizeObserver is more performant than a window resize event listener
    // as it only triggers when the element's size actually changes.
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(() => this._handleResize());
    }
    this._resizeObserver.observe(this);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  private _handleResize(): void {
    this.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item[open]').forEach((details) => {
      const content = details.querySelector<HTMLElement>('.accordion-content');
      if (content) {
        // Temporarily disable transitions to avoid animating the height change on resize.
        const originalTransition = content.style.transition;
        content.style.transition = 'none';

        // Recalculate and apply the new max-height.
        // The scrollHeight property gives the full height of the content, even if it's overflowing.
        content.style.maxHeight = `${content.scrollHeight}px`;

        // Restore the transition after the browser has applied the new height.
        // requestAnimationFrame is used to ensure this happens in the next frame.
        requestAnimationFrame(() => {
          content.style.transition = originalTransition;
        });
      }
    });
  }

  protected firstUpdated(): void {
    if (this._config?.initial_open) {
      // We need to wait for the DOM to be fully settled before we can measure scrollHeight for the animation.
      // A timeout of 0 pushes this to the end of the event queue, after the current render cycle.
      setTimeout(() => {
        const firstItem = this.shadowRoot?.querySelector<HTMLDetailsElement>('.accordion-item');
        if (firstItem && !firstItem.open) {
          this._openAccordion(firstItem);
        }
      }, 0);
    }
  }

  private async _onSummaryClick(e: MouseEvent): Promise<void> {
    const target = e.target as Element;
    // If the click is on the link itself, or a child of the link, let the browser handle it.
    if (target.closest && target.closest('a.title-link')) {
      return;
    }

    e.preventDefault();

    const details = (e.currentTarget as HTMLElement).closest<HTMLDetailsElement>('.accordion-item');
    if (!details) return;

    if (details.open) {
      this._closeAccordion(details);
    } else {
      await this._openAccordion(details);
    }
  }

  private _closeAccordion(details: HTMLDetailsElement): void {
    details.classList.remove('loading'); // Ensure loading class is removed on close
    const content = details.querySelector<HTMLElement>('.accordion-content');
    if (!content) return;

    content.style.maxHeight = '0px';

    const onTransitionEnd = (): void => {
      details.removeAttribute('open');
      content.removeEventListener('transitionend', onTransitionEnd);
    };
    content.addEventListener('transitionend', onTransitionEnd);
  }

  private async _openAccordion(details: HTMLDetailsElement): Promise<void> {
    const content = details.querySelector<HTMLElement>('.accordion-content');
    if (!content) return;

    if (!this._config.allow_multiple) {
      this.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item[open]').forEach((openDetails) => {
        if (openDetails !== details) {
          this._closeAccordion(openDetails);
        }
      });
    }

    details.setAttribute('open', '');

    const images = Array.from(content.querySelectorAll('img'));
    const imagesToLoad = images.filter((img) => !img.complete);

    if (imagesToLoad.length > 0) {
      details.classList.add('loading');
      await Promise.all(
        imagesToLoad.map(
          (img) =>
            new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true }); // Also resolve on error
            }),
        ),
      );
      details.classList.remove('loading');
    }

    // Use requestAnimationFrame to ensure the browser has painted the final content
    // (with loaded images) before we measure its height.
    requestAnimationFrame(() => {
      content.style.maxHeight = `${content.scrollHeight}px`;
    });
  }

  private _getFeedItems(): FeedEntry[] {
    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) {
      return [];
    }

    // Handle sensor entities with an 'entries' attribute
    if (stateObj.attributes.entries && Array.isArray(stateObj.attributes.entries)) {
      return (stateObj.attributes.entries as FeedEntry[]) || [];
    }

    // Handle event entities which represent a single item
    if (this._config.entity.startsWith('event.')) {
      const { title, link, summary, description, image } = stateObj.attributes;
      if (typeof title === 'string' && typeof link === 'string') {
        return [
          {
            title,
            link,
            summary: (summary as string) ?? undefined,
            description: (description as string) ?? undefined,
            image: (image as string) ?? undefined,
            published: stateObj.state,
          },
        ];
      }
    }

    return [];
  }

  /**
   * Extracts an image URL from a feed item, prioritizing dedicated fields
   * over parsing HTML content.
   * This card only considers the dedicated `image` field for the hero image.
   * @param item The feed entry to process.
   * @returns The found image URL, or undefined.
   */
  private _getItemImage(item: FeedEntry): string | undefined {
    return item.image;
  }

  private _renderChannelInfo(
    channelTitle: string | undefined,
    channelDescription: string | undefined,
    channelImage: string | undefined,
    channelLink: string | undefined,
    channelPublished: string | undefined,
    formattedChannelPublished: string | undefined,
  ): TemplateResult {
    if (
      !this._config.show_channel_info ||
      !(
        channelTitle ||
        channelDescription ||
        channelImage ||
        channelLink ||
        (this._config.show_published_date && channelPublished)
      )
    ) {
      return html``;
    }

    return html`
      <div class="channel-info ${this._config.crop_channel_image ? 'cropped-image' : ''}">
        ${this._config.show_channel_info && channelImage
          ? html`<img class="channel-image" src="${channelImage}" alt="${channelTitle || 'Channel Image'}" />`
          : ''}
        <div class="channel-text">
          ${this._config.show_channel_info && channelTitle ? html`<h2 class="channel-title">${channelTitle}</h2>` : ''}
          ${this._config.show_published_date && formattedChannelPublished
            ? html`<p class="channel-published">
                <span class="label">${localize(this.hass, 'component.rss-accordion.card.last_updated')}:</span>
                ${formattedChannelPublished}
              </p>`
            : ''}
          ${this._config.show_channel_info && channelDescription
            ? html`<p class="channel-description">${channelDescription}</p>`
            : ''}
          ${this._config.show_channel_info && channelLink
            ? html`<a class="channel-link" href="${channelLink}" target="_blank" rel="noopener noreferrer"
                >${localize(this.hass, 'component.rss-accordion.card.visit_channel')}</a
              >`
            : ''}
        </div>
      </div>
    `;
  }

  private _renderItem(item: FeedEntry): TemplateResult {
    const imageUrl = this._getItemImage(item);
    const content = item.summary || item.description || '';
    const showImage = this._config.show_item_image !== false && !!imageUrl;

    // If a hero image is being displayed from the `item.image` field,
    // strip all images from the summary to prevent duplicates.
    const processedContent = showImage ? content.replace(/<img[^>]*>/gi, '') : content;

    const publishedDate = new Date(item.published);
    const formattedDate = formatDate(publishedDate, this.hass);

    const newPillDurationHours = this._config.new_pill_duration_hours ?? 1;
    const ageInMinutes = (new Date().getTime() - publishedDate.getTime()) / (1000 * 60);
    const isNew = ageInMinutes >= 0 && ageInMinutes < newPillDurationHours * 60;

    const imageStyles = {
      aspectRatio: this._config.image_ratio,
      objectFit: this._config.image_fit_mode || 'cover',
    };

    return html`
      <details class="accordion-item">
        <summary class="accordion-header" @click=${this._onSummaryClick}>
          <div class="header-main">
            <a class="title-link" href="${item.link}" target="_blank" rel="noopener noreferrer"> ${item.title} </a>
            <div class="header-badges">
              ${isNew
                ? html`<span class="new-pill">${localize(this.hass, 'component.rss-accordion.card.new_pill')}</span>`
                : ''}
            </div>
          </div>
        </summary>
        <div class="accordion-content">
          <div class="item-published">${formattedDate}</div>
          ${showImage
            ? html`<img
                class="item-image"
                src="${imageUrl as string}"
                alt="${item.title}"
                style=${styleMap(imageStyles)}
              />`
            : ''}
          ${this._config.show_audio_player !== false && item.audio
            ? html`
                <div class="audio-player-container">
                  <audio controls .src=${item.audio as string}></audio>
                </div>
              `
            : ''}
          <div class="item-summary" .innerHTML=${processedContent}></div>
          <a class="item-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
            ${localize(this.hass, 'component.rss-accordion.card.to_news_article')}
          </a>
        </div>
      </details>
    `;
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) {
      return html`
        <ha-card .header=${this._config.title}>
          <div class="card-content warning">Entity not found: ${this._config.entity}</div>
        </ha-card>
      `;
    }

    const channel = stateObj.attributes.channel as Record<string, unknown> | undefined;
    const channelTitle = channel?.title as string | undefined;
    const channelLink = channel?.link as string | undefined;
    const channelDescription = (channel?.description || channel?.subtitle) as string | undefined;
    const channelImage = channel?.image as string | undefined;
    const channelPublished = channel?.published as string | undefined;
    const formattedChannelPublished = channelPublished ? formatDate(channelPublished, this.hass) : undefined;

    const allEntries = this._getFeedItems();
    const maxItems = this._config.max_items ?? allEntries.length;
    const itemsToDisplay = allEntries.slice(0, maxItems);

    if (itemsToDisplay.length === 0) {
      return html`
        <ha-card .header=${this._config.title}>
          <div class="card-content"><i>No entries available.</i></div>
        </ha-card>
      `;
    }

    return html`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${this._renderChannelInfo(
            channelTitle,
            channelDescription,
            channelImage,
            channelLink,
            channelPublished,
            formattedChannelPublished,
          )}
          ${itemsToDisplay.map((item) => this._renderItem(item))}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ${unsafeCSS(styles)}
  `;
}

if (typeof window !== 'undefined') {
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: ELEMENT_NAME,
    name: 'RSS Accordion',
    description: 'A card to display RSS feed items in an accordion style.',
    documentationURL: 'https://github.com/timmaurice/lovelace-rss-accordion',
  });
}
