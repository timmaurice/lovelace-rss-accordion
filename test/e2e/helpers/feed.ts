import { deflateSync } from 'node:zlib';

/**
 * Builds sensor states in the exact shape the sibling `feedparser` integration
 * produces - the integration `docker-compose.yml` mounts as
 * `/config/custom_components`, and the only source this card is written for.
 *
 * The shape is not invented: it is what `parser.generate_sensor_entry()` and
 * `parser.generate_channel_info()` emit, and it was read back off a real
 * `sensor.*` state of that integration. Two details matter and would be easy to
 * get wrong:
 *
 *  - The body of an entry arrives as `summary`, never as `description`. The
 *    Python `feedparser` library maps RSS `<description>` onto `summary`, so a
 *    seeded `description` would exercise only the card's fallback branch.
 *  - `published` is a *formatted string*: the integration runs the parsed date
 *    through the sensor's `date_format`, whose default -
 *    `%a, %b %d %Y %I:%M %p` - names no zone, so `new Date()` would read it as
 *    the browser's local time. Next to it sits `published_iso`, the same
 *    instant as ISO 8601 with its UTC offset, which is what the card reads. The
 *    entries built here carry both, the way an integration on its default
 *    format sends them; `zonedFeedparserDate` is the older shape, a configured
 *    format with a zone and no ISO companion, for entries written out by hand.
 *  - Feed categories come through as `tags`, and there is no `category` key.
 */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (value: number) => String(value).padStart(2, '0');

/** `%a, %b %d %Y %I:%M %p` in UTC - the integration's default `date_format`, with no zone in it. */
export function feedparserDate(date: Date): string {
  const hours = date.getUTCHours();
  return (
    `${DAYS[date.getUTCDay()]}, ${MONTHS[date.getUTCMonth()]} ${pad(date.getUTCDate())} ` +
    `${date.getUTCFullYear()} ${pad(hours % 12 || 12)}:${pad(date.getUTCMinutes())} ${hours < 12 ? 'AM' : 'PM'}`
  );
}

/** `%a, %d %b %Y %H:%M:%S %Z` - the format `configuration.yaml` configures. */
export function zonedFeedparserDate(date: Date): string {
  return (
    `${DAYS[date.getUTCDay()]}, ${pad(date.getUTCDate())} ${MONTHS[date.getUTCMonth()]} ` +
    `${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`
  );
}

/** Python's `datetime.isoformat(timespec="seconds")` of a UTC date: `2026-03-02T10:15:00+00:00`. */
export function feedparserIsoDate(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

export interface FeedEntrySeed {
  title: string;
  link: string;
  summary: string;
  published: Date;
  id: string;
  image?: string;
  audio?: string;
  tags?: string[];
}

/** One entry, with the keys and only the keys the integration would set. */
export function feedEntry(seed: FeedEntrySeed): Record<string, unknown> {
  const links: Record<string, unknown>[] = [{ rel: 'alternate', type: 'text/html', href: seed.link }];
  if (seed.audio) links.push({ rel: 'enclosure', type: 'audio/mpeg', length: '1', href: seed.audio });

  return {
    title: seed.title,
    links,
    link: seed.link,
    summary: seed.summary,
    published: feedparserDate(seed.published),
    published_iso: feedparserIsoDate(seed.published),
    id: seed.id,
    guidislink: false,
    ...(seed.tags ? { tags: seed.tags.map((term) => ({ term, scheme: null, label: null })) } : {}),
    ...(seed.image ? { image: seed.image } : {}),
    ...(seed.audio ? { audio: seed.audio } : {}),
  };
}

export interface FeedChannelSeed {
  title: string;
  link: string;
  subtitle: string;
  updated: Date;
  image?: string;
}

/** The `channel` attribute, as `generate_channel_info()` builds it. */
export function feedChannel(seed: FeedChannelSeed): Record<string, unknown> {
  return {
    title: seed.title,
    links: [{ rel: 'alternate', type: 'text/html', href: seed.link }],
    link: seed.link,
    subtitle: seed.subtitle,
    updated: feedparserDate(seed.updated),
    updated_iso: feedparserIsoDate(seed.updated),
    ...(seed.image ? { image: seed.image } : {}),
  };
}

/**
 * The full attribute payload of a feedparser sensor. Its state is the number of
 * entries, which is what `FeedParserSensor.native_value` returns.
 */
export function feedSensor(
  entries: Record<string, unknown>[],
  channel?: Record<string, unknown>,
): { state: string; attributes: Record<string, unknown> } {
  return {
    state: String(entries.length),
    attributes: {
      attribution: 'Data retrieved using RSS feedparser',
      icon: 'mdi:rss',
      channel: channel ?? {},
      entries,
    },
  };
}

/**
 * A solid-colour PNG, as the bytes a route handler can serve.
 *
 * A feed under test needs a picture with real intrinsic dimensions - one that
 * contributes no height at all until the browser has decoded it. A `data:` URI
 * will not do: the bytes are already in the document, so the browser resolves
 * them within the same task and the picture is never actually pending, which is
 * the exact state the card has to survive. Serving it through an intercepted
 * request is what makes the load deferrable, and generating it here is what
 * keeps the suite off the network.
 */
export function pngBytes(width: number, height: number, rgb: [number, number, number]): Buffer {
  const row = Buffer.concat([Buffer.of(0), Buffer.from(Array.from({ length: width }, () => rgb).flat())]);
  const raw = Buffer.concat(Array.from({ length: height }, () => row));

  const chunk = (type: string, data: Buffer): Buffer => {
    const typed = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typed));
    return Buffer.concat([length, typed, crc]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.set([8, 2, 0, 0, 0], 8); // 8 bits per channel, truecolour, no interlace

  return Buffer.concat([
    Buffer.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
