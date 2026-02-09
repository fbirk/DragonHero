import { describe, it, expect, beforeEach } from 'vitest';
import { CollisionSystem } from '../../../src/systems/CollisionSystem';
import { Dragon } from '../../../src/entities/Dragon';
import { Obstacle } from '../../../src/entities/Obstacle';
import { GAME_HEIGHT } from '../../../src/config/constants';

describe('CollisionSystem', () => {
  let collision: CollisionSystem;
  let dragon: Dragon;
  const DRAGON_WIDTH = 32;
  const SPRITE_HEIGHT = 32;

  beforeEach(() => {
    collision = new CollisionSystem();
    dragon = new Dragon(SPRITE_HEIGHT);
  });

  describe('checkCollision', () => {
    it('detects hit when dragon overlaps obstacle outside gap', () => {
      dragon.x = 100;
      dragon.y = 50; // above gap
      const obstacle = new Obstacle({ spawnX: 110, gapY: 160, gapSize: 120, variant: 'stone' });
      const result = collision.checkCollision(dragon, obstacle, DRAGON_WIDTH);
      expect(result.hitObstacle).toBe(true);
    });

    it('returns no hit when dragon is in the gap', () => {
      dragon.x = 100;
      dragon.y = 145; // within gap (gapY=160, gapSize=120 -> gap from 100 to 220)
      const obstacle = new Obstacle({ spawnX: 110, gapY: 160, gapSize: 120, variant: 'stone' });
      const result = collision.checkCollision(dragon, obstacle, DRAGON_WIDTH);
      expect(result.hitObstacle).toBe(false);
    });

    it('returns no hit when dragon is not overlapping horizontally', () => {
      dragon.x = 10;
      dragon.y = 50;
      const obstacle = new Obstacle({ spawnX: 200, gapY: 160, gapSize: 120, variant: 'stone' });
      const result = collision.checkCollision(dragon, obstacle, DRAGON_WIDTH);
      expect(result.hitObstacle).toBe(false);
    });

    it('ignores collision when dragon is invincible', () => {
      dragon.x = 100;
      dragon.y = 50;
      dragon.hit(); // make invincible
      const obstacle = new Obstacle({ spawnX: 110, gapY: 160, gapSize: 120, variant: 'stone' });
      const result = collision.checkCollision(dragon, obstacle, DRAGON_WIDTH);
      expect(result.hitObstacle).toBe(false);
    });
  });

  describe('checkGroundCollision', () => {
    it('detects ground collision when dragon is at bottom', () => {
      dragon.y = GAME_HEIGHT - SPRITE_HEIGHT;
      expect(collision.checkGroundCollision(dragon)).toBe(true);
    });

    it('returns false when dragon is airborne', () => {
      dragon.y = 100;
      expect(collision.checkGroundCollision(dragon)).toBe(false);
    });

    it('ignores ground collision when invincible', () => {
      dragon.y = GAME_HEIGHT - SPRITE_HEIGHT;
      dragon.hit();
      expect(collision.checkGroundCollision(dragon)).toBe(false);
    });
  });

  describe('handleHit', () => {
    it('activates dragon invincibility', () => {
      collision.handleHit(dragon);
      expect(dragon.isInvincible).toBe(true);
      expect(dragon.animationState).toBe('hit');
    });
  });
});
