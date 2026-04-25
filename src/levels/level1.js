// =============================================================================
//  Rhythm Kingdom — Level 1: The Root Gate
//  Intro level. Actions: JUMP + ROLL.
//  Elevated platforms reward exploration. Snakes on ground = instant death.
//  Wide water pits require double jump.
// =============================================================================

window.RK.Levels = window.RK.Levels || {};

window.RK.Levels.level1 = {
  name: 'The Root Gate',
  width: 3200,
  bgColor: 0x0d2318,
  nextLevel: 'level2',
  playerStart: { x: 80, y: 462 },
  unlockedActions: ['JUMP', 'ROLL'],

  platforms: [
    // ——— Section 1: Intro path ———
    { x: 0,    y: 498, w: 480,  type: 'jungle' },
    // Elevated platform — first reward
    { x: 160,  y: 380, w: 120,  type: 'jungle' },

    // [WATER PIT 1: x=480-640, 160px — learn single jump]

    // ——— Section 2: Rhythm practice ———
    { x: 640,  y: 498, w: 160,  type: 'jungle' },
    // Elevated
    { x: 680,  y: 360, w: 100,  type: 'jungle' },

    // [WATER PIT 2: x=800-1060, 260px — requires double jump]

    { x: 1060, y: 498, w: 160,  type: 'jungle' },
    { x: 1100, y: 370, w: 100,  type: 'jungle' },

    // [WATER PIT 3: x=1220-1420, 200px]

    // ——— Section 3: Long approach ———
    { x: 1420, y: 498, w: 760,  type: 'jungle' },  // x=1420-2180
    // Elevated platforms in long section
    { x: 1480, y: 370, w: 120,  type: 'jungle' },
    { x: 1720, y: 340, w: 140,  type: 'jungle' },
    { x: 1960, y: 370, w: 100,  type: 'jungle' },

    // Gate pillars (visual only, no ceiling block)
    { x: 2020, y: 498, w: 160,  type: 'gate' },

    // ——— Section 4: Post-gate gauntlet ———
    { x: 2200, y: 498, w: 120,  type: 'jungle' },
    { x: 2230, y: 360, w: 100,  type: 'jungle' },

    // [WATER PIT 4: x=2320-2580, 260px — requires double jump]

    { x: 2580, y: 498, w: 120,  type: 'jungle' },
    { x: 2620, y: 370, w: 100,  type: 'jungle' },

    // [WATER PIT 5: x=2700-2880, 180px]

    // ——— Section 5: Final sprint ———
    { x: 2880, y: 498, w: 320,  type: 'jungle' },
    { x: 2940, y: 360, w: 140,  type: 'jungle' },
  ],

  water: [
    { x: 480,  y: 500, w: 160, h: 120 },   // pit 1 — single jump
    { x: 800,  y: 500, w: 260, h: 120 },   // pit 2 — needs double jump
    { x: 1220, y: 500, w: 200, h: 120 },   // pit 3
    { x: 2320, y: 500, w: 260, h: 120 },   // pit 4 — needs double jump
    { x: 2700, y: 500, w: 180, h: 120 },   // pit 5
  ],

  thorns: [
    { x: 120,  y: 513 }, { x: 280,  y: 513 }, { x: 420,  y: 513 },
    { x: 680,  y: 513 }, { x: 760,  y: 513 },
    { x: 1100, y: 513 }, { x: 1160, y: 513 },
    { x: 1480, y: 513 }, { x: 1600, y: 513 }, { x: 1840, y: 513 },
    { x: 1960, y: 513 }, { x: 2080, y: 513 },
    { x: 2240, y: 513 }, { x: 2280, y: 513 },
    { x: 2600, y: 513 }, { x: 2640, y: 513 },
    { x: 2920, y: 513 }, { x: 3020, y: 513 }, { x: 3120, y: 513 },
  ],

  enemies: [
    { x: 340,  y: 462, type: 'snake',  patrol: [240,  460]  },
    { x: 1520, y: 462, type: 'snake',  patrol: [1430, 1640] },
    { x: 1780, y: 462, type: 'lizard', patrol: [1720, 1940] },
    { x: 2240, y: 462, type: 'snake',  patrol: [2210, 2300] },
    { x: 2640, y: 462, type: 'lizard', patrol: [2600, 2680] },
    { x: 2960, y: 462, type: 'snake',  patrol: [2900, 3100] },
  ],

  checkpoints: [
    { x: 2580, y: 458 },
  ],

  bananas: [
    // On elevated platforms
    { x: 200,  y: 356 }, { x: 230, y: 356 },
    { x: 720,  y: 336 }, { x: 750, y: 336 },
    { x: 1130, y: 346 }, { x: 1160, y: 346 },
    { x: 1520, y: 346 }, { x: 1550, y: 346 },
    { x: 1750, y: 316 }, { x: 1800, y: 316 },
    { x: 2650, y: 346 }, { x: 2680, y: 346 },
    { x: 2970, y: 336 }, { x: 3010, y: 336 },
  ],

  pickups: [],

  exit: { x: 3140, y: 458 },

  hint: 'JUMP over water. DOUBLE JUMP wide gaps. Avoid snakes!',
};
