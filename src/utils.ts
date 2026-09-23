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
