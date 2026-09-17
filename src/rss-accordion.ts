import { LitElement, TemplateResult, html, css, unsafeCSS } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCard,
  LovelaceCardEditor,
  RssAccordionConfig,
  FeedEntry,
  LovelaceGridOptions,
} from './types.js';
import { localize } from './localize';
import { isSafeUrl, sanitizeHtml } from './sanitize';
import { formatDate, truncate } from './utils';
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

/**
 * Whether an entity carries something this card can read as feed entries.
 *
 * A module function rather than a method, because the card picker asks the same
 * question from a static context. Asking it two different ways is what let the
 * picker preview an entity the card then refuses to read: it tested the feed
 * attributes for truthiness where rendering requires an array, so an `items`
 * that was a scalar or an object became the preview entity and the user's first
 * sight of the card was "Entity has no feed entries".
 *
 * An `event.*` entity is a feed of one and carries its item in its own
 * attributes rather than in a list, so it is admitted on its domain.
 */
function hasFeedAttribute(states: HomeAssistant['states'] | undefined, entityId: string): boolean {
  if (entityId.startsWith('event.')) return true;

  const attributes = states?.[entityId]?.attributes;
  return Array.isArray(attributes?.entries || attributes?.events || attributes?.items);
}

type LovelaceCardConstructor = {
  new (): LovelaceCard;
  getConfigElement(): Promise<LovelaceCardEditor>;
};

