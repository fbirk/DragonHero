# DragonHero Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-09

## Active Technologies

- TypeScript 5.x + Phaser 3 (game framework), Vite (build tool), vite-plugin-pwa (PWA support), idb (IndexedDB wrapper) (001-dragon-flight-game)
- IndexedDB via idb library (001-dragon-flight-game)

## Project Structure

```text
src/
├── main.ts                  # Phaser game config and entry point
├── scenes/                  # Phaser scenes (one per game screen)
├── entities/                # Game entities (Dragon, Obstacle)
├── systems/                 # Game systems (Physics, Collision, Scroll)
├── data/                    # Static data (level definitions, dialogue)
├── storage/                 # Persistence (SaveManager)
├── config/                  # Game configuration and constants
└── assets/                  # Sprites, backgrounds, UI, portraits

public/                      # PWA manifest, icons, index.html
tests/
├── unit/                    # Vitest unit tests
└── e2e/                     # Playwright E2E tests
```

## Commands

npm test; npm run lint

## Code Style

TypeScript: Follow standard conventions

## Recent Changes

- 001-dragon-flight-game: Added TypeScript 5.x + Phaser 3, Vite, vite-plugin-pwa, idb

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
