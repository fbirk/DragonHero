import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, BUTTON_MIN_SIZE } from '../config/constants';
import { loadGame, exportSave, importSave, saveGame } from '../storage/SaveManager';

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create(): void {
    // Background layers
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg-far').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg-mid').setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setAlpha(0.6);
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg-near').setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setAlpha(0.4);

    // Dragon character on title screen
    const dragon = this.add.sprite(GAME_WIDTH / 2 - 80, GAME_HEIGHT / 3 - 10, 'dragon', 0);
    dragon.setDisplaySize(48, 48);
    this.tweens.add({
      targets: dragon,
      y: dragon.y - 6,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Title
    const title = this.add.text(GAME_WIDTH / 2 + 10, GAME_HEIGHT / 3, 'DragonHero', {
      fontSize: '32px',
      color: COLORS.primary,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    title.setOrigin(0.5, 0.5);
    const titleShadow = this.add.text(GAME_WIDTH / 2 + 12, GAME_HEIGHT / 3 + 2, 'DragonHero', {
      fontSize: '32px',
      color: '#000000',
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });
    titleShadow.setOrigin(0.5, 0.5);
    titleShadow.setAlpha(0.3);
    titleShadow.setDepth(-1);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 3 + 36, 'A Dragon Flight Adventure', {
      fontSize: '12px',
      color: COLORS.text,
      fontFamily: 'monospace',
    }).setOrigin(0.5, 0.5);

    // Start button
    const btnBg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT * 0.65, 'btn-start');
    btnBg.setDisplaySize(120, BUTTON_MIN_SIZE);
    btnBg.setInteractive({ useHandCursor: true });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.65, 'START', {
      fontSize: '16px',
      color: COLORS.text,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5);

    btnBg.on('pointerdown', () => {
      this.scene.start('IntroScene');
    });
    btnBg.on('pointerover', () => btnBg.setAlpha(0.8));
    btnBg.on('pointerout', () => btnBg.setAlpha(1));

    // Export save button
    const exportText = this.add.text(GAME_WIDTH - 90, GAME_HEIGHT - 24, 'Export Save', {
      fontSize: '9px',
      color: COLORS.text,
      fontFamily: 'monospace',
    }).setOrigin(0, 0.5).setAlpha(0.6);
    exportText.setInteractive({ useHandCursor: true });
    exportText.on('pointerdown', () => this.exportSaveData());
    exportText.on('pointerover', () => exportText.setAlpha(1));
    exportText.on('pointerout', () => exportText.setAlpha(0.6));

    // Import save button
    const importText = this.add.text(GAME_WIDTH - 90, GAME_HEIGHT - 12, 'Import Save', {
      fontSize: '9px',
      color: COLORS.text,
      fontFamily: 'monospace',
    }).setOrigin(0, 0.5).setAlpha(0.6);
    importText.setInteractive({ useHandCursor: true });
    importText.on('pointerdown', () => this.importSaveData());
    importText.on('pointerover', () => importText.setAlpha(1));
    importText.on('pointerout', () => importText.setAlpha(0.6));

    // Version text
    this.add.text(8, GAME_HEIGHT - 8, 'v0.1', {
      fontSize: '8px',
      color: COLORS.text,
      fontFamily: 'monospace',
    }).setOrigin(0, 1).setAlpha(0.4);
  }

  private async exportSaveData(): Promise<void> {
    const data = await loadGame();
    if (!data) return;

    const json = exportSave(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dragonhero-save.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  private importSaveData(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const text = await file.text();
      const data = importSave(text);
      if (data) {
        await saveGame({
          highestLevelCompleted: data.highestLevelCompleted,
          totalPlayTime: data.totalPlayTime,
        });
      }
    };
    input.click();
  }
}
