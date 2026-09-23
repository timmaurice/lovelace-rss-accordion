import { HassEntity } from './types';
import { PlaybackState } from './audio-player';

const SUPPORT_SEEK = 2;

/**
 * Reads what a `media_player` entity is playing. HA reports the position only on
 * state changes, so a playing position is extrapolated to `now`.
 * @param stateObj The media player entity, if it exists.
 * @param now The time to extrapolate to, in milliseconds.
 * @returns The playback state; `url` is the entity's `media_content_id`.
 */
export function mediaPlayerState(stateObj: HassEntity | undefined, now = Date.now()): PlaybackState {
  if (!stateObj) return { playing: false, position: 0, duration: 0 };

  const attributes = stateObj.attributes;
  const playing = stateObj.state === 'playing';
  const duration = Number(attributes.media_duration) || 0;
  let position = Number(attributes.media_position) || 0;

  const updatedAt = Date.parse(attributes.media_position_updated_at as string);
  if (playing && Number.isFinite(updatedAt)) {
    position += Math.max(0, (now - updatedAt) / 1000);
  }
  if (duration) position = Math.min(position, duration);

  return {
    url: attributes.media_content_id as string | undefined,
    playing,
    position,
    duration,
  };
}

/**
 * Checks the entity's SEEK feature bit.
 * @param stateObj The media player entity, if it exists.
 * @returns Whether the entity advertises seeking.
 */
export function mediaPlayerCanSeek(stateObj: HassEntity | undefined): boolean {
  return ((Number(stateObj?.attributes.supported_features) || 0) & SUPPORT_SEEK) !== 0;
}

/**
 * Checks whether the entity can take a command.
 * @param stateObj The media player entity, if it exists.
 * @returns False when the entity is missing, `unavailable` or `unknown`.
 */
export function mediaPlayerAvailable(stateObj: HassEntity | undefined): boolean {
  return !!stateObj && stateObj.state !== 'unavailable' && stateObj.state !== 'unknown';
}
