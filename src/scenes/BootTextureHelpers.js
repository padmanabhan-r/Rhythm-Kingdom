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
      // Dark background with color tint
      g.fillStyle(0x0d1810); g.fillRoundedRect(0, 0, 56, 56, 6);
      g.fillStyle(color, 0.2); g.fillRoundedRect(2, 2, 52, 52, 5);
      // Rune border marks
      g.lineStyle(1, color, 0.5);
      g.strokeRoundedRect(3, 3, 50, 50, 4);
      g.fillStyle(color);
      switch (type) {
        case 'jump':
          // Lightning bolt rune — upward strike with serifs
          g.fillTriangle(28, 8, 20, 30, 36, 30);   // top spike
          g.fillRect(24, 28, 8, 6);                  // neck connector
          g.fillTriangle(20, 32, 38, 32, 28, 50);   // lower bolt
          // Rune serifs
          g.fillRect(14, 15, 10, 3);
          g.fillRect(32, 15, 10, 3);
          g.fillRect(12, 38, 10, 3);
          g.fillRect(34, 38, 10, 3);
          break;
        case 'roll':
          // Spiral rune — coiling energy rings
          g.fillCircle(28, 28, 16);
          g.fillStyle(0x0d1810); g.fillCircle(28, 28, 11);
          g.fillStyle(color); g.fillCircle(28, 28, 6);
          g.fillStyle(0x0d1810); g.fillCircle(28, 28, 2);
          // Tail
          g.fillStyle(color); g.fillTriangle(40, 18, 50, 12, 46, 26);
          break;
        case 'coconut':
          // Crescent + arc throw rune
          g.fillCircle(16, 32, 12);
          g.fillStyle(0x0d1810); g.fillCircle(21, 28, 10);
          g.fillStyle(color);
          // Arc trajectory dots
          for (let t = 0; t <= 1; t += 0.12) {
            const x = 20 + t * 22;
            const y = 38 - t * 22 + t * (1 - t) * (-14);
            g.fillCircle(x, y, 2.5);
          }
          // Impact dot
          g.fillCircle(42, 14, 5);
          break;
      }
      g.generateTexture(key, 56, 56);
    } catch(e) {}
  },

};
