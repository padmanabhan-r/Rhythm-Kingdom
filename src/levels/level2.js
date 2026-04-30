// =============================================================================
//  Rhythm Kingdom — Level 2: Temple of Echoes  [STUB]
//  New: Coconut Throw unlocked. Introduces bat + guardian enemies.
// =============================================================================

window.RK.Levels = window.RK.Levels || {};

window.RK.Levels.level2 = {
  name: 'Temple of Echoes',
  width: 2400,
  bgColor: 0x0a1a12,
  nextLevel: 'level3',
  playerStart: { x: 80, y: 410 },
  unlockedActions: ['JUMP', 'ROLL'],
  music: { trackIndex: 1, variantIndex: 1 },

  platforms: [
    { x: 0,    y: 440, w: 300, type: 'jungle' },
    { x: 380,  y: 380, w: 200, type: 'jungle' },
    { x: 660,  y: 320, w: 200, type: 'jungle' },
    { x: 900,  y: 380, w: 200, type: 'jungle' },
    { x: 1100, y: 300, w: 200, type: 'jungle' },
    { x: 1300, y: 380, w: 700,  type: 'jungle' },  // 1300-2000, closes gap at x:1300
    { x: 2000, y: 320, w: 200,  type: 'jungle' },  // 2000-2200, step up
    { x: 2200, y: 260, w: 200,  type: 'jungle' },  // 2200-2400, temple platform (exit)
  ],

  thorns: [
    { x: 312, y: 450 }, { x: 580, y: 450 }, { x: 846, y: 450 },
  ],

  enemies: [
    { x: 700,  y: 295, type: 'lizard',   patrol: [660, 850] },
    { x: 1150, y: 275, type: 'bat',      patrol: [1100, 1290] },
    { x: 1600, y: 355, type: 'guardian', patrol: [1450, 1780] },
  ],

  checkpoints: [
    { x: 1380, y: 350 },  // now on platform (main starts at x:1300)
  ],

  pickups: [
    { x: 500, y: 350, type: 'relic_shard', unlocks: 'COCONUT' },
  ],

  bananas: [
    { x: 420,  y: 355 }, { x: 450, y: 355 },
    { x: 700,  y: 295 }, { x: 730, y: 295 },
    { x: 940,  y: 355 }, { x: 970, y: 355 },
    { x: 1150, y: 275 }, { x: 1180, y: 275 },
    { x: 1500, y: 355 }, { x: 1540, y: 355 },
    { x: 1850, y: 355 }, { x: 1880, y: 355 },
    { x: 2060, y: 295 }, { x: 2090, y: 295 },
    { x: 2250, y: 235 }, { x: 2285, y: 235 },
  ],

  exit: { x: 2260, y: 240 },

  decorations: [
    { key: 'temple_1', x: 150,  y: 500, scale: 0.22, depth: -1, originX: 0.5, originY: 1 },
  ],

  hint: 'Collect the rune shard to unlock Coconut Throw!',
};
