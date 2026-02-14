import { Obstacle, ObstacleConfig } from '../entities/Obstacle';
import { BASE_SCROLL_SPEED } from '../config/constants';
import { getGameWidth } from '../config/resolution';

export interface LevelConfig {
  id: string;
  totalLength: number;
  scrollSpeed: number;
  backgroundTheme: string;
  obstacles: ObstacleConfig[];
}

export class ScrollSystem {
  private scrollProgress: number = 0;
  private activeObstacles: Obstacle[] = [];
  private spawnIndex: number = 0;
  private levelConfig: LevelConfig | null = null;

  get progress(): number {
    return this.scrollProgress;
  }

  get obstacles(): Obstacle[] {
    return this.activeObstacles;
  }

  get currentSpeed(): number {
    return this.levelConfig?.scrollSpeed ?? BASE_SCROLL_SPEED;
  }

  loadLevel(config: LevelConfig): void {
    this.levelConfig = config;
    this.scrollProgress = 0;
    this.activeObstacles = [];
    this.spawnIndex = 0;
  }

  update(): void {
    if (!this.levelConfig) return;

    const speed = this.levelConfig.scrollSpeed;
    this.scrollProgress += speed;

    // Spawn obstacles that should now be visible
    while (
      this.spawnIndex < this.levelConfig.obstacles.length &&
      this.levelConfig.obstacles[this.spawnIndex].spawnX <= this.scrollProgress + getGameWidth()
    ) {
      const config = this.levelConfig.obstacles[this.spawnIndex];
      const obstacle = new Obstacle({
        ...config,
        spawnX: config.spawnX - this.scrollProgress + getGameWidth(),
      });
      this.activeObstacles.push(obstacle);
      this.spawnIndex++;
    }

    // Move and cleanup obstacles
    for (const obstacle of this.activeObstacles) {
      obstacle.update(speed);
    }
    this.activeObstacles = this.activeObstacles.filter((o) => !o.isOffScreen());
  }

  isLevelComplete(): boolean {
    if (!this.levelConfig) return false;
    return this.scrollProgress >= this.levelConfig.totalLength;
  }

  getProgressRatio(): number {
    if (!this.levelConfig) return 0;
    return Math.min(1, this.scrollProgress / this.levelConfig.totalLength);
  }

  reset(): void {
    this.scrollProgress = 0;
    this.activeObstacles = [];
    this.spawnIndex = 0;
  }
}
