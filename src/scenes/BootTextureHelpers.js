// =============================================================================
//  Rhythm Kingdom — BootTextureHelpers.js
//  Procedural texture generators extracted from BootScene to keep file under 400 lines.
// =============================================================================

window.RK.BootTextures = {

  gorilla(g, key, running, jumping) {
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
        g.fillStyle(0x2d1b0e); g.fillEllipse(4, 20, 7, 12); g.fillEllipse(24, 20, 7, 12);
        g.fillStyle(0x1a0e06); g.fillEllipse(4, 16, 6, 5); g.fillEllipse(24, 16, 6, 5);
        g.fillStyle(0x2d1b0e); g.fillEllipse(10, 32, 7, 8); g.fillEllipse(18, 32, 7, 8);
      } else if (running) {
        g.fillStyle(0x2d1b0e); g.fillEllipse(3, 26, 7, 13); g.fillEllipse(25, 30, 7, 13);
        g.fillStyle(0x1a0e06); g.fillEllipse(3, 32, 8, 5); g.fillEllipse(25, 36, 8, 5);
        g.fillStyle(0x2d1b0e); g.fillRect(7, 32, 5, 5); g.fillRect(16, 30, 5, 6);
      } else {
        g.fillStyle(0x2d1b0e); g.fillEllipse(4, 28, 7, 14); g.fillEllipse(24, 28, 7, 14);
        g.fillStyle(0x1a0e06); g.fillEllipse(4, 34, 8, 5); g.fillEllipse(24, 34, 8, 5);
        g.fillStyle(0x2d1b0e); g.fillRect(8, 32, 5, 4); g.fillRect(15, 32, 5, 4);
      }
      g.generateTexture(key, W, H);
    } catch(e) {}
  },

  actionIcon(g, key, color, type) {
    try {
      g.clear();
      g.fillStyle(0x0d1810); g.fillRoundedRect(0, 0, 56, 56, 6);
      g.fillStyle(color, 0.25); g.fillRoundedRect(2, 2, 52, 52, 5);
      g.fillStyle(color);
      switch (type) {
        case 'jump':
          g.fillTriangle(28, 10, 14, 34, 42, 34);
          g.fillRect(22, 32, 12, 12);
          break;
        case 'roll':
          g.fillStyle(color); g.fillCircle(28, 28, 16);
          g.fillStyle(0x0d1810); g.fillCircle(28, 28, 9);
          g.fillStyle(color); g.fillTriangle(28, 12, 38, 22, 20, 22);
          break;
        case 'coconut':
          g.fillStyle(color); g.fillCircle(16, 40, 5);
          g.fillCircle(40, 16, 5);
          for (let t = 0; t <= 1; t += 0.12) {
            const x = 16 + t * 24;
            const y = 40 - t * 24 + t * (1 - t) * (-20);
            g.fillCircle(x, y, 2);
          }
          break;
        case 'punch':
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
  },

};
