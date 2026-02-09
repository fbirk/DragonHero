import { MIN_GAP_SIZE, MAX_GAP_SIZE, MIN_BARRIER_HEIGHT, OBSTACLE_WIDTH } from '../config/constants';
import { GAME_HEIGHT } from '../config/constants';

export interface ObstacleConfig {
  spawnX: number;
  gapY: number;
  gapSize: number;
  variant: string;
}

export class Obstacle {
  x: number;
  readonly gapY: number;
  readonly gapSize: number;
  readonly variant: string;
  passed: boolean;

  constructor(config: ObstacleConfig) {
    this.x = config.spawnX;
    this.gapY = this.clampGapY(config.gapY, config.gapSize);
    this.gapSize = this.clampGapSize(config.gapSize);
    this.variant = config.variant;
    this.passed = false;
  }

  private clampGapSize(size: number): number {
    return Math.max(MIN_GAP_SIZE, Math.min(MAX_GAP_SIZE, size));
  }

  private clampGapY(gapY: number, gapSize: number): number {
    const halfGap = gapSize / 2;
    const minY = MIN_BARRIER_HEIGHT + halfGap;
    const maxY = GAME_HEIGHT - MIN_BARRIER_HEIGHT - halfGap;
    return Math.max(minY, Math.min(maxY, gapY));
  }

  get topBarrierBottom(): number {
    return this.gapY - this.gapSize / 2;
  }

  get bottomBarrierTop(): number {
    return this.gapY + this.gapSize / 2;
  }

  get width(): number {
    return OBSTACLE_WIDTH;
  }

  update(scrollSpeed: number): void {
    this.x -= scrollSpeed;
  }

  isOffScreen(): boolean {
    return this.x < -this.width;
  }

  overlapsX(entityX: number, entityWidth: number): boolean {
    return entityX + entityWidth > this.x && entityX < this.x + this.width;
  }

  isInGap(entityY: number, entityHeight: number): boolean {
    return entityY > this.topBarrierBottom && entityY + entityHeight < this.bottomBarrierTop;
  }
}
