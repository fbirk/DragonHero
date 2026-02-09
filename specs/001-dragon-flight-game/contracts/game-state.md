# Contract: Game State Management

**Feature**: 001-dragon-flight-game
**Date**: 2026-02-09

This game is client-only with no backend API. Contracts define
the internal module interfaces and the save data format.

## Scene Transitions (Internal API)

Phaser scenes communicate via the scene manager. Each scene
transition passes data through the `scene.start()` method.

### StartScene → IntroScene

```typescript
// No data passed. Transition on Start button tap.
this.scene.start('IntroScene');
```

### IntroScene → GameScene

```typescript
interface GameStartData {
  levelId: string;    // e.g., "level-1"
  lives: number;      // always 3 on fresh start
  isRetry: boolean;   // false from intro, true from retry
}

this.scene.start('GameScene', {
  levelId: 'level-1',
  lives: 3,
  isRetry: false
});
```

### GameScene → GameOverScene

```typescript
interface GameOverData {
  levelId: string;    // level where player died
  scrollProgress: number; // how far player got
}

this.scene.start('GameOverScene', {
  levelId: 'level-1',
  scrollProgress: 4200
});
```

### GameScene → EndingScene

```typescript
interface EndingData {
  levelId: string;    // completed level
}

this.scene.start('EndingScene', {
  levelId: 'level-1'
});
```

### GameOverScene → GameScene (Retry)

```typescript
this.scene.start('GameScene', {
  levelId: 'level-1',
  lives: 3,
  isRetry: true       // skips intro
});
```

### GameOverScene → StartScene (Main Menu)

```typescript
this.scene.start('StartScene');
```

### EndingScene → StartScene

```typescript
this.scene.start('StartScene');
```

## Save Data Format (IndexedDB)

Database: `dragonhero-saves`
Store: `saves`
Key: `currentSave`

```typescript
interface SaveData {
  version: 1;
  highestLevelCompleted: string | null;
  totalPlayTime: number;   // seconds
  lastSaved: string;       // ISO 8601
}
```

### Save Triggers

- On level completion (before ending scene)
- On app background (visibility change)

### Load Triggers

- On StartScene initialization (to show "Continue" if save exists)

### Export Format

When the player exports save data, it is serialized as a JSON
text file with the `.json` extension:

```json
{
  "version": 1,
  "highestLevelCompleted": "level-1",
  "totalPlayTime": 312,
  "lastSaved": "2026-02-09T14:30:00.000Z"
}
```

## Level Data Format

Levels are defined as static configuration (no runtime mutation).

```typescript
interface LevelConfig {
  id: string;
  totalLength: number;       // total scroll distance (px)
  scrollSpeed: number;       // px per frame at 60fps
  backgroundTheme: string;   // asset key
  obstacles: ObstacleConfig[];
}

interface ObstacleConfig {
  spawnX: number;            // distance from level start
  gapY: number;              // vertical center of gap (px)
  gapSize: number;           // gap height (px), 80-160
  variant: string;           // sprite variant key
}
```

## Dialogue Data Format

```typescript
interface DialogueFrame {
  id: number;
  speaker: 'knight' | 'dragon' | 'narrator';
  text: string;
  portraitKey: string;       // sprite asset key
  backgroundKey: string;     // background asset key
}

type DialogueSequence = DialogueFrame[];
```
