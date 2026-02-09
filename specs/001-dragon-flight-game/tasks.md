# Tasks: Dragon Flight Game

**Input**: Design documents from `/specs/001-dragon-flight-game/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Included for critical paths per constitution Principle II (test-first for core business logic and user-facing flows).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling, and basic structure

- [x] T001 Initialize TypeScript project with Vite, install Phaser 3, idb, and vite-plugin-pwa dependencies in `package.json`
- [x] T002 Create Phaser game configuration with Canvas renderer, 480x320 logical resolution, and FIT scale mode in `src/config/gameConfig.ts`
- [x] T003 [P] Define physics, timing, and sizing constants (gravity, flap strength, terminal velocity, invincibility duration, scroll speed, gap size range) in `src/config/constants.ts`
- [x] T004 [P] Configure ESLint and Prettier with TypeScript rules in `.eslintrc.cjs` and `.prettierrc`
- [x] T005 [P] Configure Vitest in `vitest.config.ts` with coverage reporter
- [x] T006 [P] Configure Playwright for E2E tests in `playwright.config.ts` with WebKit browser
- [x] T007 Create PWA manifest with `display: standalone`, `orientation: landscape`, app name, theme colors, and icon references in `public/manifest.json`
- [x] T008 Create entry HTML with viewport meta tag, landscape orientation hint, and Canvas container in `public/index.html`
- [x] T009 Create Phaser game entry point that registers all scenes and starts BootScene in `src/main.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Tests (critical path: physics, collision, save/load)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T010 [P] Write unit tests for PhysicsSystem: gravity application, flap impulse, terminal velocity cap, boundary clamping (top/bottom) in `tests/unit/systems/PhysicsSystem.test.ts`
- [x] T011 [P] Write unit tests for CollisionSystem: obstacle hit detection, ground collision, invincibility activation, invincibility expiration, life deduction in `tests/unit/systems/CollisionSystem.test.ts`
- [x] T012 [P] Write unit tests for Dragon entity: construction, flap state transition, hit state transition, invincibility timer countdown, animation state changes in `tests/unit/entities/Dragon.test.ts`
- [x] T013 [P] Write unit tests for Obstacle entity: construction, horizontal movement, off-screen destruction, gap validation (80-160px range, min 40px barrier height) in `tests/unit/entities/Obstacle.test.ts`
- [x] T014 [P] Write unit tests for SaveManager: save data serialization, load with valid data, load with missing data, load with outdated version, export as JSON string in `tests/unit/storage/SaveManager.test.ts`

### Implementation

- [x] T015 [P] Implement Dragon entity class with y position, velocityY, invincibility state, invincibility timer, and animation state enum (idle, flapping, hit) in `src/entities/Dragon.ts`
- [x] T016 [P] Implement Obstacle entity class with x position, gapY, gapSize, variant, passed flag, and top/bottom barrier bounds calculation in `src/entities/Obstacle.ts`
- [x] T017 Implement PhysicsSystem with gravity application, flap impulse, terminal velocity cap, and y-boundary clamping in `src/systems/PhysicsSystem.ts` (depends on T015)
- [x] T018 Implement CollisionSystem with rectangle overlap detection between Dragon hitbox and Obstacle barriers, ground collision, invincibility timer management, and life deduction callback in `src/systems/CollisionSystem.ts` (depends on T015, T016)
- [x] T019 Implement ScrollSystem with background parallax scrolling (multiple layers at different speeds), obstacle horizontal movement, obstacle off-screen cleanup, and scroll progress tracking in `src/systems/ScrollSystem.ts` (depends on T016)
- [x] T020 [P] Define Level 1 obstacle layout with spawnX positions, gapY values, gapSize values, and variants for approximately 15-20 obstacles over the level length in `src/data/levels.ts`
- [x] T021 [P] Define intro dialogue sequence (4-6 frames) and ending dialogue sequence (2-3 frames) with speaker, text, portraitKey, and backgroundKey for each frame in `src/data/dialogue.ts`
- [x] T022 [P] Implement SaveManager with IndexedDB open/create via idb, save game state, load game state, delete save, and export save as JSON string in `src/storage/SaveManager.ts`
- [x] T023 Implement BootScene that preloads all sprite sheets, background layers, UI assets, portrait images, and pixel art font, showing a loading progress bar in `src/scenes/BootScene.ts` (depends on T009)
- [x] T024 [P] Add placeholder pixel art assets: dragon+knight sprite sheet (idle, flap, hit frames), obstacle sprites (at least 1 variant), background layers (sky, mountains, ground), UI elements (start button, heart icon, speech bubble frame, pixel font), character portraits (knight, dragon) in `src/assets/` subdirectories

