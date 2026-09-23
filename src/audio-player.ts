import { StorageHelper } from './storage-helper';

export interface AudioTrack {
  url: string;
  title: string;
  artist?: string;
  artwork?: string;
  storage: StorageHelper;
}

export interface PlaybackState {
  url?: string;
  playing: boolean;
  position: number;
  duration: number;
}

export const PROGRESS_SAVE_INTERVAL_MS = 5000;

// Never inserted into the DOM, so it keeps playing when HA tears down the card.
export class BrowserAudioPlayer extends EventTarget {
  private readonly _audio: HTMLAudioElement;
  private _track?: AudioTrack;
  private _lastSave?: number;

  constructor(audio: HTMLAudioElement = new Audio()) {
    super();
    this._audio = audio;
    this._audio.preload = 'metadata';

    const notify = (): void => {
      this.dispatchEvent(new Event('change'));
    };
    for (const type of ['play', 'pause', 'durationchange', 'seeked', 'emptied']) {
      this._audio.addEventListener(type, notify);
    }
    this._audio.addEventListener('loadedmetadata', () => {
      this._restoreProgress();
      notify();
    });
    this._audio.addEventListener('timeupdate', () => {
      this._saveProgress();
      notify();
    });
    this._audio.addEventListener('ended', () => {
      this._markCompleted();
      notify();
    });
  }

  public get state(): PlaybackState {
    const duration = this._audio.duration;
    return {
      url: this._track?.url,
      playing: !!this._track && !this._audio.paused && !this._audio.ended,
      position: this._audio.currentTime || 0,
      duration: Number.isFinite(duration) ? duration : 0,
    };
  }

  public async play(track: AudioTrack): Promise<void> {
    if (this._track?.url !== track.url) {
      this._track = track;
      this._lastSave = undefined;
      this._audio.src = track.url;
    } else {
      this._track = track;
    }
    this._updateMediaSession();
    try {
      await this._audio.play();
    } catch (err) {
      console.warn('rss-accordion: playback failed', err);
    }
  }

  public pause(): void {
    this._audio.pause();
  }

  public seek(seconds: number): void {
    if (!this._track) return;
    const duration = this.state.duration;
    this._audio.currentTime = Math.max(0, duration ? Math.min(seconds, duration) : seconds);
    this._lastSave = undefined;
    this._saveProgress();
  }

  private _restoreProgress(): void {
    if (!this._track) return;
    const progress = this._track.storage.getAudioProgress(this._track.url);
    if (progress && !progress.completed && progress.currentTime > 0) {
      this._audio.currentTime = progress.currentTime;
    }
  }

  private _saveProgress(): void {
    if (!this._track) return;
    const now = Date.now();
    if (this._lastSave !== undefined && now - this._lastSave <= PROGRESS_SAVE_INTERVAL_MS) return;

    // Loading fires a timeupdate at 0 before the saved position is restored.
    if (this._audio.currentTime === 0) return;

    const { storage, url } = this._track;
    const progress = storage.getAudioProgress(url) || { currentTime: 0, completed: false };
    if (progress.completed) return;

    storage.setAudioProgress(url, {
      ...progress,
      currentTime: this._audio.currentTime,
      duration: this.state.duration || progress.duration,
    });
    this._lastSave = now;
  }

  private _markCompleted(): void {
    if (!this._track) return;
    const { storage, url } = this._track;
    const progress = storage.getAudioProgress(url) || { currentTime: 0, completed: false };
    storage.setAudioProgress(url, {
      ...progress,
      currentTime: 0,
      completed: true,
      completedAt: new Date().toISOString(),
    });
  }

  private _updateMediaSession(): void {
    if (!this._track || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    const session = navigator.mediaSession;
    if (typeof MediaMetadata !== 'undefined') {
      session.metadata = new MediaMetadata({
        title: this._track.title,
        artist: this._track.artist ?? '',
        artwork: this._track.artwork ? [{ src: this._track.artwork }] : [],
      });
    }
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ['play', () => void this._audio.play()],
      ['pause', () => this.pause()],
      ['seekbackward', (d) => this.seek(this.state.position - (d.seekOffset ?? 15))],
      ['seekforward', (d) => this.seek(this.state.position + (d.seekOffset ?? 30))],
      ['seekto', (d) => d.seekTime !== undefined && this.seek(d.seekTime)],
    ];
    for (const [action, handler] of handlers) {
      try {
        session.setActionHandler(action, handler);
      } catch {
        // Unsupported action.
      }
    }
  }
}

const PLAYER_KEY = Symbol.for('rss-accordion.audio-player');

/**
 * Returns the page-wide player, creating it on first use. It is keyed with
 * `Symbol.for`, so two copies of the bundle share one player.
 * @returns The shared browser audio player.
 */
export function getBrowserAudioPlayer(): BrowserAudioPlayer {
  const registry = window as unknown as Record<symbol, BrowserAudioPlayer | undefined>;
  return (registry[PLAYER_KEY] ??= new BrowserAudioPlayer());
}
