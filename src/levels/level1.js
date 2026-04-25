// =============================================================================
//  Rhythm Kingdom — Level 1: First Loop
//  Tutorial: jump scheduling only. SMALL form, no enemies.
// =============================================================================

window.RK.Levels = window.RK.Levels || {};

window.RK.Levels.level1 = {
  name: 'Level 1: First Loop',
  startForm: 'SMALL',
  nextLevel: 'level2',
  hint: 'Place JUMP cards on the timeline to leap over the spike pits!',
  bgColor: 0x5c94fc,
  playerStart: { x: 60, y: 380 },

  platforms: [
    { x: 0,   y: 460, w: 200 },   // start platform
    { x: 280, y: 460, w: 120 },   // gap 1 landing
    { x: 490, y: 460, w: 120 },   // gap 2 landing
    { x: 690, y: 460, w: 110 },   // end platform
  ],

  spikes: [
    { x: 200, y: 460 }, { x: 220, y: 460 }, { x: 240, y: 460 }, { x: 260, y: 460 },
    { x: 410, y: 460 }, { x: 430, y: 460 }, { x: 450, y: 460 }, { x: 470, y: 460 },
    { x: 620, y: 460 }, { x: 640, y: 460 }, { x: 660, y: 460 },
  ],

  enemies: [],
  pickups: [],
  exit: { x: 760, y: 424 },
};
