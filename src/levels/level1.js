// =============================================================================
//  Rhythm Kingdom — Level 1: The Root Gate
//  Polished intro level. Actions: JUMP + ROLL. No combat.
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
    // Section 1: Open jungle path
    { x: 0,    y: 498, w: 400,  type: 'jungle' },
    { x: 480,  y: 498, w: 160,  type: 'jungle' },
    { x: 720,  y: 498, w: 200,  type: 'jungle' },

    // Section 2: Rhythm practice — spaced platforms
    { x: 1000, y: 468, w: 100,  type: 'jungle' },
    { x: 1180, y: 468, w: 100,  type: 'jungle' },
    { x: 1360, y: 468, w: 100,  type: 'jungle' },

    // Section 3: Root cavern — low ceiling forces rolling
    { x: 1520, y: 498, w: 500,  type: 'jungle' },
    { x: 1540, y: 408, w: 440,  type: 'ceiling' },

    // Section 4: "Collapsing bridge" — 3 narrow platforms
    { x: 2100, y: 498, w: 80,   type: 'jungle' },
    { x: 2250, y: 498, w: 80,   type: 'jungle' },
    { x: 2400, y: 498, w: 80,   type: 'jungle' },

    // Section 5: Post-checkpoint run to exit
    { x: 2560, y: 498, w: 640,  type: 'jungle' },
  ],

  thorns: [
    { x: 422, y: 513 },
    { x: 662, y: 513 },
    { x: 952, y: 513 },
    { x: 2085, y: 513 },
    { x: 2230, y: 513 },
    { x: 2380, y: 513 },
    { x: 2535, y: 513 },
  ],

  enemies: [
    { x: 2680, y: 462, type: 'lizard', patrol: [2600, 2850] },
    { x: 2950, y: 462, type: 'lizard', patrol: [2870, 3080] },
  ],

  checkpoints: [
    { x: 2540, y: 458 },
  ],

  pickups: [],

  exit: { x: 3140, y: 458 },

  hint: 'Place JUMP in a beat slot.  ROLL squeezes through low gaps.',
};
