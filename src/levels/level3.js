// =============================================================================
//  Rhythm Kingdom — Level 3: Canopy Heart  [STUB]
//  New: Punch unlocked. All 4 actions in play.
// =============================================================================

window.RK.Levels = window.RK.Levels || {};

window.RK.Levels.level3 = {
  name: 'Canopy Heart',
  width: 2800,
  bgColor: 0x081510,
  nextLevel: null,
  playerStart: { x: 80, y: 410 },
  unlockedActions: ['JUMP', 'ROLL', 'COCONUT'],
  music: { trackIndex: 2, variantIndex: 1 },

  platforms: [
    { x: 0,    y: 440, w: 250, type: 'jungle' },
    { x: 330,  y: 380, w: 150, type: 'jungle' },
    { x: 560,  y: 310, w: 150, type: 'jungle' },
    { x: 780,  y: 260, w: 150, type: 'jungle' },
    { x: 1000, y: 310, w: 200, type: 'jungle' },
    { x: 1280, y: 380, w: 200, type: 'jungle' },
    { x: 1560, y: 300, w: 200, type: 'jungle' },
    { x: 1840, y: 240, w: 200, type: 'jungle' },
    { x: 2100, y: 300, w: 300, type: 'jungle' },
    { x: 2480, y: 380, w: 300, type: 'jungle' },
  ],

  thorns: [
    { x: 282, y: 450 }, { x: 512, y: 450 }, { x: 742, y: 450 },
  ],

  enemies: [
    { x: 400,  y: 355, type: 'bat',      patrol: [330, 470] },
    { x: 840,  y: 235, type: 'guardian', patrol: [780, 920] },
    { x: 1080, y: 285, type: 'lizard',   patrol: [1000, 1190] },
    { x: 1890, y: 215, type: 'bat',      patrol: [1840, 2030] },
    { x: 2180, y: 275, type: 'guardian', patrol: [2100, 2380] },
  ],

  checkpoints: [
    { x: 1540, y: 270 },
  ],

  pickups: [],

  bananas: [
    { x: 370,  y: 355 }, { x: 400, y: 355 },
    { x: 600,  y: 285 }, { x: 630, y: 285 },
    { x: 820,  y: 235 }, { x: 850, y: 235 },
    { x: 1040, y: 285 }, { x: 1070, y: 285 },
    { x: 1320, y: 355 }, { x: 1350, y: 355 },
    { x: 1600, y: 275 }, { x: 1630, y: 275 },
    { x: 1880, y: 215 }, { x: 1910, y: 215 },
    { x: 2150, y: 275 }, { x: 2180, y: 275 },
    { x: 2520, y: 355 }, { x: 2550, y: 355 },
  ],

  exit: { x: 2750, y: 360 },

  hint: 'Three runes. Reach the heart of the kingdom.',
};
