# Research: Dragon Flight Game

**Feature**: 001-dragon-flight-game
**Date**: 2026-02-09

## 1. Game Framework Selection

**Decision**: Phaser 3 (latest stable)

**Rationale**:
- Full-featured 2D game framework with built-in physics, sprite
  animation, scene management, and collision detection
- Modular architecture: custom builds can reduce bundle by ~60%
- 37,800+ GitHub stars, extensive documentation and tutorials
- Excellent PWA compatibility, works with service workers
- Built-in support for sprite sheets, tilemaps, and tweens
- Arcade physics system is ideal for flappy-bird gravity/collision
- Supports both Canvas and WebGL renderers (switchable)

**Alternatives Considered**:
- **PixiJS**: Faster rendering but not a game framework. Would
  require building physics, collision, and scene management from
  scratch. Better for rendering-heavy apps, overkill complexity
  for this project.
- **Kaplay (Kaboom.js)**: Friendlier API but poor performance
  (3 FPS in benchmarks), small community (2,700 stars), least
  mature ecosystem. Not suitable for production PWA.

## 2. Renderer: Canvas 2D vs WebGL

**Decision**: Canvas 2D renderer (Phaser.CANVAS)

**Rationale**:
- WebGL on iOS Safari renders 1px elements blurry; Canvas
  maintains true 1:1 pixel mapping — critical for pixel art
- Faster initial load, consistent frame rates for 2D content
- Lower computational overhead for a simple side-scroller
- Phaser 3 supports switching renderer via a single config flag

**Alternatives Considered**:
- **WebGL**: Faster draw commands for complex scenes, but
  introduces pixel blurriness on Safari and is unnecessary
  overhead for a game with fewer than 50 sprites on screen.

## 3. PWA on iOS Safari: Limitations and Strategy

**Decision**: PWA with `display: standalone`, `orientation: landscape`

**Key Findings**:
- Service workers supported but background processing restricted
- iOS evicts PWA storage after 7 days of inactivity
- Cache API limit ~50MB on iOS
- No install prompts on iOS; manual Share > Add to Home Screen
- Fullscreen API NOT supported on iPhones (only iPads)
- `orientation` in manifest.json is the most reliable landscape lock
- Audio autoplay blocked until first user interaction

**Mitigation Strategy**:
- Use "Start Game" button to satisfy user interaction requirement
  before any audio playback
- Use `display: standalone` (not `fullscreen`) in manifest
- Set `orientation: landscape` in manifest
- Show a "rotate device" prompt if detected in portrait mode
- Keep total cached assets under 50MB
- Warn users about potential data eviction after inactivity

## 4. Game Progress Storage

**Decision**: IndexedDB via the `idb` wrapper library

**Rationale**:
- Asynchronous: does not block the game loop (unlike localStorage)
- Up to 500MB capacity on iOS (vs 5-10MB for localStorage)
- Works in service workers for offline support
- The `idb` library provides a clean Promise-based API

**User's Request**: "Save progress in a simple text file."
- The File System Access API is sandboxed on iOS Safari (Origin
  Private File System only). Users cannot browse to a save file.
- IndexedDB can store JSON-serialized game state as plain text,
  fulfilling the spirit of the request while being iOS-compatible.
- An export/import feature can allow users to download/upload
  their save data as a JSON text file.

**Alternatives Considered**:
- **localStorage**: Simplest API but synchronous (blocks rendering),
  5-10MB limit, less reliable data integrity.
- **File System Access API**: Not available on iOS Safari in any
  user-accessible form. Only sandboxed OPFS exists.
- **Cache API**: Designed for network resource caching, not
  structured data storage.

## 5. Testing Strategy

**Decision**: Vitest (unit tests) + Playwright (E2E tests)

**Rationale**:
- **Vitest**: Native ESM, fast HMR, browser mode for Canvas tests,
  near-zero config, 2026 industry standard
- **Playwright**: Real WebKit engine for iOS Safari approximation,
  cross-browser testing, screenshot-based visual regression

**Alternatives Considered**:
- **Jest 30**: ESM support still experimental, no browser mode,
  slower than Vitest.
- **Cypress**: No WebKit engine support, cannot approximate
  iOS Safari behavior.

## 6. Build Tooling

**Decision**: Vite

**Rationale**:
- Native Phaser 3 support via official Phaser project templates
- Fast dev server with HMR
- Optimized production builds with tree-shaking
- PWA plugin (`vite-plugin-pwa`) for service worker generation
  and manifest management
- Vitest integrates natively with Vite config

## 7. Project Architecture

**Decision**: Modular single-project structure

**Rationale**:
- Game is client-only (no backend server)
- Phaser scenes provide natural module boundaries
- Separate directories for scenes, entities, systems, assets,
  and configuration
- TypeScript for type safety across game entities and state
