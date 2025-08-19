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
import { localize } from './localize.js';
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
    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) {
      return 1;
    }

    let numItems = 0;
    if (stateObj.attributes.entries && Array.isArray(stateObj.attributes.entries)) {
      numItems = (stateObj.attributes.entries as FeedEntry[]).length;
    } else if (this._config.entity.startsWith('event.')) {
      const { title, link } = stateObj.attributes;
      if (title && link) {
        numItems = 1;
      }
    }

    const maxItems = this._config.max_items ?? numItems;
    const displayItems = Math.min(numItems, maxItems);

    return (this._config.title ? 1 : 0) + (displayItems || 1);
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

  private async _onSummaryClick(e: Event): Promise<void> {
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

  private _getDateTimeFormatOptions(): Intl.DateTimeFormatOptions {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    };

    // Respect the user's 12/24 hour format setting from Home Assistant
    if (this.hass.locale) {
      // hass.locale.time_format can be '12', '24', or 'system'.
      // Let's be explicit. 'system' will fallback to browser default which is what we want.
      if (this.hass.locale.time_format === '12') {
        options.hour12 = true;
      } else if (this.hass.locale.time_format === '24') {
        options.hour12 = false;
      }
    }
    return options;
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
          ${itemsToDisplay.map((item) => {
            const content = item.summary || item.description || '';
            const processedContent = this._config.strip_summary_images ? content.replace(/<img[^>]*>/g, '') : content;

            const publishedDate = new Date(item.published);
            const formattedDate = publishedDate.toLocaleString(this.hass.language, this._getDateTimeFormatOptions());

            const newPillDurationHours = this._config.new_pill_duration_hours ?? 1;
            const ageInMinutes = (new Date().getTime() - publishedDate.getTime()) / (1000 * 60);
            const isNew = ageInMinutes >= 0 && ageInMinutes < newPillDurationHours * 60;

            const imageStyles = {
              aspectRatio: this._config.image_ratio,
            };

            return html`
              <details class="accordion-item">
                <summary class="accordion-header" @click=${this._onSummaryClick}>
                  <div class="header-main">
                    <a class="title-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
                      ${item.title}
                    </a>
                    ${isNew
                      ? html`<span class="new-pill"
                          >${localize(this.hass, 'component.rss-accordion.card.new_pill')}</span
                        >`
                      : ''}
                  </div>
                </summary>
                <div class="accordion-content">
                  <div class="item-published">${formattedDate}</div>
                  ${item.image
                    ? html`<img
                        class="item-image"
                        src="${item.image}"
                        alt="${item.title}"
                        style=${styleMap(imageStyles)}
                      />`
                    : ''}
                  <div class="item-summary" .innerHTML=${processedContent}></div>
                  <a class="item-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
                    ${localize(this.hass, 'component.rss-accordion.card.to_news_article')}
                  </a>
                </div>
              </details>
            `;
          })}
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
  });
}
