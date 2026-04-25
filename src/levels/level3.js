// =============================================================================
//  Rhythm Kingdom — Level 3: Final Track
//  All three forms. Fire-only enemy, hazard enemy, flower pickup.
// =============================================================================

window.RK.Levels = window.RK.Levels || {};

window.RK.Levels.level3 = {
  name: 'Level 3: Final Track',
  startForm: 'BIG',
  nextLevel: null,
  hint: 'Get the flower for FIRE form. Shoot the purple enemy to clear the path!',
  bgColor: 0x1e0808,
  playerStart: { x: 60, y: 300 },

  platforms: [
    { x: 0,   y: 340, w: 160 },
    { x: 240, y: 280, w: 120 },   // elevated — flower pickup
    { x: 420, y: 340, w: 100 },
    { x: 580, y: 200, w: 220 },   // upper path (fire required)
    { x: 400, y: 460, w: 200 },   // lower path
    { x: 650, y: 460, w: 150 },
  ],

  spikes: [
    { x: 160, y: 340 }, { x: 180, y: 340 },
    { x: 360, y: 460 }, { x: 380, y: 460 },
  ],

  enemies: [
    { type: 'stomp',    x: 440, y: 320, left: 420, right: 510 },
    { type: 'fireonly',  x: 620, y: 180, left: 580, right: 790 },
    { type: 'hazard',   x: 430, y: 440, left: 400, right: 590 },
  ],

  pickups: [
    { type: 'flower', x: 300, y: 255 },
  ],

  exit: { x: 770, y: 164 },
};
