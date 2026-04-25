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

  pickups: [
    { x: 900, y: 235, type: 'relic_shard', unlocks: 'PUNCH' },
  ],

  exit: { x: 2750, y: 360 },

  hint: 'All four beats. Reach the heart of the kingdom.',
};
