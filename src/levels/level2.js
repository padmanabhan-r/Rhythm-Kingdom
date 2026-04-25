// =============================================================================
//  Rhythm Kingdom — Level 2: Heavy Beat
//  Mushroom pickup → BIG form → STOMP enemy.
// =============================================================================

window.RK.Levels = window.RK.Levels || {};

window.RK.Levels.level2 = {
  name: 'Level 2: Heavy Beat',
  startForm: 'SMALL',
  nextLevel: 'level3',
  hint: 'Grab the mushroom to grow BIG, then STOMP the enemy!',
  bgColor: 0x1a3a1a,
  playerStart: { x: 60, y: 380 },

  platforms: [
    { x: 0,   y: 460, w: 160 },
    { x: 240, y: 400, w: 100 },   // elevated — mushroom here
    { x: 400, y: 460, w: 200 },
    { x: 650, y: 460, w: 150 },
  ],

  spikes: [
    { x: 160, y: 460 }, { x: 180, y: 460 }, { x: 200, y: 460 }, { x: 220, y: 460 },
  ],

  enemies: [
    { type: 'stomp', x: 450, y: 440, left: 400, right: 590 },
  ],

  pickups: [
    { type: 'mushroom', x: 280, y: 375 },
  ],

  exit: { x: 770, y: 424 },
};
