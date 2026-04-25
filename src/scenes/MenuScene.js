// =============================================================================
//  Rhythm Kingdom — MenuScene.js
//  Jungle night title screen. Moonlit atmosphere, fireflies, gorilla silhouette.
// =============================================================================

class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const W = RK.WIDTH, H = RK.HEIGHT;
    const bg = this.add.graphics();

    // Deep jungle night sky — gradient bands
    const bands = [
      [0,   80,  0x020d06],
      [80,  200, 0x051a0e],
      [200, 340, 0x0a2a18],
      [340, 480, 0x0d2318],
    ];
    bands.forEach(([y1, y2, col]) => { bg.fillStyle(col); bg.fillRect(0, y1, W, y2 - y1); });
    // UI panel area
    bg.fillStyle(0x1a140e); bg.fillRect(0, 480, W, H - 480);
    bg.fillStyle(0xcc9933); bg.fillRect(0, 480, W, 2);

    // Moon
    bg.fillStyle(0xeeffee, 0.12); bg.fillCircle(620, 60, 90);
    bg.fillStyle(0xeeffee, 0.18); bg.fillCircle(620, 60, 55);
    bg.fillStyle(0xeeffee, 0.7);  bg.fillCircle(620, 60, 38);
    // Moon light shaft
    bg.fillStyle(0xaaffcc, 0.04); bg.fillTriangle(540, 60, 700, 60, 560, 480);

    // Distant jungle canopy silhouette
    bg.fillStyle(0x0a2318);
    [50, 140, 240, 360, 480, 600, 700, 790].forEach((cx, i) => {
      const h = 100 + (i % 3) * 40;
      bg.fillEllipse(cx, 380 - h / 2, 90, h);
    });

    // Mid-distance tree trunks
    bg.fillStyle(0x061408);
    [40, 170, 320, 460, 590, 730].forEach(tx => {
      bg.fillRect(tx, 300, 6, 200);
    });

    // Ground mist
    bg.fillStyle(0x0d2318, 0.8); bg.fillRect(0, 430, W, 50);
    bg.fillStyle(0x0a1a10, 0.6); bg.fillRect(0, 450, W, 30);

    // Ground
    bg.fillStyle(0x1a4a22); bg.fillRect(0, 454, W, 26);
    bg.fillStyle(0x0d2318); bg.fillRect(0, 466, W, 14);

    // Foreground root shapes
    bg.fillStyle(0x0a2010);
    bg.fillRect(0, 440, 60, 40); bg.fillRect(720, 440, 80, 40);
    bg.fillTriangle(0, 440, 50, 440, 0, 480);
    bg.fillTriangle(800, 440, 750, 440, 800, 480);

    // Gorilla silhouette (bottom right, dark)
    bg.fillStyle(0x0a1808);
    bg.fillCircle(740, 450, 16); bg.fillEllipse(740, 468, 28, 22);
    bg.fillEllipse(728, 462, 8, 14); bg.fillEllipse(752, 462, 8, 14);

    // ---- Fireflies (animated dots) ----
    this._fireflies = [];
    for (let i = 0; i < 12; i++) {
      const ff = this.add.circle(
        80 + Math.random() * 640,
        100 + Math.random() * 300,
        2, 0x88ffaa
      );
      this.tweens.add({
        targets: ff,
        x: ff.x + (Math.random() - 0.5) * 120,
        y: ff.y + (Math.random() - 0.5) * 80,
        alpha: { from: 0.8, to: 0.1 },
        duration: 1200 + Math.random() * 1800,
        ease: 'Sine.easeInOut',
        yoyo: true, repeat: -1,
        delay: Math.random() * 2000,
      });
      this._fireflies.push(ff);
    }

    // ---- Title ----
    const titleBg = this.add.graphics();
    titleBg.fillStyle(0x000000, 0.55);
    titleBg.fillRoundedRect(W / 2 - 230, 80, 460, 130, 8);
    titleBg.lineStyle(2, 0xcc9933);
    titleBg.strokeRoundedRect(W / 2 - 230, 80, 460, 130, 8);
    titleBg.lineStyle(1, 0x44ffaa, 0.4);
    titleBg.strokeRoundedRect(W / 2 - 226, 84, 452, 122, 6);

    const t1 = this.add.text(W / 2, 108, 'RHYTHM', {
      fontSize: '44px', color: '#ffcc44', fontFamily: 'monospace',
      fontStyle: 'bold', stroke: '#885500', strokeThickness: 5,
    }).setOrigin(0.5);

    const t2 = this.add.text(W / 2, 160, 'KINGDOM', {
      fontSize: '36px', color: '#44ffaa', fontFamily: 'monospace',
      fontStyle: 'bold', stroke: '#005533', strokeThickness: 4,
    }).setOrigin(0.5);

    const tagline = this.add.text(W / 2, 198, "A Gorilla's Journey", {
      fontSize: '13px', color: '#cc8833', fontFamily: 'monospace', fontStyle: 'italic',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: [t1, t2, tagline, titleBg],
      y: '-=6', duration: 1800,
      ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });

    // ---- Controls panel ----
    const panelY = 240;
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x0d1a0e, 0.88);
    panelBg.fillRoundedRect(W / 2 - 220, panelY, 440, 130, 6);
    panelBg.lineStyle(1, 0x2a4a30);
    panelBg.strokeRoundedRect(W / 2 - 220, panelY, 440, 130, 6);

    this.add.text(W / 2, panelY + 14, '— HOW TO PLAY —', {
      fontSize: '10px', color: '#44ffaa', fontFamily: 'monospace',
    }).setOrigin(0.5);

    const controls = [
      ['A / D',        'Move the gorilla'],
      ['Click a well', 'Cycle action in beat slot'],
      ['Right-click',  'Clear a slot'],
      ['Beat fires!',  'Actions execute on rhythm'],
    ];
    controls.forEach(([key, desc], i) => {
      const cy = panelY + 36 + i * 22;
      this.add.text(W / 2 - 12, cy, key, {
        fontSize: '10px', color: '#ffcc44', fontFamily: 'monospace',
      }).setOrigin(1, 0);
      this.add.text(W / 2 + 4, cy, desc, {
        fontSize: '10px', color: '#88aacc', fontFamily: 'monospace',
      });
    });

    this.add.text(W / 2, panelY + 118, '4 beats · 120 BPM · rhythm drives everything', {
      fontSize: '9px', color: '#2a4a30', fontFamily: 'monospace',
    }).setOrigin(0.5);

    // ---- Start button ----
    const bx = W / 2, by = 420;
    const startBtn = this.add.rectangle(bx, by, 220, 50, 0x1a4a22)
      .setOrigin(0.5).setDepth(10).setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0x44ffaa);
    startBtn.on('pointerdown', (p) => p.event.stopPropagation());
    startBtn.on('pointerup', () => this._start());

    const startLbl = this.add.text(bx, by, 'START', {
      fontSize: '18px', color: '#44ffaa', fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(11).setInteractive({ useHandCursor: true });
    startLbl.on('pointerdown', (p) => p.event.stopPropagation());
    startLbl.on('pointerup', () => this._start());

    this.tweens.add({
      targets: startBtn,
      alpha: { from: 1, to: 0.7 },
      duration: 600, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });

    // ---- Input ----
    this.input.keyboard.once('keydown-SPACE', () => this._start());
  }

  _start() {
    console.log('[MenuScene] _start called');
    if (window.RK && window.RK._audio) window.RK._audio._ensureCtx();
    this.cameras.main.flash(200, 20, 100, 40);
    this.time.delayedCall(200, () => {
      console.log('[MenuScene] starting GameScene');
      this.scene.start('GameScene', { level: 'level1' });
    });
  }
}
