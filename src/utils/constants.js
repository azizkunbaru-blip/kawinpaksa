export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const ASPECT_RATIO = GAME_WIDTH / GAME_HEIGHT;

export const LANES = 3;
export const LANE_Y = [
  GAME_HEIGHT * 0.35,
  GAME_HEIGHT * 0.5,
  GAME_HEIGHT * 0.65,
];

export const PLAYER_START_X = 220;
export const PLAYER_LANE_INDEX = 1;
export const GROOM_START_OFFSET = 120;

export const BASE_SPEED = 240;
export const MAX_SPEED = 520;
export const SPEED_INCREMENT = 22;
export const SPEED_INTERVAL_MS = 12000;

export const OBSTACLE_SPAWN_BASE_MS = 900;
export const OBSTACLE_SPAWN_MIN_MS = 420;
export const OBSTACLE_SPAWN_DECAY = 18;

export const HIT_STUN_MS = 350;
export const HIT_SLOW_FACTOR = 0.45;

export const DASH_DURATION_MS = 250;
export const DASH_COOLDOWN_MS = 2500;
export const DASH_SPEED_BOOST = 210;

export const RUBBER_BAND_GAIN = 0.055;
export const RUBBER_BAND_SAFE_TIME_MS = 3200;
export const RUBBER_BAND_RELAX = 0.18;

export const GAMEOVER_DISTANCE = 24;
export const DISTANCE_START = 180;
export const DISTANCE_MAX = 360;

export const PARALLAX_LAYER_SPEEDS = [0.2, 0.35, 1.0];

export const CAMERA_SHAKE = {
  duration: 120,
  intensity: 0.004,
};

export const SCORE_DODGE_BONUS = 3;

export const HUD_PADDING = 16;
export const HUD_FONT_SIZE = 20;

export const TOUCH_CONTROL_ALPHA = 0.35;
export const TOUCH_CONTROL_RADIUS = 38;
export const TOUCH_CONTROL_MARGIN = 24;

export const OBSTACLE_TYPES = [
  { key: 'cone', width: 26, height: 26 },
  { key: 'car', width: 48, height: 24 },
  { key: 'hole', width: 32, height: 18 },
];

export const PLAYER_TEXTURE_KEY = 'bride';
export const GROOM_TEXTURE_KEY = 'groom';
export const BG_LAYER_KEYS = ['bg1', 'bg2', 'road'];
