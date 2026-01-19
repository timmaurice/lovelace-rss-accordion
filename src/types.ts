export interface FrontendLocaleData {
  language: string;
  number_format: 'comma_decimal' | 'decimal_comma' | 'space_comma' | 'system';
  time_format: '12' | '24' | 'system' | 'am_pm';
  // You can expand this with more properties if needed
}

// A basic representation of the Home Assistant object
export interface HomeAssistant {
  states: { [entity_id: string]: HassEntity };
  entities: { [entity_id: string]: HassEntityRegistryDisplayEntry };
  localize: (key: string, ...args: unknown[]) => string;
  language: string;
  locale: FrontendLocaleData;
  callWS: <T>(message: { type: string; [key: string]: unknown }) => Promise<T>;
  themes?: {
    darkMode?: boolean;
    [key: string]: unknown;
  };
  // You can expand this with more properties from the hass object if needed
}

// A basic representation of a Home Assistant entity state object
export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    unit_of_measurement?: string;
    [key: string]: unknown;
  };
}

export interface HassEntityRegistryDisplayEntry {
  entity_id: string;
  display_precision?: number;
}

// A basic representation of a Lovelace card
export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  editMode?: boolean;
  setConfig(config: LovelaceCardConfig): void;
  getCardSize?(): number | Promise<number>;
}

// A basic representation of a Lovelace card configuration
export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
}

export interface FeedEntry {
  title: string;
  link: string;
  summary?: string;
  description?: string;
  published: string;
  image?: string;
  audio?: string;
  source_entity_id?: string; // Track which entity this item came from
  [key: string]: unknown;
}

export interface RssAccordionConfig extends LovelaceCardConfig {
  title?: string;
  entity?: string;
  entities?: string[];
  max_items?: number;
  allow_multiple?: boolean;
  image_ratio?: string;
  image_fit_mode?: 'cover' | 'contain';
  initial_open?: boolean;
  show_item_image?: boolean;
  new_pill_duration_hours?: number;
  show_audio_player?: boolean;
  show_channel_info?: boolean;
  crop_channel_image?: boolean;
  show_published_date?: boolean;
  show_bookmarks?: boolean;
  show_channel_description?: boolean;
  max_channel_description_length?: number;
}

export interface AudioProgress {
  currentTime: number;
  completed: boolean;
  completedAt?: string;
}
