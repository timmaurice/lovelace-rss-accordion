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
    // Use a combination of link and published date for a more robust key
    return `${item.link}|${item.published}`;
  }

  public isBookmarked(item: FeedEntry): boolean {
    const key = this.getBookmarkKey(item);
    return localStorage.getItem(`${this.bookmarkStoragePrefix}${key}`) !== null;
  }

  public setBookmark(item: FeedEntry, bookmarked: boolean): void {
    const key = this.getBookmarkKey(item);
    if (bookmarked) {
      localStorage.setItem(`${this.bookmarkStoragePrefix}${key}`, JSON.stringify(item));
    } else {
      localStorage.removeItem(`${this.bookmarkStoragePrefix}${key}`);
    }
  }

  public getBookmarkedItems(): FeedEntry[] {
    const bookmarks: FeedEntry[] = [];
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
    return bookmarks;
  }
}
