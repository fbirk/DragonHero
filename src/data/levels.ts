import type { LevelConfig } from '../systems/ScrollSystem';
import { LEVEL_1_LENGTH, BASE_SCROLL_SPEED } from '../config/constants';

function generateLevel1Obstacles() {
  const obstacles = [];
  const spacing = 400;
  const count = 18;

  for (let i = 0; i < count; i++) {
    const spawnX = 600 + i * spacing;
    // Vary gap position between 100 and 220 (within 320 height)
    const gapY = 100 + Math.sin(i * 0.7) * 60 + (i % 3) * 20;
    // Gradually decrease gap size for difficulty curve
    const gapSize = 140 - i * 3;

    obstacles.push({
      spawnX,
      gapY: Math.round(gapY),
      gapSize: Math.max(90, Math.round(gapSize)),
      variant: i % 2 === 0 ? 'stone' : 'vine',
    });
  }

  return obstacles;
}

export const LEVEL_1: LevelConfig = {
  id: 'level-1',
  totalLength: LEVEL_1_LENGTH,
  scrollSpeed: BASE_SCROLL_SPEED,
  backgroundTheme: 'fantasy-forest',
  obstacles: generateLevel1Obstacles(),
};

export const LEVELS: Record<string, LevelConfig> = {
  'level-1': LEVEL_1,
};
