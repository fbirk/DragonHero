import { describe, it, expect, beforeEach } from 'vitest';
import { Dragon } from '../../../src/entities/Dragon';
import { FLAP_VELOCITY, GRAVITY, TERMINAL_VELOCITY, INVINCIBILITY_DURATION } from '../../../src/config/constants';
import { GAME_HEIGHT } from '../../../src/config/constants';

describe('Dragon', () => {
  let dragon: Dragon;
  const SPRITE_HEIGHT = 32;

  beforeEach(() => {
    dragon = new Dragon(SPRITE_HEIGHT);
  });

  describe('construction', () => {
    it('initializes at default position with zero velocity', () => {
      expect(dragon.velocityY).toBe(0);
      expect(dragon.isInvincible).toBe(false);
      expect(dragon.invincibilityTimer).toBe(0);
      expect(dragon.animationState).toBe('idle');
    });
  });

  describe('flap', () => {
    it('sets velocity to flap velocity and animation to flapping', () => {
      dragon.flap();
      expect(dragon.velocityY).toBe(FLAP_VELOCITY);
      expect(dragon.animationState).toBe('flapping');
    });
  });

  describe('stopFlap', () => {
    it('transitions from flapping to idle', () => {
      dragon.flap();
      dragon.stopFlap();
      expect(dragon.animationState).toBe('idle');
    });

    it('does not change state if not flapping', () => {
      dragon.hit();
      dragon.stopFlap();
      expect(dragon.animationState).toBe('hit');
    });
  });

  describe('hit', () => {
    it('activates invincibility and sets hit animation', () => {
      dragon.hit();
      expect(dragon.isInvincible).toBe(true);
      expect(dragon.invincibilityTimer).toBe(INVINCIBILITY_DURATION);
      expect(dragon.animationState).toBe('hit');
    });

    it('ignores hit when already invincible', () => {
      dragon.hit();
      dragon.invincibilityTimer = 500;
      dragon.hit();
      expect(dragon.invincibilityTimer).toBe(500);
    });
  });

  describe('update', () => {
    it('applies gravity to velocity', () => {
      const delta = 16; // ~60fps
      dragon.update(delta);
      const expectedVelocity = GRAVITY * (delta / 1000);
      expect(dragon.velocityY).toBeCloseTo(expectedVelocity, 1);
    });

    it('caps velocity at terminal velocity', () => {
      dragon.velocityY = TERMINAL_VELOCITY - 1;
      dragon.update(100);
      expect(dragon.velocityY).toBeLessThanOrEqual(TERMINAL_VELOCITY);
    });

    it('clamps y position to top boundary', () => {
      dragon.y = -10;
      dragon.velocityY = -100;
      dragon.update(16);
      expect(dragon.y).toBeGreaterThanOrEqual(0);
    });

    it('clamps y position to bottom boundary', () => {
      dragon.y = GAME_HEIGHT;
      dragon.velocityY = 100;
      dragon.update(16);
      expect(dragon.y).toBeLessThanOrEqual(GAME_HEIGHT - SPRITE_HEIGHT);
    });

    it('counts down invincibility timer', () => {
      dragon.hit();
      dragon.update(500);
      expect(dragon.invincibilityTimer).toBe(INVINCIBILITY_DURATION - 500);
    });

    it('ends invincibility when timer expires', () => {
      dragon.hit();
      dragon.update(INVINCIBILITY_DURATION + 100);
      expect(dragon.isInvincible).toBe(false);
      expect(dragon.animationState).toBe('idle');
    });
  });

  describe('isOnGround', () => {
    it('returns true when at bottom boundary', () => {
      dragon.y = GAME_HEIGHT - SPRITE_HEIGHT;
      expect(dragon.isOnGround()).toBe(true);
    });

    it('returns false when above ground', () => {
      dragon.y = 100;
      expect(dragon.isOnGround()).toBe(false);
    });
  });

  describe('reset', () => {
    it('resets all state to defaults', () => {
      dragon.y = 200;
      dragon.velocityY = 300;
      dragon.hit();
      dragon.reset();
      expect(dragon.velocityY).toBe(0);
      expect(dragon.isInvincible).toBe(false);
      expect(dragon.animationState).toBe('idle');
    });
  });
});
