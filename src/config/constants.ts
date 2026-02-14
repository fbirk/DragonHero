// Game dimensions
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 320;
export const MIN_GAME_WIDTH = 480;
export const MAX_GAME_WIDTH = 740;

// Physics
export const GRAVITY = 600;
export const FLAP_VELOCITY = -200;
export const TERMINAL_VELOCITY = 400;
export const DRAGON_START_X = 80;
export const DRAGON_START_Y = 160;

// Obstacles
export const MIN_GAP_SIZE = 80;
export const MAX_GAP_SIZE = 160;
export const MIN_BARRIER_HEIGHT = 40;
export const OBSTACLE_WIDTH = 48;

// Gameplay
export const MAX_LIVES = 3;
export const INVINCIBILITY_DURATION = 2000;
export const INVINCIBILITY_FLASH_INTERVAL = 100;

// Scrolling
export const BASE_SCROLL_SPEED = 2;
export const PARALLAX_FAR = 0.2;
export const PARALLAX_MID = 0.5;
export const PARALLAX_NEAR = 1.0;

// Level
export const LEVEL_1_LENGTH = 7000;

// UI
export const HEART_SIZE = 16;
export const HEART_SPACING = 4;
export const HEART_MARGIN_TOP = 8;
export const HEART_MARGIN_LEFT = 8;
export const BUTTON_MIN_SIZE = 44;

// Design tokens
export const COLORS = {
  background: '#1a1a2e',
  primary: '#e94560',
  secondary: '#0f3460',
  accent: '#16213e',
  text: '#ffffff',
  textDark: '#1a1a2e',
  heartFull: '#e94560',
  heartEmpty: '#333333',
} as const;

// Dialogue
export const DIALOGUE_SPEED = 30;
export const DIALOGUE_ADVANCE_DEBOUNCE = 300;
