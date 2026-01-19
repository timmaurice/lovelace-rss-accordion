# RSS Accordion Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://github.com/hacs/integration)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/timmaurice/lovelace-rss-accordion?style=flat-square)
[![GH-downloads](https://img.shields.io/github/downloads/timmaurice/lovelace-rss-accordion/total?style=flat-square)](https://github.com/timmaurice/lovelace-rss-accordion/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/timmaurice/lovelace-rss-accordion.svg?style=flat-square)](https://github.com/timmaurice/lovelace-rss-accordion/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/timmaurice/lovelace-rss-accordion.svg?style=flat-square)](https://github.com/timmaurice/lovelace-rss-accordion)
![GitHub](https://img.shields.io/github/license/timmaurice/lovelace-rss-accordion?style=flat-square)

A custom Lovelace card for Home Assistant to display RSS feed items from a sensor ([A better feedparser](https://github.com/timmaurice/feedparser)), ([feedparser](https://github.com/custom-components/feedparser)) or event entity ([feedreader](https://www.home-assistant.io/integrations/feedreader/)) in an accordion style.

## Features

### Core Functionality & Layout

- **Flexible Data Source**: Displays items from a `sensor` entity (e.g., Feed Parser) or an `event` entity (e.g., core `feedreader`).
- **Multiple Feed Aggregation**: Combine items from multiple RSS entities into a single card, automatically sorted by publication date.
- **Accordion Layout**: Each feed item is presented in a clean, collapsible accordion view, with an option to allow single or multiple items to be open at once.
- **Customizable Display**: Control the maximum number of items shown and optionally open the latest item automatically on card load.
- **Channel Information**: Optionally display the feed's channel details, such as title, description, and image.

### Visuals & User Experience

- **Recent Item Indicator**: A "NEW" pill highlights recent articles, with a configurable duration.
- **Read/Unread Tracking**: Visited article links are greyed out, making it easy to see what you've already read.
- **Hero Images**: Automatically displays a hero image if provided in the feed, and hides duplicate images from the summary to keep the layout clean.
- **Persistent Bookmarking**: Star your favorite items to save them permanently in your browser. Bookmarked items will remain visible even after they disappear from the live RSS feed.

### Podcast & Audio Features

- **Built-in Audio Player**: Includes an integrated player for feeds with audio enclosures, perfect for podcasts.
- **Playback Persistence**: Remembers your listening progress. Audio resumes where you left off after a refresh, and a "Listened" icon with a completion timestamp appears for finished tracks.

| The New York Times RSS                                                                                                                         | The Daily Audio Podcast RSS                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![RSS Accordion Card - The New York Times Screenshot](https://raw.githubusercontent.com/timmaurice/lovelace-rss-accordion/main/screenshot.png) | ![RSS Accordion Card - The Daily Audio Podcast Screenshot](https://raw.githubusercontent.com/timmaurice/lovelace-rss-accordion/main/screenshot-audio.png) |

## Localization

The editor is available in the following languages:

- English
- German
- French

<details>
<summary>Contributing Translations</summary>

If you would like to contribute a new translation:

1.  Fork the repository on GitHub.
2.  Copy the `src/translation/en.json` file and rename it to your language code (e.g., `es.json` for Spanish).
3.  Translate all the values in the new file.
4.  Submit a pull request with your changes.

</details>

## Installation

### HACS (Recommended)

This card is available in the [Home Assistant Community Store (HACS)](https://hacs.xyz/).

<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=timmaurice&repository=lovelace-rss-accordion&category=plugin" target="_blank" rel="noreferrer noopener"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open a repository inside the Home Assistant Community Store." /></a>

<details>
<summary>Manual Installation</summary>

1.  Download the `rss-accordion.js` file from the latest release.
2.  Place it in your `config/www` directory.
3.  Add the resource reference to your Lovelace configuration under `Settings` -> `Dashboards` -> `...` -> `Resources`.
    - URL: `/local/rss-accordion.js`
    - Resource Type: `JavaScript Module`

You can now add the card to your dashboard.

</details>

## Configuration

| Name                             | Type    | Default        | Description                                                                                                                                                                                                          |
| -------------------------------- | ------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                           | string  | **Required**   | `custom:rss-accordion`                                                                                                                                                                                               |
| `entity`                         | string  | **Required\*** | The entity ID of your feed sensor or event. \*Either `entity` or `entities` is required.                                                                                                                             |
| `entities`                       | list    | _optional_     | A list of entity IDs to aggregate items from multiple feeds. Items are sorted by publication date. \*Either `entity` or `entities` is required.                                                                      |
| `title`                          | string  | `''`           | The title of the card.                                                                                                                                                                                               |
| `max_items`                      | number  | All items      | The maximum number of feed items to display.                                                                                                                                                                         |
| `new_pill_duration_hours`        | number  | `1`            | The duration in hours for which the "NEW" pill is shown on recent items.                                                                                                                                             |
| `show_item_image`                | boolean | `true`         | If `false`, hides the main image for each feed item.                                                                                                                                                                 |
| `image_ratio`                    | string  | `auto`         | The CSS `aspect-ratio` for item images (e.g., `16/9`, `1.77`). Images are cropped to fit.                                                                                                                            |
| `image_fit_mode`                 | string  | `cover`        | How the image should fit. `cover` (fill & crop) or `contain` (fit inside).                                                                                                                                           |
| `initial_open`                   | boolean | `false`        | If `true`, the first/newest item will be open by default when the card loads.                                                                                                                                        |
| `allow_multiple`                 | boolean | `false`        | If `true`, allows multiple accordion items to be open simultaneously.                                                                                                                                                |
| `show_audio_player`              | boolean | `true`         | If `false`, hides the audio player for feed items that include an audio enclosure (e.g., podcasts).                                                                                                                  |
| `show_bookmarks`                 | boolean | `false`        | If `true`, enables a bookmarking feature, allowing you to star items and filter for them.                                                                                                                            |
| `show_channel_info`              | boolean | `false`        | If `true`, displays the channel's info (title, description, image) above the feed items. This option is only available for entities that have a `channel` attribute (e.g. from the `feedparser` custom integration). |
| `show_channel_description`       | boolean | `true`         | If `false`, hides the channel description. Only applicable if `show_channel_info` is true and a description exists.                                                                                                  |
| `max_channel_description_length` | number  | `280`          | The maximum number of characters to display for the channel description. Truncated descriptions will end with an ellipsis. Only applicable if `show_channel_description` is true.                                    |
| `crop_channel_image`             | boolean | `false`        | If `true`, displays the channel image as a 60x60px cropped circle. By default, the image is shown at 50% width without cropping. Only applicable if `show_channel_info` is true and a channel image exists.          |
| `show_published_date`            | boolean | `false`        | If `true`, displays the channel's last update time. Only applicable if `show_channel_info` is true and the sensor has a `channel.published` attribute.                                                               |

### Examples

#### Single Feed

```yaml
type: custom:rss-accordion
title: Home Assistant Blog
entity: sensor.home_assistant_blog_feed
max_items: 5
new_pill_duration_hours: 24
image_ratio: 16/9
image_fit_mode: cover
```

#### Multiple Feeds (Aggregated)

```yaml
type: custom:rss-accordion
title: News Aggregator
entities:
  - sensor.tech_news
  - sensor.local_news
  - sensor.weather_alerts
max_items: 15
show_bookmarks: true
```

## Development

<details>
<summary>To contribute to the development, you'll need to set up a build environment.</summary>

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/timmaurice/lovelace-rss-accordion.git
    cd lovelace-rss-accordion
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**
    This command will build for changes in the `src` directory and rebuild the card.

    ```bash
    npm run build
    ```

4.  In your Home Assistant instance, you will need to configure Lovelace to use the local development version of the card from `dist/rss-accordion.js`.
</details>

---

For further assistance or to [report issues](https://github.com/timmaurice/lovelace-rss-accordion/issues), please visit the [GitHub repository](https://github.com/timmaurice/lovelace-rss-accordion).

![Star History Chart](https://api.star-history.com/svg?repos=timmaurice/lovelace-rss-accordion&type=Date)

## ☕ Support My Work

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="30" />](https://www.buymeacoffee.com/timmaurice)