**Checkpoint**: Foundation ready — all entities, systems, data, and assets are in place. User story implementation can now begin.

---

## Phase 3: User Story 1 — Play Through a Complete Level (Priority: P1) MVP

**Goal**: A player can launch the game, tap Start, watch the intro story, play a full flappy-bird level with 3 lives, and reach the ending scene on completion.

**Independent Test**: Launch app → tap Start → read intro → play through level → verify ending scene appears. Also: collide with obstacles to verify life deduction and invincibility.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T025 [P] [US1] Write unit tests for ScrollSystem: scroll progress reaches totalLength triggers level-complete callback, obstacle spawn timing matches level config in `tests/unit/systems/ScrollSystem.test.ts`
- [x] T026 [P] [US1] Write E2E test for full gameplay flow: launch → tap Start → intro plays → gameplay starts → dragon responds to tap → obstacles appear → reaching end triggers ending scene in `tests/e2e/gameplay.spec.ts`

### Implementation for User Story 1

- [x] T027 [US1] Implement StartScene with game title text, Start button (min 44x44pt touch target), and background image; transition to IntroScene on tap in `src/scenes/StartScene.ts`
- [x] T028 [US1] Implement IntroScene that displays dialogue frames sequentially in speech bubbles with character portraits and background scene; advance on tap (with debounce to prevent skip); transition to GameScene with `{ levelId: 'level-1', lives: 3, isRetry: false }` on completion in `src/scenes/IntroScene.ts`
- [x] T029 [US1] Implement GameScene core loop: initialize Dragon at center-left, render scrolling background via ScrollSystem, spawn obstacles from level config via ScrollSystem, apply PhysicsSystem each frame (gravity + tap input for flap), run CollisionSystem each frame, display 3 heart icons for lives HUD, handle life loss (flash dragon, reset position, activate invincibility), transition to EndingScene on level complete in `src/scenes/GameScene.ts`
- [x] T030 [US1] Implement touch/tap input handling in GameScene: pointerdown applies flap impulse via PhysicsSystem, pointerup stops flap; handle visibility change event to pause game and show pause overlay in `src/scenes/GameScene.ts`
- [x] T031 [US1] Implement EndingScene that displays ending dialogue frames in speech bubbles with character portraits, saves game progress via SaveManager, and transitions to StartScene on final tap in `src/scenes/EndingScene.ts`
- [x] T032 [US1] Wire all scenes together in game config scene list and verify full flow: BootScene → StartScene → IntroScene → GameScene → EndingScene → StartScene in `src/main.ts` and `src/config/gameConfig.ts`

**Checkpoint**: User Story 1 is fully functional. Player can complete a full game session: start → intro → play level → ending.

---

## Phase 4: User Story 2 — Retry After Game Over (Priority: P2)

**Goal**: A player who loses all 3 lives sees a Game Over screen and can retry the level or return to the main menu.

**Independent Test**: Intentionally collide with obstacles until all 3 lives are lost → Game Over screen appears → tap Retry → level restarts with 3 lives (intro skipped) → tap Main Menu → returns to start screen.

### Tests for User Story 2

