// =============================================================================
//  Rhythm Kingdom — main.js
//  Phaser 3 game config and entry point. Loaded last.
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
    backgroundColor: '#1a1a2e',
    parent: 'game-container',

    render: {
      antialias: false,
      pixelArt: true,
      roundPixels: true,
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
      autoCenter: Phaser.Scale.NO_CENTER,
      width: RK.WIDTH,
      height: RK.HEIGHT,
    },

    audio: { disableWebAudio: false },
  };

  window.game = new Phaser.Game(config);
}());
