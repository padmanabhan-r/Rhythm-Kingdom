// =============================================================================
//  Rhythm Kingdom — constants.js
//  Global namespace. Loaded first.
// =============================================================================

window.RK = {
  WIDTH: 800,
  HEIGHT: 600,
  PLAY_HEIGHT: 480,
  UI_HEIGHT: 120,
  BPM: 120,
  BEAT_MS: 500,          // 60000 / 120
  BEAT_COUNT: 8,
  GRAVITY: 900,
  PLAYER_SPEED: 180,
  JUMP_FORCE: -500,
  COYOTE_MS: 150,
  PROJ_SPEED: 300,

  FORMS:   { SMALL: 'SMALL', BIG: 'BIG', FIRE: 'FIRE' },
  ACTIONS: { JUMP: 'JUMP', STOMP: 'STOMP', FIRE: 'FIRE' },

  ALLOWED: {
    SMALL: ['JUMP'],
    BIG:   ['JUMP', 'STOMP'],
    FIRE:  ['JUMP', 'STOMP', 'FIRE'],
  },

  CARD_COLORS: { JUMP: 0x44cc44, STOMP: 0xddaa00, FIRE: 0xff4422 },
  FORM_TINTS:  { SMALL: 0x4488ff, BIG: 0xff4444, FIRE: 0xff8800 },

  HITBOX: {
    SMALL: { w: 14, h: 18 },
    BIG:   { w: 16, h: 28 },
    FIRE:  { w: 16, h: 28 },
  },

  // Populated by level files
  Levels: {},
};
