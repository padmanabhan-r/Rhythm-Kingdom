// =============================================================================
//  Rhythm Kingdom — main.js
//  Phaser 3 game config. Loaded last.
// =============================================================================

(function () {
  'use strict';

  if (typeof Phaser === 'undefined') {
    console.error('[RK] Phaser not loaded.');
    return;
  }

  const config = {
    type: Phaser.AUTO,
    width: RK.WIDTH,
    height: RK.HEIGHT,
    backgroundColor: '#0d2318',
    parent: 'game-container',

    render: {
      antialias: true,
      pixelArt: false,
    },

    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: RK.GRAVITY },
        debug: false,
      },
    },

    scene: [BootScene, MenuScene, GameScene, UIScene],

    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    audio: { disableWebAudio: false },
  };

  // Wait for Google Fonts before starting — prevents canvas font fallback on hard refresh
  document.fonts.ready.then(() => {
    window.game = new Phaser.Game(config);
  });
}());
