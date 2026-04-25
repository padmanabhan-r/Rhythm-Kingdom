// =============================================================================
//  Rhythm Kingdom — MenuScene.js
//  Jungle night title screen. Gorilla dances live at 120 BPM.
// =============================================================================

class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const W = RK.WIDTH, H = RK.HEIGHT;

    this._buildBg(W, H);
    this._buildFireflies(W);
    this._buildSpotlight(W);
    this._buildTitle(W);
    this._buildGorilla(W);
    this._buildBottomBar(W);

    this._buildTapOverlay(W, H);
  }

  // ---------------------------------------------------------------------------
  _buildBg(W, H) {
    const plxKeys = ['plx_1','plx_2','plx_3','plx_4','plx_5'];
    this._plxLayers = [];
    const hasPlx = plxKeys.some(k => this.textures.exists(k));

    if (hasPlx) {
      plxKeys.forEach((k, i) => {
        if (!this.textures.exists(k)) return;
        this._plxLayers.push(
          this.add.tileSprite(0, 0, W, H, k).setOrigin(0, 0).setDepth(-10 + i)
        );
      });
    } else {
      const bg = this.add.graphics().setDepth(-10);
      [[0, 160, 0x020d06], [160, 360, 0x051a0e], [360, H, 0x0a2a18]]
        .forEach(([y1, y2, col]) => { bg.fillStyle(col); bg.fillRect(0, y1, W, y2 - y1); });
      bg.fillStyle(0xeeffee, 0.7); bg.fillCircle(820, 55, 38);
      [50, 160, 300, 460, 620, 780, 920].forEach((cx, i) => {
        const h = 100 + (i % 3) * 40;
        bg.fillStyle(0x0a2318); bg.fillEllipse(cx, 380 - h / 2, 90, h);
      });
    }

    if (this.textures.exists('vine_hang')) {
      [80, 260, 480, 700, 920].forEach(vx => {
        this.add.image(vx, 0, 'vine_hang').setOrigin(0.5, 0).setDepth(-4).setScale(1.6);
      });
    }

    const gnd = this.add.graphics().setDepth(-3);
    gnd.fillStyle(0x1a4a22); gnd.fillRect(0, 505, W, 40);
    gnd.fillStyle(0x0d2318); gnd.fillRect(0, 516, W, 30);
    gnd.fillStyle(0xcc9933); gnd.fillRect(0, 505, W, 2);
  }

  // ---------------------------------------------------------------------------
  _buildFireflies(W) {
    for (let i = 0; i < 16; i++) {
      const ff = this.add.circle(
        60 + Math.random() * (W - 120),
        80 + Math.random() * 400,
        1.5 + Math.random() * 1.5, 0x88ffaa
      ).setDepth(2);
      this.tweens.add({
        targets: ff,
        x: ff.x + (Math.random() - 0.5) * 140,
        y: ff.y + (Math.random() - 0.5) * 100,
        alpha: { from: 0.9, to: 0.05 },
        duration: 1000 + Math.random() * 2200,
        ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        delay: Math.random() * 2400,
      });
    }
  }

  // ---------------------------------------------------------------------------
  _buildSpotlight(W) {
    const g = this.add.graphics().setDepth(3);
    g.fillStyle(0xffee88, 0.05);
    g.fillTriangle(W / 2, 0, W / 2 - 240, 510, W / 2 + 240, 510);
    g.fillStyle(0xffee88, 0.03);
    g.fillTriangle(W / 2, 0, W / 2 - 140, 510, W / 2 + 140, 510);

    // Ground glow ellipse
    const gl = this.add.graphics().setDepth(3);
    gl.fillStyle(0xffcc44, 0.07);
    gl.fillEllipse(W / 2, 503, 320, 36);
  }

  // ---------------------------------------------------------------------------
  _buildTitle(W) {
    const JUNGLE = '"Cinzel Decorative", serif';

    const tb = this.add.graphics().setDepth(9);
    tb.fillStyle(0x000000, 0.55);
    tb.fillRoundedRect(W / 2 - 300, 12, 600, 134, 12);
    tb.lineStyle(2, 0xcc9933, 1);
    tb.strokeRoundedRect(W / 2 - 300, 12, 600, 134, 12);
    tb.lineStyle(1, 0x44ffaa, 0.4);
    tb.strokeRoundedRect(W / 2 - 296, 16, 592, 126, 10);

    // Decorative corner dots
    [[W/2-292,20],[W/2+292,20],[W/2-292,138],[W/2+292,138]].forEach(([x,y]) => {
      tb.fillStyle(0xcc9933); tb.fillCircle(x, y, 3);
    });

    const t1 = this.add.text(W / 2, 52, 'RHYTHM', {
      fontSize: '42px', color: '#ffcc44', fontFamily: JUNGLE,
      stroke: '#5a3000', strokeThickness: 8,
      shadow: { x: 2, y: 4, color: '#1a0800', blur: 12, fill: true },
    }).setOrigin(0.5).setDepth(10);

    const t2 = this.add.text(W / 2, 98, 'KINGDOM', {
      fontSize: '34px', color: '#44ffaa', fontFamily: JUNGLE,
      stroke: '#002a18', strokeThickness: 6,
      shadow: { x: 2, y: 3, color: '#001a0e', blur: 10, fill: true },
    }).setOrigin(0.5).setDepth(10);

    // Tagline
    this.add.text(W / 2, 126, "✦  A Monkey's Rhythm Journey  ✦", {
      fontSize: '12px', color: '#ddaa44', fontFamily: 'monospace', fontStyle: 'italic',
      stroke: '#1a0e00', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(10);

    this.add.text(W / 2, 162, 'Powered by the Rhythm of ElevenLabs  |  Developed using Zed', {
      fontSize: '13px', color: '#88aacc', fontFamily: 'monospace',
      stroke: '#0a0a1a', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(10);

    this.tweens.add({
      targets: [t1, t2, tb],
      y: '-=5', duration: 2000, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });

    this._titleText = t1;
  }

  // ---------------------------------------------------------------------------
  _buildGorilla(W) {
    const GX = W / 2, GY = 248;
    const SCALE = 2.5;
    const FRAMES = ['dance_monk_idle', 'dance_monk_l', 'dance_monk_idle', 'dance_monk_r'];

    this._gorilla = this.add.image(GX, GY, FRAMES[0]).setScale(SCALE).setDepth(8);

    this._beatDots = [];

    let beatIdx = 0;
    this.time.addEvent({
      delay: RK.BEAT_MS,
      loop: true,
      callback: () => {
        const cur = beatIdx;
        beatIdx = (beatIdx + 1) % 4;
        const strong = cur === 0;

        // Swap dance frame
        this._gorilla.setTexture(FRAMES[cur]);

        // Subtle bob — avoid distortion with gentle values
        const targetSX = SCALE * (strong ? 0.92 : 0.96);
        const targetSY = SCALE * (strong ? 1.10 : 1.05);
        this.tweens.killTweensOf(this._gorilla);
        this._gorilla.setScale(SCALE);
        this.tweens.add({
          targets: this._gorilla,
          scaleX: targetSX, scaleY: targetSY,
          duration: 80, yoyo: true, ease: 'Sine.easeOut',
          onComplete: () => this._gorilla.setScale(SCALE),
        });

        // Expanding ring from gorilla
        const ringCol = strong ? 0xffcc44 : 0x44ffaa;
        const ring = this.add.circle(GX, GY, 18, 0x000000, 0).setDepth(7);
        ring.setStrokeStyle(strong ? 3 : 2, ringCol, 1);
        this.tweens.add({
          targets: ring,
          scaleX: strong ? 7 : 4.5,
          scaleY: strong ? 5.5 : 3.5,
          alpha: 0,
          duration: strong ? 580 : 380,
          ease: 'Sine.easeOut',
          onComplete: () => ring.destroy(),
        });

        // Beat dots
        const dotCol = strong ? 0xffcc44 : 0x44ffaa;
        this._beatDots.forEach((d, i) => {
          if (i === cur) {
            d.setFillStyle(dotCol);
            this.tweens.add({ targets: d, scaleX: 1.7, scaleY: 1.7, duration: 90, yoyo: true });
          } else {
            d.setFillStyle(0x1a3322);
          }
        });

        // Title flash on downbeat
        if (strong && this._titleText) {
          this.tweens.add({ targets: this._titleText, alpha: 0.55, duration: 75, yoyo: true });
        }
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Controls + start button in one centered horizontal bar
  _buildBottomBar(W) {
    const PX = 80, PY = 338, PW = 800, PH = 118;
    const MID = PX + PW / 2;   // 480
    const LCX = PX + PW / 4;   // 280  — left half centre
    const RCX = PX + PW * 3/4; // 680  — right half centre

    // Panel background
    const bg = this.add.graphics().setDepth(9);
    bg.fillStyle(0x040e06, 0.90);
    bg.fillRoundedRect(PX, PY, PW, PH, 8);
    bg.lineStyle(1, 0x1e3d20);
    bg.strokeRoundedRect(PX, PY, PW, PH, 8);

    // Centre divider
    bg.lineStyle(1, 0x1e3d20, 0.8);
    bg.beginPath();
    bg.moveTo(MID, PY + 12);
    bg.lineTo(MID, PY + PH - 12);
    bg.strokePath();

    // ── LEFT: how to play ──────────────────────────────────────────────────
    this.add.text(LCX, PY + 14, '— HOW TO PLAY —', {
      fontSize: '9px', color: '#44ffaa', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(10);

    const controls = [
      ['A / D',      'move monkey'],
      ['CLICK WELL', 'set beat action'],
      ['ON BEAT',    'action fires!'],
    ];
    controls.forEach(([key, desc], i) => {
      const cy = PY + 34 + i * 22;
      this.add.text(LCX - 8, cy, key,  { fontSize: '9px', color: '#ffcc44', fontFamily: 'monospace' }).setOrigin(1, 0).setDepth(10);
      this.add.text(LCX + 8, cy, desc, { fontSize: '9px', color: '#7799bb', fontFamily: 'monospace' }).setOrigin(0, 0).setDepth(10);
    });

    this.add.text(LCX, PY + PH - 14, '120 BPM  ·  2–8 beats  ·  rhythm rules all', {
      fontSize: '7px', color: '#55aa77', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(10);

    // ── RIGHT: play button ─────────────────────────────────────────────────
    const FONT = '"Press Start 2P", monospace';
    const by = PY + PH / 2;

    const btn = this.add.rectangle(RCX, by, 260, 72, 0x071a09)
      .setOrigin(0.5).setDepth(12).setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0x44ffaa);

    const lbl = this.add.text(RCX, by - 10, '▶  PLAY', {
      fontSize: '17px', color: '#44ffaa', fontFamily: FONT,
      shadow: { x: 0, y: 3, color: '#002a18', blur: 6, fill: true },
    }).setOrigin(0.5).setDepth(13).setInteractive({ useHandCursor: true });

    const sub = this.add.text(RCX, by + 16, 'or press SPACE', {
      fontSize: '8px', color: '#2a5a30', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(13);

    const hover = (on) => {
      btn.setFillStyle(on ? 0x0e3214 : 0x071a09);
      lbl.setStyle({ color: on ? '#88ffcc' : '#44ffaa' });
    };
    [btn, lbl].forEach(o => {
      o.on('pointerdown', (p) => p.event.stopPropagation());
      o.on('pointerup', () => this._start());
      o.on('pointerover', () => hover(true));
      o.on('pointerout', () => hover(false));
    });

    this.tweens.add({
      targets: [btn, lbl, sub],
      alpha: { from: 1, to: 0.72 },
      duration: 700, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });
  }

  // ---------------------------------------------------------------------------
  update() {
    if (this._plxLayers) {
      this._plxLayers.forEach((spr, i) => { spr.tilePositionX += 0.1 + i * 0.08; });
    }
  }

  _buildTapOverlay(W, H) {
    // Full-screen dark overlay
    const overlay = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.72)
      .setDepth(50).setInteractive();

    // Pulsing tap prompt
    const txt = this.add.text(W / 2, H / 2, 'TAP TO BEGIN', {
      fontSize: '28px', color: '#ffcc44',
      fontFamily: '"Cinzel Decorative", serif', fontStyle: 'bold',
      stroke: '#5a3000', strokeThickness: 6,
      shadow: { x: 0, y: 4, color: '#000', blur: 12, fill: true },
    }).setOrigin(0.5).setDepth(51);

    const sub = this.add.text(W / 2, H / 2 + 44, 'click or press any key', {
      fontSize: '11px', color: '#886633', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(51);

    this.tweens.add({
      targets: txt, alpha: { from: 1, to: 0.3 },
      duration: 700, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });

    const dismiss = () => {
      this._startMenuMusic();
      this.tweens.add({
        targets: [overlay, txt, sub], alpha: 0, duration: 400,
        onComplete: () => { overlay.destroy(); txt.destroy(); sub.destroy(); },
      });
      // Only wire SPACE → start AFTER overlay gone
      this.input.keyboard.once('keydown-SPACE', () => this._start());
    };

    overlay.once('pointerdown', dismiss);
    this.input.keyboard.once('keydown', dismiss);
  }

  _startMenuMusic() {
    const a = window.RK && window.RK._audio;
    if (!a) return;
    a._ensureCtx(); // must call during user gesture to unsuspend context
    if (a.buffers['menu_loop']) {
      if (!this._menuMusicOn) {
        this._menuMusicOn = true;
        a.playLoop('menu_loop');
      }
    } else {
      // Buffer still fetching — retry until loaded (up to 5s)
      this._menuRetries = (this._menuRetries || 0) + 1;
      if (this._menuRetries < 25) {
        this.time.delayedCall(200, () => this._startMenuMusic());
      }
    }
  }

  _stopMenuMusic() {
    const a = window.RK && window.RK._audio;
    if (a) a.stopLoop('menu_loop');
    this._menuMusicOn = false;
  }

  _start() {
    // Ensure context unlocked even if music not started yet
    const a = window.RK && window.RK._audio;
    if (a) a._ensureCtx();
    this.cameras.main.flash(200, 20, 100, 40);
    this.time.delayedCall(300, () => {
      this._stopMenuMusic();
      this.scene.start('GameScene', { level: 'level1' });
    });
  }

  shutdown() {
    this._stopMenuMusic();
  }
}
