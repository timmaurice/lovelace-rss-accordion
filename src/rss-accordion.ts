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
import { StorageHelper } from './storage-helper.js';
import styles from './styles/card.styles.scss';

const ELEMENT_NAME = 'rss-accordion';
const EDITOR_ELEMENT_NAME = `${ELEMENT_NAME}-editor`;

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
  @state() private _showOnlyBookmarks = false;
  private _resizeObserver?: ResizeObserver;
  private _lastAudioSave = new Map<string, number>();
  private _storageHelper!: StorageHelper;

  public setConfig(config: RssAccordionConfig): void {
    if (!config || !config.entity) {
      throw new Error('You need to define an entity');
    }
    this._config = config;
    this._storageHelper = new StorageHelper(config.entity);
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

    const allItems = this._getAllDisplayableItems();
    const numItems = allItems.length;
    const maxItems = this._config.max_items ?? numItems;
    const displayItems = Math.min(numItems, maxItems);

    let size = (this._config.title ? 1 : 0) + (displayItems || 1);

    const stateObj = this.hass.states[this._config.entity];
    const channel = stateObj?.attributes.channel as Record<string, unknown> | undefined;

    if (this._shouldRenderChannelInfo(channel)) {
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

  protected shouldUpdate(changedProperties: Map<string | number | symbol, unknown>): boolean {
    if (changedProperties.has('_config')) {
      return true;
    }

    const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;

    // Check if the entity that this card uses has changed, or if the language has changed.
    if (oldHass) {
      if (
        oldHass.states[this._config.entity] !== this.hass.states[this._config.entity] ||
        oldHass.language !== this.hass.language
      ) {
        return true;
      }
      return false; // All other hass changes are ignored
    }

    return true; // First render
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

  private _onAudioLoaded(e: Event, audioUrl: string): void {
    const audioEl = e.target as HTMLAudioElement;
    const progress = this._storageHelper.getAudioProgress(audioUrl);
    if (progress && !progress.completed) {
      audioEl.currentTime = progress.currentTime;
    }
  }

  private _onAudioTimeUpdate(e: Event, audioUrl: string): void {
    const now = Date.now();
    const lastSave = this._lastAudioSave.get(audioUrl);

    // This is a leading-edge throttle. It fires on the first event, then enforces a cooldown.
    if (lastSave === undefined || now - lastSave > 5000) {
      const audioEl = e.target as HTMLAudioElement;

      // On the very first event, the time might be 0. Don't save a 0-progress state.
      if (lastSave === undefined && audioEl.currentTime === 0) {
        this._lastAudioSave.set(audioUrl, now); // Just start the timer
        return;
      }

      const progress = this._storageHelper.getAudioProgress(audioUrl) || { currentTime: 0, completed: false };

      if (progress.completed) {
        return;
      }

      progress.currentTime = audioEl.currentTime;
      this._storageHelper.setAudioProgress(audioUrl, progress);
      this._lastAudioSave.set(audioUrl, now);
    }
  }

  private _onAudioEnded(e: Event, audioUrl: string): void {
    const progress = this._storageHelper.getAudioProgress(audioUrl) || { currentTime: 0, completed: false };
    this._storageHelper.setAudioProgress(audioUrl, {
      ...progress,
      currentTime: 0,
      completed: true,
      completedAt: new Date().toISOString(),
    });
    this.requestUpdate();
  }

  private _toggleBookmark(e: Event, item: FeedEntry): void {
    e.stopPropagation();
    e.preventDefault();

    const isBookmarked = this._storageHelper.isBookmarked(item);
    this._storageHelper.setBookmark(item, !isBookmarked);
    this.requestUpdate();
  }

  private _getAllDisplayableItems(): FeedEntry[] {
    const itemsMap = new Map<string, FeedEntry>();

    // Add stored bookmarks first
    if (this._config.show_bookmarks) {
      const storedBookmarks = this._storageHelper.getBookmarkedItems();
      for (const item of storedBookmarks) {
        itemsMap.set(this._storageHelper.getBookmarkKey(item), item);
      }
    }

    // Add live feed items, overwriting stored ones if they conflict,
    // ensuring we have the latest version.
    const liveFeedItems = this._getFeedItems();
    for (const item of liveFeedItems) {
      itemsMap.set(this._storageHelper.getBookmarkKey(item), item);
    }

    const allItems = Array.from(itemsMap.values());

    // Sort all items by date, newest first
    allItems.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

    return allItems;
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

  private _shouldRenderChannelInfo(channel: Record<string, unknown> | undefined): boolean {
    if (!this._config.show_channel_info || !channel) {
      return false;
    }

    return !!(
      channel.title ||
      channel.description ||
      channel.subtitle ||
      channel.image ||
      channel.link ||
      (this._config.show_published_date && channel.published)
    );
  }

  private _renderChannelActions(channelLink: string | undefined, hasAnyBookmarks: boolean): TemplateResult {
    return html`
      <div class="channel-actions">
        ${channelLink
          ? html`<a class="channel-link" href="${channelLink}" target="_blank" rel="noopener noreferrer"
              >${localize(this.hass, 'component.rss-accordion.card.visit_channel')}</a
            >`
          : ''}
        ${this._renderBookmarkFilter(hasAnyBookmarks)}
      </div>
    `;
  }

  private _renderChannelInfo(channel: Record<string, unknown> | undefined, hasAnyBookmarks: boolean): TemplateResult {
    if (!channel) {
      return html``;
    }

    const channelTitle = channel.title as string | undefined;
    const channelLink = channel.link as string | undefined;
    const channelDescription = (channel.description || channel.subtitle) as string | undefined;
    const channelImage = channel.image as string | undefined;
    const channelPublished = channel.published as string | undefined;
    const formattedChannelPublished = channelPublished ? formatDate(channelPublished, this.hass) : undefined;

    return html`
      <div class="channel-info ${this._config.crop_channel_image ? 'cropped-image' : ''}">
        ${channelImage
          ? html`<img
              class="channel-image"
              src="${channelImage}"
              alt="${channelTitle || localize(this.hass, 'component.rss-accordion.card.channel_image_alt')}"
            />`
          : ''}
        <div class="channel-text">
          ${channelTitle ? html`<h2 class="channel-title">${channelTitle}</h2>` : ''}
          ${this._config.show_published_date && formattedChannelPublished
            ? html`<p class="channel-published">
                <span class="label">${localize(this.hass, 'component.rss-accordion.card.last_updated')}:</span>
                ${formattedChannelPublished}
              </p>`
            : ''}
          ${channelDescription ? html`<p class="channel-description">${channelDescription}</p>` : ''}
          ${this._renderChannelActions(channelLink, hasAnyBookmarks)}
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
    const isBookmarked = this._storageHelper.isBookmarked(item);

    const audioUrlString = item.audio as string | undefined;
    const audioProgress = audioUrlString ? this._storageHelper.getAudioProgress(audioUrlString) : null;
    const isCompleted = audioProgress?.completed ?? false;

    let listenedTooltip = localize(this.hass, 'component.rss-accordion.card.listened');
    if (isCompleted && audioProgress?.completedAt) {
      const completedDate = formatDate(audioProgress.completedAt, this.hass);
      listenedTooltip = localize(this.hass, 'component.rss-accordion.card.listened_on', { date: completedDate });
    }

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
              ${this._config.show_bookmarks
                ? html`<span
                    class="bookmark-button"
                    role="button"
                    tabindex="0"
                    title="${localize(
                      this.hass,
                      isBookmarked
                        ? 'component.rss-accordion.card.remove_bookmark'
                        : 'component.rss-accordion.card.add_bookmark',
                    )}"
                    @click=${(e: Event) => this._toggleBookmark(e, item)}
                    ><ha-icon icon=${isBookmarked ? 'mdi:star' : 'mdi:star-outline'}></ha-icon
                  ></span>`
                : ''}
              ${isNew
                ? html`<span class="new-pill">${localize(this.hass, 'component.rss-accordion.card.new_pill')}</span>`
                : ''}
              ${audioUrlString && isCompleted
                ? html`<ha-icon
                    class="listened-icon"
                    icon="mdi:check-circle-outline"
                    title="${listenedTooltip}"
                  ></ha-icon>`
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
                  <audio
                    controls
                    .src=${audioUrlString}
                    @loadedmetadata=${(e: Event) => this._onAudioLoaded(e, audioUrlString as string)}
                    @timeupdate=${(e: Event) => this._onAudioTimeUpdate(e, audioUrlString as string)}
                    @ended=${(e: Event) => this._onAudioEnded(e, audioUrlString as string)}
                  ></audio>
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
          <div class="card-content warning">
            ${localize(this.hass, 'component.rss-accordion.card.entity_not_found', { entity: this._config.entity })}
          </div>
        </ha-card>
      `;
    }

    const channel = stateObj.attributes.channel as Record<string, unknown> | undefined;
    let allEntries = this._getAllDisplayableItems();
    const hasAnyBookmarks = !!(
      this._config.show_bookmarks && allEntries.some((item) => this._storageHelper.isBookmarked(item))
    );

    const shouldRenderChannel = this._shouldRenderChannelInfo(channel);

    if (this._config.show_bookmarks && this._showOnlyBookmarks) {
      allEntries = allEntries.filter((item) => this._storageHelper.isBookmarked(item));
    }

    const maxItems = this._config.max_items ?? allEntries.length;
    const itemsToDisplay = allEntries.slice(0, maxItems);

    if (itemsToDisplay.length === 0) {
      if (this._showOnlyBookmarks) {
        return html`
          <ha-card .header=${this._config.title}>
            <div class="card-content">
              ${
                shouldRenderChannel
                  ? this._renderChannelInfo(channel, hasAnyBookmarks)
                  : this._renderChannelActions(undefined, hasAnyBookmarks) /* Render filter button */
              }
              <i>${localize(this.hass, 'component.rss-accordion.card.no_bookmarked_entries')}</i>
            </div>
          </ha-card>
        `;
      }
      return html`
        <ha-card .header=${this._config.title}>
          <div class="card-content"><i>${localize(this.hass, 'component.rss-accordion.card.no_entries')}</i></div>
        </ha-card>
      `;
    }

    return html`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${
            shouldRenderChannel
              ? this._renderChannelInfo(channel, hasAnyBookmarks)
              : this._renderChannelActions(undefined, hasAnyBookmarks) /* Render filter button */
          }
          ${itemsToDisplay.map((item) => this._renderItem(item))}
        </div>
      </ha-card>
    `;
  }

  private _renderBookmarkFilter(hasAnyBookmarks: boolean): TemplateResult {
    if (!this._config.show_bookmarks) {
      return html``;
    }

    return html`
      <ha-button
        outlined
        class="bookmark-filter-button ${this._showOnlyBookmarks ? 'active' : ''}"
        ?disabled=${!hasAnyBookmarks}
        size="small"
        title="${!hasAnyBookmarks
          ? localize(this.hass, 'component.rss-accordion.card.no_bookmarks_yet_tooltip')
          : localize(this.hass, 'component.rss-accordion.card.show_bookmarked')}"
        @click=${() => {
          if (hasAnyBookmarks) {
            this._showOnlyBookmarks = !this._showOnlyBookmarks;
          }
        }}
      >
        <ha-icon icon="mdi:star"></ha-icon>
        <span class="button-text">${localize(this.hass, 'component.rss-accordion.card.show_bookmarked')}</span>
      </ha-button>
    `;
  }

  static styles = [
    css`
      ${unsafeCSS(styles)}
    `,
  ];
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
