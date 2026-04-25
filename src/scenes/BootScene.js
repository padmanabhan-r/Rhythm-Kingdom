// =============================================================================
//  Rhythm Kingdom — BootScene.js
//  Generates all textures procedurally, then transitions to MenuScene.
// =============================================================================

class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    this.add.rectangle(RK.WIDTH / 2, RK.HEIGHT / 2, RK.WIDTH, RK.HEIGHT, 0x5c94fc);
    this._status = this.add.text(RK.WIDTH / 2, RK.HEIGHT / 2, 'Loading…', {
      fontFamily: "'Press Start 2P', monospace", fontSize: '16px', color: '#ffffff',
    }).setOrigin(0.5);
  }

  create() {
    this._genTextures();
    this._status.destroy();
    this.scene.start('MenuScene');
  }

  _genTextures() {
    const g = this.add.graphics();

    // ------------------------------------------------------------------ PLAYERS

    // player_small (24×28) — blue overalls, red cap
    try {
      g.clear();
      // Cap
      g.fillStyle(0xbb1111); g.fillRect(4, 0, 16, 9);
      g.fillStyle(0xdd2222); g.fillRect(5, 1, 14, 6);
      g.fillStyle(0xff4444); g.fillRect(6, 1, 12, 2);
      g.fillStyle(0xbb1111); g.fillRect(2, 7, 20, 3);
      // Face
      g.fillStyle(0xffc880); g.fillRect(5, 10, 14, 8);
      g.fillStyle(0xe8a860); g.fillRect(5, 16, 14, 2);
      // Eyes (white + dark pupil)
      g.fillStyle(0xffffff); g.fillRect(6, 12, 4, 3); g.fillRect(14, 12, 4, 3);
      g.fillStyle(0x222222); g.fillRect(7, 13, 2, 2); g.fillRect(15, 13, 2, 2);
      // Mustache
      g.fillStyle(0x5c3010); g.fillRect(7, 17, 4, 2); g.fillRect(13, 17, 4, 2);
      // Red shirt sleeves
      g.fillStyle(0xcc2222); g.fillRect(0, 18, 5, 7); g.fillRect(19, 18, 5, 7);
      // Blue overalls bib
      g.fillStyle(0x2244bb); g.fillRect(5, 18, 14, 8);
      g.fillStyle(0x3355dd); g.fillRect(6, 18, 12, 4);
      g.fillStyle(0xffee00); g.fillRect(10, 23, 2, 2);
      // Overalls straps
      g.fillStyle(0x2244bb); g.fillRect(5, 17, 3, 2); g.fillRect(16, 17, 3, 2);
      // Blue pants legs
      g.fillStyle(0x2244bb); g.fillRect(3, 25, 6, 3); g.fillRect(15, 25, 6, 3);
      // Brown boots
      g.fillStyle(0x6b4820); g.fillRect(2, 25, 8, 3);  g.fillRect(14, 25, 8, 3);
      g.fillStyle(0x3c2a10); g.fillRect(2, 27, 5, 1); g.fillRect(14, 27, 5, 1);
      g.generateTexture('player_small', 24, 28);
    } catch (e) { /* silent */ }

    // player_big (24×38) — red overalls, bigger form
    try {
      g.clear();
      // Cap (bigger brim)
      g.fillStyle(0xbb1111); g.fillRect(3, 0, 18, 10);
      g.fillStyle(0xdd2222); g.fillRect(5, 1, 14, 7);
      g.fillStyle(0xff4444); g.fillRect(6, 1, 12, 3);
      g.fillStyle(0xbb1111); g.fillRect(1, 8, 22, 4);
      // Face
      g.fillStyle(0xffc880); g.fillRect(4, 12, 16, 10);
      g.fillStyle(0xe8a860); g.fillRect(4, 20, 16, 2);
      // Eyes
      g.fillStyle(0xffffff); g.fillRect(5, 14, 4, 3); g.fillRect(15, 14, 4, 3);
      g.fillStyle(0x222222); g.fillRect(6, 15, 2, 2); g.fillRect(16, 15, 2, 2);
      // Mustache
      g.fillStyle(0x5c3010); g.fillRect(7, 21, 4, 2); g.fillRect(13, 21, 4, 2);
      // Red shirt (sleeves)
      g.fillStyle(0xcc2222); g.fillRect(0, 22, 5, 9); g.fillRect(19, 22, 5, 9);
      // Red overalls bib
      g.fillStyle(0xaa1111); g.fillRect(5, 22, 14, 10);
      g.fillStyle(0xcc2222); g.fillRect(6, 22, 12, 5);
      g.fillStyle(0xffee00); g.fillRect(10, 29, 2, 2);
      // Straps
      g.fillStyle(0xaa1111); g.fillRect(5, 21, 4, 2); g.fillRect(15, 21, 4, 2);
      // Red pants
      g.fillStyle(0xaa1111); g.fillRect(2, 31, 8, 5); g.fillRect(14, 31, 8, 5);
      // Boots
      g.fillStyle(0x6b4820); g.fillRect(1, 34, 10, 4); g.fillRect(13, 34, 10, 4);
      g.fillStyle(0x3c2a10); g.fillRect(1, 36, 6, 2); g.fillRect(13, 36, 6, 2);
      g.generateTexture('player_big', 24, 38);
    } catch (e) { /* silent */ }

    // player_fire (24×38) — white/orange fire form, gold crown
    try {
      g.clear();
      // Crown (gold spikes)
      g.fillStyle(0xcc9900); g.fillRect(1, 4, 22, 8);
      g.fillStyle(0xffcc00); g.fillRect(2, 4, 20, 6);
      g.fillStyle(0xffee44); g.fillRect(3, 4, 18, 3);
      g.fillStyle(0xffcc00);
      g.fillTriangle(3, 4, 6, 0, 9, 4);
      g.fillTriangle(9, 4, 12, 0, 15, 4);
      g.fillTriangle(15, 4, 18, 0, 21, 4);
      // Face
      g.fillStyle(0xffc880); g.fillRect(4, 12, 16, 10);
      g.fillStyle(0xe8a860); g.fillRect(4, 20, 16, 2);
      // Fire eyes (orange/red glow)
      g.fillStyle(0xff6600); g.fillRect(5, 14, 4, 3); g.fillRect(15, 14, 4, 3);
      g.fillStyle(0xff0000); g.fillRect(6, 15, 2, 2); g.fillRect(16, 15, 2, 2);
      // White outfit
      g.fillStyle(0xffeedd); g.fillRect(0, 22, 24, 10);
      g.fillStyle(0xffffff); g.fillRect(1, 22, 22, 6);
      // Orange trim stripe
      g.fillStyle(0xff8800); g.fillRect(0, 29, 24, 3);
      // White bib
      g.fillStyle(0xffeedd); g.fillRect(6, 22, 12, 10);
      g.fillStyle(0xffee00); g.fillRect(10, 28, 2, 2);
      // White pants
      g.fillStyle(0xeeddcc); g.fillRect(1, 31, 9, 5); g.fillRect(14, 31, 9, 5);
      // Orange boots
      g.fillStyle(0xff6600); g.fillRect(0, 34, 11, 4); g.fillRect(13, 34, 11, 4);
      g.fillStyle(0xcc4400); g.fillRect(0, 37, 7, 1); g.fillRect(13, 37, 7, 1);
      g.generateTexture('player_fire', 24, 38);
    } catch (e) { /* silent */ }

    // ------------------------------------------------------------------ ENEMIES

    // enemy_stomp (24×22) — goomba style: brown mushroom cap, cream face
    try {
      g.clear();
      // Cap (dark brown mushroom)
      g.fillStyle(0x6e2a08); g.fillEllipse(12, 9, 24, 18);
      g.fillStyle(0x8b3a10); g.fillEllipse(12, 8, 22, 14);
      g.fillStyle(0xaa5020); g.fillEllipse(12, 7, 18, 10);
      // Spots
      g.fillStyle(0xcc7040); g.fillCircle(7, 6, 2.5); g.fillCircle(16, 5, 2); g.fillCircle(13, 10, 1.5);
      // Cream face
      g.fillStyle(0xffd8a0); g.fillRect(3, 14, 18, 7);
      g.fillStyle(0xffe8b8); g.fillRect(3, 14, 18, 3);
      // Angry eyebrows
      g.fillStyle(0x111111); g.fillRect(3, 11, 6, 2); g.fillRect(15, 11, 6, 2);
      // Eyes
      g.fillStyle(0x111111); g.fillRect(3, 14, 4, 4); g.fillRect(17, 14, 4, 4);
      g.fillStyle(0xffffff); g.fillRect(3, 14, 2, 2); g.fillRect(17, 14, 2, 2);
      // Fangs
      g.fillStyle(0xffffff); g.fillRect(8, 19, 2, 2); g.fillRect(14, 19, 2, 2);
      // Feet (small brown boots)
      g.fillStyle(0x6e2a08); g.fillRect(2, 19, 7, 3); g.fillRect(15, 19, 7, 3);
      g.generateTexture('enemy_stomp', 24, 22);
    } catch (e) { /* silent */ }

    // enemy_fire (24×22) — koopa style: green shell, yellow face
    try {
      g.clear();
      // Green shell
      g.fillStyle(0x1a6a1a); g.fillRect(4, 5, 16, 14);
      g.fillStyle(0x22aa22); g.fillRect(5, 6, 14, 8);
      g.fillStyle(0x44cc44); g.fillRect(6, 6, 12, 4);
      // Shell pattern lines
      g.fillStyle(0x0a4a0a); g.fillRect(4, 12, 16, 1); g.fillRect(12, 5, 1, 14);
      // Shell rim (gold)
      g.fillStyle(0xccaa22); g.fillRect(3, 5, 2, 14); g.fillRect(19, 5, 2, 14);
      g.fillRect(4, 4, 16, 2); g.fillRect(4, 18, 16, 2);
      // Yellow head
      g.fillStyle(0xffdd66); g.fillEllipse(12, 5, 14, 10);
      g.fillStyle(0xffee88); g.fillEllipse(11, 4, 10, 6);
      // Eyes (cute, round)
      g.fillStyle(0xffffff); g.fillCircle(9, 4, 2.5); g.fillCircle(15, 4, 2.5);
      g.fillStyle(0x111111); g.fillCircle(9, 4, 1.5); g.fillCircle(15, 4, 1.5);
      g.fillStyle(0xffffff); g.fillCircle(9.5, 3.5, 0.8); g.fillCircle(15.5, 3.5, 0.8);
      // Yellow feet
      g.fillStyle(0xffdd66); g.fillRect(4, 19, 7, 3); g.fillRect(13, 19, 7, 3);
      g.generateTexture('enemy_fire', 24, 22);
    } catch (e) { /* silent */ }

    // enemy_hazard (22×24) — spiny style: grey body, red spikes
    try {
      g.clear();
      // Body
      g.fillStyle(0x882222); g.fillEllipse(11, 14, 18, 16);
      g.fillStyle(0xaa2222); g.fillEllipse(11, 13, 16, 12);
      g.fillStyle(0xcc3333); g.fillEllipse(11, 12, 12, 8);
      // Spikes (red triangles)
      g.fillStyle(0xff4444);
      g.fillTriangle(11, 0, 7, 9, 15, 9);      // top
      g.fillTriangle(0, 12, 8, 10, 8, 16);     // left
      g.fillTriangle(22, 12, 14, 10, 14, 16);  // right
      g.fillTriangle(4, 3, 8, 9, 11, 7);       // top-left
      g.fillTriangle(18, 3, 14, 9, 11, 7);     // top-right
      g.fillStyle(0xff8888);
      g.fillTriangle(11, 2, 9, 7, 13, 7);      // top spike highlight
      // Eyes
      g.fillStyle(0xffffff); g.fillCircle(7, 14, 2.5); g.fillCircle(15, 14, 2.5);
      g.fillStyle(0xff0000); g.fillCircle(7, 14, 1.5); g.fillCircle(15, 14, 1.5);
      g.generateTexture('enemy_hazard', 22, 24);
    } catch (e) { /* silent */ }

    // ------------------------------------------------------------------ PICKUPS

    // pickup_mushroom (18×18) — red cap with spots, white stem
    try {
      g.clear();
      // Stem
      g.fillStyle(0xffeedd); g.fillRect(5, 11, 8, 7);
      g.fillStyle(0xffffff); g.fillRect(5, 11, 8, 3);
      g.fillStyle(0xddccbb); g.fillRect(5, 14, 8, 4);
      // Cap (red ellipse)
      g.fillStyle(0xcc1111); g.fillEllipse(9, 9, 18, 14);
      g.fillStyle(0xee2222); g.fillEllipse(9, 8, 16, 10);
      g.fillStyle(0xff4444); g.fillEllipse(9, 7, 12, 6);
      // White spots
      g.fillStyle(0xffffff); g.fillCircle(6, 7, 2.5); g.fillCircle(12.5, 6, 2); g.fillCircle(9, 4, 1.5);
      // Eyes on stem
      g.fillStyle(0x222222); g.fillRect(6, 12, 2, 2); g.fillRect(10, 12, 2, 2);
      g.fillStyle(0xffffff); g.fillRect(6, 12, 1, 1); g.fillRect(10, 12, 1, 1);
      g.generateTexture('pickup_mushroom', 18, 18);
    } catch (e) { /* silent */ }

    // pickup_flower (18×18) — orange petals, yellow centre
    try {
      g.clear();
      // Stem + leaf
      g.fillStyle(0x228822); g.fillRect(8, 10, 2, 8);
      g.fillStyle(0x33aa33); g.fillEllipse(5, 14, 8, 5);
      // Petals (orange)
      g.fillStyle(0xff8800);
      g.fillCircle(9, 4, 3.5); g.fillCircle(9, 12, 3.5);
      g.fillCircle(5, 8, 3.5); g.fillCircle(13, 8, 3.5);
      g.fillCircle(6, 5, 2.8); g.fillCircle(12, 5, 2.8);
      g.fillCircle(6, 11, 2.8); g.fillCircle(12, 11, 2.8);
      // Centre
      g.fillStyle(0xffee00); g.fillCircle(9, 8, 4);
      g.fillStyle(0xffff88); g.fillCircle(8, 7, 2);
      // Face
      g.fillStyle(0x222222); g.fillRect(8, 8, 1, 1); g.fillRect(10, 8, 1, 1);
      g.generateTexture('pickup_flower', 18, 18);
    } catch (e) { /* silent */ }

    // ------------------------------------------------------------------ WORLD

    // platform (32×16) — physics body (transparent in game, drawn inline)
    try {
      g.clear();
      g.fillStyle(0x52a84c); g.fillRect(0, 0, 32, 5);
      g.fillStyle(0x8b5e1c); g.fillRect(0, 5, 32, 11);
      g.generateTexture('platform', 32, 16);
    } catch (e) { /* silent */ }

    // ground (800×20) — physics body
    try {
      g.clear();
      g.fillStyle(0x52a84c); g.fillRect(0, 0, 800, 5);
      g.fillStyle(0x8b5e1c); g.fillRect(0, 5, 800, 15);
      g.generateTexture('ground', 800, 20);
    } catch (e) { /* silent */ }

    // spike (16×16) — physics body
    try {
      g.clear();
      g.fillStyle(0xccccdd); g.fillTriangle(8, 0, 0, 16, 16, 16);
      g.generateTexture('spike', 16, 16);
    } catch (e) { /* silent */ }

    // exit_door (32×48) — gold-framed door with star emblem
    try {
      g.clear();
      // Frame (gold)
      g.fillStyle(0xaa7800); g.fillRect(0, 0, 32, 48);
      g.fillStyle(0xffcc00); g.fillRect(1, 1, 30, 46);
      g.fillStyle(0xffee44); g.fillRect(2, 2, 6, 44); // left highlight
      g.fillStyle(0xcc9900); g.fillRect(24, 2, 6, 44); // right shadow
      // Door interior (dark planks)
      g.fillStyle(0x2a1408); g.fillRect(4, 4, 24, 40);
      g.fillStyle(0x3a1e0c); g.fillRect(4, 4, 24, 16);
      g.fillStyle(0x3a1e0c); g.fillRect(4, 22, 24, 16);
      g.fillStyle(0x1a0c04); g.fillRect(4, 19, 24, 4); g.fillRect(4, 38, 24, 2);
      // Vertical plank divider
      g.fillStyle(0x1a0c04); g.fillRect(15, 4, 2, 40);
      // Star emblem (gold circle)
      g.fillStyle(0xffcc00); g.fillCircle(16, 16, 7);
      g.fillStyle(0xffee44); g.fillCircle(14, 14, 4);
      g.fillStyle(0xffaa00); g.fillCircle(16, 16, 3);
      // Door handle
      g.fillStyle(0xffcc00); g.fillCircle(22, 32, 3);
      g.fillStyle(0xffee88); g.fillCircle(21, 31, 1.5);
      g.generateTexture('exit_door', 32, 48);
    } catch (e) { /* silent */ }

    // projectile (10×8) — fireball
    try {
      g.clear();
      g.fillStyle(0xcc2200); g.fillEllipse(5, 4, 10, 8);
      g.fillStyle(0xff6600); g.fillEllipse(5, 4, 7, 6);
      g.fillStyle(0xff8800); g.fillEllipse(4, 3, 4, 4);
      g.fillStyle(0xffff00); g.fillEllipse(4, 3, 2, 2);
      g.generateTexture('projectile', 10, 8);
    } catch (e) { /* silent */ }

    // ------------------------------------------------------------------ UI CARDS

    // card_jump (56×42) — green, up-arrow
    try {
      g.clear();
      // Border + body
      g.fillStyle(0x1a6622); g.fillRect(0, 0, 56, 42);
      g.fillStyle(0x228833); g.fillRect(2, 2, 52, 38);
      g.fillStyle(0x33aa44); g.fillRect(2, 2, 52, 14);
      // Shine line
      g.fillStyle(0x55cc66, 0.6); g.fillRect(4, 4, 48, 2);
      // Up-arrow (white)
      g.fillStyle(0xffffff);
      g.fillTriangle(28, 8, 16, 26, 40, 26);
      g.fillRect(22, 24, 12, 10);
      g.generateTexture('card_jump', 56, 42);
    } catch (e) { /* silent */ }

    // card_stomp (56×42) — gold, down-arrow
    try {
      g.clear();
      g.fillStyle(0x886600); g.fillRect(0, 0, 56, 42);
      g.fillStyle(0xcc9900); g.fillRect(2, 2, 52, 38);
      g.fillStyle(0xeecc22); g.fillRect(2, 2, 52, 14);
      g.fillStyle(0xffdd44, 0.6); g.fillRect(4, 4, 48, 2);
      // Down-arrow (white)
      g.fillStyle(0xffffff);
      g.fillRect(22, 8, 12, 10);
      g.fillTriangle(28, 34, 16, 16, 40, 16);
      g.generateTexture('card_stomp', 56, 42);
    } catch (e) { /* silent */ }

    // card_fire (56×42) — red, flame
    try {
      g.clear();
      g.fillStyle(0x881100); g.fillRect(0, 0, 56, 42);
      g.fillStyle(0xcc2211); g.fillRect(2, 2, 52, 38);
      g.fillStyle(0xee4433); g.fillRect(2, 2, 52, 14);
      g.fillStyle(0xff6655, 0.6); g.fillRect(4, 4, 48, 2);
      // Flame (white/yellow core)
      g.fillStyle(0xffcc00); g.fillEllipse(28, 30, 18, 22);
      g.fillStyle(0xff8800); g.fillEllipse(28, 25, 13, 18);
      g.fillStyle(0xffffff); g.fillEllipse(28, 22, 8, 12);
      g.fillStyle(0xffff88); g.fillTriangle(28, 10, 24, 22, 32, 22);
      g.generateTexture('card_fire', 56, 42);
    } catch (e) { /* silent */ }

    // slot_empty (56×44)
    try {
      g.clear();
      g.fillStyle(0x080820); g.fillRect(0, 0, 56, 44);
      g.fillStyle(0x12123a); g.fillRect(1, 1, 54, 42);
      g.fillStyle(0x1e1e4a); g.fillRect(2, 2, 52, 40);
      g.lineStyle(1, 0x2a2a5a); g.strokeRect(2, 2, 52, 40);
      g.generateTexture('slot_empty', 56, 44);
    } catch (e) { /* silent */ }

    // particle (4×4)
    try {
      g.clear();
      g.fillStyle(0xffffff); g.fillRect(0, 0, 4, 4);
      g.generateTexture('particle', 4, 4);
    } catch (e) { /* silent */ }

    g.destroy();
  }
}
