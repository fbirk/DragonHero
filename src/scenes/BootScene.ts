import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config/constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.createLoadingBar();
    this.generateAssets();

    this.load.image('portrait-knight', 'knight_48x48.png');
    this.load.image('portrait-dragon', 'dragon_48x48.png');
    this.load.image('portrait-narrator', 'narrator_48x48.png');
    this.load.image('portrait-wizard', 'wizard_48x48.png');
  }

  create(): void {
    // Create dragon animations using the sprite atlas
    this.anims.create({
      key: 'dragon-flap',
      frames: this.anims.generateFrameNames('a-dragon', {
        prefix: 'flying_',
        start: 0,
        end: 5,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: 'dragon-idle',
      frames: [
        { key: 'a-dragon', frame: 'flying_0' },
        { key: 'a-dragon', frame: 'flying_1' },
      ],
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: 'dragon-hit',
      frames: [
        { key: 'a-dragon', frame: 'flying_3' },
        { key: 'a-dragon', frame: 'flying_4' },
      ],
      frameRate: 8,
      repeat: 0,
    });

    this.scene.start('StartScene');
  }

  private createLoadingBar(): void {
    const width = GAME_WIDTH * 0.6;
    const height = 16;
    const x = (GAME_WIDTH - width) / 2;
    const y = GAME_HEIGHT / 2;

    const bg = this.add.rectangle(x + width / 2, y, width, height, 0x333333);
    bg.setOrigin(0.5, 0.5);

    const bar = this.add.rectangle(x, y, 0, height - 4, 0xe94560);
    bar.setOrigin(0, 0.5);

    this.load.on('progress', (value: number) => {
      bar.width = (width - 4) * value;
    });
  }

  private generateAssets(): void {
    this.generateObstacleSprites();
    this.generateBackgrounds();
    this.generateUIElements();
    this.load.atlas('a-dragon', 'sprites/CharacterFlyingSprite.png', 'sprites/CharacterFlyingSprite_atlas.json');
  }

  // --- Obstacle sprites ---
  private generateObstacleSprites(): void {
    // Stone pillar
    const gs = this.make.graphics({ x: 0, y: 0 }, false);
    for (let y = 0; y < 320; y += 16) {
      const shade = (y % 32 === 0) ? 0x777788 : 0x888899;
      gs.fillStyle(shade);
      gs.fillRect(0, y, 48, 16);
      // Brick lines
      gs.lineStyle(1, 0x555566, 0.6);
      gs.strokeRect(0, y, 48, 16);
      if (y % 32 === 0) {
        gs.beginPath();
        gs.moveTo(24, y);
        gs.lineTo(24, y + 16);
        gs.strokePath();
      } else {
        gs.beginPath();
        gs.moveTo(12, y);
        gs.lineTo(12, y + 16);
        gs.strokePath();
        gs.beginPath();
        gs.moveTo(36, y);
        gs.lineTo(36, y + 16);
        gs.strokePath();
      }
    }
    // Top cap
    gs.fillStyle(0x666677);
    gs.fillRect(0, 0, 48, 4);
    gs.generateTexture('obstacle-stone', 48, 320);
    gs.destroy();

    // Vine obstacle
    const gv = this.make.graphics({ x: 0, y: 0 }, false);
    for (let y = 0; y < 320; y += 8) {
      const shade = (y % 16 === 0) ? 0x336633 : 0x447744;
      gv.fillStyle(shade);
      gv.fillRect(8, y, 32, 8);
      // Vine tendrils
      gv.fillStyle(0x558855);
      gv.fillRect(4, y, 6, 4);
      gv.fillRect(38, y + 4, 6, 4);
    }
    // Thorns
    for (let y = 0; y < 320; y += 24) {
      gv.fillStyle(0x884422);
      gv.fillRect(2, y, 3, 3);
      gv.fillRect(43, y + 12, 3, 3);
    }
    gv.generateTexture('obstacle-vine', 48, 320);
    gv.destroy();
  }

  // --- Parallax background layers ---
  private generateBackgrounds(): void {
    // Far layer: sky with stars/clouds
    const gf = this.make.graphics({ x: 0, y: 0 }, false);
    // Gradient sky
    for (let y = 0; y < GAME_HEIGHT; y += 4) {
      const t = y / GAME_HEIGHT;
      const r = Math.floor(0x0a + t * 0x15);
      const gg = Math.floor(0x0a + t * 0x20);
      const b = Math.floor(0x2e + t * 0x20);
      gf.fillStyle((r << 16) | (gg << 8) | b);
      gf.fillRect(0, y, GAME_WIDTH, 4);
    }
    // Stars
    const starPositions = [
      [30, 20], [100, 40], [200, 15], [320, 35], [400, 25], [450, 50],
      [60, 60], [150, 30], [250, 55], [370, 10], [430, 45],
    ];
    gf.fillStyle(0xffffff);
    for (const [sx, sy] of starPositions) {
      gf.fillRect(sx, sy, 2, 2);
    }
    // Moon
    gf.fillStyle(0xddddaa);
    gf.fillCircle(380, 40, 12);
    gf.fillStyle(0x0a0a2e);
    gf.fillCircle(385, 38, 10);
    gf.generateTexture('bg-far', GAME_WIDTH, GAME_HEIGHT);
    gf.destroy();

    // Mid layer: mountains/castles
    const gm = this.make.graphics({ x: 0, y: 0 }, false);
    gm.fillStyle(0x000000, 0); // transparent base
    gm.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    // Mountains
    gm.fillStyle(0x1a2a4e);
    const mountains = [
      { x: 0, peak: 160, w: 120 },
      { x: 100, peak: 130, w: 160 },
      { x: 240, peak: 150, w: 140 },
      { x: 360, peak: 120, w: 120 },
    ];
    for (const m of mountains) {
      gm.beginPath();
      gm.moveTo(m.x, GAME_HEIGHT);
      gm.lineTo(m.x + m.w / 2, m.peak);
      gm.lineTo(m.x + m.w, GAME_HEIGHT);
      gm.closePath();
      gm.fillPath();
    }
    // Castle silhouette
    gm.fillStyle(0x162040);
    gm.fillRect(180, 180, 30, 60);
    gm.fillRect(175, 170, 10, 14);
    gm.fillRect(205, 170, 10, 14);
    gm.fillRect(190, 160, 10, 24);
    // Castle flag
    gm.fillStyle(0xe94560);
    gm.fillRect(193, 155, 6, 4);
    gm.generateTexture('bg-mid', GAME_WIDTH, GAME_HEIGHT);
    gm.destroy();

    // Near layer: ground with trees
    const gn = this.make.graphics({ x: 0, y: 0 }, false);
    gn.fillStyle(0x000000, 0);
    gn.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    // Ground
    gn.fillStyle(0x2a4a2a);
    gn.fillRect(0, GAME_HEIGHT - 32, GAME_WIDTH, 32);
    gn.fillStyle(0x3a5a3a);
    gn.fillRect(0, GAME_HEIGHT - 36, GAME_WIDTH, 6);
    // Grass tufts
    gn.fillStyle(0x4a7a4a);
    for (let x = 0; x < GAME_WIDTH; x += 20) {
      gn.fillRect(x, GAME_HEIGHT - 38, 4, 4);
      gn.fillRect(x + 8, GAME_HEIGHT - 36, 3, 3);
    }
    // Trees
    const trees = [40, 150, 300, 420];
    for (const tx of trees) {
      // Trunk
      gn.fillStyle(0x553322);
      gn.fillRect(tx + 4, GAME_HEIGHT - 56, 6, 24);
      // Foliage
      gn.fillStyle(0x2a6a2a);
      gn.fillRect(tx, GAME_HEIGHT - 72, 14, 18);
      gn.fillStyle(0x3a7a3a);
      gn.fillRect(tx + 2, GAME_HEIGHT - 76, 10, 6);
    }
    gn.generateTexture('bg-near', GAME_WIDTH, GAME_HEIGHT);
    gn.destroy();

    // Intro background: castle courtyard
    const gi = this.make.graphics({ x: 0, y: 0 }, false);
    // Sky
    for (let y = 0; y < GAME_HEIGHT; y += 4) {
      const t = y / GAME_HEIGHT;
      const r = Math.floor(0x10 + t * 0x10);
      const gg = Math.floor(0x18 + t * 0x18);
      const b = Math.floor(0x30 + t * 0x20);
      gi.fillStyle((r << 16) | (gg << 8) | b);
      gi.fillRect(0, y, GAME_WIDTH, 4);
    }
    // Castle wall
    gi.fillStyle(0x555566);
    gi.fillRect(0, GAME_HEIGHT - 100, GAME_WIDTH, 100);
    gi.fillStyle(0x666677);
    gi.fillRect(0, GAME_HEIGHT - 104, GAME_WIDTH, 8);
    // Battlements
    for (let x = 0; x < GAME_WIDTH; x += 24) {
      gi.fillStyle(0x555566);
      gi.fillRect(x, GAME_HEIGHT - 116, 12, 16);
    }
    // Torches
    gi.fillStyle(0xffaa33);
    gi.fillRect(100, GAME_HEIGHT - 80, 4, 6);
    gi.fillRect(380, GAME_HEIGHT - 80, 4, 6);
    gi.fillStyle(0xff6622);
    gi.fillRect(101, GAME_HEIGHT - 84, 2, 4);
    gi.fillRect(381, GAME_HEIGHT - 84, 2, 4);
    gi.generateTexture('bg-intro', GAME_WIDTH, GAME_HEIGHT);
    gi.destroy();

    // Ending background: sunrise
    const ge = this.make.graphics({ x: 0, y: 0 }, false);
    for (let y = 0; y < GAME_HEIGHT; y += 4) {
      const t = y / GAME_HEIGHT;
      const r = Math.floor(0x40 + (1 - t) * 0x80);
      const gg = Math.floor(0x20 + (1 - t) * 0x60);
      const b = Math.floor(0x40 + t * 0x30);
      ge.fillStyle((r << 16) | (gg << 8) | b);
      ge.fillRect(0, y, GAME_WIDTH, 4);
    }
    // Sun
    ge.fillStyle(0xffdd44);
    ge.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT * 0.35, 20);
    ge.fillStyle(0xffee88);
    ge.fillCircle(GAME_WIDTH / 2, GAME_HEIGHT * 0.35, 14);
    // Ground
    ge.fillStyle(0x3a6a3a);
    ge.fillRect(0, GAME_HEIGHT - 40, GAME_WIDTH, 40);
    ge.fillStyle(0x4a8a4a);
    ge.fillRect(0, GAME_HEIGHT - 44, GAME_WIDTH, 6);
    ge.generateTexture('bg-ending', GAME_WIDTH, GAME_HEIGHT);
    ge.destroy();
  }

  // --- UI elements ---
  private generateUIElements(): void {
    // Start button
    const gb = this.make.graphics({ x: 0, y: 0 }, false);
    gb.fillStyle(0xe94560);
    gb.fillRoundedRect(0, 0, 120, 44, 4);
    gb.lineStyle(2, 0xff6680);
    gb.strokeRoundedRect(1, 1, 118, 42, 4);
    // Inner highlight
    gb.fillStyle(0xff5570, 0.3);
    gb.fillRoundedRect(4, 2, 112, 20, 2);
    gb.generateTexture('btn-start', 120, 44);
    gb.destroy();

    // Heart full
    const hf = this.make.graphics({ x: 0, y: 0 }, false);
    hf.fillStyle(0xe94560);
    // Pixel heart shape
    const heartPixels = [
      [0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
      [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
      [0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
      [0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
    ];
    for (let py = 0; py < heartPixels.length; py++) {
      for (let px = 0; px < 9; px++) {
        if (heartPixels[py][px]) {
          hf.fillRect(px * 2 - 1, py * 2, 2, 2);
        }
      }
    }
    hf.generateTexture('heart-full', 16, 16);
    hf.destroy();

    // Heart empty
    const he = this.make.graphics({ x: 0, y: 0 }, false);
    he.fillStyle(0x444444);
    for (let py = 0; py < heartPixels.length; py++) {
      for (let px = 0; px < 9; px++) {
        if (heartPixels[py][px]) {
          he.fillRect(px * 2 - 1, py * 2, 2, 2);
        }
      }
    }
    he.generateTexture('heart-empty', 16, 16);
    he.destroy();

    // Speech bubble
    const sb = this.make.graphics({ x: 0, y: 0 }, false);
    sb.fillStyle(0xfaf0e6);
    sb.fillRoundedRect(0, 0, 400, 100, 6);
    sb.lineStyle(2, 0x8b7355);
    sb.strokeRoundedRect(1, 1, 398, 98, 6);
    // Inner border
    sb.lineStyle(1, 0xd4c4a8, 0.5);
    sb.strokeRoundedRect(4, 4, 392, 92, 4);
    sb.generateTexture('speech-bubble', 400, 100);
    sb.destroy();
  }

  // --- Character portraits ---
  private generatePortraits(): void {
    // Knight portrait
    const gk = this.make.graphics({ x: 0, y: 0 }, false);
    // Background circle
    gk.fillStyle(0x2a2a4e);
    gk.fillCircle(24, 24, 22);
    gk.lineStyle(2, 0xccaa44);
    gk.strokeCircle(24, 24, 22);
    // Face
    gk.fillStyle(0xeebb88);
    gk.fillRect(16, 16, 16, 18);
    // Hair
    gk.fillStyle(0x996633);
    gk.fillRect(14, 12, 20, 6);
    gk.fillRect(14, 14, 4, 14);
    gk.fillRect(30, 14, 4, 14);
    // Eyes
    gk.fillStyle(0x4466aa);
    gk.fillRect(18, 22, 3, 3);
    gk.fillRect(27, 22, 3, 3);
    // Armor collar
    gk.fillStyle(0xccccdd);
    gk.fillRect(14, 34, 20, 8);
    gk.fillStyle(0xaaaacc);
    gk.fillRect(16, 36, 16, 4);
    gk.generateTexture('portrait-knight', 48, 48);
    gk.destroy();

    // Dragon portrait
    const gd = this.make.graphics({ x: 0, y: 0 }, false);
    gd.fillStyle(0x1a3a1a);
    gd.fillCircle(24, 24, 22);
    gd.lineStyle(2, 0x44aa44);
    gd.strokeCircle(24, 24, 22);
    // Dragon head
    gd.fillStyle(0x44aa44);
    gd.fillRect(12, 14, 24, 20);
    // Snout
    gd.fillStyle(0x55bb55);
    gd.fillRect(28, 20, 10, 10);
    // Eye
    gd.fillStyle(0xffcc00);
    gd.fillRect(26, 18, 4, 4);
    gd.fillStyle(0x000000);
    gd.fillRect(27, 19, 2, 2);
    // Nostril
    gd.fillStyle(0x338833);
    gd.fillRect(34, 24, 2, 2);
    // Horns
    gd.fillStyle(0xddaa44);
    gd.fillRect(16, 8, 3, 8);
    gd.fillRect(26, 8, 3, 8);
    // Teeth
    gd.fillStyle(0xffffff);
    gd.fillRect(30, 30, 2, 3);
    gd.fillRect(34, 30, 2, 3);
    gd.generateTexture('portrait-dragon', 48, 48);
    gd.destroy();
  }
}
