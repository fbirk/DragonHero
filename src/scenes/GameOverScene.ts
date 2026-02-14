import Phaser from 'phaser';
import { GAME_HEIGHT, COLORS, BUTTON_MIN_SIZE } from '../config/constants';
import { getGameWidth } from '../config/resolution';

export interface GameOverSceneData {
  levelId: string;
  scrollProgress: number;
}

export class GameOverScene extends Phaser.Scene {
  private levelId: string = 'level-1';

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: GameOverSceneData): void {
    this.levelId = data?.levelId || 'level-1';
  }

  create(): void {
    const w = getGameWidth();

    // Dark background with vignette effect
    this.add.image(w / 2, GAME_HEIGHT / 2, 'bg-far').setDisplaySize(w, GAME_HEIGHT).setAlpha(0.3);
    this.add.rectangle(w / 2, GAME_HEIGHT / 2, w, GAME_HEIGHT, 0x000000, 0.6);

    // Dragon hit sprite
    const dragon = this.add.sprite(w / 2, GAME_HEIGHT / 4, 'dragon', 2);
    dragon.setDisplaySize(48, 48);
    // Falling animation
    this.tweens.add({
      targets: dragon,
      y: dragon.y + 8,
      angle: 15,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Game Over title with shadow
    this.add.text(w / 2 + 2, GAME_HEIGHT * 0.42 + 2, 'GAME OVER', {
      fontSize: '28px',
      color: '#000000',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5).setAlpha(0.4);

    this.add.text(w / 2, GAME_HEIGHT * 0.42, 'GAME OVER', {
      fontSize: '28px',
      color: COLORS.primary,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5);

    // Retry button
    const retryBg = this.add.image(w / 2, GAME_HEIGHT * 0.6, 'btn-start');
    retryBg.setDisplaySize(120, BUTTON_MIN_SIZE);
    retryBg.setInteractive({ useHandCursor: true });

    this.add.text(w / 2, GAME_HEIGHT * 0.6, 'Erneut Versuchen', {
      fontSize: '14px',
      color: COLORS.text,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5);

    retryBg.on('pointerdown', () => {
      this.scene.start('GameScene', {
        levelId: this.levelId,
        lives: 3,
        isRetry: true,
      });
    });

    retryBg.on('pointerover', () => retryBg.setAlpha(0.8));
    retryBg.on('pointerout', () => retryBg.setAlpha(1));

    // Main Menu button
    const menuBg = this.add.image(w / 2, GAME_HEIGHT * 0.78, 'btn-start');
    menuBg.setDisplaySize(120, BUTTON_MIN_SIZE);
    menuBg.setInteractive({ useHandCursor: true });
    menuBg.setAlpha(0.7);

    this.add.text(w / 2, GAME_HEIGHT * 0.78, 'HAUPTMENÜ', {
      fontSize: '12px',
      color: COLORS.text,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5);

    menuBg.on('pointerdown', () => {
      this.scene.start('StartScene');
    });

    menuBg.on('pointerover', () => menuBg.setAlpha(0.5));
    menuBg.on('pointerout', () => menuBg.setAlpha(0.7));
  }
}
