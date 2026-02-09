import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, DIALOGUE_ADVANCE_DEBOUNCE } from '../config/constants';
import { ENDING_DIALOGUE, type DialogueFrame } from '../data/dialogue';
import { saveGame } from '../storage/SaveManager';

export interface EndingSceneData {
  levelId: string;
}

export class EndingScene extends Phaser.Scene {
  private currentFrameIndex: number = 0;
  private dialogueText!: Phaser.GameObjects.Text;
  private portraitImage!: Phaser.GameObjects.Image;
  private speakerText!: Phaser.GameObjects.Text;
  private background!: Phaser.GameObjects.Image;
  private speechBubble!: Phaser.GameObjects.Image;
  private canAdvance: boolean = true;
  private levelId: string = 'level-1';

  constructor() {
    super({ key: 'EndingScene' });
  }

  init(data: EndingSceneData): void {
    this.levelId = data?.levelId || 'level-1';
  }

  create(): void {
    this.currentFrameIndex = 0;
    this.canAdvance = true;

    // Save progress
    saveGame({
      highestLevelCompleted: this.levelId,
      totalPlayTime: 0,
    });

    // Background
    this.background = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'bg-ending');
    this.background.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    // Speech bubble background
    this.speechBubble = this.add.image(GAME_WIDTH / 2 + 20, GAME_HEIGHT * 0.65, 'speech-bubble');
    this.speechBubble.setDisplaySize(360, 90);
    this.speechBubble.setAlpha(0.9);

    // Portrait
    this.portraitImage = this.add.image(50, GAME_HEIGHT * 0.65, 'portrait-knight');
    this.portraitImage.setDisplaySize(48, 48);

    // Speaker name
    this.speakerText = this.add.text(100, GAME_HEIGHT * 0.65 - 35, '', {
      fontSize: '10px',
      color: COLORS.primary,
      fontFamily: 'monospace',
      fontStyle: 'bold',
    });

    // Dialogue text
    this.dialogueText = this.add.text(100, GAME_HEIGHT * 0.65 - 18, '', {
      fontSize: '11px',
      color: COLORS.textDark,
      fontFamily: 'monospace',
      wordWrap: { width: 340 },
      lineSpacing: 4,
    });

    // Show first frame
    this.showFrame(ENDING_DIALOGUE[0]);

    // Tap to advance
    this.input.on('pointerdown', () => {
      this.advanceDialogue();
    });
  }

  private showFrame(frame: DialogueFrame): void {
    this.portraitImage.setTexture(frame.portraitKey);
    this.background.setTexture(frame.backgroundKey);

    const speakerNames: Record<string, string> = {
      knight: 'Lady Elara',
      dragon: 'Ember',
      narrator: 'Narrator',
    };
    this.speakerText.setText(speakerNames[frame.speaker] || frame.speaker);
    this.dialogueText.setText(frame.text);
  }

  private advanceDialogue(): void {
    if (!this.canAdvance) return;

    this.canAdvance = false;
    this.time.delayedCall(DIALOGUE_ADVANCE_DEBOUNCE, () => {
      this.canAdvance = true;
    });

    this.currentFrameIndex++;

    if (this.currentFrameIndex >= ENDING_DIALOGUE.length) {
      this.scene.start('StartScene');
    } else {
      this.showFrame(ENDING_DIALOGUE[this.currentFrameIndex]);
    }
  }
}