export class RssAccordion extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: RssAccordionConfig;
  @state() private _showOnlyBookmarks = false;
  @state() private _isDescriptionExpanded = false;
  /**
   * The channel image URL that failed to load, if one has.
   *
   * Held as the URL rather than as a flag so that a channel which later offers
   * a different picture starts out trusted again, and held in state rather than
   * written onto the DOM because the class it suppresses is one lit owns.
   */
  @state() private _failedChannelImage?: string;
  @state() private _entities: string[] = [];
  private _resizeObserver?: ResizeObserver;
  private _lastAudioSave = new Map<string, number>();
  /**
   * Which items the user expanded, by item key rather than by position. The
   * feed reorders and grows underneath the card, so a positional flag would
   * hand the open panel to whatever entry moved into that slot.
   */
  private _openKeys = new Set<string>();
  /** Keys already rendered once, so `open_behavior: all` can expand new arrivals. */
  private _seenKeys = new Set<string>();
  private _storageHelper!: StorageHelper;
  private _refreshTimer?: number;
  private _teardownTimer?: number;

  public setConfig(config: RssAccordionConfig): void {
    if (!config || (!config.entity && (!config.entities || config.entities.length === 0))) {
      throw new Error('You need to define an entity or a list of entities');
    }
    this._config = config;

    if (config.entities && config.entities.length > 0) {
      this._entities = [...config.entities];
    } else if (config.entity) {
      this._entities = [config.entity];
    } else {
      this._entities = [];
    }

    const uniqueId = this._entities.slice().sort().join(',');
    this._storageHelper = new StorageHelper(uniqueId);

    this._startRefreshTimer();
  }

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    // Ensure that the required Home Assistant components are loaded before creating the editor
    // by loading a core editor that uses them. `loadCardHelpers` has been there since
    // Home Assistant 2023.4, but the editor renders `ha-input`, which arrived in 2026.4 -
    // that is the minimum this card documents in the README and in `hacs.json`.
    const loadHelpers = (window as CustomWindow).loadCardHelpers;
    if (!loadHelpers) {
      throw new Error('This card requires Home Assistant 2026.4+ and `loadCardHelpers` is not available.');
    }
    const helpers = await loadHelpers();
    // This is a trick to load the editor dependencies (e.g., ha-entity-picker)
    // by creating an instance of an entities card and triggering its editor to load.
    const entitiesCard = await helpers.createCardElement({ type: 'entities', entities: [] });
    await (entitiesCard.constructor as LovelaceCardConstructor).getConfigElement();

    await import('./editor.js');
    return document.createElement(EDITOR_ELEMENT_NAME) as LovelaceCardEditor;
  }

  /**
   * Picks a real feed entity for the card picker preview. A placeholder id only
   * ever renders as "Entity not found", which tells the user nothing about the
   * card.
   */
  public static getStubConfig(hass?: HomeAssistant, entities?: string[]): Record<string, unknown> {
    const candidates = entities?.length ? entities : Object.keys(hass?.states ?? {});
    const feedEntity = candidates.find((entityId) => hasFeedAttribute(hass?.states, entityId));

    return {
      entity: feedEntity ?? 'sensor.your_rss_feed_sensor',
      max_items: 5,
    };
  }

  public getCardSize(): number {
    if (!this.hass || this._entities.length === 0) {
      return 1;
    }

    const allItems = this._getAllDisplayableItems();
    const numItems = allItems.length;
    const maxItems = this._config.max_items ?? numItems;
    const displayItems = Math.min(numItems, maxItems);

    let size = (this._config.title ? 1 : 0) + (displayItems || 1);

    const stateObj = this._entities.length > 0 ? this.hass.states[this._entities[0]] : undefined;
    const channel = stateObj?.attributes.channel as Record<string, unknown> | undefined;

    if (this._shouldRenderChannelInfo(channel)) {
      size += 2; // Add 2 for the channel info block
    }

    return size;
  }

  /**
   * The sections-view sizing API. `getLayoutOptions` is what Home Assistant
   * read before 2024.11 and is kept for those releases.
   *
   * Both are instance methods, not static ones: `hui-card` reads them off the
   * card element it created (`if (this._element.getGridOptions)`), so a static
   * method is never found and the card falls back to the default sizing.
   */
  public getGridOptions(): LovelaceGridOptions {
    return { columns: 'full', min_columns: 6, rows: 'auto', min_rows: 1 };
  }

  public getLayoutOptions(): {
    grid_rows: number;
    grid_columns: number;
    grid_min_rows: number;
    grid_min_columns: number;
  } {
    return {
      grid_rows: 3,
      grid_columns: 12,
      grid_min_rows: 1,
      grid_min_columns: 6,
    };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    // We are back in the document, so the disconnect that just happened was a
    // re-parent and not a teardown.
    this._cancelTeardown();
    // Using ResizeObserver is more performant than a window resize event listener
    // as it only triggers when the element's size actually changes.
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(() => this._handleResize());
    }
    this._resizeObserver.observe(this);
    this._startRefreshTimer();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    this._stopRefreshTimer();
    // A view switch tears the card out of the DOM but leaves the media elements
    // alive, so a podcast would keep playing from a card that is no longer there.
    //
    // Being disconnected is not the same as being torn down, though: Home
    // Assistant re-parents cards, and a masonry view rebuilding its columns on a
    // column-count change (a window resize, the sidebar toggling) or a sections
    // drag-reorder re-appends the very same node. Pausing here and now would
    // stop a podcast the user deliberately started, on a window resize, with no
    // user action behind it. So defer the decision by a task: a re-parent has
    // reconnected us long before it runs, a real teardown has not.
    this._cancelTeardown();
    this._teardownTimer = window.setTimeout(() => {
      this._teardownTimer = undefined;
      if (!this.isConnected) {
        this._pauseAudio();
      }
    }, 0);
  }

  private _cancelTeardown(): void {
    if (this._teardownTimer !== undefined) {
      clearTimeout(this._teardownTimer);
      this._teardownTimer = undefined;
    }
  }

  private _startRefreshTimer(): void {
    this._stopRefreshTimer();

    if (this._config && this._config.refresh_interval && this._config.refresh_interval > 0) {
      this._refreshTimer = window.setInterval(
        () => {
          this._refreshEntities();
        },
        this._config.refresh_interval * 60 * 1000,
      ); // Convert minutes to milliseconds
    }
  }

  private _stopRefreshTimer(): void {
    if (this._refreshTimer) {
      clearInterval(this._refreshTimer);
      this._refreshTimer = undefined;
    }
  }

  private async _refreshEntities(): Promise<void> {
    if (!this.hass || !this._entities || this._entities.length === 0) {
      return;
    }

    // Call homeassistant.update_entity service for all configured entities
    try {
      await Promise.all(
        this._entities.map((entityId) =>
          this.hass.callService('homeassistant', 'update_entity', {
            entity_id: entityId,
          }),
        ),
      );
    } catch (err) {
      console.error('Failed to refresh RSS feed entities:', err);
    }
  }

  private _handleResize(): void {
    this.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item[open]').forEach((details) => {
      void this._measureOpenPanel(details, false);
    });
  }

  /**
   * Measures an open panel and writes the measurement onto its inline
   * `max-height`.
   *
   * This is the only place a panel height is calculated. Every caller has to
   * wait for the same thing: an `<img>` that has not loaded yet has no
   * intrinsic size, so it contributes nothing to `scrollHeight`. Measuring
   * before it arrives pins the panel to its pre-image height and leaves the
   * picture clipped, and nothing measures it again afterwards.
   *
   * @param animate Whether the height change may animate. Opening a panel by
   *   hand should; a re-measure the user did not ask for - after a re-render or
   *   a resize - should not.
   */
  private async _measureOpenPanel(details: HTMLDetailsElement, animate: boolean): Promise<void> {
    const content = details.querySelector<HTMLElement>('.accordion-content');
    if (!content) return;

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

    // Waiting for an image takes time, and the user may have collapsed the
    // panel in the meantime. `_openKeys` is the authority here and the `open`
    // attribute is not: a close leaves that attribute in place until its
    // animation finishes, so measuring on it would re-open what the user just
    // shut.
    const key = details.dataset.key;
    if (key !== undefined && !this._openKeys.has(key)) return;

    if (!animate) {
      content.style.transition = 'none';
    }

    // Use requestAnimationFrame to ensure the browser has painted the final content
    // (with loaded images) before we measure its height.
    requestAnimationFrame(() => {
      content.style.maxHeight = `${content.scrollHeight}px`;
      if (!animate) {
        // Restored a frame later, so the height lands while the transition is
        // still off. The stylesheet owns the real value - the inline property
        // is only ever this override - so it is removed rather than restored
        // from a snapshot that a second, overlapping measure could poison.
        requestAnimationFrame(() => content.style.removeProperty('transition'));
      }
    });
  }

  protected shouldUpdate(changedProperties: Map<string | number | symbol, unknown>): boolean {
    if (changedProperties.has('_config')) {
      return true;
    }

    const oldHass = changedProperties.get('hass') as HomeAssistant | undefined;

    // Check if any of the entities that this card uses has changed, or if the language has changed.
    if (oldHass) {
      let entitiesChanged = false;
      for (const entityId of this._entities) {
        if (oldHass.states[entityId] !== this.hass.states[entityId]) {
          entitiesChanged = true;
          break;
        }
      }

      if (entitiesChanged || oldHass.language !== this.hass.language) {
        return true;
      }
      return false; // All other hass changes are ignored
    }

    return true; // First render
  }

  private _openBehavior(): 'none' | 'latest' | 'all' {
    return this._config?.open_behavior || (this._config?.initial_open ? 'latest' : 'none');
  }

  /**
   * Re-applies the expanded state after a re-render.
   *
   * Items are rendered keyed, so an entry keeps its own DOM node when the feed
   * reorders. What this adds is the state for nodes lit had to rebuild (an item
   * that left the feed and came back) and a fresh height measurement, because
   * the panel content may have changed since the inline `max-height` was set.
   */
  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);

    // hass can arrive before setConfig does, and there is nothing here that
    // means anything without a config - render() has already bailed out, so
    // there is not even any DOM to re-apply state to.
    if (!this._config) return;

    const openAll = this._openBehavior() === 'all';
    this._pruneKeys();
    this._enforceSingleOpen();

    this.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item').forEach((details) => {
      // Every item carries a data-key, and getBookmarkKey never answers with an
      // empty string - an entry with neither a link nor a published date keys
      // as "undefined|undefined". So this narrows the type and nothing else;
      // the falsy check it replaces could not fire.
      const key = details.dataset.key;
      if (key === undefined) return;

      const isNewItem = !this._seenKeys.has(key);
      this._seenKeys.add(key);

      if (openAll && isNewItem) {
        void this._openAccordion(details);
        return;
      }

      const content = details.querySelector<HTMLElement>('.accordion-content');
      if (!content) return;

      if (this._openKeys.has(key)) {
        details.setAttribute('open', '');
        // The height is re-measured, not carried over: a recycled node would
        // otherwise clip or overshoot the new content. Through the same path as
        // opening by hand, so a body that re-rendered around an uncached image
        // is measured once that image is there and not at its height without.
        void this._measureOpenPanel(details, false);
      } else if (details.open && !details.classList.contains('closing')) {
        // A panel that is already animating shut is left to finish. Its key is
        // gone from _openKeys the moment the user clicks, so this branch would
        // otherwise catch it mid-transition and drop the open attribute at
        // once - the panel would vanish rather than collapse, on nothing more
        // than a feed update landing during the animation.
        details.removeAttribute('open');
        content.style.maxHeight = '0px';
      }
    });
  }

  /**
   * Forgets the keys of entries the feed no longer offers.
   *
   * Both sets only ever grew. On a card left on a dashboard for weeks that is a
   * slow leak, and it is wrong as well as untidy: an entry that scrolled out of
   * the feed while it was open came back open when the feed offered it again,
   * even under `open_behavior: 'none'`, because its key was still in
   * `_openKeys` and `updated()` re-applies whatever it finds there.
   *
   * Measured against everything the card could display rather than against what
   * it currently shows, so that hiding entries behind the bookmark filter or
   * past `max_items` does not count as leaving. An empty feed prunes nothing:
   * an entity that is briefly unavailable is not the feed dropping every entry
   * it ever had.
   */
  private _pruneKeys(): void {
    const displayable = this._getAllDisplayableItems();
    if (displayable.length === 0) return;

    const live = new Set(displayable.map((item) => this._storageHelper.getBookmarkKey(item)));
    for (const keys of [this._openKeys, this._seenKeys]) {
      for (const key of keys) {
        if (!live.has(key)) keys.delete(key);
      }
    }
  }

  /**
   * Drops every open key but the newest when the config allows one panel.
   *
   * `_openAccordion` collapses the panels it can see, which is not all of them:
   * an item the bookmark filter hides is not in the DOM, so its key stays
   * behind and re-opens it when the filter comes off - two panels open where
   * the config says one. A config edit from `allow_multiple: true` leaves the
   * same surplus behind.
   *
   * The survivor is the most recently opened, which is why `_openAccordion`
   * re-inserts rather than adds: the user's last choice is the one they can
   * still see, and taking it away instead would be the visible surprise.
   */
  private _enforceSingleOpen(): void {
    if (this._config.allow_multiple || this._openBehavior() === 'all' || this._openKeys.size <= 1) {
      return;
    }

    const keys = [...this._openKeys];
    this._openKeys = new Set([keys[keys.length - 1]]);
  }

  protected firstUpdated(): void {
    const openBehavior = this._openBehavior();

    if (openBehavior === 'latest') {
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

  /**
   * Pauses the media players of this card.
   *
   * @param except An element that may keep playing (the one that just started).
   */
  private _pauseAudio(except?: HTMLAudioElement): void {
    this.shadowRoot?.querySelectorAll<HTMLAudioElement>('audio').forEach((audio) => {
      if (audio !== except && !audio.paused) {
        audio.pause();
      }
    });
  }

  /** Only one episode at a time - starting one silences the others. */
  private _onAudioPlay(e: Event): void {
    this._pauseAudio(e.target as HTMLAudioElement);
  }

  private _closeAccordion(details: HTMLDetailsElement): void {
    details.classList.remove('loading'); // Ensure loading class is removed on close
    const key = details.dataset.key;
    if (key) {
      this._openKeys.delete(key);
    }
    const content = details.querySelector<HTMLElement>('.accordion-content');
    if (!content) return;

    // A collapsed panel is invisible; audio playing on behind it is not what the
    // user asked for when they closed it.
    content.querySelectorAll<HTMLAudioElement>('audio').forEach((audio) => audio.pause());

    content.style.maxHeight = '0px';

    // Marks the panel as mid-animation, so a re-render arriving before the
    // transition ends does not finish the job early.
    details.classList.add('closing');

    const onTransitionEnd = (): void => {
      details.classList.remove('closing');
      details.removeAttribute('open');
      content.removeEventListener('transitionend', onTransitionEnd);
    };
    content.addEventListener('transitionend', onTransitionEnd);
  }

  private async _openAccordion(details: HTMLDetailsElement): Promise<void> {
    const content = details.querySelector<HTMLElement>('.accordion-content');
    if (!content) return;

    const openBehavior = this._config.open_behavior || (this._config.initial_open ? 'latest' : 'none');
    if (!this._config.allow_multiple && openBehavior !== 'all') {
      this.shadowRoot?.querySelectorAll<HTMLDetailsElement>('.accordion-item[open]').forEach((openDetails) => {
        if (openDetails !== details) {
          this._closeAccordion(openDetails);
        }
      });
    }

    // Re-opening overrules a close that has not finished, and clears the mark
    // in the case where no transition ever ran to clear it.
    details.classList.remove('closing');
    details.setAttribute('open', '');
    const key = details.dataset.key;
    if (key) {
      // Re-inserted rather than added, so the set stays ordered oldest first -
      // which is what single-open enforcement reads to find the newest.
      this._openKeys.delete(key);
      this._openKeys.add(key);
    }

    await this._measureOpenPanel(details, true);
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
    allItems.sort((a, b) => {
      const dateA = a.published || a.updated || '';
      const dateB = b.published || b.updated || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return allItems;
  }

  private _getFeedItems(): FeedEntry[] {
    const allItems: FeedEntry[] = [];

    for (const entityId of this._entities) {
      const stateObj = this.hass.states[entityId];
      if (!stateObj) {
        continue;
      }

      // Arrays of entries might be in `entries`, `events`, or `items` depending on the integration
      const entryArray = stateObj.attributes.entries || stateObj.attributes.events || stateObj.attributes.items;

      if (entryArray && Array.isArray(entryArray)) {
        let entries = [...((entryArray as FeedEntry[]) || [])];

        // Ensure entries are sorted newest first BEFORE slicing!
        entries.sort((a, b) => {
          const dateA = a.published || a.updated || '';
          const dateB = b.published || b.updated || '';
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        if (this._config.max_items_per_entity) {
          entries = entries.slice(0, this._config.max_items_per_entity);
        }
        // Tag each entry with its source entity
        const taggedEntries = entries.map((entry) => ({ ...entry, source_entity_id: entityId }));
        allItems.push(...taggedEntries);
      }
      // Handle event entities which represent a single item
      else if (entityId.startsWith('event.')) {
        const { title, link, summary, description, image } = stateObj.attributes;
        if (typeof title === 'string' && typeof link === 'string') {
          allItems.push({
            title,
            link,
            summary: (summary as string) ?? undefined,
            description: (description as string) ?? undefined,
            image: (image as string) ?? undefined,
            published: stateObj.state,
            source_entity_id: entityId,
          });
        }
      }
    }

    return allItems;
  }

  private _getEntityName(entityId: string): string {
    const stateObj = this.hass.states[entityId];
    return stateObj?.attributes.friendly_name || entityId;
  }

  private _getItemSourceName(item: FeedEntry): string {
    const entityName = item.source_entity_id ? this._getEntityName(item.source_entity_id) : '';
    let itemSource = '';

    if (item.source && typeof item.source === 'string') {
      itemSource = item.source;
    } else if (item.category) {
      if (typeof item.category === 'string') itemSource = item.category;
      if (Array.isArray(item.category)) itemSource = item.category.join(', ');
    }

    if (this._entities.length > 1) {
      return itemSource ? `${entityName} (${itemSource})` : entityName;
    } else {
      return itemSource ? itemSource : entityName;
    }
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
      (this._config.show_channel_description !== false && (channel.description || channel.subtitle)) ||
      channel.image ||
      channel.link ||
      (this._config.show_published_date && (channel.published || channel.updated))
    );
  }

  private _renderChannelActions(channelLink: string | undefined, hasAnyBookmarks: boolean): TemplateResult {
    return html`
      <div class="channel-actions">
        ${
          channelLink && isSafeUrl(channelLink)
            ? html`<a class="channel-link" href="${channelLink}" target="_blank" rel="noopener noreferrer"
                >${localize(this.hass, 'component.rss-accordion.card.visit_channel')}</a
              >`
            : ''
        }
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
    const rawChannelImage = channel.image as string | undefined;
    const channelImage = isSafeUrl(rawChannelImage, true) ? rawChannelImage : undefined;
    // Cropping a picture that is not being shown reserves a hole where it would
    // have been, so the crop comes off with the picture.
    const channelImageFailed = channelImage !== undefined && this._failedChannelImage === channelImage;
    const channelPublished = (channel.published || channel.updated) as string | undefined;
    const formattedChannelPublished = channelPublished ? formatDate(channelPublished, this.hass) : undefined;

    return html`
      <div class="channel-info ${this._config.crop_channel_image && !channelImageFailed ? 'cropped-image' : ''}">
        ${
          channelImage
            ? html`<img
                class="channel-image"
                src="${channelImage}"
                alt="${channelTitle || localize(this.hass, 'component.rss-accordion.card.channel_image_alt')}"
                @error=${this._onChannelImageError}
                @load=${this._onChannelImageLoad}
              />`
            : ''
        }
        <div class="channel-text">
          ${channelTitle ? html`<h2 class="channel-title">${channelTitle}</h2>` : ''}
          ${
            this._config.show_published_date && formattedChannelPublished
              ? html`<p class="channel-published">
                  <span class="label">${localize(this.hass, 'component.rss-accordion.card.last_updated')}:</span>
                  ${formattedChannelPublished}
                </p>`
              : ''
          }
          ${
            this._config.show_channel_description !== false && channelDescription
              ? html`<div
                  class="channel-description-container ${this._isDescriptionExpanded ? 'expanded' : ''}"
                  style="${this._isDescriptionExpanded ? `max-height: 1000px` : ''}"
                >
                  <p class="channel-description">
                    ${
                      this._isDescriptionExpanded
                        ? channelDescription
                        : truncate(channelDescription, this._config.max_channel_description_length ?? 180)
                    }
                  </p>
                  ${
                    channelDescription.length > (this._config.max_channel_description_length ?? 180)
                      ? html`<button class="toggle-description" @click=${this._toggleDescription}>
                          ${localize(
                            this.hass,
                            this._isDescriptionExpanded
                              ? 'component.rss-accordion.card.show_less'
                              : 'component.rss-accordion.card.show_more',
                          )}
                        </button>`
                      : ''
                  }
                </div>`
              : ''
          }
          ${this._renderChannelActions(channelLink, hasAnyBookmarks)}
        </div>
      </div>
    `;
  }

  /**
   * Hides an image that failed to load.
   *
   * A broken `<img>` paints its alt text - wrapped over several lines next to
   * the title - or a broken-file icon, which is worse than no image at all.
   *
   * The class is only ever a reaction to what this element did, and the
   * `class` attribute it goes on is a static part of the template that lit
   * writes once and never revisits, so mutating it here is safe. It has to come
   * off again, though: nodes are keyed and outlive their contents, so an `<img>`
   * whose `src` later rebinds to a working URL would otherwise stay hidden for
   * the life of the card.
   */
  private _onImageError(e: Event): void {
    (e.target as HTMLImageElement).classList.add('image-failed');
  }

  private _onImageLoad(e: Event): void {
    (e.target as HTMLImageElement).classList.remove('image-failed');
  }

  /**
   * The same for the channel image, which additionally drives the crop.
   *
   * The crop lives on `.channel-info`, whose `class` attribute lit owns through
   * a binding. Reaching in and removing `cropped-image` by hand only appeared
   * to work: lit skips writing an attribute whose value has not changed, so the
   * removal survived until the binding produced a different string - toggling
   * the crop off and on in the editor put the crop back while the picture
   * stayed hidden. It is derived from state and rendered now, so lit remains
   * the only writer.
   */
  private _onChannelImageError(e: Event): void {
    const img = e.target as HTMLImageElement;
    img.classList.add('image-failed');
    this._failedChannelImage = img.getAttribute('src') ?? undefined;
  }

  private _onChannelImageLoad(e: Event): void {
    (e.target as HTMLImageElement).classList.remove('image-failed');
    this._failedChannelImage = undefined;
  }

  private _toggleDescription(): void {
    this._isDescriptionExpanded = !this._isDescriptionExpanded;
  }

  private _renderItem(item: FeedEntry): TemplateResult {
    const imageUrl = this._getItemImage(item);
    const content = item.summary || item.description || '';
    const showImage = this._config.show_item_image !== false && isSafeUrl(imageUrl as string | undefined, true);

    // If a hero image is being displayed from the `item.image` field,
    // strip all images from the summary to prevent duplicates.
    const processedContent = showImage ? content.replace(/<img[^>]*>/gi, '') : content;

    const dateString = item.published || item.updated || '';
    const publishedDate = new Date(dateString);
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
      // formatDate answers an unparsable timestamp with an empty string, and
      // "Listened on: " with nothing behind it says less than "Listened".
      // Stored progress can carry one: it is whatever was in localStorage when
      // the episode finished, from any version of this card.
      if (completedDate) {
        listenedTooltip = localize(this.hass, 'component.rss-accordion.card.listened_on', { date: completedDate });
      }
    }

    const imageStyles = {
      aspectRatio: this._config.image_ratio,
      objectFit: this._config.image_fit_mode || 'cover',
    };

    // An entry without a title would otherwise render an empty, clickable row.
    const title = item.title?.trim() || localize(this.hass, 'component.rss-accordion.card.untitled');

    return html`
      <details class="accordion-item" data-key=${this._storageHelper.getBookmarkKey(item)}>
        <summary class="accordion-header" @click=${this._onSummaryClick}>
          <div class="header-main">
            ${
              isSafeUrl(item.link)
                ? html`<a class="title-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
                    ${title}
                  </a>`
                : html`<span class="title-link">${title}</span>`
            }
            <div class="header-badges">
              ${
                this._config.show_bookmarks
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
                  : ''
              }
              ${
                isNew
                  ? html`<span class="new-pill">${localize(this.hass, 'component.rss-accordion.card.new_pill')}</span>`
                  : ''
              }
              ${
                audioUrlString && isCompleted
                  ? html`<ha-icon
                      class="listened-icon"
                      icon="mdi:check-circle-outline"
                      title="${listenedTooltip}"
                    ></ha-icon>`
                  : ''
              }
            </div>
          </div>
        </summary>
        <div class="accordion-content">
          ${
            (this._config.show_source !== undefined ? this._config.show_source : this._entities.length > 1) &&
            (item.source_entity_id || item.category || item.source)
              ? html`<div class="item-source">
                  ${localize(this.hass, 'component.rss-accordion.card.source')}: ${this._getItemSourceName(item)}
                </div>`
              : ''
          }
          ${
            /* No parsable date at all: an empty row beats "Invalid Date". */
            formattedDate ? html`<div class="item-published">${formattedDate}</div>` : ''
          }
          ${
            showImage
              ? html`<img
                  class="item-image"
                  src="${imageUrl as string}"
                  alt="${title}"
                  style=${styleMap(imageStyles)}
                  @error=${this._onImageError}
                  @load=${this._onImageLoad}
                />`
              : ''
          }
          ${
            this._config.show_audio_player !== false && item.audio
              ? html`
                  <div class="audio-player-container">
                    <audio
                      controls
                      .src=${audioUrlString}
                      @play=${this._onAudioPlay}
                      @loadedmetadata=${(e: Event) => this._onAudioLoaded(e, audioUrlString as string)}
                      @timeupdate=${(e: Event) => this._onAudioTimeUpdate(e, audioUrlString as string)}
                      @ended=${(e: Event) => this._onAudioEnded(e, audioUrlString as string)}
                    ></audio>
                  </div>
                `
              : ''
          }
          <div class="item-summary" .innerHTML=${sanitizeHtml(processedContent)}></div>
          ${
            isSafeUrl(item.link)
              ? html`<a class="item-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
                  ${localize(this.hass, 'component.rss-accordion.card.to_news_article')}
                </a>`
              : ''
          }
        </div>
      </details>
    `;
  }

  protected render(): TemplateResult {
    if (!this._config || !this.hass) {
      return html``;
    }

    // If no entities are configured or found
    if (this._entities.length === 0) {
      return html`
        <ha-card .header=${this._config.title}>
          <div class="card-content warning">
            ${localize(this.hass, 'component.rss-accordion.card.entity_not_found', { entity: 'No entity configured' })}
          </div>
        </ha-card>
      `;
    }

    // Check if at least one entity exists
    const someEntityExists = this._entities.some((id) => this.hass.states[id]);
    if (!someEntityExists) {
      return html`
        <ha-card .header=${this._config.title}>
          <div class="card-content warning">
            ${localize(this.hass, 'component.rss-accordion.card.entity_not_found', {
              entity: this._entities.join(', '),
            })}
          </div>
        </ha-card>
      `;
    }

    // Use the first entity for channel info, if available
    const firstStateObj = this.hass.states[this._entities[0]];
    const channel = firstStateObj?.attributes.channel as Record<string, unknown> | undefined;
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
      return html`<ha-card .header=${this._config.title}>${this._renderEmptyState()}</ha-card>`;
    }

    return html`
      <ha-card .header=${this._config.title}>
        <div class="card-content">
          ${
            shouldRenderChannel
              ? this._renderChannelInfo(channel, hasAnyBookmarks)
              : this._renderChannelActions(undefined, hasAnyBookmarks) /* Render filter button */
          }
          ${
            /* Keyed, so an entry keeps its own DOM node - and with it its open
               panel, height and audio position - when the feed reorders. */
            repeat(
              itemsToDisplay,
              (item) => this._storageHelper.getBookmarkKey(item),
              (item) => this._renderItem(item),
            )
          }
        </div>
      </ha-card>
    `;
  }

  private _hasFeedAttribute(entityId: string): boolean {
    return hasFeedAttribute(this.hass.states, entityId);
  }

  /**
   * Explains why there is nothing to show.
   *
   * An entity that is down and an entity that was never a feed both used to read
   * as "No entries available in feed", which sends the user looking at the feed
   * instead of at their configuration.
   */
  private _renderEmptyState(): TemplateResult {
    const known = this._entities.filter((entityId) => this.hass.states[entityId]);

    const unavailable = known.filter((entityId) =>
      ['unavailable', 'unknown'].includes(this.hass.states[entityId].state),
    );
    if (unavailable.length === known.length) {
      return html`<div class="card-content warning">
        ${localize(this.hass, 'component.rss-accordion.card.entity_unavailable', { entity: unavailable.join(', ') })}
      </div>`;
    }

    const withoutFeed = known.filter((entityId) => !this._hasFeedAttribute(entityId));
    if (withoutFeed.length === known.length) {
      return html`<div class="card-content warning">
        ${localize(this.hass, 'component.rss-accordion.card.entity_no_feed', { entity: withoutFeed.join(', ') })}
      </div>`;
    }

    return html`<div class="card-content">
      <i>${localize(this.hass, 'component.rss-accordion.card.no_entries')}</i>
    </div>`;
  }

  /**
   * The `size` token this core's `ha-button` understands.
   *
   * The vocabulary was renamed in 2026.7: up to and including 2026.6 the
   * component documents `small`/`medium`/`large` and styles `:host([size="small"])`,
   * from 2026.7 it documents `xs`/`s`/`m`/`l`/`xl` and styles `:host([size="s"])`.
   * Neither version aliases the other's tokens and neither says anything about
   * one it does not know - an unrecognised `size` is silently dropped and the
   * button renders at its default size.
   *
   * That rename lands three releases above the minimum this card supports, so
   * one hard-coded token is wrong on one side of it or the other. An
   * unreadable version resolves to the current vocabulary, which is the one
   * every core from here on will speak.
   */
  private _buttonSize(): 'small' | 's' {
    const version = this.hass?.config?.version;
    const match = /^(\d+)\.(\d+)/.exec(version ?? '');
    if (!match) return 's';

    const [year, month] = [Number(match[1]), Number(match[2])];
    return year > 2026 || (year === 2026 && month >= 7) ? 's' : 'small';
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
        size=${this._buttonSize()}
        title="${
          !hasAnyBookmarks
            ? localize(this.hass, 'component.rss-accordion.card.no_bookmarks_yet_tooltip')
            : localize(this.hass, 'component.rss-accordion.card.show_bookmarked')
        }"
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

// A duplicate Lovelace resource entry loads this bundle twice. An unguarded define throws and
// takes the second copy down with it, so register only if nobody registered us before.
if (!customElements.get(ELEMENT_NAME)) {
  customElements.define(ELEMENT_NAME, RssAccordion);
}

if (typeof window !== 'undefined') {
  window.customCards = window.customCards || [];
  // Same duplicate load: a second push would list the card twice in the card picker.
  if (!window.customCards.some((card) => card.type === ELEMENT_NAME)) {
    window.customCards.push({
      type: ELEMENT_NAME,
      name: 'RSS Accordion',
      description: 'A card to display RSS feed items in an accordion style.',
      documentationURL: 'https://github.com/timmaurice/lovelace-rss-accordion',
    });
  }
}
