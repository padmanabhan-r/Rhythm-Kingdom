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
    // Section 1: Open jungle path (continuous)
    { x: 0,    y: 498, w: 960,  type: 'jungle' },

    // Section 2: Rhythm practice — spaced platforms (intentional gaps — jump over)
    // Section 2: Rhythm practice — spaced platforms (intentional gaps — jump over)
    { x: 1000, y: 498, w: 80,  type: 'jungle' },
    { x: 1120, y: 498, w: 120,  type: 'jungle' },
    { x: 1300, y: 498, w: 120,  type: 'jungle' },
    { x: 1480, y: 498, w: 120,  type: 'jungle' },

    // Section 3: Root Gate — stone wall with small gate, must roll to pass
    { x: 1460, y: 498, w: 740,  type: 'jungle' },

    // Stone wall with gate at floor level (roll to open)
    { x: 1980, y: 498, w: 200,  type: 'gate' },

    // Low ceiling tunnel — blocks jumping, forces roll through the gate
    // Standing body top = 462, ceiling bottom = 460 → jump blocked; roll body top = 480 → clears
    { x: 1700, y: 440, w: 580,  type: 'ceiling' },

    // Section 4: "Collapsing bridge" — 3 narrow platforms (intentional gaps)
    { x: 2180, y: 498, w: 140,   type: 'jungle' },
    { x: 2380, y: 498, w: 140,   type: 'jungle' },
    { x: 2580, y: 498, w: 140,   type: 'jungle' },

    // Section 5: Post-checkpoint run to exit (continuous)
    { x: 2720, y: 498, w: 480,  type: 'jungle' },
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
