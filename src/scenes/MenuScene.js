// =============================================================================
//  Rhythm Kingdom — MenuScene.js
//  Title screen. Sky gradient, rolling hills, animated clouds, pixel-font title.
// =============================================================================

const _PX = "'Press Start 2P', monospace";

class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
    this._clouds = [];
  }

  create() {
    const W = RK.WIDTH;
    const H = RK.HEIGHT;

    // ---- Background ----
    const bg = this.add.graphics();

    // Sky gradient (drawn as horizontal bands, light→deeper blue)
    const bands = [
      [0,   60,  0x8ec5ff],
      [60,  120, 0x70aeff],
      [120, 200, 0x5c94fc],
      [200, 360, 0x4880f0],
      [360, 480, 0x3a6cdd],
    ];
    bands.forEach(([y1, y2, col]) => {
      bg.fillStyle(col);
      bg.fillRect(0, y1, W, y2 - y1);
    });
    // Below play area (UI panel zone): keep dark
    bg.fillStyle(0x0c0c24);
    bg.fillRect(0, 480, W, H - 480);

    // Distant mountains (misty blue)
    bg.fillStyle(0x7aaef0, 0.6);
    bg.fillEllipse(130, 400, 320, 210);
    bg.fillEllipse(420, 380, 290, 190);
    bg.fillEllipse(700, 410, 310, 210);
    bg.fillEllipse(830, 385, 220, 170);

    // Near hills (green)
    bg.fillStyle(0x48913e);
    bg.fillEllipse(70,  430, 270, 160);
    bg.fillEllipse(340, 445, 310, 140);
    bg.fillEllipse(650, 435, 290, 160);
    bg.fillStyle(0x3a7f32);
    bg.fillEllipse(200, 450, 230, 120);
    bg.fillEllipse(510, 458, 260, 110);
    bg.fillEllipse(820, 448, 200, 120);

    // Ground strip
    bg.fillStyle(0x52a84c); bg.fillRect(0, 454, W, 26);
    bg.fillStyle(0x8b5e1c); bg.fillRect(0, 466, W, 14);

    // Ground decorations (small tufts)
    [60, 150, 290, 440, 560, 680, 760].forEach(gx => {
      bg.fillStyle(0x66cc44);
      bg.fillTriangle(gx, 454, gx - 5, 462, gx + 5, 462);
      bg.fillTriangle(gx + 7, 456, gx + 2, 463, gx + 12, 463);
    });

    // Accent line at top
    bg.fillStyle(0xffcc00); bg.fillRect(0, 0, W, 3);

    // ---- Animated clouds ----
    this._spawnCloud(W, 48,  22000, 0);
    this._spawnCloud(W, 82,  30000, 7000);
    this._spawnCloud(W, 36,  26000, 14000);
    this._spawnCloud(W, 65,  35000, 21000);

    // ---- Title block ----
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x000000, 0.45);
    titleBg.fillRect(W / 2 - 220, 90, 440, 110);
    titleBg.lineStyle(3, 0xffcc00);
    titleBg.strokeRect(W / 2 - 220, 90, 440, 110);
    titleBg.lineStyle(1, 0xff8800);
    titleBg.strokeRect(W / 2 - 217, 93, 434, 104);

    const titleLine1 = this.add.text(W / 2, 112, 'RHYTHM', {
      fontFamily: _PX, fontSize: '36px', color: '#ffcc00',
      stroke: '#884400', strokeThickness: 6,
      shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 0, fill: true },
    }).setOrigin(0.5);

    const titleLine2 = this.add.text(W / 2, 158, 'KINGDOM', {
      fontFamily: _PX, fontSize: '36px', color: '#ff8800',
      stroke: '#441100', strokeThickness: 6,
      shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 0, fill: true },
    }).setOrigin(0.5);

    this.tweens.add({
      targets: [titleLine1, titleLine2, titleBg],
      y: '-=7', duration: 1600,
      ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });

    // ---- Form legend ----
    const legendY = 238;
    this.add.text(W / 2, legendY - 16, '— POWER-UP FORMS —', {
      fontFamily: _PX, fontSize: '8px', color: '#ccddff',
    }).setOrigin(0.5);

    const forms = [
      { label: 'SMALL', color: '#4488ff', actions: 'JUMP' },
      { label: 'BIG',   color: '#ff4444', actions: 'JUMP + STOMP' },
      { label: 'FIRE',  color: '#ff8800', actions: 'JUMP+STOMP+FIRE' },
    ];
    forms.forEach((f, i) => {
      const cx = 170 + i * 155;
      const dot = this.add.circle(cx - 32, legendY + 12, 6, parseInt(f.color.replace('#', ''), 16));
      dot.setStrokeStyle(1, 0x000000);
      this.add.text(cx - 20, legendY + 4, f.label, {
        fontFamily: _PX, fontSize: '8px', color: f.color,
      });
      this.add.text(cx - 20, legendY + 18, f.actions, {
        fontFamily: _PX, fontSize: '7px', color: '#aaaacc',
      });
    });

    // ---- Controls panel ----
    const panelY = 330;
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x080820, 0.88);
    panelBg.fillRect(W / 2 - 210, panelY - 14, 420, 130);
    panelBg.lineStyle(2, 0x334488);
    panelBg.strokeRect(W / 2 - 210, panelY - 14, 420, 130);
    panelBg.lineStyle(1, 0x556699);
    panelBg.strokeRect(W / 2 - 207, panelY - 11, 414, 124);

    this.add.text(W / 2, panelY, '— CONTROLS —', {
      fontFamily: _PX, fontSize: '9px', color: '#6688cc',
    }).setOrigin(0.5);

    const controls = [
      ['A / D',      'Move left & right'],
      ['SPACE',      'Toggle Edit / Play'],
      ['Click slot', 'Cycle action'],
      ['Right-click', 'Clear slot'],
    ];
    controls.forEach((row, i) => {
      const cy = panelY + 22 + i * 22;
      this.add.text(W / 2 - 10, cy, row[0], {
        fontFamily: _PX, fontSize: '8px', color: '#ffdd88',
      }).setOrigin(1, 0);
      this.add.text(W / 2 + 4, cy, row[1], {
        fontFamily: _PX, fontSize: '8px', color: '#aabbdd',
      });
    });

    this.add.text(W / 2, panelY + 113, '8 beats · 120 BPM · timeline loops', {
      fontFamily: _PX, fontSize: '7px', color: '#334466',
    }).setOrigin(0.5);

    // ---- Start prompt ----
    const prompt = this.add.text(W / 2, 498, 'PRESS SPACE TO START', {
      fontFamily: _PX, fontSize: '14px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: prompt, alpha: { from: 1, to: 0 },
      duration: 600, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });

    // ---- Version ----
    this.add.text(W - 8, H - 6, 'v1.0', {
      fontFamily: _PX, fontSize: '7px', color: '#334455',
    }).setOrigin(1, 1);

    // ---- Input ----
    this.input.keyboard.once('keydown-SPACE', () => {
      this.cameras.main.flash(180, 255, 220, 100);
      this.time.delayedCall(200, () => {
        this.scene.start('GameScene', { level: 'level1' });
      });
    });
  }

  _spawnCloud(W, y, duration, delay) {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 0.92);
    g.fillEllipse(0,    0,  90, 46);
    g.fillEllipse(30,  -18, 58, 36);
    g.fillEllipse(-28, -14, 52, 32);
    g.fillStyle(0xddeeff, 0.35);
    g.fillEllipse(0, 12, 84, 22);
    g.y = y;

    this.tweens.add({
      targets:  g,
      x:        { from: -160, to: W + 160 },
      duration,
      repeat:   -1,
      delay,
      ease:     'Linear',
    });
    this._clouds.push(g);
  }
}
