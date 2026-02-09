import { describe, it, expect, beforeEach } from 'vitest';
import { PhysicsSystem } from '../../../src/systems/PhysicsSystem';
import { Dragon } from '../../../src/entities/Dragon';
import { FLAP_VELOCITY } from '../../../src/config/constants';

describe('PhysicsSystem', () => {
  let physics: PhysicsSystem;
  let dragon: Dragon;

  beforeEach(() => {
    physics = new PhysicsSystem();
    dragon = new Dragon(32);
  });

  describe('applyFlap', () => {
    it('sets dragon velocity to flap velocity', () => {
      physics.applyFlap(dragon);
      expect(dragon.velocityY).toBe(FLAP_VELOCITY);
    });

    it('changes animation to flapping', () => {
      physics.applyFlap(dragon);
      expect(dragon.animationState).toBe('flapping');
    });
  });

  describe('releaseFlap', () => {
    it('transitions dragon back to idle', () => {
      physics.applyFlap(dragon);
      physics.releaseFlap(dragon);
      expect(dragon.animationState).toBe('idle');
    });
  });

  describe('update', () => {
    it('delegates to dragon update', () => {
      const initialY = dragon.y;
      physics.update(dragon, 100);
      expect(dragon.y).not.toBe(initialY);
    });
  });
});
