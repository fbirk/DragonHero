import { MIN_GAME_WIDTH, MAX_GAME_WIDTH, GAME_HEIGHT } from './constants';

let resolvedWidth: number = MIN_GAME_WIDTH;

export function initResolution(): void {
  if (typeof window === 'undefined') {
    resolvedWidth = MIN_GAME_WIDTH;
    return;
  }

  const innerW = window.innerWidth;
  const innerH = window.innerHeight;

  // Use landscape dimensions (wider axis as width)
  const screenW = Math.max(innerW, innerH);
  const screenH = Math.min(innerW, innerH);

  const aspectRatio = screenW / screenH;
  const calculated = Math.round(GAME_HEIGHT * aspectRatio);

  resolvedWidth = Math.max(MIN_GAME_WIDTH, Math.min(MAX_GAME_WIDTH, calculated));
}

export function getGameWidth(): number {
  return resolvedWidth;
}
