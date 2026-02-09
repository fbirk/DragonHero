import { Dragon } from '../entities/Dragon';
import { Obstacle } from '../entities/Obstacle';

export interface CollisionResult {
  hitObstacle: boolean;
  hitGround: boolean;
}

export class CollisionSystem {
  checkCollision(dragon: Dragon, obstacle: Obstacle, dragonWidth: number): CollisionResult {
    const result: CollisionResult = { hitObstacle: false, hitGround: false };

    if (dragon.isInvincible) return result;

    if (obstacle.overlapsX(dragon.x, dragonWidth)) {
      if (!obstacle.isInGap(dragon.y, dragon.spriteHeight)) {
        result.hitObstacle = true;
      }
    }

    return result;
  }

  checkGroundCollision(dragon: Dragon): boolean {
    if (dragon.isInvincible) return false;
    return dragon.isOnGround();
  }

  handleHit(dragon: Dragon): void {
    dragon.hit();
  }
}
