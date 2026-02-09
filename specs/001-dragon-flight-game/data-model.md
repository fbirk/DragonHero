# Data Model: Dragon Flight Game

**Feature**: 001-dragon-flight-game
**Date**: 2026-02-09

## Entities

### PlayerCharacter

The controllable game entity — a lady knight riding a small dragon.

| Field | Type | Description |
|---|---|---|
| y | number | Vertical position (pixels from top) |
| velocityY | number | Current vertical velocity (positive = falling) |
| isInvincible | boolean | Whether currently in post-hit invincibility |
| invincibilityTimer | number | Remaining invincibility time (ms) |
| animationState | enum | `idle`, `flapping`, `hit` |

**Validation Rules**:
- `y` MUST be clamped between 0 and (canvas height - sprite height)
- `velocityY` has a terminal velocity cap (prevents infinite acceleration)
- `invincibilityTimer` resets to ~2000ms on collision

**State Transitions**:
```
idle → (tap) → flapping
flapping → (release) → idle
idle/flapping → (collision) → hit
hit → (invincibility expires) → idle
```

### Obstacle

A pair of top and bottom barriers creating a navigable gap.

| Field | Type | Description |
|---|---|---|
| x | number | Horizontal position (pixels from left) |
| gapY | number | Vertical center of the gap |
| gapSize | number | Height of the gap in pixels |
| variant | string | Visual variant identifier for sprite selection |
| passed | boolean | Whether the player has passed this obstacle |

**Validation Rules**:
- `gapY` MUST position the gap so both top and bottom barriers
  are at least 40px tall (visible)
- `gapSize` MUST be between 80px and 160px (playable range)
- `x` decreases each frame by the scroll speed; obstacle is
  destroyed when `x` < -obstacle_width

### Level

A single gameplay stage definition (loaded from config, not mutated).

| Field | Type | Description |
|---|---|---|
| id | string | Level identifier (e.g., "level-1") |
| totalLength | number | Total scroll distance in pixels |
| scrollSpeed | number | Pixels per frame the background moves |
| obstacles | ObstacleConfig[] | Array of obstacle definitions |
| backgroundTheme | string | Background asset key |

**ObstacleConfig** (sub-entity):

| Field | Type | Description |
|---|---|---|
| spawnX | number | Distance from level start where obstacle spawns |
| gapY | number | Vertical center of gap |
| gapSize | number | Gap height |
| variant | string | Visual variant |

### GameState

Tracks the current game session.

| Field | Type | Description |
|---|---|---|
| lives | number | Current lives (0-3) |
| currentLevelId | string | Active level identifier |
| scrollProgress | number | Current scroll position in level |
| phase | enum | Current game phase |
| highestLevelCompleted | string or null | For save/load purposes |

**Phase enum values**:
`start_screen`, `intro`, `playing`, `paused`, `game_over`, `ending`

**State Transitions**:
```
start_screen → (tap Start) → intro
intro → (story ends) → playing
playing → (app background) → paused
paused → (app foreground) → playing
playing → (lives = 0) → game_over
playing → (reach end) → ending
game_over → (tap Retry) → playing
game_over → (tap Menu) → start_screen
ending → (tap Continue) → start_screen
```

### DialogueFrame

A single unit of the story sequence.

| Field | Type | Description |
|---|---|---|
| id | number | Frame sequence number |
| speaker | string | Speaker identity ("knight", "dragon", "narrator") |
| text | string | Dialogue text content |
| portraitKey | string | Asset key for character portrait sprite |
| backgroundKey | string | Asset key for scene background |

### SaveData

Persisted game progress (stored in IndexedDB as JSON).

| Field | Type | Description |
|---|---|---|
| version | number | Save format version for migration |
| highestLevelCompleted | string or null | Last completed level id |
| totalPlayTime | number | Cumulative play time in seconds |
| lastSaved | string | ISO 8601 timestamp |

**Validation Rules**:
- `version` MUST match current save format; if older, migrate
- `lastSaved` MUST be a valid ISO 8601 date string

## Entity Relationships

```
Level ──contains──▶ ObstacleConfig[] (1:many, read-only definition)
GameState ──references──▶ Level (via currentLevelId)
GameState ──tracks──▶ PlayerCharacter (runtime, not persisted)
GameState ──tracks──▶ Obstacle[] (instantiated from ObstacleConfig)
GameState ──serializes-to──▶ SaveData (on save)
DialogueFrame[] ──loaded-by──▶ intro scene and ending scene
```
