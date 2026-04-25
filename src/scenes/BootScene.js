// =============================================================================
//  Rhythm Kingdom — BootScene.js
//  Generates all procedural textures, initialises audio, then goes to Menu.
// =============================================================================

class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.add.rectangle(RK.WIDTH / 2, RK.HEIGHT / 2, RK.WIDTH, RK.HEIGHT, RK.COLORS.BG);
    this._status = this.add.text(RK.WIDTH / 2, RK.HEIGHT / 2, 'Loading…', {
      fontSize: '18px', color: '#44ffaa', fontFamily: 'monospace',
    }).setOrigin(0.5);
  }

  create() {
    this._genTextures();
    // Shared audio instance — loaded non-blocking
    window.RK._audio = new RK.AudioManager();
    window.RK._audio.loadSounds();
    this._status.destroy();
    this.scene.start('MenuScene');
  }

  // ---------------------------------------------------------------------------
  _genTextures() {
    const g = this.add.graphics();

    // ----------------------------------------------------------------- GORILLA

    this._gorilla(g, 'gorilla_idle',  false, false);
    this._gorilla(g, 'gorilla_run',   true,  false);
    this._gorilla(g, 'gorilla_jump',  false, true);

    // ----------------------------------------------------------------- ENEMIES

    // enemy_lizard (26×22) — green patrol reptile
    try {
      g.clear();
      g.fillStyle(0x1a5c18); g.fillEllipse(13, 14, 22, 16);
      g.fillStyle(0x228822); g.fillEllipse(13, 13, 20, 13);
      g.fillStyle(0x33aa33); g.fillEllipse(13, 12, 16, 10);
      // Tail
      g.fillStyle(0x1a5c18); g.fillTriangle(22, 16, 26, 12, 26, 20);
      // Head
      g.fillStyle(0x228822); g.fillEllipse(5, 11, 12, 10);
      g.fillStyle(0x33aa33); g.fillEllipse(4, 10, 9, 7);
      // Eye
      g.fillStyle(0xffdd00); g.fillCircle(4, 9, 2.5);
      g.fillStyle(0x111100); g.fillCircle(4, 9, 1.5);
      // Feet
      g.fillStyle(0x1a5c18); g.fillRect(5, 18, 4, 4); g.fillRect(14, 18, 4, 4);
      g.fillStyle(0x228822); g.fillRect(3, 21, 7, 2); g.fillRect(12, 21, 7, 2);
      g.generateTexture('enemy_lizard', 26, 22);
    } catch(e) {}

    // enemy_bat (28×20) — dark flying creature
    try {
      g.clear();
      // Wings
      g.fillStyle(0x3a1a4a); g.fillEllipse(7, 12, 14, 10); g.fillEllipse(21, 12, 14, 10);
      g.fillStyle(0x4d2266); g.fillEllipse(7, 11, 11, 7); g.fillEllipse(21, 11, 11, 7);
      g.fillStyle(0x5a2878); g.fillTriangle(1, 16, 8, 8, 10, 16); g.fillTriangle(27, 16, 20, 8, 18, 16);
      // Body
      g.fillStyle(0x2a1040); g.fillEllipse(14, 12, 12, 14);
      g.fillStyle(0x3a1a55); g.fillEllipse(14, 11, 10, 11);
      // Eyes
      g.fillStyle(0xff4444); g.fillCircle(11, 9, 2.5); g.fillCircle(17, 9, 2.5);
      g.fillStyle(0xff0000); g.fillCircle(11, 9, 1.5); g.fillCircle(17, 9, 1.5);
      // Ears
      g.fillStyle(0x2a1040); g.fillTriangle(10, 4, 8, 10, 13, 9); g.fillTriangle(18, 4, 15, 9, 20, 10);
      // Fangs
      g.fillStyle(0xffffff); g.fillTriangle(12, 14, 11, 18, 13, 18); g.fillTriangle(16, 14, 15, 18, 17, 18);
      g.generateTexture('enemy_bat', 28, 20);
    } catch(e) {}

    // enemy_guardian (30×30) — stone-armored, coconut-only
    try {
      g.clear();
      // Stone armor body
      g.fillStyle(0x4a4035); g.fillEllipse(15, 18, 26, 22);
      g.fillStyle(0x5e5245); g.fillEllipse(15, 17, 24, 19);
      g.fillStyle(0x726655); g.fillEllipse(15, 16, 20, 15);
      // Armor cracks
      g.fillStyle(0x3a3028); g.fillRect(10, 12, 1, 10); g.fillRect(18, 14, 1, 8);
      g.fillRect(12, 20, 6, 1);
      // Head
      g.fillStyle(0x4a4035); g.fillCircle(15, 9, 9);
      g.fillStyle(0x5e5245); g.fillCircle(15, 8, 7);
      // Glowing eyes
      g.fillStyle(0xff6600); g.fillCircle(11, 9, 3); g.fillCircle(19, 9, 3);
      g.fillStyle(0xff4400); g.fillCircle(11, 9, 2); g.fillCircle(19, 9, 2);
      g.fillStyle(0xffcc44); g.fillCircle(11, 9, 1); g.fillCircle(19, 9, 1);
      // Horns
      g.fillStyle(0x4a4035); g.fillTriangle(9, 1, 6, 8, 13, 7); g.fillTriangle(21, 1, 17, 7, 24, 8);
      g.fillStyle(0x5e5245); g.fillTriangle(9, 3, 7, 8, 11, 8); g.fillTriangle(21, 3, 19, 8, 23, 8);
      g.generateTexture('enemy_guardian', 30, 30);
    } catch(e) {}

    // ------------------------------------------------------------------ WORLD

    // platform_jungle (64×20) — mossy carved stone
    try {
      g.clear();
      g.fillStyle(0x1a4a22); g.fillRect(0, 0, 64, 7);   // moss top
      g.fillStyle(0x228833); g.fillRect(1, 1, 62, 4);
      g.fillStyle(0x33aa44); g.fillRect(2, 1, 60, 2);
      g.fillStyle(0x3a2e1a); g.fillRect(0, 7, 64, 13);   // stone base
      g.fillStyle(0x4a3c26); g.fillRect(1, 8, 62, 4);
      g.fillStyle(0x3a2e1a); g.fillRect(0, 12, 64, 1);   // stone seam
      g.fillStyle(0x2a2015); g.fillRect(0, 13, 64, 7);
      g.fillStyle(0xcc9933, 0.4); g.fillRect(28, 9, 8, 3); // gold rune mark
      g.generateTexture('platform_jungle', 64, 20);
    } catch(e) {}

    // ground_jungle (800×24) — dark soil with roots
    try {
      g.clear();
      g.fillStyle(0x1a4a22); g.fillRect(0, 0, 800, 5);
      g.fillStyle(0x228833); g.fillRect(0, 1, 800, 3);
      g.fillStyle(0x1a1408); g.fillRect(0, 5, 800, 19);
      g.fillStyle(0x241c0e); g.fillRect(0, 6, 800, 5);
      // Root details
      g.fillStyle(0x5a3a18); g.fillRect(80, 7, 3, 10); g.fillRect(200, 8, 2, 8);
      g.fillRect(340, 6, 4, 12); g.fillRect(520, 7, 3, 9);
      g.generateTexture('ground_jungle', 800, 24);
    } catch(e) {}

    // thorn_spike (16×20) — organic curved thorn
    try {
      g.clear();
      g.fillStyle(0x1a5c18); g.fillTriangle(8, 0, 0, 20, 16, 20);
      g.fillStyle(0x228822); g.fillTriangle(8, 2, 2, 20, 14, 20);
      g.fillStyle(0x33aa33); g.fillTriangle(8, 4, 4, 20, 12, 20);
      // Curved tip highlight
      g.fillStyle(0x44cc44); g.fillRect(7, 2, 2, 4);
      g.generateTexture('thorn_spike', 16, 20);
    } catch(e) {}

    // exit_arch (48×56) — carved stone archway with jade glow
    try {
      g.clear();
      // Stone pillars
      g.fillStyle(0x4a4035); g.fillRect(0, 10, 12, 46); g.fillRect(36, 10, 12, 46);
      g.fillStyle(0x5e5245); g.fillRect(1, 11, 10, 44); g.fillRect(37, 11, 10, 44);
      // Arch top
      g.fillStyle(0x4a4035); g.fillEllipse(24, 12, 48, 22);
      g.fillStyle(0x5e5245); g.fillEllipse(24, 12, 44, 18);
      // Gold trim
      g.fillStyle(0xcc9933); g.lineStyle(2, 0xcc9933); g.strokeRect(1, 11, 10, 44);
      g.fillRect(0, 10, 12, 2); g.fillRect(36, 10, 12, 2);
      // Jade center glow
      g.fillStyle(0x0d2318); g.fillRect(12, 8, 24, 48);
      g.fillStyle(0x44ffaa, 0.3); g.fillRect(12, 8, 24, 48);
      g.fillStyle(0x44ffaa, 0.5); g.fillEllipse(24, 24, 16, 20);
      // Rune marks on pillars
      g.fillStyle(0xcc9933, 0.7); g.fillRect(3, 20, 6, 2); g.fillRect(39, 20, 6, 2);
      g.fillRect(3, 28, 6, 2); g.fillRect(39, 28, 6, 2);
      g.generateTexture('exit_arch', 48, 56);
    } catch(e) {}

    // relic_shard (14×14) — glowing shard pickup (tinted per action in game)
    try {
      g.clear();
      g.fillStyle(0x88ffcc); g.fillTriangle(7, 0, 0, 14, 14, 14);
      g.fillStyle(0xaaffdd); g.fillTriangle(7, 2, 2, 14, 12, 14);
      g.fillStyle(0xffffff); g.fillTriangle(7, 4, 5, 10, 9, 10);
      g.fillStyle(0x44ffaa, 0.5); g.fillRect(5, 10, 4, 3);
      g.generateTexture('relic_shard', 14, 14);
    } catch(e) {}

    // checkpoint (24×40) — ancient stone pillar with glyph
    try {
      g.clear();
      g.fillStyle(0x4a4035); g.fillRect(0, 10, 24, 30);
      g.fillStyle(0x5e5245); g.fillRect(1, 11, 22, 28);
      g.fillStyle(0x6a5e50); g.fillRect(2, 11, 6, 28);
      // Capital top
      g.fillStyle(0x5e5245); g.fillRect(0, 8, 24, 4);
      g.fillStyle(0x726655); g.fillRect(0, 7, 24, 3);
      // Glyph
      g.fillStyle(0x44ffaa); g.fillRect(10, 18, 4, 14);
      g.fillRect(8, 18, 8, 3);
      g.fillRect(8, 25, 8, 3);
      // Base
      g.fillStyle(0x4a4035); g.fillRect(0, 36, 24, 4);
      g.generateTexture('checkpoint', 24, 40);
    } catch(e) {}

    // coconut (14×14) — round brown projectile
    try {
      g.clear();
      g.fillStyle(0x5a3810); g.fillCircle(7, 7, 7);
      g.fillStyle(0x7a4e18); g.fillCircle(6, 6, 5);
      g.fillStyle(0x9a6628); g.fillCircle(5, 5, 3);
      g.fillStyle(0x1a0c00); g.fillCircle(8, 5, 2); g.fillCircle(5, 9, 1.5); g.fillCircle(10, 9, 1.5);
      g.generateTexture('coconut', 14, 14);
    } catch(e) {}

    // bg_canopy (400×300) — far background, jungle canopy silhouette
    this._genCanopy(g);

    // ------------------------------------------------------------------- UI

    // beat_well (80×80) — carved stone well with gold rim
    try {
      g.clear();
      g.fillStyle(0x2a2015); g.fillRoundedRect(0, 0, 80, 80, 8);
      g.fillStyle(0x3a3020); g.fillRoundedRect(2, 2, 76, 76, 7);
      g.fillStyle(0xcc9933); g.fillRoundedRect(3, 3, 74, 74, 6);
      g.fillStyle(0x3a3020); g.fillRoundedRect(5, 5, 70, 70, 5);
      g.fillStyle(0x0d1810); g.fillRoundedRect(8, 8, 64, 64, 4);
      g.fillStyle(0x1a2815); g.fillRoundedRect(10, 10, 60, 60, 3);
      // Inner gold ring glow
      g.lineStyle(1, 0xcc9933, 0.4); g.strokeRoundedRect(12, 12, 56, 56, 3);
      // Corner accents
      g.fillStyle(0xffcc44); g.fillRect(5, 5, 4, 4); g.fillRect(71, 5, 4, 4);
      g.fillRect(5, 71, 4, 4); g.fillRect(71, 71, 4, 4);
      g.generateTexture('beat_well', 80, 80);
    } catch(e) {}

    // ui_panel (800×120) — stone panel with gold inlay top border
    try {
      g.clear();
      g.fillStyle(0x1a140e); g.fillRect(0, 0, 800, 120);
      g.fillStyle(0x241c12); g.fillRect(0, 0, 800, 30);
      g.fillStyle(0x2e2418); g.fillRect(0, 0, 800, 12);
      // Gold top border
      g.fillStyle(0xcc9933); g.fillRect(0, 0, 800, 3);
      g.fillStyle(0xffcc44); g.fillRect(0, 0, 800, 1);
      // Subtle horizontal stone lines
      g.fillStyle(0x241c12); g.fillRect(0, 40, 800, 1); g.fillRect(0, 80, 800, 1);
      // Corner gold accents
      g.fillStyle(0xcc9933); g.fillRect(0, 0, 8, 8); g.fillRect(792, 0, 8, 8);
      g.fillRect(0, 112, 8, 8); g.fillRect(792, 112, 8, 8);
      g.generateTexture('ui_panel', 800, 120);
    } catch(e) {}

    // Action icon textures (56×56 each) — glyph on dark bg
    this._actionIcon(g, 'action_jump',    RK.ACTION_COLORS.JUMP,    'jump');
    this._actionIcon(g, 'action_roll',    RK.ACTION_COLORS.ROLL,    'roll');
    this._actionIcon(g, 'action_coconut', RK.ACTION_COLORS.COCONUT, 'coconut');
    this._actionIcon(g, 'action_punch',   RK.ACTION_COLORS.PUNCH,   'punch');

    // playhead (8×72) — jade glow bar
    try {
      g.clear();
      g.fillStyle(0x44ffaa); g.fillRect(2, 0, 4, 72);
      g.fillStyle(0x88ffcc); g.fillRect(3, 0, 2, 72);
      g.fillStyle(0x44ffaa, 0.3); g.fillRect(0, 0, 2, 72); g.fillRect(6, 0, 2, 72);
      g.generateTexture('playhead', 8, 72);
    } catch(e) {}

    // particle textures
    try {
      g.clear(); g.fillStyle(0xccaa66); g.fillRect(0, 0, 6, 6);
      g.generateTexture('particle_dust', 6, 6);
    } catch(e) {}
    try {
      g.clear(); g.fillStyle(0xffcc44); g.fillRect(0, 0, 5, 5);
      g.generateTexture('particle_spark', 5, 5);
    } catch(e) {}

    // 1×1 white pixel — used for invisible physics bodies
    try {
      g.clear(); g.fillStyle(0xffffff); g.fillRect(0, 0, 1, 1);
      g.generateTexture('px', 1, 1);
    } catch(e) {}

    g.destroy();
  }

  // ---------------------------------------------------------------------------
  _gorilla(g, key, running, jumping) {
    const W = 28, H = 36;
    try {
      g.clear();
      // Ears
      g.fillStyle(0x2d1b0e); g.fillCircle(3, 11, 4); g.fillCircle(25, 11, 4);
      g.fillStyle(0x8b6914); g.fillCircle(3, 11, 2.5); g.fillCircle(25, 11, 2.5);
      // Head
      g.fillStyle(0x2d1b0e); g.fillCircle(14, 10, 10);
      g.fillStyle(0x3d2510); g.fillCircle(14, 9, 8);
      // Heavy brow ridge
      g.fillStyle(0x1a0e06); g.fillRect(5, 6, 18, 5);
      g.fillStyle(0x2d1b0e); g.fillRect(6, 8, 16, 2);
      // Muzzle
      g.fillStyle(0x5a3a18); g.fillEllipse(14, 16, 12, 8);
      g.fillStyle(0x6a4a22); g.fillEllipse(14, 15, 9, 6);
      // Eyes
      g.fillStyle(0xcc9933); g.fillCircle(10, 11, 2.5); g.fillCircle(18, 11, 2.5);
      g.fillStyle(0x0d0800); g.fillCircle(10, 11, 1.5); g.fillCircle(18, 11, 1.5);
      g.fillStyle(0xffffff); g.fillCircle(9.5, 10.5, 0.8); g.fillCircle(17.5, 10.5, 0.8);
      // Nostrils
      g.fillStyle(0x1a0e06); g.fillCircle(12.5, 15, 1.5); g.fillCircle(15.5, 15, 1.5);
      // Body
      g.fillStyle(0x2d1b0e); g.fillEllipse(14, 26, 22, 18);
      g.fillStyle(0x3d2510); g.fillEllipse(14, 25, 20, 15);
      // Chest patch (golden)
      g.fillStyle(0x8b6914); g.fillEllipse(14, 27, 12, 10);
      g.fillStyle(0xaa8820); g.fillEllipse(14, 26, 9, 7);
      // Arms — vary by pose
      if (jumping) {
        // Arms raised
        g.fillStyle(0x2d1b0e); g.fillEllipse(4, 20, 7, 12); g.fillEllipse(24, 20, 7, 12);
        g.fillStyle(0x1a0e06); g.fillEllipse(4, 16, 6, 5); g.fillEllipse(24, 16, 6, 5);
        // Legs tucked
        g.fillStyle(0x2d1b0e); g.fillEllipse(10, 32, 7, 8); g.fillEllipse(18, 32, 7, 8);
      } else if (running) {
        // Arms swinging — one forward, one back
        g.fillStyle(0x2d1b0e); g.fillEllipse(3, 26, 7, 13); g.fillEllipse(25, 30, 7, 13);
        g.fillStyle(0x1a0e06); g.fillEllipse(3, 32, 8, 5); g.fillEllipse(25, 36, 8, 5);
        // Legs — stride
        g.fillStyle(0x2d1b0e); g.fillRect(7, 32, 5, 5); g.fillRect(16, 30, 5, 6);
      } else {
        // Idle — arms hanging
        g.fillStyle(0x2d1b0e); g.fillEllipse(4, 28, 7, 14); g.fillEllipse(24, 28, 7, 14);
        g.fillStyle(0x1a0e06); g.fillEllipse(4, 34, 8, 5); g.fillEllipse(24, 34, 8, 5);
        // Legs
        g.fillStyle(0x2d1b0e); g.fillRect(8, 32, 5, 4); g.fillRect(15, 32, 5, 4);
      }
      g.generateTexture(key, W, H);
    } catch(e) {}
  }

  _actionIcon(g, key, color, type) {
    try {
      g.clear();
      // Dark background
      g.fillStyle(0x0d1810); g.fillRoundedRect(0, 0, 56, 56, 6);
      g.fillStyle(color, 0.25); g.fillRoundedRect(2, 2, 52, 52, 5);
      // Glyph in action color
      g.fillStyle(color);
      switch (type) {
        case 'jump':
          g.fillTriangle(28, 10, 14, 34, 42, 34);
          g.fillRect(22, 32, 12, 12);
          break;
        case 'roll':
          // Circular swirl (ring)
          g.fillStyle(color); g.fillCircle(28, 28, 16);
          g.fillStyle(0x0d1810); g.fillCircle(28, 28, 9);
          g.fillStyle(color); g.fillTriangle(28, 12, 38, 22, 20, 22); // arrow tip
          break;
        case 'coconut':
          // Arc trajectory
          g.fillStyle(color); g.fillCircle(16, 40, 5);      // start
          g.fillCircle(40, 16, 5);                           // end
          // Arc line (approximate with circles along curve)
          for (let t = 0; t <= 1; t += 0.12) {
            const x = 16 + t * 24;
            const y = 40 - t * 24 + t * (1 - t) * (-20);
            g.fillCircle(x, y, 2);
          }
          break;
        case 'punch':
          // Starburst / impact star
          g.fillTriangle(28, 10, 24, 24, 32, 24);
          g.fillTriangle(28, 46, 24, 32, 32, 32);
          g.fillTriangle(10, 28, 24, 24, 24, 32);
          g.fillTriangle(46, 28, 32, 24, 32, 32);
          g.fillTriangle(13, 13, 23, 23, 24, 18);
          g.fillTriangle(43, 13, 33, 23, 32, 18);
          g.fillTriangle(13, 43, 23, 33, 18, 32);
          g.fillTriangle(43, 43, 33, 33, 38, 32);
          g.fillCircle(28, 28, 7);
          break;
      }
      g.generateTexture(key, 56, 56);
    } catch(e) {}
  }

  _genCanopy(g) {
    try {
      g.clear();
      // Sky gradient bands — dark jungle night
      g.fillStyle(0x020d06); g.fillRect(0, 0, 400, 120);
      g.fillStyle(0x051a0e); g.fillRect(0, 80, 400, 80);
      g.fillStyle(0x0a2a18); g.fillRect(0, 140, 400, 80);
      g.fillStyle(0x0d2318); g.fillRect(0, 200, 400, 100);
      // Moon glow
      g.fillStyle(0xeeffdd, 0.08); g.fillCircle(300, 40, 60);
      g.fillStyle(0xeeffdd, 0.06); g.fillCircle(300, 40, 90);
      // Far canopy silhouettes — dark teal tree crowns
      g.fillStyle(0x0a2318);
      g.fillEllipse(30, 210, 80, 100); g.fillEllipse(90, 220, 60, 80);
      g.fillEllipse(150, 200, 90, 110); g.fillEllipse(220, 215, 70, 90);
      g.fillEllipse(280, 205, 85, 105); g.fillEllipse(340, 220, 65, 85);
      g.fillEllipse(380, 210, 70, 100);
      // Slightly lighter row of trees mid-distance
      g.fillStyle(0x102e1e);
      g.fillEllipse(60, 240, 70, 70); g.fillEllipse(130, 250, 55, 60);
      g.fillEllipse(200, 245, 75, 70); g.fillEllipse(270, 248, 60, 65);
      g.fillEllipse(330, 242, 70, 68);
      // Trunk details
      g.fillStyle(0x061408); g.fillRect(28, 250, 4, 50); g.fillRect(88, 258, 3, 42);
      g.fillRect(148, 245, 5, 55); g.fillRect(218, 252, 3, 48);
      // Foreground mist band
      g.fillStyle(0x0d2318, 0.7); g.fillRect(0, 260, 400, 40);
      g.generateTexture('bg_canopy', 400, 300);
    } catch(e) {}
  }
}
