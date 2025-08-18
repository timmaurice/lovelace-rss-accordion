import { LitElement, TemplateResult, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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

  protected firstUpdated(): void {
    if (this._config?.initial_open) {
      const firstItem = this.shadowRoot?.querySelector<HTMLDetailsElement>('.accordion-item');
      if (firstItem && !firstItem.open) {
        firstItem.open = true;
      }
    }
  }

  private _handleToggle(e: Event): void {
    const details = e.target as HTMLDetailsElement;
    const content = details.querySelector('.accordion-content') as HTMLElement | null;
    if (!content) return;

    if (details.open) {
      // Handle single-open accordion
      if (!this._config.allow_multiple) {
        this.shadowRoot?.querySelectorAll<HTMLDetailsElement>('details.accordion-item').forEach((d) => {
          if (d !== details) {
            d.open = false;
          }
        });
      }
      // Animate open
      content.style.maxHeight = content.scrollHeight + 'px';
    } else {
      // Animate close
      content.style.maxHeight = '';
    }
  }

  private _getDateTimeFormatOptions(): Intl.DateTimeFormatOptions {
    const lang = this.hass.language.substring(0, 2);

    // Default options (matches German format)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };

    // English (US) format is different
    if (lang === 'en') {
      options.month = 'short';
      options.hour12 = true;
    }

    return options;
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

    let entries: FeedEntry[] = [];
    if (stateObj.attributes.entries && Array.isArray(stateObj.attributes.entries)) {
      // Sensor entity with a list of entries
      entries = (stateObj.attributes.entries as FeedEntry[]) || [];
    } else if (this._config.entity.startsWith('event.')) {
      // Event entity representing a single feed item
      const { title, link, summary, description, image } = stateObj.attributes;

      if (typeof title === 'string' && typeof link === 'string') {
        const singleEntry: FeedEntry = {
          title,
          link,
          summary: (summary as string) ?? undefined,
          description: (description as string) ?? undefined,
          image: (image as string) ?? undefined,
          published: stateObj.state,
        };
        entries.push(singleEntry);
      }
    }
    const maxItems = this._config.max_items ?? entries.length;
    const itemsToDisplay = entries.slice(0, maxItems);

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

            const newPillDuration = this._config.new_pill_duration_minutes ?? 30;
            const ageInMinutes = (new Date().getTime() - publishedDate.getTime()) / (1000 * 60);
            const isNew = ageInMinutes >= 0 && ageInMinutes < newPillDuration;

            return html`
              <details class="accordion-item" @toggle=${this._handleToggle}>
                <summary class="accordion-header">
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
                  ${item.image ? html`<img class="item-image" src="${item.image}" alt="${item.title}" />` : ''}
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
