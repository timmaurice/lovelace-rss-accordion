import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, RssAccordionConfig } from './types';
import { localize } from './localize';
import { fireEvent } from './utils';
import editorStyles from './styles/editor.styles.scss';

interface ValueChangedEventTarget extends HTMLElement {
  configValue?: keyof RssAccordionConfig;
  value?: string | number;
  checked?: boolean;
  type?: string;
  tagName: string;
}

@customElement('rss-accordion-editor')
export class RssAccordionEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: RssAccordionConfig;

  public setConfig(config: RssAccordionConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: Event): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target as ValueChangedEventTarget;
    if (!target.configValue) {
      return;
    }

    const configValue = target.configValue as keyof RssAccordionConfig;
    const newConfig = { ...this._config };

    const value = target.tagName === 'HA-SWITCH' ? target.checked : target.value;

    if (value === '' || value === false || value === undefined) {
      delete newConfig[configValue];
    } else {
      newConfig[configValue] = target.type === 'number' ? Number(value) : value;
    }

    // If image_ratio is cleared or set to 'auto', also remove image_fit_mode
    if (configValue === 'image_ratio') {
      if (!newConfig.image_ratio || newConfig.image_ratio === 'auto') {
        delete newConfig.image_fit_mode;
      }
    }
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private _entityChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) {
      return;
    }
    const newConfig = {
      ...this._config,
      entity: ev.detail.value,
    };
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <ha-card>
        <div class="card-content card-config">
          <ha-textfield
            .label=${localize(this.hass, 'component.rss-accordion.editor.title')}
            .value=${this._config.title || ''}
            .configValue=${'title'}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-entity-picker
            .hass=${this.hass}
            .label=${localize(this.hass, 'component.rss-accordion.editor.entity')}
            .value=${this._config.entity || ''}
            .includeDomains=${['sensor', 'event']}
            @value-changed=${this._entityChanged}
            allow-custom-entity
            required
          ></ha-entity-picker>
          <ha-textfield
            .label=${localize(this.hass, 'component.rss-accordion.editor.max_items')}
            type="number"
            min="1"
            .value=${this._config.max_items || ''}
            .configValue=${'max_items'}
            @input=${this._valueChanged}
            .placeholder=${localize(this.hass, 'component.rss-accordion.editor.max_items_placeholder')}
          ></ha-textfield>
          <ha-textfield
            .label=${localize(this.hass, 'component.rss-accordion.editor.new_pill_duration_hours')}
            type="number"
            min="1"
            .value=${this._config.new_pill_duration_hours || ''}
            .configValue=${'new_pill_duration_hours'}
            @input=${this._valueChanged}
            .placeholder="1"
          ></ha-textfield>
          <ha-textfield
            .label=${localize(this.hass, 'component.rss-accordion.editor.image_ratio')}
            .value=${this._config.image_ratio || ''}
            .configValue=${'image_ratio'}
            @input=${this._valueChanged}
            .placeholder=${'auto'}
            .pattern=${'^auto$|^\\d+(\\.\\d+)?$|^\\d+(\\.\\d+)?\\s*\\/\\s*\\d+(\\.\\d+)?$'}
            .validationMessage=${localize(this.hass, 'component.rss-accordion.editor.image_ratio_validation_message')}
          ></ha-textfield>
          ${this._config.image_ratio && this._config.image_ratio !== 'auto'
            ? html`
                <ha-select
                  .label=${localize(this.hass, 'component.rss-accordion.editor.image_fit_mode')}
                  .value=${this._config.image_fit_mode || 'cover'}
                  .configValue=${'image_fit_mode'}
                  @selected=${this._valueChanged}
                  @closed=${(ev: Event) => ev.stopPropagation()}
                  fixedMenuPosition
                  naturalMenuWidth
                >
                  <mwc-list-item value="cover"
                    >${localize(
                      this.hass,
                      'component.rss-accordion.editor.image_fit_mode_options.cover',
                    )}</mwc-list-item
                  >
                  <mwc-list-item value="contain"
                    >${localize(
                      this.hass,
                      'component.rss-accordion.editor.image_fit_mode_options.contain',
                    )}</mwc-list-item
                  >
                </ha-select>
              `
            : ''}
          <ha-formfield .label=${localize(this.hass, 'component.rss-accordion.editor.initial_open')}>
            <ha-switch
              .checked=${this._config.initial_open === true}
              .configValue=${'initial_open'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${localize(this.hass, 'component.rss-accordion.editor.allow_multiple')}>
            <ha-switch
              .checked=${this._config.allow_multiple === true}
              .configValue=${'allow_multiple'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${localize(this.hass, 'component.rss-accordion.editor.strip_summary_images')}>
            <ha-switch
              .checked=${this._config.strip_summary_images === true}
              .configValue=${'strip_summary_images'}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ${unsafeCSS(editorStyles)}
  `;
}
