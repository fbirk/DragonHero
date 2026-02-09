# DragonHero

A 2D pixel art fantasy game built as a Progressive Web App. A brave knight named Lady Jana rides her dragon Tairn through flappy-bird-style obstacle courses to break the curse of the Dark Towers.

Built with **Phaser 3**, **TypeScript**, and **Vite**.

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in a browser. The game runs in landscape orientation at a 480x320 logical resolution, scaled to fit the screen.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |

## Project Structure

```
index.html                       # Entry point (must be at project root for Vite)
src/
  main.ts                        # Phaser game bootstrap, registers all scenes
  config/
    constants.ts                 # All game constants and design tokens
    gameConfig.ts                # Phaser engine configuration
  scenes/
    BootScene.ts                 # Asset generation and loading bar
    StartScene.ts                # Title screen, start button, save export/import
    IntroScene.ts                # Pre-level story dialogue
    GameScene.ts                 # Core flappy-bird gameplay
    GameOverScene.ts             # Retry / main menu after losing all lives
    EndingScene.ts               # Post-level victory dialogue, saves progress
  entities/
    Dragon.ts                    # Player character: position, velocity, state
    Obstacle.ts                  # Obstacle pair: gap position, collision bounds
  systems/
    PhysicsSystem.ts             # Gravity, flap impulse, velocity clamping
    CollisionSystem.ts           # Hit detection, invincibility management
    ScrollSystem.ts              # Level scrolling, obstacle spawning/cleanup
  data/
    levels.ts                    # Level definitions (obstacle layouts)
    dialogue.ts                  # Intro and ending story frames
  storage/
    SaveManager.ts               # IndexedDB persistence, JSON export/import
public/
  manifest.json                  # PWA manifest (landscape, standalone)
  icons/                         # SVG app icons (192x192, 512x512)
tests/
  unit/                          # Vitest unit tests
  e2e/                           # Playwright E2E tests
```

## Scene Flow

```
BootScene -> StartScene -> IntroScene -> GameScene -> EndingScene -> StartScene
                                             |
                                             v
                                       GameOverScene -> (Retry) GameScene
                                             |
                                             v
                                        (Menu) StartScene
```

## Architecture

The game uses an **Entity-System-Scene** architecture:

- **Entities** (`Dragon`, `Obstacle`) hold data and pure logic. They have no Phaser dependency and are fully unit-testable.
- **Systems** (`PhysicsSystem`, `CollisionSystem`, `ScrollSystem`) operate on entities each frame.
- **Scenes** handle rendering, input, and scene transitions using Phaser's scene lifecycle.

All game constants (physics, sizing, colors) live in `src/config/constants.ts`. This file has no Phaser import, so entities and systems can import from it without pulling in browser dependencies -- this is critical for unit tests running in Node.js.

## How Assets Work

All visual assets are **generated programmatically** at runtime in `BootScene.ts` using Phaser's Graphics API. There are no image files to load. This means:

- The game works out of the box with zero external assets
- You can iterate on visuals by editing the drawing code in BootScene
- To switch to real image files, replace the `generateTexture()` calls with `this.load.image()` / `this.load.spritesheet()` calls in `preload()`

### Current Texture Keys

These are the texture keys generated in BootScene and referenced throughout the game:

| Key | Size | Used By | Description |
|---|---|---|---|
| `dragon` | 96x32 (3 frames of 32x32) | GameScene, StartScene, GameOverScene | Dragon+knight sprite sheet: frame 0 = idle, frame 1 = flap, frame 2 = hit |
| `obstacle-stone` | 48x320 | GameScene | Stone pillar with brick pattern |
| `obstacle-vine` | 48x320 | GameScene | Vine obstacle with thorns |
| `bg-far` | 480x320 | GameScene, StartScene, GameOverScene | Far parallax layer (sky, stars, moon) |
| `bg-mid` | 480x320 | GameScene, StartScene | Mid parallax layer (mountains, castle) |
| `bg-near` | 480x320 | GameScene, StartScene | Near parallax layer (ground, trees) |
| `bg-intro` | 480x320 | IntroScene | Intro dialogue background (castle courtyard) |
| `bg-ending` | 480x320 | EndingScene | Ending dialogue background (sunrise) |
| `btn-start` | 120x44 | StartScene, GameOverScene | Button background (used for all buttons) |
| `heart-full` | 16x16 | GameScene | Filled heart icon for lives HUD |
| `heart-empty` | 16x16 | GameScene | Empty heart icon for lives HUD |
| `speech-bubble` | 400x100 | IntroScene, EndingScene | Dialogue box background |
| `portrait-knight` | 48x48 | IntroScene, EndingScene | Knight portrait for dialogue |
| `portrait-dragon` | 48x48 | IntroScene, EndingScene | Dragon portrait for dialogue |

## Extending the Game

### Replacing Programmatic Assets with Image Files

To replace the generated art with real sprite sheets or images:

1. Place your image files in `public/` (e.g. `public/sprites/dragon.png`)
2. In `BootScene.ts`, replace the corresponding `generate*()` call with a Phaser load call in `preload()`:

```typescript
// Before (programmatic):
this.generateDragonSprite();

// After (image file):
this.load.spritesheet('dragon', 'sprites/dragon.png', {
  frameWidth: 32,
  frameHeight: 32,
});
```

