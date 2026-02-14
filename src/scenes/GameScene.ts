import Phaser from 'phaser';
import { Dragon } from '../entities/Dragon';
import { PhysicsSystem } from '../systems/PhysicsSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ScrollSystem } from '../systems/ScrollSystem';
import { LEVELS } from '../data/levels';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  MAX_LIVES,
  HEART_SIZE,
  HEART_SPACING,
  HEART_MARGIN_TOP,
  HEART_MARGIN_LEFT,
  INVINCIBILITY_FLASH_INTERVAL,
  COLORS,
  PARALLAX_FAR,
  PARALLAX_MID,
  PARALLAX_NEAR,
  DRAGON_START_X,
} from '../config/constants';

export interface GameSceneData {
  levelId: string;
  lives: number;
  isRetry: boolean;
}

export class GameScene extends Phaser.Scene {
  private dragon!: Dragon;
  private dragonSprite!: Phaser.GameObjects.Sprite;
  private physicsSystem!: PhysicsSystem;
  private collision!: CollisionSystem;
  private scroll!: ScrollSystem;
  private lives: number = MAX_LIVES;
  private heartImages: Phaser.GameObjects.Image[] = [];
  private obstacleSprites: Map<number, Phaser.GameObjects.TileSprite[]> = new Map();
  private bgFar!: Phaser.GameObjects.TileSprite;
  private bgMid!: Phaser.GameObjects.TileSprite;
  private bgNear!: Phaser.GameObjects.TileSprite;
  private isPaused: boolean = false;
  private pauseOverlay!: Phaser.GameObjects.Rectangle;
  private pauseText!: Phaser.GameObjects.Text;
  private levelId: string = 'level-1';
  private flashTimer: number = 0;
  private obstacleIdCounter: number = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: GameSceneData): void {
    this.levelId = data?.levelId || 'level-1';
    this.lives = data?.lives || MAX_LIVES;
  }

  create(): void {
    // Init systems
    this.dragon = new Dragon(32);
    this.physicsSystem = new PhysicsSystem();
    this.collision = new CollisionSystem();
    this.scroll = new ScrollSystem();
    this.obstacleSprites = new Map();
    this.obstacleIdCounter = 0;
    this.flashTimer = 0;
    this.isPaused = false;

    // Load level
    const levelConfig = LEVELS[this.levelId];
    if (levelConfig) {
      this.scroll.loadLevel(levelConfig);
    }

    // Parallax backgrounds
    this.bgFar = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg-far');
    this.bgFar.setOrigin(0, 0);
    this.bgMid = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg-mid');
    this.bgMid.setOrigin(0, 0);
    this.bgMid.setAlpha(0.7);
    this.bgNear = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg-near');
    this.bgNear.setOrigin(0, 0);
    this.bgNear.setAlpha(0.5);

    // Dragon sprite
    this.dragonSprite = this.add.sprite(DRAGON_START_X, this.dragon.y, 'a-dragon', 'flying_0');
    this.dragonSprite.setDisplaySize(32, 24);

    // Lives HUD
    this.heartImages = [];
    for (let i = 0; i < MAX_LIVES; i++) {
      const x = HEART_MARGIN_LEFT + i * (HEART_SIZE + HEART_SPACING);
      const heart = this.add.image(x, HEART_MARGIN_TOP, 'heart-full');
      heart.setOrigin(0, 0);
      heart.setDisplaySize(HEART_SIZE, HEART_SIZE);
      this.heartImages.push(heart);
    }
    this.updateHeartsDisplay();

    // Touch input
    this.input.on('pointerdown', () => {
      if (this.isPaused) return;
      this.physicsSystem.applyFlap(this.dragon);
    });

    this.input.on('pointerup', () => {
      if (this.isPaused) return;
      this.physicsSystem.releaseFlap(this.dragon);
    });

    // Pause overlay (hidden initially)
    this.pauseOverlay = this.add.rectangle(
      GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6,
    );
    this.pauseOverlay.setVisible(false);
    this.pauseOverlay.setDepth(100);

    this.pauseText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'PAUSED', {
      fontSize: '24px',
      color: COLORS.text,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    this.pauseText.setOrigin(0.5, 0.5);
    this.pauseText.setVisible(false);
    this.pauseText.setDepth(101);

    // Visibility change (app background)
    this.game.events.on('hidden', () => this.pauseGame());
    this.game.events.on('visible', () => this.resumeGame());
  }

  update(_time: number, delta: number): void {
    if (this.isPaused) return;

    // Update physics
    this.physicsSystem.update(this.dragon, delta);

    // Update scrolling
    const speed = this.scroll.currentSpeed;
    this.scroll.update();

    // Parallax
    this.bgFar.tilePositionX += speed * PARALLAX_FAR;
    this.bgMid.tilePositionX += speed * PARALLAX_MID;
    this.bgNear.tilePositionX += speed * PARALLAX_NEAR;

    // Sync dragon sprite
    this.dragonSprite.setY(this.dragon.y + 16); // center offset

    // Update dragon animation based on state
    if (this.dragon.animationState === 'flapping') {
      if (!this.dragonSprite.anims.isPlaying || this.dragonSprite.anims.currentAnim?.key !== 'dragon-flap') {
        this.dragonSprite.play('dragon-flap');
      }
    } else if (this.dragon.animationState === 'hit') {
      this.dragonSprite.play('dragon-hit');
    } else {
      if (!this.dragonSprite.anims.isPlaying || this.dragonSprite.anims.currentAnim?.key !== 'dragon-idle') {
        this.dragonSprite.play('dragon-idle');
      }
    }

    // Invincibility flash
    if (this.dragon.isInvincible) {
      this.flashTimer += delta;
      if (this.flashTimer >= INVINCIBILITY_FLASH_INTERVAL) {
        this.flashTimer = 0;
        this.dragonSprite.setVisible(!this.dragonSprite.visible);
      }
    } else {
      this.dragonSprite.setVisible(true);
      this.flashTimer = 0;
    }

    // Manage obstacle sprites
    this.syncObstacleSprites();

    // Collision checks
    for (const obstacle of this.scroll.obstacles) {
      const result = this.collision.checkCollision(this.dragon, obstacle, 32);
      if (result.hitObstacle) {
        this.handleLifeLoss();
        break;
      }
      // Mark passed
      if (!obstacle.passed && obstacle.x + obstacle.width < this.dragon.x) {
        obstacle.passed = true;
      }
    }

    // Ground collision
    if (this.collision.checkGroundCollision(this.dragon)) {
      this.handleLifeLoss();
    }

    // Level complete
    if (this.scroll.isLevelComplete()) {
      this.scene.start('EndingScene', { levelId: this.levelId });
    }
  }

  private syncObstacleSprites(): void {
    const activeIds = new Set<number>();

    for (let i = 0; i < this.scroll.obstacles.length; i++) {
      const obstacle = this.scroll.obstacles[i];
      const id = (obstacle as unknown as { _spriteId?: number })._spriteId ??
        ((obstacle as unknown as { _spriteId: number })._spriteId = this.obstacleIdCounter++);
      activeIds.add(id);

      if (!this.obstacleSprites.has(id)) {
        const variant = obstacle.variant === 'vine' ? 'obstacle-vine' : 'obstacle-stone';

        // Top barrier
        const topHeight = obstacle.topBarrierBottom;
        const top = this.add.tileSprite(obstacle.x, 0, obstacle.width, topHeight, variant);
        top.setOrigin(0, 0);

        // Bottom barrier
        const bottomY = obstacle.bottomBarrierTop;
        const bottomHeight = GAME_HEIGHT - bottomY;
        const bottom = this.add.tileSprite(obstacle.x, bottomY, obstacle.width, bottomHeight, variant);
        bottom.setOrigin(0, 0);

        this.obstacleSprites.set(id, [top, bottom]);
      } else {
        const [top, bottom] = this.obstacleSprites.get(id)!;
        top.setX(obstacle.x);
        bottom.setX(obstacle.x);
      }
    }

    // Remove sprites for obstacles no longer active
    for (const [id, sprites] of this.obstacleSprites) {
      if (!activeIds.has(id)) {
        sprites.forEach((s) => s.destroy());
        this.obstacleSprites.delete(id);
      }
    }
  }

  private handleLifeLoss(): void {
    if (this.dragon.isInvincible) return;

    this.lives--;
    this.collision.handleHit(this.dragon);
    this.updateHeartsDisplay();

    if (this.lives <= 0) {
      this.scene.start('GameOverScene', {
        levelId: this.levelId,
        scrollProgress: this.scroll.progress,
      });
    }
  }

  private updateHeartsDisplay(): void {
    for (let i = 0; i < MAX_LIVES; i++) {
      this.heartImages[i]?.setTexture(i < this.lives ? 'heart-full' : 'heart-empty');
    }
  }

  private pauseGame(): void {
    this.isPaused = true;
    this.pauseOverlay.setVisible(true);
    this.pauseText.setVisible(true);
  }

  private resumeGame(): void {
    this.isPaused = false;
    this.pauseOverlay.setVisible(false);
    this.pauseText.setVisible(false);
  }

  shutdown(): void {
    this.game.events.off('hidden');
    this.game.events.off('visible');
  }
}
