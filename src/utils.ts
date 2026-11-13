import { HomeAssistant } from './types';

/**
 * Dispatches a custom event with an optional detail value.
 *
 * @param node The element to dispatch the event from.
 * @param type The name of the event.
 * @param detail The detail value to pass with the event.
 * @param options The options for the event.
 */
export const fireEvent = <T>(node: HTMLElement, type: string, detail?: T, options?: CustomEventInit<T>): void => {
  const event = new CustomEvent(type, { bubbles: true, cancelable: false, composed: true, ...options, detail });
  node.dispatchEvent(event);
};

/**
 * Formats a date string or object into a locale-aware string.
 * Feeds are not obliged to carry a date, and the ones that do may use a format
 * this browser cannot parse. Both end up as an unparsable `Date`, and an empty
 * string is a better answer than the literal "Invalid Date".
 *
 * @param date The date to format.
 * @param hass The Home Assistant object, used for locale and language settings.
 * @returns A formatted date string, or '' if the date cannot be parsed.
 */
export function formatDate(date: string | Date, hass: HomeAssistant): string {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  };

  // Respect the user's 12/24 hour format setting from Home Assistant
  if (hass.locale) {
    // hass.locale.time_format can be '12', '24', or 'system'.
    // Let's be explicit. 'system' will fallback to browser default which is what we want.
    if (hass.locale.time_format === '12') {
      options.hour12 = true;
    } else if (hass.locale.time_format === '24') {
      options.hour12 = false;
    }
  }

  return dateObj.toLocaleString(hass.language, options);
}

/**
 * The keys a feed entry or channel carries its date under. feedparser formats
 * `published`/`updated` with the user's `date_format`, which may drop the zone
 * (the default does) or anything else a parser needs, so newer versions add an
 * ISO 8601 `_iso` companion with the UTC offset next to each.
 */
const DATE_KEYS = ['published', 'updated'] as const;

/**
 * Returns the date of a feed entry or channel, or undefined when it has none
 * this browser can read. The ISO companion is preferred, as it is the only one
 * that names its instant; the formatted string is the fallback for older
 * integration versions and for other sources.
 *
 * @param item A feed entry, or the `channel` attribute.
 * @returns The date, or undefined.
 */
export function itemDate(item: Record<string, unknown>): Date | undefined {
  for (const key of DATE_KEYS) {
    for (const value of [item[`${key}_iso`], item[key]]) {
      if (typeof value !== 'string' || !value) continue;
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date;
    }
  }
  return undefined;
}

/**
 * The sort key of a feed entry: its date in milliseconds, NaN when it has none.
 * @param item A feed entry.
 * @returns Milliseconds since the epoch, or NaN.
 */
export function itemTime(item: Record<string, unknown>): number {
  return itemDate(item)?.getTime() ?? NaN;
}

/**
 * Comparator sorting feed entries newest first, with undated entries last.
 * Undated entries keep their relative order (stable sort).
 * @param a A feed entry.
 * @param b A feed entry.
 * @returns A negative, zero or positive number for Array.prototype.sort.
 */
export function compareItemsNewestFirst(a: Record<string, unknown>, b: Record<string, unknown>): number {
  const ta = itemTime(a);
  const tb = itemTime(b);
  const aMissing = Number.isNaN(ta);
  const bMissing = Number.isNaN(tb);
  if (aMissing || bMissing) {
    return Number(aMissing) - Number(bMissing);
  }
  return tb - ta;
}

/**
 * Truncates a string to a specified length and adds an ellipsis if needed.
 * @param text The text to truncate.
 * @param maxLength The maximum length of the text.
 * @returns The truncated text.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Formats a playback position as `m:ss`, or `h:mm:ss` from one hour on.
 * @param seconds The position in seconds; invalid or negative values count as 0.
 * @returns The formatted position.
 */
export function formatDuration(seconds: number): string {
  const total = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/**
 * Checks whether HTML carries readable text, ignoring tags, whitespace and ellipses.
 * @param html The HTML to check.
 * @returns False for teaser markup such as `<img … />...`.
 */
export function hasReadableText(html: string | undefined): boolean {
  if (!html) return false;
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&(nbsp|hellip|#8230|#160);/gi, '')
    .replace(/[\s.…]+/g, '');
  return text.length > 0;
}
