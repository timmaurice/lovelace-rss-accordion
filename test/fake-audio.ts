import { vi } from 'vitest';
import { BrowserAudioPlayer } from '../src/audio-player';

export interface FakeAudio {
  el: HTMLAudioElement;
  setDuration(seconds: number): void;
  advanceTo(seconds: number): void;
}

// JSDOM has no media stack; this scripts what the player reads.
export function createFakeAudio(): FakeAudio {
  const el = document.createElement('audio');
  let paused = true;
  let currentTime = 0;
  let duration = NaN;

  Object.defineProperties(el, {
    paused: { configurable: true, get: () => paused },
    ended: { configurable: true, get: () => false },
    currentTime: {
      configurable: true,
      get: () => currentTime,
      set: (value: number) => {
        currentTime = value;
      },
    },
    duration: { configurable: true, get: () => duration },
  });
  el.play = vi.fn(async () => {
    paused = false;
    el.dispatchEvent(new Event('play'));
  });
  el.pause = vi.fn(() => {
    paused = true;
    el.dispatchEvent(new Event('pause'));
  });

  return {
    el,
    setDuration(seconds: number) {
      duration = seconds;
      el.dispatchEvent(new Event('durationchange'));
    },
    advanceTo(seconds: number) {
      currentTime = seconds;
      el.dispatchEvent(new Event('timeupdate'));
    },
  };
}

const PLAYER_KEY = Symbol.for('rss-accordion.audio-player');

export function installFakePlayer(): { player: BrowserAudioPlayer; audio: FakeAudio } {
  const audio = createFakeAudio();
  const player = new BrowserAudioPlayer(audio.el);
  (window as unknown as Record<symbol, unknown>)[PLAYER_KEY] = player;
  return { player, audio };
}