- [x] T033 [P] [US2] Write E2E test for retry flow: lose all lives → Game Over screen → tap Retry → gameplay restarts with 3 lives and no intro → also test Main Menu returns to StartScene in `tests/e2e/navigation.spec.ts`

### Implementation for User Story 2

- [x] T034 [US2] Add game-over transition in GameScene: when lives reach 0 after collision, transition to GameOverScene with `{ levelId, scrollProgress }` in `src/scenes/GameScene.ts`
- [x] T035 [US2] Implement GameOverScene with "Game Over" title text, Retry button (min 44x44pt), and Main Menu button (min 44x44pt); Retry transitions to GameScene with `{ levelId, lives: 3, isRetry: true }`, Main Menu transitions to StartScene in `src/scenes/GameOverScene.ts`
- [x] T036 [US2] Update GameScene to accept `isRetry` flag: when true, skip IntroScene and start gameplay immediately with 3 lives in `src/scenes/GameScene.ts`

**Checkpoint**: User Stories 1 AND 2 are functional. Full game loop with retry works independently.

---

## Phase 5: User Story 3 — Experience the Pixel Art Theme (Priority: P3)

**Goal**: All game screens use a cohesive 2D pixel art visual style with consistent fantasy theme. The character is recognizable as a lady knight on a dragon with animations.

**Independent Test**: Play through entire game flow and verify all screens use pixel art styling, character has idle/flap/hit animations, backgrounds have parallax depth, dialogue uses speech bubbles with pixel font and character portraits.

### Implementation for User Story 3

- [x] T037 [P] [US3] Replace placeholder dragon+knight sprite sheet with final pixel art sprites containing idle (2-frame), flap (3-frame), and hit (2-frame) animation sequences in `src/assets/sprites/`
- [x] T038 [P] [US3] Replace placeholder obstacle sprites with final pixel art obstacle variants (e.g., stone pillars, thorny vines) in `src/assets/sprites/`
- [x] T039 [P] [US3] Replace placeholder backgrounds with final pixel art parallax layers: far sky/clouds, mid mountains/castles, near ground/trees (at least 3 layers per scene) in `src/assets/backgrounds/`
- [x] T040 [P] [US3] Replace placeholder UI elements with final pixel art: start button, heart icons, speech bubble frame, game over text, pixel art font bitmap in `src/assets/ui/`
- [x] T041 [P] [US3] Replace placeholder character portraits with final pixel art portraits for knight and dragon (used in intro/ending dialogue) in `src/assets/portraits/`
- [x] T042 [US3] Configure Dragon sprite animations in BootScene and Dragon entity: map idle, flap, and hit animation keys to sprite sheet frames with correct frame rates in `src/scenes/BootScene.ts` and `src/entities/Dragon.ts`
- [x] T043 [US3] Implement multi-layer parallax scrolling in ScrollSystem: configure per-layer scroll speed ratios (far=0.2x, mid=0.5x, near=1.0x of base scroll speed) and seamless tile wrapping in `src/systems/ScrollSystem.ts`
- [x] T044 [US3] Style StartScene with pixel art title text (using bitmap font), themed background, and styled start button in `src/scenes/StartScene.ts`
- [x] T045 [US3] Style IntroScene and EndingScene speech bubbles with pixel art frame sprite, bitmap font text, and animated portrait display in `src/scenes/IntroScene.ts` and `src/scenes/EndingScene.ts`
- [x] T046 [US3] Style GameOverScene with pixel art "Game Over" text, themed background, and styled retry/menu buttons in `src/scenes/GameOverScene.ts`
- [x] T047 [US3] Define design tokens in constants: color palette (hex values), font sizes, spacing values, button dimensions, and ensure all scenes reference these tokens instead of ad-hoc values in `src/config/constants.ts`

