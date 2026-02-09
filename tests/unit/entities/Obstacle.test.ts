import { describe, it, expect } from 'vitest';
import { Obstacle } from '../../../src/entities/Obstacle';
import { MIN_GAP_SIZE, MAX_GAP_SIZE, MIN_BARRIER_HEIGHT, OBSTACLE_WIDTH } from '../../../src/config/constants';
import { GAME_HEIGHT } from '../../../src/config/constants';

describe('Obstacle', () => {
  describe('construction', () => {
    it('creates obstacle with given config', () => {
      const obstacle = new Obstacle({ spawnX: 500, gapY: 160, gapSize: 120, variant: 'stone' });
      expect(obstacle.x).toBe(500);
      expect(obstacle.gapSize).toBe(120);
      expect(obstacle.variant).toBe('stone');
      expect(obstacle.passed).toBe(false);
    });

    it('clamps gap size to minimum', () => {
      const obstacle = new Obstacle({ spawnX: 500, gapY: 160, gapSize: 10, variant: 'stone' });
      expect(obstacle.gapSize).toBe(MIN_GAP_SIZE);
    });

    it('clamps gap size to maximum', () => {
      const obstacle = new Obstacle({ spawnX: 500, gapY: 160, gapSize: 300, variant: 'stone' });
      expect(obstacle.gapSize).toBe(MAX_GAP_SIZE);
    });

    it('clamps gapY so top barrier is at least MIN_BARRIER_HEIGHT', () => {
      const obstacle = new Obstacle({ spawnX: 500, gapY: 10, gapSize: 100, variant: 'stone' });
      expect(obstacle.topBarrierBottom).toBeGreaterThanOrEqual(MIN_BARRIER_HEIGHT);
    });

    it('clamps gapY so bottom barrier is at least MIN_BARRIER_HEIGHT', () => {
      const obstacle = new Obstacle({ spawnX: 500, gapY: GAME_HEIGHT - 10, gapSize: 100, variant: 'stone' });
      expect(GAME_HEIGHT - obstacle.bottomBarrierTop).toBeGreaterThanOrEqual(MIN_BARRIER_HEIGHT);
    });
  });

  describe('barrier bounds', () => {
    it('calculates top and bottom barrier positions from gap', () => {
      const obstacle = new Obstacle({ spawnX: 500, gapY: 160, gapSize: 100, variant: 'stone' });
      expect(obstacle.topBarrierBottom).toBe(110);
      expect(obstacle.bottomBarrierTop).toBe(210);
    });
  });

  describe('update', () => {
    it('moves obstacle left by scroll speed', () => {
      const obstacle = new Obstacle({ spawnX: 500, gapY: 160, gapSize: 120, variant: 'stone' });
      obstacle.update(2);
      expect(obstacle.x).toBe(498);
    });
  });

  describe('isOffScreen', () => {
    it('returns true when fully past left edge', () => {
      const obstacle = new Obstacle({ spawnX: -OBSTACLE_WIDTH - 1, gapY: 160, gapSize: 120, variant: 'stone' });
      expect(obstacle.isOffScreen()).toBe(true);
    });

    it('returns false when still visible', () => {
      const obstacle = new Obstacle({ spawnX: 100, gapY: 160, gapSize: 120, variant: 'stone' });
      expect(obstacle.isOffScreen()).toBe(false);
    });
  });

  describe('overlapsX', () => {
    it('detects horizontal overlap', () => {
      const obstacle = new Obstacle({ spawnX: 100, gapY: 160, gapSize: 120, variant: 'stone' });
      expect(obstacle.overlapsX(90, 32)).toBe(true);
    });

    it('returns false when no overlap', () => {
      const obstacle = new Obstacle({ spawnX: 100, gapY: 160, gapSize: 120, variant: 'stone' });
      expect(obstacle.overlapsX(200, 32)).toBe(false);
    });
  });

  describe('isInGap', () => {
    it('returns true when entity is within gap', () => {
      const obstacle = new Obstacle({ spawnX: 100, gapY: 160, gapSize: 120, variant: 'stone' });
      expect(obstacle.isInGap(130, 32)).toBe(true);
    });

    it('returns false when entity touches top barrier', () => {
      const obstacle = new Obstacle({ spawnX: 100, gapY: 160, gapSize: 120, variant: 'stone' });
      expect(obstacle.isInGap(90, 32)).toBe(false);
    });

    it('returns false when entity touches bottom barrier', () => {
      const obstacle = new Obstacle({ spawnX: 100, gapY: 160, gapSize: 120, variant: 'stone' });
      expect(obstacle.isInGap(200, 32)).toBe(false);
    });
  });
});
