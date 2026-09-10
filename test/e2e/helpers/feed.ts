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
 *  - `published` is a *formatted string*, not an ISO timestamp: the integration
 *    runs the parsed date through the sensor's `date_format`. This is the format
 *    the repository's own `configuration.yaml` asks for, and the trailing zone
 *    name is what keeps `new Date()` from reading it as local time.
 *  - Feed categories come through as `tags`, and there is no `category` key.
 */

/** `%a, %d %b %Y %H:%M:%S %Z` - the format `configuration.yaml` configures. */
export function feedparserDate(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (value: number) => String(value).padStart(2, '0');
  return (
    `${days[date.getUTCDay()]}, ${pad(date.getUTCDate())} ${months[date.getUTCMonth()]} ` +
    `${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`
  );
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
