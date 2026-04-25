// =============================================================================
//  Rhythm Kingdom — constants.js
//  Global namespace. Loaded first.
// =============================================================================

window.RK = {
  WIDTH:       960,
  HEIGHT:      540,
  PLAY_HEIGHT: 500,
  UI_HEIGHT:   60,

  BPM: 120,
  BEAT_MS: 500,
  BEAT_COUNT: 8,

  GRAVITY: 900,
  PLAYER_SPEED: 200,
  JUMP_FORCE: -420,
  JUMP_FORCE_DOUBLE: -560,
  COYOTE_MS: 150,
  COCONUT_SPEED: 250,

  ACTIONS: { JUMP: 'JUMP', ROLL: 'ROLL', COCONUT: 'COCONUT' },

  ACTION_COLORS: {
    JUMP:    0x44bb66,
    ROLL:    0x4488ff,
    COCONUT: 0xddaa22,
  },

  // Persists across scene restarts for the browser session
  _session: { beatCount: 8, trackIndex: 1, trackKey: 'backing_loop' },

  COLORS: {
    BG:      0x0d2318,
    TEAL:    0x1a4a2a,
    AMBER:   0xcc8833,
    JADE:    0x44ffaa,
    GOLD:    0xffcc44,
    DANGER:  0xcc2222,
    STONE:   0x3a2e1a,
    UI_GOLD: 0xcc9933,
  },

  PLAYER_W: 22,
  PLAYER_H: 32,
  ROLL_W:   22,
  ROLL_H:   18,

  // Populated by level files
  Levels: {},
};
