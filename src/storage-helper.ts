import { FeedEntry, AudioProgress } from './types';

export class StorageHelper {
  private readonly audioStoragePrefix: string;
  private readonly bookmarkStoragePrefix: string;

  constructor(uniqueId: string) {
    // Use a uniqueId (like the entity_id) to namespace storage keys
    this.audioStoragePrefix = `rss-accordion-progress-${uniqueId}-`;
    this.bookmarkStoragePrefix = `rss-accordion-bookmark-${uniqueId}-`;
  }

  // --- Audio Progress Methods ---

  public getAudioProgress(audioUrl: string): AudioProgress | null {
    try {
      const data = localStorage.getItem(`${this.audioStoragePrefix}${audioUrl}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading audio progress from localStorage', e);
      return null;
    }
  }

  public setAudioProgress(audioUrl: string, progress: AudioProgress): void {
    try {
      localStorage.setItem(`${this.audioStoragePrefix}${audioUrl}`, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving audio progress to localStorage', e);
    }
  }

  // --- Bookmark Methods ---

  public getBookmarkKey(item: FeedEntry): string {
    // The GUID when the feed sends one: status feeds link every entry to one page,
    // and Atom entries often carry `updated` only.
    if (typeof item.id === 'string' && item.id) return item.id;
    return `${item.link}|${item.published ?? item.updated}`;
  }

  /** The key bookmarks were saved under before entries were keyed by id. */
  private _legacyBookmarkKey(item: FeedEntry): string {
    return `${item.link}|${item.published}`;
  }

  public isBookmarked(item: FeedEntry): boolean {
    try {
      return [this.getBookmarkKey(item), this._legacyBookmarkKey(item)].some(
        (key) => localStorage.getItem(`${this.bookmarkStoragePrefix}${key}`) !== null,
      );
    } catch (e) {
      // Blocked site data throws on every access; render the item unbookmarked.
      console.error('Error reading bookmark from localStorage', e);
      return false;
    }
  }

  public setBookmark(item: FeedEntry, bookmarked: boolean): void {
    const key = this.getBookmarkKey(item);
    try {
      if (bookmarked) {
        localStorage.setItem(`${this.bookmarkStoragePrefix}${key}`, JSON.stringify(item));
      } else {
        localStorage.removeItem(`${this.bookmarkStoragePrefix}${key}`);
        localStorage.removeItem(`${this.bookmarkStoragePrefix}${this._legacyBookmarkKey(item)}`);
      }
    } catch (e) {
      console.error('Error saving bookmark to localStorage', e);
    }
  }

  public getBookmarkedItems(): FeedEntry[] {
    const bookmarks: FeedEntry[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.bookmarkStoragePrefix)) {
          try {
            const item = JSON.parse(localStorage.getItem(key) as string);
            bookmarks.push(item);
          } catch (e) {
            console.error(`Error parsing bookmarked item from localStorage for key: ${key}`, e);
          }
        }
      }
    } catch (e) {
      console.error('Error reading bookmarks from localStorage', e);
    }
    return bookmarks;
  }
}
