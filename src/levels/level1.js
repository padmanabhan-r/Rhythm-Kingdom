// =============================================================================
//  Rhythm Kingdom — Level 1: The Root Gate
//  Intro level. Actions: JUMP + ROLL. Water pits, traps, mandatory gate roll.
//
//  Gate physics: tall wall bodies y=0-476 block standing (body top=462<476)
//  but rolling player (body top=480>476) can pass underneath.
// =============================================================================

window.RK.Levels = window.RK.Levels || {};

window.RK.Levels.level1 = {
  name: 'The Root Gate',
  width: 3200,
  bgColor: 0x0d2318,
  nextLevel: 'level2',
  playerStart: { x: 80, y: 482 },
  unlockedActions: ['JUMP', 'ROLL'],

  platforms: [
    // ——— Section 1: Intro jungle path ———
    { x: 0,    y: 498, w: 560,  type: 'jungle' },

    // [WATER PIT 1: x=560-700, 140px — first gap, learn jump timing]

    // ——— Section 2: Rhythm practice platforms ———
    { x: 700,  y: 498, w: 160,  type: 'jungle' },

    // [WATER PIT 2: x=860-1040, 180px]

    { x: 1040, y: 498, w: 160,  type: 'jungle' },

    // [WATER PIT 3: x=1200-1380, 180px]

    // ——— Section 3: Long approach to Root Gate ———
    { x: 1380, y: 498, w: 820,  type: 'jungle' },   // x=1380-2200

    // Gate wall structure (on top of floor above)
    { x: 1980, y: 498, w: 200,  type: 'gate' },

    // ——— Section 4: Post-gate gauntlet ———
    { x: 2200, y: 498, w: 140,  type: 'jungle' },

    // [WATER PIT 4: x=2340-2520, 180px]

    { x: 2520, y: 498, w: 140,  type: 'jungle' },

    // [WATER PIT 5: x=2660-2820, 160px]

    // ——— Section 5: Final sprint to exit ———
    { x: 2820, y: 498, w: 380,  type: 'jungle' },
  ],

  water: [
    { x: 560,  y: 500, w: 140, h: 120 },
    { x: 860,  y: 500, w: 180, h: 120 },
    { x: 1200, y: 500, w: 180, h: 120 },
    { x: 2340, y: 500, w: 180, h: 120 },
    { x: 2660, y: 500, w: 160, h: 120 },
  ],

  thorns: [
    { x: 180,  y: 513 },
    { x: 340,  y: 513 },
    { x: 490,  y: 513 },
    { x: 740,  y: 513 },
    { x: 820,  y: 513 },
    { x: 1080, y: 513 },
    { x: 1160, y: 513 },
    { x: 1460, y: 513 },
    { x: 1640, y: 513 },
    { x: 1830, y: 513 },
    { x: 1940, y: 513 },
    { x: 2230, y: 513 },
    { x: 2290, y: 513 },
    { x: 2570, y: 513 },
    { x: 2640, y: 513 },
    { x: 2870, y: 513 },
    { x: 3020, y: 513 },
    { x: 3110, y: 513 },
  ],

  enemies: [
    { x: 380,  y: 462, type: 'lizard', patrol: [280,  520]  },
    { x: 1520, y: 462, type: 'lizard', patrol: [1430, 1640] },
    { x: 2250, y: 462, type: 'lizard', patrol: [2210, 2320] },
    { x: 2900, y: 462, type: 'lizard', patrol: [2860, 3060] },
    { x: 3090, y: 462, type: 'lizard', patrol: [3020, 3180] },
  ],

  checkpoints: [
    { x: 2520, y: 458 },
  ],

  pickups: [],

  exit: { x: 3140, y: 458 },

  hint: 'JUMP over water pits.  ROLL squeezes through the stone gate.',
};
