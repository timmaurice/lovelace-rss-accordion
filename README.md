# RSS Accordion Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=flat-square)](https://github.com/hacs/integration)
A custom Lovelace card for Home Assistant to display RSS feed items from a sensor ([feedparser](https://github.com/custom-components/feedparser)) or event entity ([feedreader](https://www.home-assistant.io/integrations/feedreader/)) in an accordion style.

## Features

- Display items from a `sensor` entity (like one from the Feed Parser integration) or an `event` entity (like one from the core `feedreader` integration).
- Each item is displayed in a collapsible accordion.
- Option to only allow one item to be open at a time.
- "NEW" pill for articles published within the last 30 minutes.
- Visited articles are greyed out to easily distinguish them from unread ones.
- Option to open the first (latest) item on card load.
- Customizable number of items to display.

## Installation

(Instructions to be added)

## Configuration

| Name                   | Type    | Default      | Description                                                    |
| ---------------------- | ------- | ------------ | -------------------------------------------------------------- |
| `type`                 | string  | **Required** | `custom:rss-accordion`                                         |
| `entity`               | string  | **Required** | The entity ID of your feed sensor or event.                    |
| `title`                | string  | `''`         | The title of the card.                                         |
| `max_items`            | number  | `all`        | The maximum number of feed items to display.                   |
| `allow_multiple`       | boolean | `false`      | If `true`, allows multiple accordion items to be open at once. |
| `strip_summary_images` | boolean | `false`      | If `true`, removes `<img>` tags from the item summary.         |
| `initial_open`         | boolean | `false`      | If `true`, the first (latest) item will be open on load.       |
| `new_pill_duration_minutes` | number | `30` | The duration in minutes for which the "NEW" pill is shown. |

### Examples

```yaml
type: custom:rss-accordion
title: Home Assistant Blog
entity: sensor.home_assistant_blog_feed
max_items: 5
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

For further assistance or to report issues, please visit the GitHub repository.