3. Keep the same texture key (e.g. `'dragon'`) so all other code continues to work
4. For sprite sheets, make sure the frames are laid out horizontally: frame 0 (idle), frame 1 (flap), frame 2 (hit)

### Adding a New Obstacle Variant

1. **Generate or load the texture** in `BootScene.ts` with a key like `'obstacle-crystal'`

2. **Map the variant** in `GameScene.ts` in `syncObstacleSprites()`:

```typescript
// In syncObstacleSprites(), update the variant mapping:
let textureKey: string;
if (obstacle.variant === 'vine') {
  textureKey = 'obstacle-vine';
} else if (obstacle.variant === 'crystal') {
  textureKey = 'obstacle-crystal';   // your new variant
} else {
  textureKey = 'obstacle-stone';
}
```

3. **Use the variant** in a level definition in `src/data/levels.ts`:

```typescript
obstacles.push({
  spawnX: 1200,
  gapY: 160,
  gapSize: 120,
  variant: 'crystal',
});
```

### Adding a New Level

1. **Define the level** in `src/data/levels.ts`:

```typescript
export const LEVEL_2: LevelConfig = {
  id: 'level-2',
  totalLength: 10000,          // longer than level 1
  scrollSpeed: 2.5,            // slightly faster
  backgroundTheme: 'dungeon',
  obstacles: generateLevel2Obstacles(),
};

// Register it:
export const LEVELS: Record<string, LevelConfig> = {
  'level-1': LEVEL_1,
  'level-2': LEVEL_2,
};
```

2. **Add dialogue** for the new level in `src/data/dialogue.ts` (optional)

3. **Wire the level progression** -- update `EndingScene.ts` to transition to level 2 instead of returning to StartScene, or add a level select screen

### Adding New UI Elements

All UI textures are generated in `BootScene.generateUIElements()`. To add a new UI element:

1. Add the generation code in BootScene:

```typescript
// Example: a progress bar background
const pb = this.make.graphics({ x: 0, y: 0 }, false);
pb.fillStyle(0x333333);
pb.fillRoundedRect(0, 0, 200, 12, 3);
pb.generateTexture('progress-bar-bg', 200, 12);
pb.destroy();
```

2. Use it in any scene with `this.add.image(x, y, 'progress-bar-bg')`

### Modifying Game Physics

All physics constants are in `src/config/constants.ts`:

| Constant | Default | Effect |
|---|---|---|
| `GRAVITY` | 600 | How fast the dragon falls (pixels/sec^2) |
| `FLAP_VELOCITY` | -200 | Upward impulse on tap (negative = up) |
| `TERMINAL_VELOCITY` | 400 | Maximum fall speed |
| `BASE_SCROLL_SPEED` | 2 | How fast obstacles scroll left (pixels/frame) |
| `MIN_GAP_SIZE` | 80 | Minimum gap between top and bottom obstacle |
| `MAX_GAP_SIZE` | 160 | Maximum gap between top and bottom obstacle |
| `INVINCIBILITY_DURATION` | 2000 | Milliseconds of invincibility after a hit |

### Changing the Color Palette

All colors are defined in `src/config/constants.ts` under the `COLORS` object:

```typescript
export const COLORS = {
  background: '#1a1a2e',    // dark blue - page background
  primary: '#e94560',       // red - title, hearts, accents
  secondary: '#0f3460',     // navy - secondary elements
  accent: '#16213e',        // dark navy - subtle accents
  text: '#ffffff',          // white - button text, HUD
  textDark: '#1a1a2e',      // dark - dialogue text
  heartFull: '#e94560',     // red - active hearts
  heartEmpty: '#333333',    // grey - lost hearts
};
```

Every scene references these tokens. Changing them here updates the entire game.

### Modifying Dialogue

Dialogue frames are defined in `src/data/dialogue.ts`. Each frame has:

```typescript
{
  id: 1,
  speaker: 'knight',                // 'knight' | 'dragon' | 'narrator'
  text: 'Your dialogue text here',
  portraitKey: 'portrait-knight',    // texture key for the portrait image
  backgroundKey: 'bg-intro',        // texture key for the background
}
```

Speaker names are mapped in `IntroScene.ts` and `EndingScene.ts`:

```typescript
const speakerNames: Record<string, string> = {
  knight: 'Lady Jana',
  dragon: 'Tairn',
  narrator: 'Erzaehler',
};
```

To add a new character, add their portrait texture in BootScene, then add a new speaker key.

## PWA & Mobile

- The game runs as a PWA with offline support via a Workbox service worker
- Portrait orientation shows a "Please rotate" overlay (configured in `index.html`)
- Save data is stored in IndexedDB and can be exported/imported as JSON from the start screen
- Manifest is configured for `display: standalone` and `orientation: landscape`
- To install on iOS: open in Safari, tap Share, then "Add to Home Screen"

## Testing

- **62 unit tests** covering Dragon, Obstacle, PhysicsSystem, CollisionSystem, ScrollSystem, and SaveManager
- **2 E2E test files** testing the full gameplay flow and navigation/retry flow
- All entities and systems are testable without Phaser (no browser/DOM dependency)
