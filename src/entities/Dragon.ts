import {
  DRAGON_START_X,
  DRAGON_START_Y,
  INVINCIBILITY_DURATION,
  TERMINAL_VELOCITY,
  FLAP_VELOCITY,
  GRAVITY,
} from '../config/constants';
import { GAME_HEIGHT } from '../config/constants';

export type AnimationState = 'idle' | 'flapping' | 'hit';

export class Dragon {
  x: number;
  y: number;
  velocityY: number;
  isInvincible: boolean;
  invincibilityTimer: number;
  animationState: AnimationState;

  readonly spriteHeight: number;

  constructor(spriteHeight = 32) {
    this.x = DRAGON_START_X;
    this.y = DRAGON_START_Y;
    this.velocityY = 0;
    this.isInvincible = false;
    this.invincibilityTimer = 0;
    this.animationState = 'idle';
    this.spriteHeight = spriteHeight;
  }

  flap(): void {
    this.velocityY = FLAP_VELOCITY;
    this.animationState = 'flapping';
  }

  stopFlap(): void {
    if (this.animationState === 'flapping') {
      this.animationState = 'idle';
    }
  }

  hit(): void {
    if (this.isInvincible) return;
    this.animationState = 'hit';
    this.isInvincible = true;
    this.invincibilityTimer = INVINCIBILITY_DURATION;
  }

  update(delta: number): void {
    // Apply gravity
    this.velocityY += GRAVITY * (delta / 1000);

    // Cap terminal velocity
    if (this.velocityY > TERMINAL_VELOCITY) {
      this.velocityY = TERMINAL_VELOCITY;
    }

    // Update position
    this.y += this.velocityY * (delta / 1000);

    // Clamp to screen boundaries
    if (this.y < 0) {
      this.y = 0;
      this.velocityY = 0;
    }
    const maxY = GAME_HEIGHT - this.spriteHeight;
    if (this.y > maxY) {
      this.y = maxY;
      this.velocityY = 0;
    }

    // Update invincibility
    if (this.isInvincible) {
      this.invincibilityTimer -= delta;
      if (this.invincibilityTimer <= 0) {
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        if (this.animationState === 'hit') {
          this.animationState = 'idle';
        }
      }
    }
  }

  isOnGround(): boolean {
    return this.y >= GAME_HEIGHT - this.spriteHeight;
  }

  reset(): void {
    this.y = DRAGON_START_Y;
    this.velocityY = 0;
    this.isInvincible = false;
    this.invincibilityTimer = 0;
    this.animationState = 'idle';
  }
}
