// =============================================================================
//  Rhythm Kingdom — BootScene.js
//  Loads external assets, generates procedural textures, initialises audio.
// =============================================================================

class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.add.rectangle(RK.WIDTH / 2, RK.HEIGHT / 2, RK.WIDTH, RK.HEIGHT, RK.COLORS.BG);
    this._status = this.add.text(RK.WIDTH / 2, RK.HEIGHT / 2, 'Loading…', {
      fontSize: '18px', color: '#44ffaa', fontFamily: 'monospace',
    }).setOrigin(0.5);

    // Parallax layers — Jungle Asset Pack
    this.load.image('plx_1', 'assets-packs/Jungle Asset Pack/parallax background/plx-1.png');
    this.load.image('plx_2', 'assets-packs/Jungle Asset Pack/parallax background/plx-2.png');
    this.load.image('plx_3', 'assets-packs/Jungle Asset Pack/parallax background/plx-3.png');
    this.load.image('plx_4', 'assets-packs/Jungle Asset Pack/parallax background/plx-4.png');
    this.load.image('plx_5', 'assets-packs/Jungle Asset Pack/parallax background/plx-5.png');

    // Hanging vine decoration
    this.load.image('vine_hang', 'assets-packs/haning-vines.png');

    // Temple ruins decorations
    this.load.image('temple_1', 'assets-packs/temple-1.png');
    this.load.image('temple_2', 'assets-packs/temple-2.png');

    // Hazard + trap tiles
    this.load.image('water_tile',  'assets-packs/JungleAssets/Water/WaterTile1.png');
    this.load.image('jungle_trap', 'assets-packs/JungleAssets/Trap/JungleTrap1.png');

    // Fruit collectibles
    this.load.image('fruit_0', 'assets-packs/Fruits/MelonCantaloupe.png');
    this.load.image('fruit_1', 'assets-packs/Fruits/MelonHoneydew.png');

    // Pixel snake enemy sprites (224×32, 8 frames of 28×32)
    const snakePath = 'assets-packs/PixelSnakes_Free_Carysaurus/';
    this.load.spritesheet('snake_green', snakePath + 'SnakeGreen-Walk.png', { frameWidth: 28, frameHeight: 32 });
    this.load.spritesheet('snake_corn',  snakePath + 'SnakeCorn-Walk.png',  { frameWidth: 28, frameHeight: 32 });
    this.load.spritesheet('snake_red',   snakePath + 'SnakeRed-Walk.png',   { frameWidth: 28, frameHeight: 32 });
  }

  create() {
    this._genTextures();
    window.RK._audio = new RK.AudioManager();
    window.RK._audio.loadSounds();
    this._status.destroy();
    this.scene.start('MenuScene');
  }

  // ---------------------------------------------------------------------------
  _genTextures() {
    const g = this.add.graphics();

    // ----------------------------------------------------------------- GORILLA
    RK.BootTextures.gorilla(g, 'gorilla_idle',  false, false);
    RK.BootTextures.gorilla(g, 'gorilla_run',   true,  false);
    RK.BootTextures.gorilla(g, 'gorilla_jump',  false, true);

    // ----------------------------------------------------------------- ENEMIES

    // enemy_lizard (26×22) — green patrol reptile
    try {
      g.clear();
      g.fillStyle(0x1a5c18); g.fillEllipse(13, 14, 22, 16);
      g.fillStyle(0x228822); g.fillEllipse(13, 13, 20, 13);
      g.fillStyle(0x33aa33); g.fillEllipse(13, 12, 16, 10);
      g.fillStyle(0x1a5c18); g.fillTriangle(22, 16, 26, 12, 26, 20);
      g.fillStyle(0x228822); g.fillEllipse(5, 11, 12, 10);
      g.fillStyle(0x33aa33); g.fillEllipse(4, 10, 9, 7);
      g.fillStyle(0xffdd00); g.fillCircle(4, 9, 2.5);
      g.fillStyle(0x111100); g.fillCircle(4, 9, 1.5);
      g.fillStyle(0x1a5c18); g.fillRect(5, 18, 4, 4); g.fillRect(14, 18, 4, 4);
      g.fillStyle(0x228822); g.fillRect(3, 21, 7, 2); g.fillRect(12, 21, 7, 2);
      g.generateTexture('enemy_lizard', 26, 22);
    } catch(e) {}

    // enemy_bat (28×20) — dark flying creature
    try {
      g.clear();
      g.fillStyle(0x3a1a4a); g.fillEllipse(7, 12, 14, 10); g.fillEllipse(21, 12, 14, 10);
      g.fillStyle(0x4d2266); g.fillEllipse(7, 11, 11, 7); g.fillEllipse(21, 11, 11, 7);
      g.fillStyle(0x5a2878); g.fillTriangle(1, 16, 8, 8, 10, 16); g.fillTriangle(27, 16, 20, 8, 18, 16);
      g.fillStyle(0x2a1040); g.fillEllipse(14, 12, 12, 14);
      g.fillStyle(0x3a1a55); g.fillEllipse(14, 11, 10, 11);
      g.fillStyle(0xff4444); g.fillCircle(11, 9, 2.5); g.fillCircle(17, 9, 2.5);
      g.fillStyle(0xff0000); g.fillCircle(11, 9, 1.5); g.fillCircle(17, 9, 1.5);
      g.fillStyle(0x2a1040); g.fillTriangle(10, 4, 8, 10, 13, 9); g.fillTriangle(18, 4, 15, 9, 20, 10);
      g.fillStyle(0xffffff); g.fillTriangle(12, 14, 11, 18, 13, 18); g.fillTriangle(16, 14, 15, 18, 17, 18);
      g.generateTexture('enemy_bat', 28, 20);
    } catch(e) {}

    // enemy_guardian (30×30) — stone-armored, coconut-only
    try {
      g.clear();
      g.fillStyle(0x4a4035); g.fillEllipse(15, 18, 26, 22);
      g.fillStyle(0x5e5245); g.fillEllipse(15, 17, 24, 19);
      g.fillStyle(0x726655); g.fillEllipse(15, 16, 20, 15);
      g.fillStyle(0x3a3028); g.fillRect(10, 12, 1, 10); g.fillRect(18, 14, 1, 8);
      g.fillRect(12, 20, 6, 1);
      g.fillStyle(0x4a4035); g.fillCircle(15, 9, 9);
      g.fillStyle(0x5e5245); g.fillCircle(15, 8, 7);
      g.fillStyle(0xff6600); g.fillCircle(11, 9, 3); g.fillCircle(19, 9, 3);
      g.fillStyle(0xff4400); g.fillCircle(11, 9, 2); g.fillCircle(19, 9, 2);
      g.fillStyle(0xffcc44); g.fillCircle(11, 9, 1); g.fillCircle(19, 9, 1);
      g.fillStyle(0x4a4035); g.fillTriangle(9, 1, 6, 8, 13, 7); g.fillTriangle(21, 1, 17, 7, 24, 8);
      g.fillStyle(0x5e5245); g.fillTriangle(9, 3, 7, 8, 11, 8); g.fillTriangle(21, 3, 19, 8, 23, 8);
      g.generateTexture('enemy_guardian', 30, 30);
    } catch(e) {}

    // ------------------------------------------------------------------ MONKEY (dancing)

    // dance_monk_idle (40×40) — groove monkey with maracas, arms up ready to dance
    try {
      g.clear();
      g.fillStyle(0x000000, 0.2); g.fillEllipse(20, 38, 18, 5);
      g.fillStyle(0x8b4513); g.fillEllipse(20, 26, 16, 18);
      g.fillStyle(0xa0522d); g.fillEllipse(20, 24, 14, 15);
      g.fillStyle(0xd2a679); g.fillEllipse(20, 28, 9, 10);
      g.fillStyle(0x8b4513); g.fillCircle(20, 10, 11);
      g.fillStyle(0xa0522d); g.fillCircle(20, 9, 9);
      g.fillStyle(0xfaf0e6); g.fillEllipse(20, 12, 7, 6);
      g.fillStyle(0xffffff); g.fillCircle(16, 8, 3); g.fillCircle(24, 8, 3);
      g.fillStyle(0x1a1a1a); g.fillCircle(16.5, 8, 2); g.fillCircle(24.5, 8, 2);
      g.fillStyle(0xffffff); g.fillCircle(15.5, 7, 1); g.fillCircle(23.5, 7, 1);
      g.fillStyle(0x5c3317); g.fillEllipse(20, 12, 3, 2);
      g.fillStyle(0x1a1a1a); g.fillRect(17, 14, 6, 2);
      g.fillStyle(0xffffff); g.fillRect(17.5, 14, 5, 1);
      g.fillStyle(0x8b4513); g.fillCircle(10, 9, 4); g.fillCircle(30, 9, 4);
      g.fillStyle(0xfaf0e6); g.fillCircle(10, 9, 2.5); g.fillCircle(30, 9, 2.5);
      g.fillStyle(0x8b4513); g.fillEllipse(6, 16, 5, 10);
      g.fillStyle(0xa0522d); g.fillEllipse(6, 15, 4, 8);
      g.fillStyle(0xcc4400); g.fillCircle(4, 6, 5);
      g.fillStyle(0xff6600); g.fillCircle(4, 5.5, 4);
      g.fillStyle(0xffcc44); g.fillCircle(4, 5, 2);
      g.fillStyle(0x884400); g.fillRect(3, 9, 2, 6);
      g.fillStyle(0x8b4513); g.fillEllipse(34, 16, 5, 10);
      g.fillStyle(0xa0522d); g.fillEllipse(34, 15, 4, 8);
      g.fillStyle(0xcc4400); g.fillCircle(36, 6, 5);
      g.fillStyle(0xff6600); g.fillCircle(36, 5.5, 4);
      g.fillStyle(0xffcc44); g.fillCircle(36, 5, 2);
      g.fillStyle(0x884400); g.fillRect(35, 9, 2, 6);
      g.fillStyle(0x8b4513); g.fillRect(13, 34, 5, 5); g.fillRect(22, 34, 5, 5);
      g.fillStyle(0xffcc44, 0.6); g.fillRect(1, 10, 2, 6); g.fillRect(1, 18, 2, 6);
      g.fillStyle(0xffcc44, 0.6); g.fillRect(37, 10, 2, 6); g.fillRect(37, 18, 2, 6);
      g.fillStyle(0x111111); g.fillRect(11, 5, 8, 6); g.fillRect(21, 5, 8, 6);
      g.fillStyle(0x1155cc, 0.65); g.fillRect(12, 6, 6, 4); g.fillRect(22, 6, 6, 4);
      g.fillStyle(0xaaddff, 0.25); g.fillRect(12, 6, 3, 2); g.fillRect(22, 6, 3, 2);
      g.fillStyle(0x111111); g.fillRect(19, 7, 2, 2);
      g.generateTexture('dance_monk_idle', 40, 40);
    } catch(e) {}

    // dance_monk_l (40×40) — dance frame left
    try {
      g.clear();
      g.fillStyle(0x000000, 0.2); g.fillEllipse(18, 38, 18, 5);
      g.fillStyle(0x8b4513); g.fillEllipse(18, 26, 16, 18);
      g.fillStyle(0xa0522d); g.fillEllipse(18, 24, 14, 15);
      g.fillStyle(0xd2a679); g.fillEllipse(18, 28, 9, 10);
      g.fillStyle(0x8b4513); g.fillCircle(18, 10, 11);
      g.fillStyle(0xa0522d); g.fillCircle(18, 9, 9);
      g.fillStyle(0xfaf0e6); g.fillEllipse(18, 12, 7, 6);
      g.fillStyle(0xffffff); g.fillCircle(14, 8, 3); g.fillCircle(22, 8, 3);
      g.fillStyle(0x1a1a1a); g.fillCircle(14.5, 8, 2); g.fillCircle(22.5, 8, 2);
      g.fillStyle(0xffffff); g.fillCircle(13.5, 7, 1); g.fillCircle(21.5, 7, 1);
      g.fillStyle(0x5c3317); g.fillEllipse(18, 12, 3, 2);
      g.fillStyle(0x1a1a1a); g.fillRect(15, 14, 6, 2);
      g.fillStyle(0xffffff); g.fillRect(15.5, 14, 5, 1);
      g.fillStyle(0x8b4513); g.fillCircle(8, 9, 4); g.fillCircle(28, 9, 4);
      g.fillStyle(0xfaf0e6); g.fillCircle(8, 9, 2.5); g.fillCircle(28, 9, 2.5);
      g.fillStyle(0x8b4513); g.fillEllipse(5, 14, 5, 10);
      g.fillStyle(0xa0522d); g.fillEllipse(5, 13, 4, 8);
      g.fillStyle(0xcc4400); g.fillCircle(2, 4, 5);
      g.fillStyle(0xff6600); g.fillCircle(2, 3.5, 4);
      g.fillStyle(0xffcc44); g.fillCircle(2, 3, 2);
      g.fillStyle(0x884400); g.fillRect(1, 7, 2, 6);
      g.fillStyle(0x8b4513); g.fillEllipse(32, 20, 5, 10);
      g.fillStyle(0xa0522d); g.fillEllipse(32, 19, 4, 8);
      g.fillStyle(0xcc4400); g.fillCircle(34, 28, 4);
      g.fillStyle(0xff6600); g.fillCircle(34, 27.5, 3);
      g.fillStyle(0x884400); g.fillRect(33, 25, 2, 5);
      g.fillStyle(0x8b4513); g.fillRect(10, 34, 5, 5); g.fillRect(24, 34, 5, 5);
      g.fillStyle(0xffcc44, 0.5); g.fillRect(0, 6, 2, 8); g.fillRect(0, 16, 2, 8);
      g.fillStyle(0x111111); g.fillRect(9, 5, 8, 6); g.fillRect(19, 5, 8, 6);
      g.fillStyle(0x1155cc, 0.65); g.fillRect(10, 6, 6, 4); g.fillRect(20, 6, 6, 4);
      g.fillStyle(0xaaddff, 0.25); g.fillRect(10, 6, 3, 2); g.fillRect(20, 6, 3, 2);
      g.fillStyle(0x111111); g.fillRect(17, 7, 2, 2);
      g.generateTexture('dance_monk_l', 40, 40);
    } catch(e) {}

    // dance_monk_r (40×40) — dance frame right
    try {
      g.clear();
      g.fillStyle(0x000000, 0.2); g.fillEllipse(22, 38, 18, 5);
      g.fillStyle(0x8b4513); g.fillEllipse(22, 26, 16, 18);
      g.fillStyle(0xa0522d); g.fillEllipse(22, 24, 14, 15);
      g.fillStyle(0xd2a679); g.fillEllipse(22, 28, 9, 10);
      g.fillStyle(0x8b4513); g.fillCircle(22, 10, 11);
      g.fillStyle(0xa0522d); g.fillCircle(22, 9, 9);
      g.fillStyle(0xfaf0e6); g.fillEllipse(22, 12, 7, 6);
      g.fillStyle(0xffffff); g.fillCircle(18, 8, 3); g.fillCircle(26, 8, 3);
      g.fillStyle(0x1a1a1a); g.fillCircle(18.5, 8, 2); g.fillCircle(26.5, 8, 2);
      g.fillStyle(0xffffff); g.fillCircle(17.5, 7, 1); g.fillCircle(25.5, 7, 1);
      g.fillStyle(0x5c3317); g.fillEllipse(22, 12, 3, 2);
      g.fillStyle(0x1a1a1a); g.fillRect(19, 14, 6, 2);
      g.fillStyle(0xffffff); g.fillRect(19.5, 14, 5, 1);
      g.fillStyle(0x8b4513); g.fillCircle(12, 9, 4); g.fillCircle(32, 9, 4);
      g.fillStyle(0xfaf0e6); g.fillCircle(12, 9, 2.5); g.fillCircle(32, 9, 2.5);
      g.fillStyle(0x8b4513); g.fillEllipse(8, 20, 5, 10);
      g.fillStyle(0xa0522d); g.fillEllipse(8, 19, 4, 8);
      g.fillStyle(0xcc4400); g.fillCircle(6, 28, 4);
      g.fillStyle(0xff6600); g.fillCircle(6, 27.5, 3);
      g.fillStyle(0x884400); g.fillRect(5, 25, 2, 5);
      g.fillStyle(0x8b4513); g.fillEllipse(35, 14, 5, 10);
      g.fillStyle(0xa0522d); g.fillEllipse(35, 13, 4, 8);
      g.fillStyle(0xcc4400); g.fillCircle(38, 4, 5);
      g.fillStyle(0xff6600); g.fillCircle(38, 3.5, 4);
      g.fillStyle(0xffcc44); g.fillCircle(38, 3, 2);
      g.fillStyle(0x884400); g.fillRect(37, 7, 2, 6);
      g.fillStyle(0x8b4513); g.fillRect(11, 34, 5, 5); g.fillRect(25, 34, 5, 5);
      g.fillStyle(0xffcc44, 0.5); g.fillRect(38, 6, 2, 8); g.fillRect(38, 16, 2, 8);
      g.fillStyle(0x111111); g.fillRect(13, 5, 8, 6); g.fillRect(23, 5, 8, 6);
      g.fillStyle(0x1155cc, 0.65); g.fillRect(14, 6, 6, 4); g.fillRect(24, 6, 6, 4);
      g.fillStyle(0xaaddff, 0.25); g.fillRect(14, 6, 3, 2); g.fillRect(24, 6, 3, 2);
      g.fillStyle(0x111111); g.fillRect(21, 7, 2, 2);
      g.generateTexture('dance_monk_r', 40, 40);
    } catch(e) {}

    // ------------------------------------------------------------------ WORLD

    // platform_jungle (64×20)
    try {
      g.clear();
      g.fillStyle(0x1a4a22); g.fillRect(0, 0, 64, 7);
      g.fillStyle(0x228833); g.fillRect(1, 1, 62, 4);
      g.fillStyle(0x33aa44); g.fillRect(2, 1, 60, 2);
      g.fillStyle(0x3a2e1a); g.fillRect(0, 7, 64, 13);
      g.fillStyle(0x4a3c26); g.fillRect(1, 8, 62, 4);
      g.fillStyle(0x3a2e1a); g.fillRect(0, 12, 64, 1);
      g.fillStyle(0x2a2015); g.fillRect(0, 13, 64, 7);
      g.fillStyle(0xcc9933, 0.4); g.fillRect(28, 9, 8, 3);
      g.generateTexture('platform_jungle', 64, 20);
    } catch(e) {}

    // ground_jungle (800×24)
    try {
      g.clear();
      g.fillStyle(0x1a4a22); g.fillRect(0, 0, 800, 5);
      g.fillStyle(0x228833); g.fillRect(0, 1, 800, 3);
      g.fillStyle(0x1a1408); g.fillRect(0, 5, 800, 19);
      g.fillStyle(0x241c0e); g.fillRect(0, 6, 800, 5);
      g.fillStyle(0x5a3a18); g.fillRect(80, 7, 3, 10); g.fillRect(200, 8, 2, 8);
      g.fillRect(340, 6, 4, 12); g.fillRect(520, 7, 3, 9);
      g.generateTexture('ground_jungle', 800, 24);
    } catch(e) {}

    // thorn_spike (16×20)
    try {
      g.clear();
      g.fillStyle(0x1a5c18); g.fillTriangle(8, 0, 0, 20, 16, 20);
      g.fillStyle(0x228822); g.fillTriangle(8, 2, 2, 20, 14, 20);
      g.fillStyle(0x33aa33); g.fillTriangle(8, 4, 4, 20, 12, 20);
      g.fillStyle(0x44cc44); g.fillRect(7, 2, 2, 4);
      g.generateTexture('thorn_spike', 16, 20);
    } catch(e) {}

    // exit_arch (48×56)
    try {
      g.clear();
      g.fillStyle(0x4a4035); g.fillRect(0, 10, 12, 46); g.fillRect(36, 10, 12, 46);
      g.fillStyle(0x5e5245); g.fillRect(1, 11, 10, 44); g.fillRect(37, 11, 10, 44);
      g.fillStyle(0x4a4035); g.fillEllipse(24, 12, 48, 22);
      g.fillStyle(0x5e5245); g.fillEllipse(24, 12, 44, 18);
      g.fillStyle(0xcc9933); g.lineStyle(2, 0xcc9933); g.strokeRect(1, 11, 10, 44);
      g.fillRect(0, 10, 12, 2); g.fillRect(36, 10, 12, 2);
      g.fillStyle(0x0d2318); g.fillRect(12, 8, 24, 48);
      g.fillStyle(0x44ffaa, 0.3); g.fillRect(12, 8, 24, 48);
      g.fillStyle(0x44ffaa, 0.5); g.fillEllipse(24, 24, 16, 20);
      g.fillStyle(0xcc9933, 0.7); g.fillRect(3, 20, 6, 2); g.fillRect(39, 20, 6, 2);
      g.fillRect(3, 28, 6, 2); g.fillRect(39, 28, 6, 2);
      g.generateTexture('exit_arch', 48, 56);
    } catch(e) {}

    // relic_shard (14×14)
    try {
      g.clear();
      g.fillStyle(0x88ffcc); g.fillTriangle(7, 0, 0, 14, 14, 14);
      g.fillStyle(0xaaffdd); g.fillTriangle(7, 2, 2, 14, 12, 14);
      g.fillStyle(0xffffff); g.fillTriangle(7, 4, 5, 10, 9, 10);
      g.fillStyle(0x44ffaa, 0.5); g.fillRect(5, 10, 4, 3);
      g.generateTexture('relic_shard', 14, 14);
    } catch(e) {}

    // checkpoint (24×40)
    try {
      g.clear();
      g.fillStyle(0x4a4035); g.fillRect(0, 10, 24, 30);
      g.fillStyle(0x5e5245); g.fillRect(1, 11, 22, 28);
      g.fillStyle(0x6a5e50); g.fillRect(2, 11, 6, 28);
      g.fillStyle(0x5e5245); g.fillRect(0, 8, 24, 4);
      g.fillStyle(0x726655); g.fillRect(0, 7, 24, 3);
      g.fillStyle(0x44ffaa); g.fillRect(10, 18, 4, 14);
      g.fillRect(8, 18, 8, 3);
      g.fillRect(8, 25, 8, 3);
      g.fillStyle(0x4a4035); g.fillRect(0, 36, 24, 4);
      g.generateTexture('checkpoint', 24, 40);
    } catch(e) {}

    // coconut (14×14)
    try {
      g.clear();
      g.fillStyle(0x5a3810); g.fillCircle(7, 7, 7);
      g.fillStyle(0x7a4e18); g.fillCircle(6, 6, 5);
      g.fillStyle(0x9a6628); g.fillCircle(5, 5, 3);
      g.fillStyle(0x1a0c00); g.fillCircle(8, 5, 2); g.fillCircle(5, 9, 1.5); g.fillCircle(10, 9, 1.5);
      g.generateTexture('coconut', 14, 14);
    } catch(e) {}

// enemy_snake (34×14) — elongated ground snake
    try {
      g.clear();
      // Body segments
      g.fillStyle(0x2a6e18); g.fillEllipse(17, 9, 32, 12);
      g.fillStyle(0x3a8e22); g.fillEllipse(17, 8, 30, 9);
      // Diamond pattern
      g.fillStyle(0x1a5010); g.fillRect(8, 6, 4, 4); g.fillRect(16, 6, 4, 4); g.fillRect(24, 6, 4, 4);
      // Head
      g.fillStyle(0x1a5010); g.fillEllipse(4, 8, 10, 10);
      g.fillStyle(0x2a6e18); g.fillEllipse(4, 7, 8, 8);
      // Eye
      g.fillStyle(0xffdd00); g.fillCircle(3, 5, 2);
      g.fillStyle(0x110000); g.fillCircle(3, 5, 1);
      // Forked tongue
      g.fillStyle(0xff2222); g.fillRect(0, 8, 4, 1);
      g.fillRect(0, 7, 2, 1); g.fillRect(0, 9, 2, 1);
      // Tail
      g.fillStyle(0x1a5010); g.fillTriangle(33, 6, 33, 12, 28, 9);
      g.generateTexture('enemy_snake', 34, 14);
    } catch(e) {}

    // ------------------------------------------------------------------- UI

    // beat_well (80×80) — octagonal rune holder
    try {
      g.clear();
      const C = 20; // corner cut
      const oct = [{x:C,y:0},{x:80-C,y:0},{x:80,y:C},{x:80,y:80-C},{x:80-C,y:80},{x:C,y:80},{x:0,y:80-C},{x:0,y:C}];
      const oct2 = [{x:C+3,y:3},{x:80-C-3,y:3},{x:77,y:C+3},{x:77,y:80-C-3},{x:80-C-3,y:77},{x:C+3,y:77},{x:3,y:80-C-3},{x:3,y:C+3}];
      const oct3 = [{x:C+5,y:5},{x:80-C-5,y:5},{x:75,y:C+5},{x:75,y:80-C-5},{x:80-C-5,y:75},{x:C+5,y:75},{x:5,y:80-C-5},{x:5,y:C+5}];
      const inner = [{x:C+10,y:10},{x:80-C-10,y:10},{x:70,y:C+10},{x:70,y:80-C-10},{x:80-C-10,y:70},{x:C+10,y:70},{x:10,y:80-C-10},{x:10,y:C+10}];
      g.fillStyle(0x1a1208); g.fillPoints(oct, true);
      g.fillStyle(0xcc9933); g.fillPoints(oct2, true);
      g.fillStyle(0x2a1e08); g.fillPoints(oct3, true);
      g.fillStyle(0x0d1408); g.fillPoints(inner, true);
      // Carved rune marks — centre cross lines
      g.lineStyle(1, 0xcc9933, 0.35);
      g.beginPath(); g.moveTo(40, 16); g.lineTo(40, 64); g.strokePath();
      g.beginPath(); g.moveTo(16, 40); g.lineTo(64, 40); g.strokePath();
      // Small gem at centre
      g.fillStyle(0x44ffaa, 0.4); g.fillCircle(40, 40, 5);
      g.fillStyle(0x88ffcc, 0.6); g.fillCircle(40, 40, 2);
      // Corner dots
      g.fillStyle(0xffcc44, 0.7);
      [[C,4],[80-C,4],[4,C],[76,C],[4,80-C],[76,80-C],[C,76],[80-C,76]].forEach(([x,y]) => g.fillCircle(x,y,2));
      g.generateTexture('beat_well', 80, 80);
    } catch(e) {}

    // ui_panel (800×120)
    try {
      g.clear();
      g.fillStyle(0x1a140e); g.fillRect(0, 0, 800, 120);
      g.fillStyle(0x241c12); g.fillRect(0, 0, 800, 30);
      g.fillStyle(0x2e2418); g.fillRect(0, 0, 800, 12);
      g.fillStyle(0xcc9933); g.fillRect(0, 0, 800, 3);
      g.fillStyle(0xffcc44); g.fillRect(0, 0, 800, 1);
      g.fillStyle(0x241c12); g.fillRect(0, 40, 800, 1); g.fillRect(0, 80, 800, 1);
      g.fillStyle(0xcc9933); g.fillRect(0, 0, 8, 8); g.fillRect(792, 0, 8, 8);
      g.fillRect(0, 112, 8, 8); g.fillRect(792, 112, 8, 8);
      g.generateTexture('ui_panel', 800, 120);
    } catch(e) {}

    // Action icons (56×56 each)
    RK.BootTextures.actionIcon(g, 'action_jump',    RK.ACTION_COLORS.JUMP,    'jump');
    RK.BootTextures.actionIcon(g, 'action_roll',    RK.ACTION_COLORS.ROLL,    'roll');
    RK.BootTextures.actionIcon(g, 'action_coconut', RK.ACTION_COLORS.COCONUT, 'coconut');
    // Grey locked versions of rune cards
    RK.BootTextures.actionIcon(g, 'action_jump_locked',    0x334466, 'jump');
    RK.BootTextures.actionIcon(g, 'action_roll_locked',    0x445566, 'roll');
    RK.BootTextures.actionIcon(g, 'action_coconut_locked', 0x445544, 'coconut');

    // playhead (8×72)
    try {
      g.clear();
      g.fillStyle(0x44ffaa); g.fillRect(2, 0, 4, 72);
      g.fillStyle(0x88ffcc); g.fillRect(3, 0, 2, 72);
      g.fillStyle(0x44ffaa, 0.3); g.fillRect(0, 0, 2, 72); g.fillRect(6, 0, 2, 72);
      g.generateTexture('playhead', 8, 72);
    } catch(e) {}

    // Particles
    try {
      g.clear(); g.fillStyle(0xccaa66); g.fillRect(0, 0, 6, 6);
      g.generateTexture('particle_dust', 6, 6);
    } catch(e) {}
    try {
      g.clear(); g.fillStyle(0xffcc44); g.fillRect(0, 0, 5, 5);
      g.generateTexture('particle_spark', 5, 5);
    } catch(e) {}

    // 1×1 white pixel
    try {
      g.clear(); g.fillStyle(0xffffff); g.fillRect(0, 0, 1, 1);
      g.generateTexture('px', 1, 1);
    } catch(e) {}

    g.destroy();
  }
}
