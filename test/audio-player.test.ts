import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BrowserAudioPlayer, getBrowserAudioPlayer } from '../src/audio-player';
import { mediaPlayerCanSeek, mediaPlayerState } from '../src/media-player-target';
import { StorageHelper } from '../src/storage-helper';
import { HassEntity } from '../src/types';
import { formatDuration, hasReadableText } from '../src/utils';
import { FakeAudio, createFakeAudio } from './fake-audio';

describe('BrowserAudioPlayer', () => {
  const url = 'https://example.com/e1.mp3';
  let audio: FakeAudio;
  let player: BrowserAudioPlayer;
  let storage: StorageHelper;

  const track = () => ({ url, title: 'Episode 1', storage });

  beforeEach(() => {
    localStorage.clear();
    audio = createFakeAudio();
    player = new BrowserAudioPlayer(audio.el);
    storage = new StorageHelper('sensor.test_feed');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resume a saved position once the episode has loaded', async () => {
    storage.setAudioProgress(url, { currentTime: 60, completed: false });
    await player.play(track());
    audio.el.dispatchEvent(new Event('loadedmetadata'));

    expect(audio.el.currentTime).toBe(60);
  });

  it('should start a completed episode from the top', async () => {
    storage.setAudioProgress(url, { currentTime: 120, completed: true });
    await player.play(track());
    audio.el.currentTime = 10;
    audio.el.dispatchEvent(new Event('loadedmetadata'));

    expect(audio.el.currentTime).toBe(10);
  });

  it('should save progress on a leading-edge throttle', async () => {
    vi.useFakeTimers();
    await player.play(track());
    audio.setDuration(600);

    audio.advanceTo(0);
    expect(storage.getAudioProgress(url)).toBeNull();

    audio.advanceTo(30);
    expect(storage.getAudioProgress(url)).toEqual({ currentTime: 30, completed: false, duration: 600 });

    audio.advanceTo(32);
    expect(storage.getAudioProgress(url)?.currentTime).toBe(30);

    vi.advanceTimersByTime(5001);
    audio.advanceTo(36);
    expect(storage.getAudioProgress(url)?.currentTime).toBe(36);
  });

  it('should mark the episode completed when it ends', async () => {
    await player.play(track());
    audio.el.dispatchEvent(new Event('ended'));

    const progress = storage.getAudioProgress(url);
    expect(progress?.completed).toBe(true);
    expect(progress?.currentTime).toBe(0);
    expect(typeof progress?.completedAt).toBe('string');
  });

  it('should resume rather than reload the episode it already has', async () => {
    await player.play(track());
    audio.el.currentTime = 90;
    player.pause();
    await player.play(track());

    expect(audio.el.currentTime).toBe(90);
    expect(player.state).toMatchObject({ url, playing: true, position: 90 });
  });

  it('should clamp a seek to the episode', async () => {
    await player.play(track());
    audio.setDuration(100);

    player.seek(500);
    expect(audio.el.currentTime).toBe(100);
    player.seek(-5);
    expect(audio.el.currentTime).toBe(0);
  });

  it('should be one player per page', () => {
    expect(getBrowserAudioPlayer()).toBe(getBrowserAudioPlayer());
  });
});

describe('mediaPlayerState', () => {
  const entity = (state: string, attributes: Record<string, unknown>): HassEntity =>
    ({ entity_id: 'media_player.kitchen', state, attributes }) as HassEntity;

  it('should extrapolate the position of a playing player', () => {
    const now = Date.parse('2026-01-01T12:00:10Z');
    const state = mediaPlayerState(
      entity('playing', {
        media_content_id: 'https://example.com/e1.mp3',
        media_position: 100,
        media_position_updated_at: '2026-01-01T12:00:00Z',
        media_duration: 600,
      }),
      now,
    );

    expect(state).toEqual({ url: 'https://example.com/e1.mp3', playing: true, position: 110, duration: 600 });
  });

  it('should not extrapolate a paused player, nor run past the end', () => {
    const now = Date.parse('2026-01-01T13:00:00Z');
    const attributes = { media_position: 100, media_position_updated_at: '2026-01-01T12:00:00Z', media_duration: 600 };

    expect(mediaPlayerState(entity('paused', attributes), now).position).toBe(100);
    expect(mediaPlayerState(entity('playing', attributes), now).position).toBe(600);
  });

  it('should read an absent player as idle', () => {
    expect(mediaPlayerState(undefined)).toEqual({ playing: false, position: 0, duration: 0 });
  });

  it('should read the seek feature bit', () => {
    expect(mediaPlayerCanSeek(entity('idle', { supported_features: 2 }))).toBe(true);
    expect(mediaPlayerCanSeek(entity('idle', { supported_features: 1 | 512 }))).toBe(false);
  });
});

describe('formatDuration', () => {
  it('should format minutes and hours', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(75.9)).toBe('1:15');
    expect(formatDuration(3725)).toBe('1:02:05');
    expect(formatDuration(NaN)).toBe('0:00');
  });
});

describe('hasReadableText', () => {
  it('should ignore tags, whitespace and ellipses', () => {
    expect(hasReadableText('<img src="a.jpg" />...')).toBe(false);
    expect(hasReadableText(' &hellip; … &nbsp;')).toBe(false);
    expect(hasReadableText(undefined)).toBe(false);
    expect(hasReadableText('<p>Hi</p>')).toBe(true);
  });
});
