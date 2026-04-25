// =============================================================================
//  Rhythm Kingdom — UIScene.js
//  Relic sequencer overlay. Click beat wells to cycle actions.
// =============================================================================

class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UIScene' }); }

  init(data) {
    this.timeline    = (data && data.timeline) || new RK.Timeline();
    this.currentBeat = 0;
    this._unlockedActions = ['JUMP', 'ROLL'];
  }

  create() {
    this.PANEL_TOP = 0;
    this.WELL_W    = 72;
    this.WELL_H    = 56;
    this.WELL_GAP  = 8;

    const totalW     = RK.BEAT_COUNT * this.WELL_W + (RK.BEAT_COUNT - 1) * this.WELL_GAP;
    this.wellStartX  = (RK.WIDTH - totalW) / 2;
    this.WELL_CY     = 35;

    this._buildPanel();
    this._buildWells();
    this._buildPlayhead();
    this._buildUnlockIndicator();
    this._buildMusicSelector();

    this.input.on('pointerdown', this._onPointerDown, this);

    this.game.events.on('rk_beat',          this._onBeat,          this);
    this.game.events.on('rk_player_dead',   this._onPlayerDead,    this);
    this.game.events.on('rk_level_complete',this._onLevelComplete,  this);
    this.game.events.on('rk_slot_success',  this._onSlotSuccess,   this);
    this.game.events.on('rk_slot_invalid',  this._onSlotInvalid,   this);
    this.game.events.on('rk_action_unlock', this._onActionUnlock,  this);
  }

  // ---------------------------------------------------------------------------
  _wellX(i) {
    return this.wellStartX + i * (this.WELL_W + this.WELL_GAP) + this.WELL_W / 2;
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
      const numStyle = { fontSize: '11px', color: '#cc9933', fontFamily: 'monospace', fontStyle: 'bold' };
      const num = this.add.text(cx, cy - 25, String(i + 1), numStyle).setOrigin(0.5).setDepth(2);
      this.beatNums.push(num);

      // Stone well base
      const bg = this.add.image(cx, cy, 'beat_well').setDepth(1).setScale(0.72);
      this.wellBgs.push(bg);

      // Glow overlay
      const glow = this.add.rectangle(cx, cy, this.WELL_W - 16, this.WELL_H - 16, 0x44ffaa, 0)
        .setDepth(2);
      this.wellGlows.push(glow);

      // Action icon
      const icon = this.add.image(cx, cy, 'action_jump').setDepth(3).setAlpha(0).setScale(0.65);
      this.wellIcons.push(icon);

      // Action name label beneath icon
      const lblStyle = { fontSize: '7px', color: '#cc9933', fontFamily: 'monospace' };
      const lbl = this.add.text(cx, cy + 20, '', lblStyle).setOrigin(0.5).setDepth(3);
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

  _buildUnlockIndicator() {
    this._unlockTxt = this.add.text(8, 8, '', {
      fontSize: '8px', color: '#44ffaa', fontFamily: 'monospace',
    }).setDepth(5);
    this._refreshUnlockDisplay();
  }

  _buildMusicSelector() {
    const tracks = [
      { key: 'backing_loop_chill',   label: 'CHILL',   color: 0x44ffaa },
      { key: 'backing_loop',         label: 'GROOVE',  color: 0xffcc44 },
      { key: 'backing_loop_intense', label: 'INTENSE', color: 0xff4422 },
    ];
    this._tracks = tracks;
    this._trackIndex = 1;

    // Gear button — RIGHT side of panel
    const bx = RK.WIDTH - 22;
    const by = 30;
    this._gearBtn = this.add.rectangle(bx, by, 18, 18, 0x2a2015)
      .setDepth(5).setStrokeStyle(1, 0xcc9933).setScrollFactor(0).setInteractive({ useHandCursor: true });
    this._gearBtn.on('pointerdown', (p) => p.event.stopPropagation());
    this._gearBtn.on('pointerup', () => this._toggleTrackPicker());

    // Gear icon — 6 dots around center
    const gl = this.add.graphics().setDepth(6).setScrollFactor(0);
    gl.fillStyle(0xcc9933);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      gl.fillCircle(bx + Math.cos(a) * 6, by + Math.sin(a) * 6, 1.8);
    }
    gl.fillCircle(bx, by, 2.5);

    // Track picker — pops below gear button, right-aligned
    const pickerX = RK.WIDTH - 162;
    const pickerY = RK.UI_HEIGHT + 40;
    this._pickerBg = this.add.rectangle(pickerX, pickerY, 300, 55, 0x1a140e, 0.95)
      .setDepth(20).setAlpha(0).setStrokeStyle(2, 0xcc9933).setScrollFactor(0);

    this._pickerBtns = tracks.map((t, i) => {
      const px = (RK.WIDTH - 280) + i * 100;
      const py = pickerY;
      const btn = this.add.rectangle(px, py, 90, 30, t.color, 0.15)
        .setDepth(21).setAlpha(0).setScrollFactor(0).setInteractive({ useHandCursor: true })
        .setStrokeStyle(1, t.color);
      btn.on('pointerdown', (p) => p.event.stopPropagation());
      btn.on('pointerup', () => this._selectTrack(i));
      const lbl = this.add.text(px, py, t.label, {
        fontSize: '10px', color: '#' + t.color.toString(16).padStart(6, '0'),
        fontFamily: 'monospace', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(22).setScrollFactor(0).setAlpha(0);
      return { btn, lbl, track: t };
    });

    this._pickerOpen = false;
  }

  _toggleTrackPicker() {
    this._pickerOpen = !this._pickerOpen;
    const target = this._pickerOpen ? 1 : 0;
    this._pickerBg.setAlpha(target);
    this._pickerBtns.forEach(({ btn, lbl }) => {
      btn.setAlpha(target);
      lbl.setAlpha(target);
    });
  }

  _selectTrack(index) {
    this._trackIndex = index;
    const track = this._tracks[index];
    this.game.events.emit('rk_loop_change', { loopKey: track.key });
    this._toggleTrackPicker();
  }

  _refreshUnlockDisplay() {
    const symbols = { JUMP: '↑ JUMP', ROLL: '⟳ ROLL', COCONUT: '○ COCO', PUNCH: '★ PUNCH' };
    const txt = this._unlockedActions.map(a => symbols[a] || a).join('  ');
    this._unlockTxt.setText(txt);
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
    this.timeline.cycleSlot(index);
    this._updateWellVisuals();
    const glow = this.wellGlows[index];
    this.tweens.add({
      targets: glow, fillAlpha: 0.5, duration: 80, yoyo: true,
    });
  }

  _onPointerDown(pointer) {
    if (pointer.y < this.PANEL_TOP) return;
    if (this._pickerOpen) {
      let inside = false;
      const px = pointer.x, py = pointer.y;
      this._pickerBtns.forEach(({ btn }) => {
        const bx = btn.x - 45, ex = btn.x + 45;
        const by = btn.y - 15, ey = btn.y + 15;
        if (px >= bx && px <= ex && py >= by && py <= ey) inside = true;
      });
      if (!inside) this._toggleTrackPicker();
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
    this._beatScreenPulse(beatIndex === 0);
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
    const bg = this.wellBgs[i];
    this.tweens.add({
      targets: bg, scaleX: 0.78, scaleY: 0.78,
      duration: 80, yoyo: true, ease: 'Sine.easeOut',
    });
  }

  _beatScreenPulse(strong) {
    const alpha = strong ? 0.12 : 0.04;
    const col   = strong ? 0xffcc44 : 0x44ffaa;
    const rect  = this.add.rectangle(
      RK.WIDTH / 2, this.PANEL_TOP + RK.UI_HEIGHT / 2,
      RK.WIDTH, RK.UI_HEIGHT, col, alpha
    ).setDepth(10);
    this.tweens.add({
      targets: rect, alpha: 0, duration: 120, ease: 'Sine.easeOut',
      onComplete: () => rect.destroy(),
    });
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
      this._refreshUnlockDisplay();
    }
  }

  _onPlayerDead() {
    this._movePlayhead(0);
    this.currentBeat = 0;
  }

  _onLevelComplete() {
    // no-op — level transition handled by GameScene
  }

  // ---------------------------------------------------------------------------
  shutdown() {
    this.game.events.off('rk_beat',          this._onBeat,          this);
    this.game.events.off('rk_player_dead',   this._onPlayerDead,    this);
    this.game.events.off('rk_level_complete',this._onLevelComplete,  this);
    this.game.events.off('rk_slot_success',  this._onSlotSuccess,   this);
    this.game.events.off('rk_slot_invalid',  this._onSlotInvalid,   this);
    this.game.events.off('rk_action_unlock', this._onActionUnlock,  this);
  }
}