**Checkpoint**: All user stories are functional with cohesive pixel art visual theme across every screen.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T048 [P] Configure vite-plugin-pwa service worker generation to precache all assets for offline play in `vite.config.ts`
- [x] T049 [P] Add portrait-mode detection: if device is in portrait orientation, show a full-screen "Please rotate your device" overlay in `src/scenes/BootScene.ts` or `src/main.ts`
- [x] T050 Implement save data export/import: add export button on StartScene that downloads save as `.json` file, add import button that reads a `.json` file and restores save data in `src/scenes/StartScene.ts` and `src/storage/SaveManager.ts`
- [x] T051 [P] Performance optimization: verify 60fps on iOS Safari, profile with Chrome DevTools, optimize sprite draw calls and garbage collection in all scenes
- [x] T052 [P] Add PWA icons (192x192 and 512x512 pixel art dragon icon) in `public/icons/`
- [x] T053 Run quickstart.md validation: follow quickstart.md steps from scratch, verify `npm install`, `npm run dev`, `npm run build`, `npm run test`, and `npm run test:e2e` all succeed
- [ ] T054 Verify PWA installation flow on iOS device: build → serve → open in Safari → Add to Home Screen → launch from home screen → verify landscape lock, offline play, and save persistence

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 (GameScene and GameOverScene transition)
- **User Story 3 (Phase 5)**: Can start after Foundational, but best after US1+US2 (polishes existing screens)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories
- **User Story 2 (P2)**: Depends on GameScene from US1 (adds game-over transition and retry flow)
- **User Story 3 (P3)**: Can start after Foundational — replaces placeholder assets and adds visual polish to all scenes created in US1 and US2

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Entities before systems
- Systems before scenes
- Data definitions before scenes that consume them
- Scene implementation before scene integration
- Story complete before moving to next priority

### Parallel Opportunities

- Setup: T003, T004, T005, T006, T007, T008 can all run in parallel after T001+T002
- Foundational tests: T010, T011, T012, T013, T014 can all run in parallel
- Foundational entities: T015, T016 can run in parallel
- Foundational data + storage: T020, T021, T022, T024 can run in parallel
- US1 tests: T025, T026 can run in parallel
- US3 assets: T037, T038, T039, T040, T041 can all run in parallel
- Polish: T048, T049, T051, T052 can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all foundational tests together:
Task: "Unit tests for PhysicsSystem in tests/unit/systems/PhysicsSystem.test.ts"
Task: "Unit tests for CollisionSystem in tests/unit/systems/CollisionSystem.test.ts"
Task: "Unit tests for Dragon entity in tests/unit/entities/Dragon.test.ts"
Task: "Unit tests for Obstacle entity in tests/unit/entities/Obstacle.test.ts"
Task: "Unit tests for SaveManager in tests/unit/storage/SaveManager.test.ts"

# Launch all foundational entities together:
Task: "Implement Dragon entity in src/entities/Dragon.ts"
Task: "Implement Obstacle entity in src/entities/Obstacle.ts"

# Launch all data + storage together:
Task: "Define Level 1 layout in src/data/levels.ts"
Task: "Define dialogue sequences in src/data/dialogue.ts"
Task: "Implement SaveManager in src/storage/SaveManager.ts"
Task: "Add placeholder assets in src/assets/"
```

---

## Parallel Example: User Story 3 (Assets)

```bash
# Launch all asset replacement tasks together:
Task: "Final dragon+knight sprites in src/assets/sprites/"
Task: "Final obstacle sprites in src/assets/sprites/"
Task: "Final background layers in src/assets/backgrounds/"
Task: "Final UI elements in src/assets/ui/"
Task: "Final character portraits in src/assets/portraits/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test full flow — start → intro → play → ending
5. Deploy/demo if ready (playable game with placeholder art)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP with placeholder art!)
3. Add User Story 2 → Test retry/game-over flow → Deploy/Demo
4. Add User Story 3 → Replace all placeholders with final pixel art → Deploy/Demo (final product)
5. Polish phase → PWA hardening, iOS testing, performance verification

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verify tests fail before implementing (red-green-refactor)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Placeholder assets in Phase 2 allow gameplay testing before final art is ready
- Asset creation (T037-T041) can be done by a designer in parallel with development
