# Implementation Plan: Dragon Flight Game

**Branch**: `001-dragon-flight-game` | **Date**: 2026-02-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-dragon-flight-game/spec.md`

## Summary

Build a 2D pixel art flappy-bird-style mobile game as a Progressive Web App. A lady knight rides a dragon through side-scrolling obstacle courses. The game features a start screen, speech-bubble intro story, flappy-bird gameplay with 3 lives and fixed-length levels, game over/retry flow, and a final ending scene. Built with Phaser 3 (Canvas renderer) and Vite, targeting iOS Safari in landscape mode. Game progress persisted via IndexedDB.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Phaser 3 (game framework), Vite (build tool), vite-plugin-pwa (PWA support), idb (IndexedDB wrapper)
**Storage**: IndexedDB via `idb` library (game saves as JSON)
**Testing**: Vitest (unit tests), Playwright (E2E tests)
**Target Platform**: iOS Safari (PWA, landscape mode), also usable as standalone web app in any modern browser
**Project Type**: Single client-only web application
**Performance Goals**: 60 fps sustained during gameplay, < 2s cold start, < 100ms touch response
**Constraints**: < 50MB total cached assets (iOS PWA limit), offline-capable, no backend server, Canvas 2D renderer (not WebGL) for pixel-perfect rendering on iOS
**Scale/Scope**: 1 level for MVP, architecture supports 2-3 levels, ~6 screens (start, intro, gameplay, pause, game over, ending)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality

| Gate | Status | Notes |
|---|---|---|
| Readability over cleverness | PASS | TypeScript with descriptive naming; Phaser scenes provide clear separation |
| Single Responsibility | PASS | Each scene is one screen; entities, systems, and data are separate modules |
| No dead code | PASS | Enforced via ESLint no-unused-vars and tree-shaking |
| Consistent style | PASS | ESLint + Prettier configured in project setup |
| Minimal dependencies | PASS | 4 runtime deps (Phaser, idb, vite-plugin-pwa manifest, service worker); all justified in research.md |
| Error handling at boundaries | PASS | SaveManager validates IndexedDB reads; touch input validated at scene level |
| Documentation where it matters | PASS | Public APIs documented; constants file self-documenting |

### II. Testing Standards

| Gate | Status | Notes |
|---|---|---|
| Test-first for critical paths | PASS | Physics, collision, and save/load get tests before implementation |
| Test pyramid | PASS | Many unit tests (entities, systems, data), few integration (scene transitions), minimal E2E (full playthrough) |
| Naming convention | PASS | `describe/it` pattern: `dragon_whenTapping_movesUpward` |
| No test interdependence | PASS | Each test creates its own entity instances |
| Coverage tracking | PASS | Vitest coverage reporter enabled |
| Edge case coverage | PASS | Boundary clamping, zero lives, max velocity tested |
| CI integration | PASS | GitHub Actions runs Vitest + Playwright on push |

### III. UX Consistency (Mobile-First)

| Gate | Status | Notes |
|---|---|---|
| Platform conventions | PASS | PWA follows iOS HIG for touch targets and safe areas |
| Touch-first design | PASS | All buttons ≥ 44x44pt; gameplay is tap-only |
| Responsive layout | PASS | Phaser scale manager with FIT mode adapts to any landscape screen |
| Consistent visual language | PASS | Pixel art design tokens in constants.ts (colors, sizes, spacing) |
| Accessible by default | JUSTIFIED | Game canvas has limited accessibility by nature; UI overlays (menus, game over) use semantic HTML with ARIA labels and meet contrast ratios |
| Motion and feedback | PASS | < 100ms tap response; flashing on hit; respects prefers-reduced-motion for non-gameplay animations |
| Offline resilience | PASS | Fully offline; service worker caches all assets; IndexedDB for saves |
| Navigation clarity | PASS | Linear flow: Start → Intro → Game → Ending; always clear how to go back |

## Project Structure

### Documentation (this feature)

```text
specs/001-dragon-flight-game/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── game-state.md    # Scene transitions, save format, data formats
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── main.ts                  # Phaser game config and entry point
├── scenes/
│   ├── BootScene.ts         # Asset preloading with progress bar
│   ├── StartScene.ts        # Title screen with Start button
│   ├── IntroScene.ts        # Speech-bubble story sequence
│   ├── GameScene.ts         # Core flappy-bird gameplay loop
│   ├── GameOverScene.ts     # Game over with Retry / Main Menu
│   └── EndingScene.ts       # Victory ending scene
├── entities/
│   ├── Dragon.ts            # Player character (dragon + knight)
│   └── Obstacle.ts          # Top/bottom obstacle pair
├── systems/
│   ├── PhysicsSystem.ts     # Gravity, velocity, boundary clamping
│   ├── CollisionSystem.ts   # Hit detection, invincibility timer
│   └── ScrollSystem.ts      # Background parallax and obstacle movement
├── data/
│   ├── levels.ts            # Level definitions (obstacle layouts)
│   └── dialogue.ts          # Intro and ending story dialogue frames
├── storage/
│   └── SaveManager.ts       # IndexedDB save/load/export/import
├── config/
│   ├── gameConfig.ts        # Phaser config (Canvas, 480x320, scale)
│   └── constants.ts         # Physics, timing, sizing constants
└── assets/
    ├── sprites/             # Pixel art sprite sheets (dragon, knight, obstacles)
    ├── backgrounds/         # Parallax background layers
    ├── ui/                  # Buttons, hearts, speech bubbles
    └── portraits/           # Character portraits for dialogue

public/
├── manifest.json            # PWA manifest (landscape, standalone)
├── index.html               # Entry HTML
└── icons/                   # PWA icons

tests/
├── unit/
│   ├── entities/            # Dragon, Obstacle unit tests
│   ├── systems/             # Physics, Collision, Scroll tests
│   └── storage/             # SaveManager tests
└── e2e/
    ├── gameplay.spec.ts     # Full gameplay flow
    └── navigation.spec.ts   # Menu navigation, retry, transitions
```

**Structure Decision**: Single client-only project. No backend needed. Phaser scenes act as natural module boundaries. The `entities/`, `systems/`, and `data/` directories follow a lightweight ECS-inspired pattern that keeps game logic separate from rendering. All configuration is centralized in `config/`.

## Complexity Tracking

No constitution violations detected. No complexity justifications needed.
