// =============================================================================
//  Rhythm Kingdom — UIScene.js
//  Relic sequencer overlay. Click beat wells to cycle actions.
// =============================================================================

class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UIScene' }); }

  init(data) {
    this.timeline         = (data && data.timeline) || new RK.Timeline();
    this.currentBeat      = 0;
    this._unlockedActions = ['JUMP', 'ROLL'];
    // Restore session values
    const sess = window.RK && window.RK._session;
    this._activeBeatCount   = (sess && sess.beatCount)    || RK.BEAT_COUNT;
    this._savedTrackIndex   = (sess && sess.trackIndex)   || 1;
    this._savedVariantIndex = (sess && sess.variantIndex !== undefined) ? sess.variantIndex : 0;
    this._levelKey  = (data && data.levelKey) || 'level1';
    const m = this._levelKey.match(/\d+/);
    this._levelNum  = m ? parseInt(m[0]) : 1;
    this._levelName = (RK.Levels[this._levelKey] && RK.Levels[this._levelKey].name) || '';
  }

  create() {
    this.PANEL_TOP = 0;
    this.WELL_W    = 52;
    this.WELL_H    = 42;
    this.WELL_GAP  = 5;

    const totalW    = RK.BEAT_COUNT * this.WELL_W + (RK.BEAT_COUNT - 1) * this.WELL_GAP;
    this.wellStartX = (RK.WIDTH - totalW) / 2;
    this.WELL_CY    = 33;

    this._buildPanel();
    this._buildWells();
    this._buildPlayhead();
    this._buildLockedRunesDisplay();
    this._buildMusicSelector();
    this._buildLevelLabel();
    this._showLevelIntro();

    // Apply saved beat count layout (if not default 8)
    if (this._activeBeatCount !== RK.BEAT_COUNT) {
      this._setActiveBeatCount(this._activeBeatCount);
    }

    this.input.on('pointerdown', this._onPointerDown, this);

    const g = this.game.events;
    g.off('rk_beat',           this._onBeat,          this);
    g.off('rk_player_dead',    this._onPlayerDead,    this);
    g.off('rk_level_complete', this._onLevelComplete, this);
    g.off('rk_slot_success',   this._onSlotSuccess,   this);
    g.off('rk_slot_invalid',   this._onSlotInvalid,   this);
    g.off('rk_action_unlock',  this._onActionUnlock,  this);
    g.off('rk_timeline_clear', this._onTimelineClear, this);
    g.on('rk_beat',           this._onBeat,          this);
    g.on('rk_player_dead',    this._onPlayerDead,    this);
    g.on('rk_level_complete', this._onLevelComplete, this);
    g.on('rk_slot_success',   this._onSlotSuccess,   this);
    g.on('rk_slot_invalid',   this._onSlotInvalid,   this);
    g.on('rk_action_unlock',  this._onActionUnlock,  this);
    g.on('rk_timeline_clear', this._onTimelineClear, this);
  }

  // ---------------------------------------------------------------------------
  _wellX(i) {
    const n = this._activeBeatCount;
    const startX = (RK.WIDTH - (n * this.WELL_W + (n - 1) * this.WELL_GAP)) / 2;
    return startX + i * (this.WELL_W + this.WELL_GAP) + this.WELL_W / 2;
  }

  // ---------------------------------------------------------------------------
  _buildPanel() {
    this.add.rectangle(RK.WIDTH / 2, RK.UI_HEIGHT / 2, RK.WIDTH, RK.UI_HEIGHT, 0x1a140e, 0.95)
      .setDepth(0).setScrollFactor(0);
    this.add.rectangle(RK.WIDTH / 2, 0, RK.WIDTH, 2, 0xcc9933)
      .setDepth(0).setScrollFactor(0);
  }

  _buildWells() {
    this.wellBgs    = [];
    this.wellIcons  = [];
    this.wellGlows  = [];
    this.beatNums   = [];
    this.wellLabels = [];

    for (let i = 0; i < RK.BEAT_COUNT; i++) {
      const cx = this._wellX(i);
      const cy = this.WELL_CY;

      // Beat number label
      const numStyle = { fontSize: '9px', color: '#cc9933', fontFamily: 'monospace', fontStyle: 'bold' };
      const num = this.add.text(cx, cy - 20, String(i + 1), numStyle).setOrigin(0.5).setDepth(2);
      this.beatNums.push(num);

      // Stone well base
      const bg = this.add.image(cx, cy, 'beat_well').setDepth(1).setScale(0.54);
      this.wellBgs.push(bg);

      // Glow overlay
      const glow = this.add.rectangle(cx, cy, this.WELL_W - 10, this.WELL_H - 10, 0x44ffaa, 0)
        .setDepth(2);
      this.wellGlows.push(glow);

      // Action icon
      const icon = this.add.image(cx, cy, 'action_jump').setDepth(3).setAlpha(0).setScale(0.46);
      this.wellIcons.push(icon);

      // Action name label beneath icon
      const lblStyle = { fontSize: '6px', color: '#cc9933', fontFamily: 'monospace' };
      const lbl = this.add.text(cx, cy + 15, '', lblStyle).setOrigin(0.5).setDepth(3);
      this.wellLabels.push(lbl);

      // Click interaction
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerdown', () => this._onWellClick(i));
      bg.on('pointerover', () => bg.setTint(0xffeecc));
      bg.on('pointerout',  () => bg.clearTint());
    }

    this._updateWellVisuals();
  }

  _buildPlayhead() {
    this._playhead = this.add.image(this._wellX(0), this.WELL_CY, 'playhead')
      .setDepth(4).setAlpha(0.9).setScale(0.7);
  }

  _buildLockedRunesDisplay() {
    const ALL_ACTIONS = ['JUMP', 'ROLL', 'COCONUT'];
    this._runeIconObjs = [];

    this.add.text(14, 3, 'RUNES', {
      fontSize: '7px', color: '#cc9933', fontFamily: 'monospace', fontStyle: 'bold',
    }).setDepth(5).setScrollFactor(0);

    ALL_ACTIONS.forEach((action, i) => {
      const x = 28 + i * 68;
      const unlockedKey = 'action_' + action.toLowerCase();
      const lockedKey   = 'action_' + action.toLowerCase() + '_locked';
      const col = RK.ACTION_COLORS[action] || 0x888888;

      // Icon — starts as locked version, swaps on unlock
      const icon = this.add.image(x, 30, lockedKey)
        .setScale(0.38).setAlpha(0.55).setDepth(5).setScrollFactor(0);

      // Lock badge
      const lockBadge = this.add.text(x + 8, 18, 'X', {
        fontSize: '7px', color: '#ff4444', fontFamily: 'monospace', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(6).setScrollFactor(0);

      // Action name
      const lbl = this.add.text(x, 50, action, {
        fontSize: '7px', color: '#ccaa55', fontFamily: 'monospace', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(5).setScrollFactor(0);

      this._runeIconObjs.push({ action, icon, lockBadge, lbl, unlockedKey, lockedKey, col });
    });

    this._refreshLockedDisplay();
  }

  _refreshLockedDisplay() {
    if (!this._runeIconObjs) return;
    this._runeIconObjs.forEach(({ action, icon, lockBadge, lbl, unlockedKey, lockedKey, col }) => {
      const unlocked = this._unlockedActions.includes(action);
      if (unlocked) {
        icon.setTexture(unlockedKey).setAlpha(1).setTint(0xffffff);
        lockBadge.setVisible(false);
        lbl.setStyle({ color: '#' + col.toString(16).padStart(6, '0') });
      } else {
        icon.setTexture(lockedKey).setAlpha(0.55).setTint(0x888888);
        lockBadge.setVisible(true);
        lbl.setStyle({ color: '#998844' });
      }
    });
  }

  _buildInfoButton(bx, by) {
    const btn = this.add.rectangle(bx, by, 18, 18, 0x0a1a2a)
      .setDepth(5).setStrokeStyle(1, 0x44aaff).setScrollFactor(0).setInteractive({ useHandCursor: true });
    this.add.text(bx, by, 'i', {
      fontSize: '11px', color: '#44aaff', fontFamily: 'monospace', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(6).setScrollFactor(0);

    // Info panel
    const pw = 400, ph = 170, pcx = RK.WIDTH - 225, pcy = RK.UI_HEIGHT + 98;
    this._infoBg = this.add.rectangle(pcx, pcy, pw, ph, 0x080e18, 0.96)
      .setDepth(30).setAlpha(0).setStrokeStyle(2, 0x44aaff).setScrollFactor(0);

    const lines = [
      { t: '— HOW TO PLAY —',                   c: '#44aaff', s: '10px', b: true },
      { t: '▸ 2 runes unlocked by default',      c: '#ffee88', s: '9px'  },
      { t: '▸ Unlock more as you progress further', c: '#ffee88', s: '9px' },
      { t: '▸ Stack 2 JUMP runes → double jump', c: '#44ffaa', s: '9px'  },
      { t: '▸ Place runes in the right slots',   c: '#44ffaa', s: '9px'  },
      { t: '▸ Time your actions to the beat',    c: '#44ffaa', s: '9px'  },
      { t: '▸ A / D  or  ← / →  to move',       c: '#ccaa55', s: '9px'  },
      { t: '▸ Avoid snakes — instant death!',    c: '#ff6644', s: '9px'  },
      { t: 'Click anywhere to close',            c: '#445566', s: '8px'  },
    ];

    this._infoObjs = [this._infoBg];
    lines.forEach((l, i) => {
      const txt = this.add.text(pcx, pcy - 68 + i * 18, l.t, {
        fontSize: l.s, color: l.c, fontFamily: 'monospace',
        fontStyle: l.b ? 'bold' : 'normal',
      }).setOrigin(0.5).setDepth(31).setAlpha(0).setScrollFactor(0);
      this._infoObjs.push(txt);
    });

    this._infoOpen = false;
    btn.on('pointerdown', (p) => p.event.stopPropagation());
    btn.on('pointerup', () => this._toggleInfo());
    this.input.on('pointerdown', () => { if (this._infoOpen) this._toggleInfo(); });
  }

  _toggleInfo() {
    this._infoOpen = !this._infoOpen;
    const a = this._infoOpen ? 1 : 0;
    this._infoObjs.forEach(o => o.setAlpha(a));
  }

  _buildMusicSelector() {
    const tracks = [
      { key: 'backing_loop_chill',   label: 'CHILL',   color: 0x44ffaa },
      { key: 'backing_loop',         label: 'GROOVE',  color: 0xffcc44 },
      { key: 'backing_loop_intense', label: 'INTENSE', color: 0xff4422 },
    ];
    this._tracks = tracks;
    this._trackIndex   = this._savedTrackIndex;
    this._variantIndex = this._savedVariantIndex;

    // Info (i) button — left of gear
    this._buildInfoButton(RK.WIDTH - 46, this.WELL_CY);

    // Gear button
    const gbx = RK.WIDTH - 22, gby = this.WELL_CY;
    this._gearBtn = this.add.rectangle(gbx, gby, 18, 18, 0x2a2015)
      .setDepth(5).setStrokeStyle(1, 0xcc9933).setScrollFactor(0).setInteractive({ useHandCursor: true });
    this._gearBtn.on('pointerdown', (p) => p.event.stopPropagation());
    this._gearBtn.on('pointerup', () => this._toggleSettings());
    const gl = this.add.graphics().setDepth(6).setScrollFactor(0);
    gl.fillStyle(0xcc9933);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      gl.fillCircle(gbx + Math.cos(a) * 6, gby + Math.sin(a) * 6, 1.8);
    }
    gl.fillCircle(gbx, gby, 2.5);

    // Settings popup — right-aligned, expanded to fit variant row
    const pw = 340, ph = 168;
    const pcx = RK.WIDTH - pw / 2 - 12;
    const pcy = RK.UI_HEIGHT + 91;   // shifted down 19px to keep top edge same

    this._pickerBg = this.add.rectangle(pcx, pcy, pw, ph, 0x120e08, 0.97)
      .setDepth(20).setAlpha(0).setStrokeStyle(2, 0xcc9933).setScrollFactor(0);

    const popObjs = [];
    const PAD = pcx - pw / 2 + 12;  // left text margin

    // ── WELLS ─────────────────────────────────────────────────────────────────
    popObjs.push(this.add.text(PAD, pcy - 71, 'WELLS', {
      fontSize: '8px', color: '#cc9933', fontFamily: 'monospace',
    }).setDepth(22).setAlpha(0).setScrollFactor(0));

    // 7 buttons centered on pcx: step=44px, total span=6*44=264, half=132
    this._wellCountBtns = [];
    for (let n = 2; n <= 8; n++) {
      const bx = pcx - 132 + (n - 2) * 44;
      const by = pcy - 47;
      const active = n === this._activeBeatCount;
      const btn = this.add.rectangle(bx, by, 40, 24, active ? 0x1e4a1e : 0x1a1a0e)
        .setDepth(21).setAlpha(0).setScrollFactor(0).setInteractive({ useHandCursor: true })
        .setStrokeStyle(1, active ? 0x44ffaa : 0x443322);
      btn.on('pointerdown', (p) => p.event.stopPropagation());
      btn.on('pointerup', () => { this._setActiveBeatCount(n); this._toggleSettings(); });
      const lbl = this.add.text(bx, by, String(n), {
        fontSize: '10px', color: active ? '#44ffaa' : '#886633',
        fontFamily: 'monospace', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(22).setAlpha(0).setScrollFactor(0);
      popObjs.push(btn, lbl);
      this._wellCountBtns.push({ btn, lbl, n });
    }

    // Divider
    const div = this.add.graphics().setDepth(21).setAlpha(0).setScrollFactor(0);
    div.lineStyle(1, 0x443322, 0.7);
    div.beginPath(); div.moveTo(pcx - pw / 2 + 12, pcy - 19); div.lineTo(pcx + pw / 2 - 12, pcy - 19); div.strokePath();
    popObjs.push(div);

    // ── MUSIC ─────────────────────────────────────────────────────────────────
    popObjs.push(this.add.text(PAD, pcy - 11, 'MUSIC', {
      fontSize: '8px', color: '#cc9933', fontFamily: 'monospace',
    }).setDepth(22).setAlpha(0).setScrollFactor(0));

    // 3 buttons centered on pcx: step=92px, total span=2*92=184, half=92
    this._pickerBtns = tracks.map((t, i) => {
      const px = pcx - 92 + i * 92;
      const py = pcy + 17;
      const btn = this.add.rectangle(px, py, 86, 28, t.color, 0.12)
        .setDepth(21).setAlpha(0).setScrollFactor(0).setInteractive({ useHandCursor: true })
        .setStrokeStyle(1, t.color);
      btn.on('pointerdown', (p) => p.event.stopPropagation());
      btn.on('pointerup', () => this._selectTrack(i));
      const lbl = this.add.text(px, py, t.label, {
        fontSize: '9px', color: '#' + t.color.toString(16).padStart(6, '0'),
        fontFamily: 'monospace', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(22).setAlpha(0).setScrollFactor(0);
      popObjs.push(btn, lbl);
      return { btn, lbl, track: t };
    });

    // ── VARIANT (1 / 2) inline below each track ───────────────────────────────
    // Each track gets its own [1] [2] pair. Only active track's pair is visible.
    this._perTrackVariants = tracks.map((t, i) => {
      const trackPx = pcx - 92 + i * 92;
      const vy = pcy + 42;
      return [0, 1].map(v => {
        const vx = trackPx - 20 + v * 40;
        const on = v === this._variantIndex;
        const btn = this.add.rectangle(vx, vy, 34, 18, on ? 0x1e3a4a : 0x1a1a0e)
          .setDepth(21).setAlpha(0).setScrollFactor(0).setInteractive({ useHandCursor: true })
          .setStrokeStyle(1, on ? 0x44aaff : 0x443322);
        btn.on('pointerdown', (p) => p.event.stopPropagation());
        btn.on('pointerup', () => this._selectVariant(v));
        const lbl = this.add.text(vx, vy, String(v + 1), {
          fontSize: '9px', color: on ? '#44aaff' : '#886633',
          fontFamily: 'monospace', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(22).setAlpha(0).setScrollFactor(0);
        return { btn, lbl, v };
      });
    });

    this._popObjs = popObjs;
    this._pickerOpen = false;
  }

  _toggleSettings() {
    this._pickerOpen = !this._pickerOpen;
    const a = this._pickerOpen ? 1 : 0;
    this._pickerBg.setAlpha(a);
    this._popObjs.forEach(o => o.setAlpha(a));
    this._updateTrackBtns();
    this._refreshVariantVisibility();
  }

  _effectiveLoopKey() {
    const base = this._tracks[this._trackIndex].key;
    return this._variantIndex === 1 ? base + '_2' : base;
  }

  _selectTrack(index) {
    this._trackIndex = index;
    const loopKey = this._effectiveLoopKey();
    if (window.RK._session) {
      window.RK._session.trackIndex = index;
      window.RK._session.trackKey   = loopKey;
    }
    this.game.events.emit('rk_loop_change', { loopKey });
    this._updateTrackBtns();
    this._refreshVariantVisibility();
  }

  _selectVariant(v) {
    this._variantIndex = v;
    if (window.RK._session) window.RK._session.variantIndex = v;
    this.game.events.emit('rk_loop_change', { loopKey: this._effectiveLoopKey() });
    this._updateVariantBtns();
    this._toggleSettings();
  }

  _updateTrackBtns() {
    if (!this._pickerBtns) return;
    this._pickerBtns.forEach(({ btn, track }, i) => {
      const on = i === this._trackIndex;
      btn.setFillStyle(track.color, on ? 0.35 : 0.12);
      btn.setStrokeStyle(on ? 2 : 1, track.color);
    });
  }

  _refreshVariantVisibility() {
    if (!this._perTrackVariants) return;
    this._perTrackVariants.forEach((pair, i) => {
      const va = (this._pickerOpen && i === this._trackIndex) ? 1 : 0;
      pair.forEach(({ btn, lbl }) => { btn.setAlpha(va); lbl.setAlpha(va); });
    });
  }

  _updateVariantBtns() {
    if (!this._perTrackVariants) return;
    this._perTrackVariants.forEach(pair => {
      pair.forEach(({ btn, lbl, v }) => {
        const on = v === this._variantIndex;
        btn.setFillStyle(on ? 0x1e3a4a : 0x1a1a0e);
        btn.setStrokeStyle(1, on ? 0x44aaff : 0x443322);
        lbl.setStyle({ color: on ? '#44aaff' : '#886633' });
      });
    });
  }

  _setActiveBeatCount(n) {
    this._activeBeatCount = n;
    if (window.RK._session) window.RK._session.beatCount = n;

    // Highlight active button in popup
    this._wellCountBtns.forEach(({ btn, lbl, n: bn }) => {
      const on = bn === n;
      btn.setFillStyle(on ? 0x1e4a1e : 0x1a1a0e);
      btn.setStrokeStyle(1, on ? 0x44ffaa : 0x443322);
      lbl.setStyle({ color: on ? '#44ffaa' : '#886633' });
    });

    // Reposition active wells centered, hide extras
    for (let i = 0; i < RK.BEAT_COUNT; i++) {
      if (i < n) {
        const cx = this._wellX(i);
        this.wellBgs[i].setPosition(cx, this.WELL_CY).setVisible(true)
          .setInteractive({ useHandCursor: true });
        this.beatNums[i].setPosition(cx, this.WELL_CY - 20).setVisible(true);
        this.wellIcons[i].setPosition(cx, this.WELL_CY).setVisible(true);
        this.wellGlows[i].setPosition(cx, this.WELL_CY).setVisible(true);
        this.wellLabels[i].setPosition(cx, this.WELL_CY + 15).setVisible(true);
      } else {
        this.wellBgs[i].setVisible(false).removeInteractive();
        this.beatNums[i].setVisible(false);
        this.wellIcons[i].setVisible(false);
        this.wellGlows[i].setVisible(false);
        this.wellLabels[i].setVisible(false);
        this.timeline.clearSlot(i);
      }
    }

    // Snap playhead to well 0
    this._playhead.setPosition(this._wellX(0), this.WELL_CY);

    this.game.events.emit('rk_beat_count_change', { count: n });
  }


  // ---------------------------------------------------------------------------
  _updateWellVisuals() {
    for (let i = 0; i < RK.BEAT_COUNT; i++) {
      const action = this.timeline.getSlot(i);
      const icon   = this.wellIcons[i];
      const glow   = this.wellGlows[i];
      const lbl    = this.wellLabels[i];

      if (action) {
        const iconKey = 'action_' + action.toLowerCase();
        icon.setTexture(iconKey).setAlpha(1);
        const col = RK.ACTION_COLORS[action] || 0x888888;
        glow.setFillStyle(col, 0.18);
        lbl.setText(action);
      } else {
        icon.setAlpha(0);
        glow.setFillStyle(0x44ffaa, 0);
        lbl.setText('');
      }
    }
  }

  // ---------------------------------------------------------------------------
  _onWellClick(index) {
    if (index >= this._activeBeatCount) return;
    this.timeline.cycleSlot(index);

    // If this created 3 consecutive JUMPs, cycle past JUMP and warn
    if (this.timeline.getSlot(index) === 'JUMP' && this._activeBeatCount >= 3 && this._wouldTripleJump(index)) {
      this.timeline.cycleSlot(index);
      this._showBeatMsg('Max 2 jumps in a row!');
    }

    this._updateWellVisuals();
    const glow = this.wellGlows[index];
    this.tweens.add({ targets: glow, fillAlpha: 0.5, duration: 80, yoyo: true });
  }

  _wouldTripleJump(i) {
    const n = this._activeBeatCount;
    const g = (idx) => this.timeline.getSlot(((idx % n) + n) % n);
    return (g(i-2) === 'JUMP' && g(i-1) === 'JUMP') ||
           (g(i-1) === 'JUMP' && g(i+1) === 'JUMP') ||
           (g(i+1) === 'JUMP' && g(i+2) === 'JUMP');
  }

  _showBeatMsg(text) {
    if (this._msgTxt) { this._msgTxt.destroy(); this._msgTxt = null; }
    this._msgTxt = this.add.text(RK.WIDTH / 2, RK.UI_HEIGHT + 14, text, {
      fontSize: '10px', color: '#ffcc44', fontFamily: 'monospace',
      backgroundColor: '#00000099', padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setDepth(30).setScrollFactor(0);
    this.tweens.add({
      targets: this._msgTxt, alpha: 0, duration: 1400, delay: 600,
      onComplete: () => { if (this._msgTxt) { this._msgTxt.destroy(); this._msgTxt = null; } },
    });
  }

  _onPointerDown(pointer) {
    if (pointer.y < this.PANEL_TOP) return;
    if (this._pickerOpen) {
      const bg = this._pickerBg;
      const inside = Math.abs(pointer.x - bg.x) < bg.width / 2 &&
                     Math.abs(pointer.y - bg.y) < bg.height / 2;
      if (!inside) this._toggleSettings();
      return;
    }
    if (pointer.rightButtonDown()) {
      for (let i = 0; i < RK.BEAT_COUNT; i++) {
        const cx = this._wellX(i);
        if (Math.abs(pointer.x - cx) < this.WELL_W / 2 &&
            Math.abs(pointer.y - this.WELL_CY) < this.WELL_H / 2) {
          this.timeline.clearSlot(i);
          this._updateWellVisuals();
          return;
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  _onBeat(beatIndex) {
    this.currentBeat = beatIndex;
    this._movePlayhead(beatIndex);
    this._pulseWell(beatIndex);
    this._beatScreenPulse(beatIndex);
    this._updateBeatNumbers(beatIndex);
  }

  _movePlayhead(beatIndex) {
    const tx = this._wellX(beatIndex);
    this.tweens.killTweensOf(this._playhead);
    this.tweens.add({
      targets: this._playhead, x: tx,
      duration: 60, ease: 'Quad.easeOut',
    });
  }

  _pulseWell(i) {
    if (i >= this._activeBeatCount) return;
    const bg = this.wellBgs[i];
    this.tweens.add({
      targets: bg, scaleX: 0.60, scaleY: 0.60,
      duration: 80, yoyo: true, ease: 'Sine.easeOut',
    });
  }

  _beatScreenPulse(beatIndex) {
    if (!this._pulseRect || !this._pulseRect.scene) {
      this._pulseRect = this.add.rectangle(
        RK.WIDTH / 2, RK.HEIGHT / 2, RK.WIDTH, RK.HEIGHT, 0xffffff
      ).setDepth(10).setScrollFactor(0).setAlpha(0);
    }
    const cols = [0xffffff, 0xff2222, 0xffee22, 0x22ff44];
    this._pulseRect.setFillStyle(cols[beatIndex % 4], 1);
    this._pulseAlpha = 0.22;
    this._pulseRect.setAlpha(this._pulseAlpha);
  }

  _updateBeatNumbers(activeBeat) {
    this.beatNums.forEach((num, i) => {
      num.setStyle({ color: i === activeBeat ? '#ffcc44' : '#cc9933' });
      num.setScale(i === activeBeat ? 1.3 : 1);
    });
  }

  // ---------------------------------------------------------------------------
  _onSlotSuccess(beatIndex) {
    const glow = this.wellGlows[beatIndex];
    if (!glow) return;
    const col = RK.ACTION_COLORS[this.timeline.getSlot(beatIndex)] || 0x44ffaa;
    glow.setFillStyle(col, 0.7);
    this.tweens.add({
      targets: glow, fillAlpha: 0,
      duration: 200, ease: 'Sine.easeOut',
    });
  }

  _onSlotInvalid(beatIndex) {
    const bg = this.wellBgs[beatIndex];
    if (!bg) return;
    bg.setTint(0xff4444);
    this.time.delayedCall(200, () => { if (bg.scene) bg.clearTint(); });
  }

  // ---------------------------------------------------------------------------
  _onActionUnlock(data) {
    if (data && data.action && !this._unlockedActions.includes(data.action)) {
      this._unlockedActions.push(data.action);
      this.timeline.unlock(data.action);
      this._refreshLockedDisplay();
      this._updateWellVisuals();
      this._showUnlockBanner(data.action);
    }
  }

  _showUnlockBanner(action) {
    const messages = {
      COCONUT: 'COCONUT RUNE UNLOCKED!\nThrow coconuts at enemies to kill them.',
      JUMP:    'JUMP RUNE UNLOCKED!\nPlace JUMP in the timeline to leap.',
      STOMP:   'STOMP RUNE UNLOCKED!\nStomp enemies from above.',
      FIRE:    'FIRE RUNE UNLOCKED!\nShoot fireballs at enemies.',
    };
    const msg = messages[action] || (action + ' RUNE UNLOCKED!');
    const cx = RK.WIDTH / 2;
    const cy = RK.HEIGHT / 2;

    const bg = this.add.rectangle(cx, cy, 480, 80, 0x000000, 0.82)
      .setDepth(20).setScrollFactor(0).setStrokeStyle(2, 0xddaa22);
    const txt = this.add.text(cx, cy, msg, {
      fontSize: '14px', fill: '#ffdd88', align: 'center',
      fontFamily: '"Press Start 2P", monospace',
      wordWrap: { width: 440 },
    }).setOrigin(0.5).setDepth(21).setScrollFactor(0);

    this.time.delayedCall(2800, () => {
      this.tweens.add({
        targets: [bg, txt], alpha: 0, duration: 400,
        onComplete: () => { bg.destroy(); txt.destroy(); },
      });
    });
  }

  _onPlayerDead() {
    this._movePlayhead(0);
    this.currentBeat = 0;
    this._updateWellVisuals();
  }

  _onTimelineClear() {
    this._updateWellVisuals();
  }

  _onLevelComplete() {
    // no-op — level transition handled by GameScene
  }

  _buildLevelLabel() {
    this.add.text(
      RK.WIDTH - 8, RK.UI_HEIGHT + 8,
      `LEVEL ${this._levelNum}: ${this._levelName.toUpperCase()}`,
      { fontSize: '9px', color: '#ffffff', fontFamily: 'monospace',
        stroke: '#000000', strokeThickness: 3,
        backgroundColor: '#00000066', padding: { x: 6, y: 3 } }
    ).setOrigin(1, 0).setDepth(10).setScrollFactor(0);
  }

  _showLevelIntro() {
    const cx = RK.WIDTH / 2, cy = RK.UI_HEIGHT + RK.PLAY_HEIGHT / 2;
    const top = this.add.text(cx, cy - 30, `LEVEL ${this._levelNum}`, {
      fontSize: '36px', color: '#ffcc44', fontFamily: 'monospace',
      stroke: '#663300', strokeThickness: 5,
    }).setOrigin(0.5).setAlpha(0).setDepth(25).setScrollFactor(0);
    const bot = this.add.text(cx, cy + 20, this._levelName.toUpperCase(), {
      fontSize: '20px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#222222', strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0).setDepth(25).setScrollFactor(0);
    this.tweens.add({
      targets: [top, bot], alpha: 1, duration: 400, ease: 'Sine.easeOut',
      onComplete: () => {
        this.time.delayedCall(2200, () => {
          this.tweens.add({
            targets: [top, bot], alpha: 0, duration: 600,
            onComplete: () => { top.destroy(); bot.destroy(); },
          });
        });
      },
    });
  }

  update(time, delta) {
    if (this._pulseAlpha > 0 && this._pulseRect && this._pulseRect.scene) {
      this._pulseAlpha = Math.max(0, this._pulseAlpha - delta / 2200);
      this._pulseRect.setAlpha(this._pulseAlpha);
    }
  }

  // ---------------------------------------------------------------------------
  shutdown() {
    this.game.events.off('rk_beat',           this._onBeat,          this);
    this.game.events.off('rk_player_dead',    this._onPlayerDead,    this);
    this.game.events.off('rk_level_complete', this._onLevelComplete, this);
    this.game.events.off('rk_slot_success',   this._onSlotSuccess,   this);
    this.game.events.off('rk_slot_invalid',   this._onSlotInvalid,   this);
    this.game.events.off('rk_action_unlock',  this._onActionUnlock,  this);
    this.game.events.off('rk_timeline_clear', this._onTimelineClear, this);
    this._pulseRect = null;
    this._pulseAlpha = 0;
  }
}
