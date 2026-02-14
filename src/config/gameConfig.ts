import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';

export { GAME_WIDTH, GAME_HEIGHT };

export function createGameConfig(scenes: Phaser.Types.Scenes.SceneType[]): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.CANVAS,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: scenes,
  };
}
