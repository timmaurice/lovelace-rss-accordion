# RSS Accordion Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://github.com/hacs/integration)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/timmaurice/lovelace-rss-accordion?style=flat-square)
[![GH-downloads](https://img.shields.io/github/downloads/timmaurice/lovelace-rss-accordion/total?style=flat-square)](https://github.com/timmaurice/lovelace-rss-accordion/releases)
[![GH-last-commit](https://img.shields.io/github/last-commit/timmaurice/lovelace-rss-accordion.svg?style=flat-square)](https://github.com/timmaurice/lovelace-rss-accordion/commits/master)
[![GH-code-size](https://img.shields.io/github/languages/code-size/timmaurice/lovelace-rss-accordion.svg?color=red&style=flat-square)](https://github.com/timmaurice/lovelace-rss-accordion)
![GitHub](https://img.shields.io/github/license/timmaurice/lovelace-rss-accordion?style=flat-square)

A custom Lovelace card for Home Assistant to display RSS feed items from a sensor ([feedparser](https://github.com/custom-components/feedparser)) or event entity ([feedreader](https://www.home-assistant.io/integrations/feedreader/)) in an accordion style.

## Features

- Display items from a `sensor` entity _(like one from the Feed Parser integration)_ or an `event` entity _(like one from the core `feedreader` integration)_.
- Each item is displayed in a collapsible accordion.
- Option to only allow one item to be open at a time.
- "NEW" pill for articles published within the last 30 minutes.
- Visited articles are greyed out to easily distinguish them from unread ones.
- Option to open the first (latest) item on card load.
- Customizable number of items to display.

![RSS Accordion Card Screenshot](https://raw.githubusercontent.com/timmaurice/lovelace-rss-accordion/main/screenshot.png)

## Installation

### HACS (Recommended)

This card is available in the [Home Assistant Community Store (HACS)](https://hacs.xyz/).

<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=timmaurice&repository=lovelace-rss-accordion&category=plugin" target="_blank" rel="noreferrer noopener"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open a repository inside the Home Assistant Community Store." /></a>

### Manual Installation

1.  Download the `rss-accordion.js` file from the latest release.
2.  Place it in your `config/www` directory.
3.  Add the resource reference to your Lovelace configuration under `Settings` -> `Dashboards` -> `...` -> `Resources`.
    - URL: `/local/rss-accordion.js`
    - Resource Type: `JavaScript Module`

You can now add the card to your dashboard.

## Configuration

| Name                      | Type    | Default      | Description                                                                                             |
| ------------------------- | ------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| `type`                    | string  | **Required** | `custom:rss-accordion`                                                                                  |
| `entity`                  | string  | **Required** | The entity ID of your feed sensor or event.                                                             |
| `title`                   | string  | `''`         | The title of the card.                                                                                  |
| `max_items`               | number  | All items    | The maximum number of feed items to display.                                                            |
| `new_pill_duration_hours` | number  | `1`          | The duration in hours for which the "NEW" pill is shown on recent items.                                |
| `image_ratio`             | string  | `auto`       | The CSS `aspect-ratio` for item images (e.g., `16/9`, `1.77`). Images are cropped to fit.               |
| `image_fit_mode`          | string  | `cover`      | How the image should fit. `cover` (fill & crop) or `contain` (fit inside).                              |
| `initial_open`            | boolean | `false`      | If `true`, the first/newest item will be open by default when the card loads.                           |
| `allow_multiple`          | boolean | `false`      | If `true`, allows multiple accordion items to be open simultaneously.                                   |
| `strip_summary_images`    | boolean | `false`      | If `true`, removes `<img>` tags from the summary. Useful if the feed includes the image in the content. |

### Examples

```yaml
type: custom:rss-accordion
title: Home Assistant Blog
entity: sensor.home_assistant_blog_feed
max_items: 5
new_pill_duration_hours: 24
image_ratio: 16/9
image_fit_mode: cover
```

## Development

To contribute to the development, you'll need to set up a build environment.

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
    This command will watch for changes in the `src` directory and automatically rebuild the card.

    ```bash
    npm run watch
    ```

4.  In your Home Assistant instance, you will need to configure Lovelace to use the local development version of the card from `dist/rss-accordion.js`.

---

For further assistance or to [report issues](https://github.com/timmaurice/lovelace-rss-accordion/issues), please visit the [GitHub repository](https://github.com/timmaurice/lovelace-rss-accordion).
