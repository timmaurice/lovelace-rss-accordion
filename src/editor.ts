import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, RssAccordionConfig, FeedEntry } from './types';
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

    let value: string | number | boolean | undefined = target.tagName === 'HA-SWITCH' ? target.checked : target.value;

    // Handle default values by deleting the key.
    if (configValue === 'image_fit_mode' && value === 'cover') {
      value = undefined;
    }

    if (configValue === 'show_item_image') {
      if (value) {
        delete newConfig.show_item_image;
      } else {
        newConfig.show_item_image = false;
        delete newConfig.image_ratio;
        delete newConfig.image_fit_mode;
      }
    } else if (configValue === 'show_audio_player') {
      if (value) {
        delete newConfig.show_audio_player;
      } else {
        newConfig.show_audio_player = false;
      }
    } else if (value === '' || value === false || value === undefined) {
      delete newConfig[configValue];
      // If show_channel_info is turned off, also remove its dependent options
      if (configValue === 'show_channel_info') {
        delete newConfig.show_published_date;
        delete newConfig.crop_channel_image;
      }
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
    const newEntityId = ev.detail.value;
    const newConfig: RssAccordionConfig = {
      ...this._config,
      entity: newEntityId,
    };

    // Clean up config options that may not be applicable to the new entity
    const stateObj = newEntityId ? this.hass.states[newEntityId] : undefined;
    const channel = stateObj?.attributes.channel as Record<string, unknown> | undefined;

    if (!channel) {
      delete newConfig.show_channel_info;
      delete newConfig.crop_channel_image;
      delete newConfig.show_published_date;
    } else {
      if (!channel.published) {
        delete newConfig.show_published_date;
      }
      if (!channel.image) {
        delete newConfig.crop_channel_image;
      }
    }

    // Clean up audio player option if not applicable
    const entries = (stateObj?.attributes.entries as FeedEntry[]) ?? [];
    const hasAudio = !!(stateObj?.attributes.audio as string | undefined) || entries.some((entry) => !!entry.audio);
    if (!hasAudio) {
      delete newConfig.show_audio_player;
    }

    fireEvent(this, 'config-changed', { config: newConfig });
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;
    const channel = stateObj?.attributes.channel as Record<string, unknown> | undefined;
    const channelImage = channel?.image as string | undefined;
    const channelPublished = channel?.published as string | undefined;
    const entries = (stateObj?.attributes.entries as FeedEntry[]) ?? [];
    const hasAudio = !!(stateObj?.attributes.audio as string | undefined) || entries.some((entry) => !!entry.audio);

    return html`
      <ha-card>
        <div class="card-content card-config">
          <div class="group">
            <div class="group-header">${localize(this.hass, 'component.rss-accordion.editor.groups.core')}</div>
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
          </div>

          <div class="group">
            <div class="group-header">${localize(this.hass, 'component.rss-accordion.editor.groups.feed')}</div>
            <div class="row">
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
            </div>
            <ha-formfield .label=${localize(this.hass, 'component.rss-accordion.editor.initial_open')}>
              <ha-switch
                .checked=${!!this._config.initial_open}
                .configValue=${'initial_open'}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
            <ha-formfield .label=${localize(this.hass, 'component.rss-accordion.editor.allow_multiple')}>
              <ha-switch
                .checked=${!!this._config.allow_multiple}
                .configValue=${'allow_multiple'}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
            ${hasAudio
              ? html`
                  <ha-formfield .label=${localize(this.hass, 'component.rss-accordion.editor.show_audio_player')}>
                    <ha-switch
                      .checked=${this._config.show_audio_player !== false}
                      .configValue=${'show_audio_player'}
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </ha-formfield>
                `
              : ''}
            <ha-formfield .label=${localize(this.hass, 'component.rss-accordion.editor.show_item_image')}>
              <ha-switch
                .checked=${this._config.show_item_image !== false}
                .configValue=${'show_item_image'}
                @change=${this._valueChanged}
              ></ha-switch>
            </ha-formfield>
          </div>

          ${this._config.show_item_image !== false
            ? html`
                <div class="group">
                  <div class="group-header">
                    ${localize(this.hass, 'component.rss-accordion.editor.groups.item_images')}
                  </div>
                  <div class="row">
                    <ha-textfield
                      .label=${localize(this.hass, 'component.rss-accordion.editor.image_ratio')}
                      .value=${this._config.image_ratio || ''}
                      .configValue=${'image_ratio'}
                      @input=${this._valueChanged}
                      .placeholder=${'auto'}
                      .pattern=${'^auto$|^\\d+(\\.\\d+)?$|^\\d+(\\.\\d+)?\\s*\\/\\s*\\d+(\\.\\d+)?$'}
                      .validationMessage=${localize(
                        this.hass,
                        'component.rss-accordion.editor.image_ratio_validation_message',
                      )}
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
                  </div>
                </div>
              `
            : ''}
          ${channel
            ? html`
                <div class="group">
                  <div class="group-header">
                    ${localize(this.hass, 'component.rss-accordion.editor.groups.channel')}
                  </div>
                  <ha-formfield .label=${localize(this.hass, 'component.rss-accordion.editor.show_channel_info')}>
                    <ha-switch
                      .checked=${!!this._config.show_channel_info}
                      .configValue=${'show_channel_info'}
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </ha-formfield>
                  ${this._config.show_channel_info && channelImage
                    ? html`
                        <ha-formfield
                          .label=${localize(this.hass, 'component.rss-accordion.editor.crop_channel_image')}
                        >
                          <ha-switch
                            .checked=${!!this._config.crop_channel_image}
                            .configValue=${'crop_channel_image'}
                            @change=${this._valueChanged}
                          ></ha-switch>
                        </ha-formfield>
                      `
                    : ''}
                  ${this._config.show_channel_info && channelPublished
                    ? html`
                        <ha-formfield
                          .label=${localize(this.hass, 'component.rss-accordion.editor.show_channel_published_date')}
                        >
                          <ha-switch
                            .checked=${!!this._config.show_published_date}
                            .configValue=${'show_published_date'}
                            @change=${this._valueChanged}
                          ></ha-switch>
                        </ha-formfield>
                      `
                    : ''}
                </div>
              `
            : ''}
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ${unsafeCSS(editorStyles)}
  `;
}
