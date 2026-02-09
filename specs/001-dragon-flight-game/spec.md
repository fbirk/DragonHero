# Feature Specification: Dragon Flight Game

**Feature Branch**: `001-dragon-flight-game`
**Created**: 2026-02-09
**Status**: Draft
**Input**: User description: "Build a small 2D pixel art fantasy game for mobile devices where a lady knight rides a dragon through flappy-bird-style obstacle courses across 2-3 levels, with an intro story sequence, three lives, and a final ending scene."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play Through a Complete Level (Priority: P1)

A player opens the game, taps the start button, watches a short speech-bubble intro story, and then plays the first level. The level is a side-scrolling obstacle course where the dragon flies forward automatically (background scrolls left) while the player taps to make the dragon rise and releases to let it fall. Obstacles appear at the top and bottom of the screen. The player has three lives and loses one each time the dragon collides with an obstacle. The level has a fixed length; reaching the end triggers a final ending scene.

**Why this priority**: This is the core gameplay loop. Without a playable level, there is no game. All other features build on top of this.

**Independent Test**: Can be fully tested by launching the app, tapping Start, reading the intro, playing through the level, and verifying that the ending scene appears on completion. Delivers a complete, playable game experience.

**Acceptance Scenarios**:

1. **Given** the game is launched, **When** the player taps the Start button, **Then** the intro story sequence begins with speech-bubble-style text over a pixel art scene.
2. **Given** the intro sequence has finished, **When** the last speech bubble is dismissed, **Then** the first gameplay level begins immediately.
3. **Given** the level is active, **When** the player taps the screen, **Then** the dragon moves upward; when the player stops tapping, the dragon falls downward due to gravity.
4. **Given** the level is active, **When** the background scrolls to the left, **Then** obstacles approach from the right side and the dragon's horizontal position remains fixed on screen.
5. **Given** the player has 3 lives and collides with an obstacle, **When** the collision occurs, **Then** one life is deducted, a brief hit feedback is shown, and gameplay continues from a safe position.
6. **Given** the player has 1 life remaining and collides with an obstacle, **When** the collision occurs, **Then** a Game Over screen is displayed.
7. **Given** the player has lives remaining, **When** the dragon passes the final obstacle and reaches the level end, **Then** a final ending scene is displayed with the lady knight and dragon.

---

### User Story 2 - Retry After Game Over (Priority: P2)

A player who loses all three lives sees a Game Over screen and can choose to retry the current level from the beginning or return to the start screen.

**Why this priority**: Without retry capability, the game is a single-attempt experience. Retry is essential for player engagement and replayability.

**Independent Test**: Can be tested by intentionally colliding with obstacles until all lives are lost, verifying the Game Over screen appears, and confirming both retry and return-to-start options work correctly.

**Acceptance Scenarios**:

1. **Given** the player has lost all 3 lives, **When** the Game Over screen is displayed, **Then** a "Retry" button and a "Main Menu" button are visible.
2. **Given** the Game Over screen is displayed, **When** the player taps "Retry", **Then** the current level restarts with 3 lives and the intro is skipped.
3. **Given** the Game Over screen is displayed, **When** the player taps "Main Menu", **Then** the player is returned to the start screen with the Start button.

---

### User Story 3 - Experience the Pixel Art Theme (Priority: P3)

A player enjoys a cohesive 2D pixel art visual experience throughout the game, including the start screen, intro story, gameplay, and ending scene. The fantasy theme is consistent: the hero is a lady knight riding a small dragon through a fantasy landscape.

**Why this priority**: Visual polish makes the game feel complete and engaging but is layered on top of working gameplay mechanics.

**Independent Test**: Can be tested by playing through the entire game flow and verifying that all screens use pixel art styling, the character is recognizable as a lady knight on a dragon, and the fantasy theme is consistent.

**Acceptance Scenarios**:

1. **Given** the game is launched, **When** any screen is displayed (start, intro, gameplay, ending, game over), **Then** all visual elements use a consistent 2D pixel art style.
2. **Given** the gameplay level is active, **When** the player observes the character, **Then** the character is clearly recognizable as a lady knight riding a small dragon with idle and flap animations.
3. **Given** the gameplay level is active, **When** the background scrolls, **Then** the environment features a fantasy-themed parallax landscape (e.g., mountains, castles, clouds) rendered in pixel art.
4. **Given** the intro sequence is playing, **When** dialogue is displayed, **Then** it appears in speech bubbles with a pixel art font, accompanied by character portraits.

---

### Edge Cases

