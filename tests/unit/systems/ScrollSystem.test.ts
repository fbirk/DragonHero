import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../../src/config/resolution', () => ({
  getGameWidth: () => 480,
}));

import { ScrollSystem, type LevelConfig } from '../../../src/systems/ScrollSystem';

describe('ScrollSystem', () => {
  let scroll: ScrollSystem;

  const testLevel: LevelConfig = {
    id: 'test-level',
    totalLength: 1000,
    scrollSpeed: 2,
    backgroundTheme: 'forest',
    obstacles: [
      { spawnX: 300, gapY: 160, gapSize: 120, variant: 'stone' as const },
      { spawnX: 600, gapY: 140, gapSize: 100, variant: 'vine' as const },
      { spawnX: 900, gapY: 180, gapSize: 110, variant: 'stone' as const },
    ],
  };

  beforeEach(() => {
    scroll = new ScrollSystem();
  });

  describe('loadLevel', () => {
    it('initializes state from level config', () => {
      scroll.loadLevel(testLevel);
      expect(scroll.progress).toBe(0);
      expect(scroll.obstacles).toHaveLength(0);
      expect(scroll.currentSpeed).toBe(2);
    });
  });

  describe('update', () => {
    it('advances scroll progress by speed each update', () => {
      scroll.loadLevel(testLevel);
      scroll.update();
      expect(scroll.progress).toBe(2);
      scroll.update();
      expect(scroll.progress).toBe(4);
    });

    it('spawns obstacles when they enter the viewport', () => {
      scroll.loadLevel(testLevel);
      // First obstacle at spawnX=300, viewport is 480 wide
      // It spawns when scrollProgress + 480 >= 300, so immediately (0 + 480 >= 300)
      scroll.update();
      expect(scroll.obstacles.length).toBeGreaterThanOrEqual(1);
    });

    it('does not spawn obstacles before they reach viewport', () => {
      const farLevel: LevelConfig = {
        ...testLevel,
        obstacles: [
          { spawnX: 2000, gapY: 160, gapSize: 120, variant: 'stone' as const },
        ],
      };
      scroll.loadLevel(farLevel);
      scroll.update();
      expect(scroll.obstacles).toHaveLength(0);
    });

    it('moves obstacles to the left each update', () => {
      scroll.loadLevel(testLevel);
      scroll.update();
      const firstObstacleX = scroll.obstacles[0].x;
      scroll.update();
      expect(scroll.obstacles[0].x).toBeLessThan(firstObstacleX);
    });

    it('removes obstacles that go off screen', () => {
      scroll.loadLevel({
        ...testLevel,
        obstacles: [
          { spawnX: 0, gapY: 160, gapSize: 120, variant: 'stone' as const },
        ],
      });
      scroll.update();
      expect(scroll.obstacles.length).toBe(1);

      // Move enough for obstacle to go off screen (x < -width)
      for (let i = 0; i < 400; i++) {
        scroll.update();
      }
      expect(scroll.obstacles.length).toBe(0);
    });

    it('does nothing when no level is loaded', () => {
      scroll.update();
      expect(scroll.progress).toBe(0);
      expect(scroll.obstacles).toHaveLength(0);
    });
  });

  describe('isLevelComplete', () => {
    it('returns false when progress is less than totalLength', () => {
      scroll.loadLevel(testLevel);
      expect(scroll.isLevelComplete()).toBe(false);
    });

    it('returns true when scroll progress reaches totalLength', () => {
      scroll.loadLevel(testLevel);
      // totalLength=1000, speed=2 -> 500 updates to complete
      for (let i = 0; i < 500; i++) {
        scroll.update();
      }
      expect(scroll.isLevelComplete()).toBe(true);
    });

    it('returns false when no level is loaded', () => {
      expect(scroll.isLevelComplete()).toBe(false);
    });
  });

  describe('getProgressRatio', () => {
    it('returns 0 at start', () => {
      scroll.loadLevel(testLevel);
      expect(scroll.getProgressRatio()).toBe(0);
    });

    it('returns correct ratio mid-level', () => {
      scroll.loadLevel(testLevel);
      // 250 updates * speed 2 = 500 progress -> 500/1000 = 0.5
      for (let i = 0; i < 250; i++) {
        scroll.update();
      }
      expect(scroll.getProgressRatio()).toBeCloseTo(0.5);
    });

    it('caps at 1.0', () => {
      scroll.loadLevel(testLevel);
      for (let i = 0; i < 600; i++) {
        scroll.update();
      }
      expect(scroll.getProgressRatio()).toBe(1);
    });

    it('returns 0 when no level is loaded', () => {
      expect(scroll.getProgressRatio()).toBe(0);
    });
  });

  describe('reset', () => {
    it('resets scroll state', () => {
      scroll.loadLevel(testLevel);
      for (let i = 0; i < 10; i++) {
        scroll.update();
      }
      scroll.reset();
      expect(scroll.progress).toBe(0);
      expect(scroll.obstacles).toHaveLength(0);
    });
  });
});
