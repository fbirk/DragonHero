import Phaser from 'phaser';
import { initResolution } from './config/resolution';
import { createGameConfig } from './config/gameConfig';
import { BootScene } from './scenes/BootScene';
import { StartScene } from './scenes/StartScene';
import { IntroScene } from './scenes/IntroScene';
import { GameScene } from './scenes/GameScene';
import { GameOverScene } from './scenes/GameOverScene';
import { EndingScene } from './scenes/EndingScene';

initResolution();

const config = createGameConfig([
  BootScene,
  StartScene,
  IntroScene,
  GameScene,
  GameOverScene,
  EndingScene,
]);

new Phaser.Game(config);