- What happens when the player taps rapidly during the intro story? The game MUST either queue taps to advance dialogue or ignore taps during speech bubble animation to prevent skipping content unintentionally.
- What happens when the dragon is at the very top of the screen and the player taps? The dragon MUST NOT move above the visible play area; it MUST be clamped to the screen boundary.
- What happens when the dragon is at the very bottom of the screen? Hitting the ground MUST count as a collision and deduct a life, same as hitting an obstacle.
- What happens if the player does nothing (no taps) during gameplay? The dragon MUST fall continuously under gravity until it hits the ground, losing a life.
- What happens when the player receives a phone call or switches apps mid-game? The game MUST pause automatically and display a pause overlay; lives and progress MUST be preserved.
- What happens when the player loses a life mid-level? A brief invincibility period (approximately 2 seconds) MUST be granted to prevent immediate consecutive deaths.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST display a start screen with a single "Start" button and the game title rendered in pixel art style.
- **FR-002**: The game MUST play a speech-bubble intro story sequence after the player taps Start, introducing the lady knight and her dragon through 4-6 dialogue frames.
- **FR-003**: The game MUST provide a side-scrolling gameplay level where the background moves from right to left at a consistent speed.
- **FR-004**: The player MUST control the dragon's vertical position by tapping (rise) and releasing (fall via gravity). The dragon MUST NOT move horizontally on screen.
- **FR-005**: Obstacles MUST appear on both the top and bottom of the screen, creating gaps the player must navigate through.
- **FR-006**: The level MUST have a fixed, predetermined length (defined by total scroll distance, not time) with a clear finish point.
- **FR-007**: The player MUST start each level with 3 lives, displayed on-screen as heart icons.
- **FR-008**: The game MUST detect collisions between the dragon and obstacles, deducting one life per collision.
- **FR-009**: After a collision, the game MUST grant a brief invincibility period (approximately 2 seconds) with a visual flashing indicator.
- **FR-010**: When all 3 lives are lost, the game MUST display a Game Over screen with retry and main menu options.
- **FR-011**: When the player reaches the end of the level, the game MUST display a final ending scene with the lady knight and dragon.
- **FR-012**: The game MUST pause automatically when the app goes to the background and resume when it returns to the foreground.
- **FR-013**: All visual assets MUST use a consistent 2D pixel art style with a fantasy theme.
- **FR-014**: The intro and ending scenes MUST use speech-bubble-style dialogue with character portraits.
- **FR-015**: The game MUST run at a stable frame rate on mid-range mobile devices without dropped frames during normal gameplay.

### Key Entities

- **Player Character (Dragon + Knight)**: The controllable game entity. Attributes: vertical position, velocity, invincibility state, animation state (idle, flapping, hit). The lady knight rides on top of the dragon.
- **Obstacle**: A pair of top and bottom barriers creating a gap. Attributes: horizontal position, gap vertical position, gap size, visual variant. Obstacles scroll from right to left.
- **Level**: A single gameplay stage. Attributes: total scroll length, obstacle sequence (positions and gap sizes), scroll speed, background theme.
- **Game State**: Tracks the current game session. Attributes: current lives (0-3), current level progress (scroll position), game phase (start screen, intro, playing, game over, ending).
- **Dialogue Frame**: A single unit of the story sequence. Attributes: speaker identity, dialogue text, character portrait, background scene.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can complete a full game session (start, intro, level, ending) in under 5 minutes.
- **SC-002**: The game maintains a smooth, consistent frame rate on devices released within the last 4 years without visible stuttering during gameplay.
- **SC-003**: 90% of first-time players successfully navigate the first 3 obstacle gaps without external instruction, confirming intuitive controls.
- **SC-004**: The game loads from launch to the start screen in under 3 seconds on target devices.
- **SC-005**: All game screens (start, intro, gameplay, game over, ending) display correctly in landscape orientation on iOS devices with screen heights from 320pt to 430pt.
- **SC-006**: Players who lose all lives can restart and be playing again within 3 seconds of tapping "Retry".
- **SC-007**: The visual theme is recognized as "pixel art fantasy" by 8 out of 10 testers without prompting.

### Assumptions

- The game targets landscape orientation on iOS devices (iPhones as primary target).
- Touch input is the only control method (no gamepad or tilt controls).
- The game does not require network connectivity; it is fully offline-capable.
- Sound effects and background music are out of scope for the initial version but the architecture should not prevent adding them later.
- The game ships with a single level for the initial release; the architecture supports adding more levels later.
- Asset creation (pixel art sprites, backgrounds) is handled separately from the development work.
