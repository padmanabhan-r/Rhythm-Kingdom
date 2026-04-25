// =============================================================================
//  Rhythm Kingdom — UIScene.js
//  Relic sequencer overlay. Listens to rk_beat from RhythmClock.
//  Click beat wells to cycle actions. Space = toggle play/edit.
// =============================================================================

class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UIScene' }); }

  init(data) {
    this.timeline    = (data && data.timeline) || new RK.Timeline();
    this.currentBeat = 0;
    this.mode        = 'edit';
    this._unlockedActions = ['JUMP', 'ROLL'];
  }

  create() {
    this.PANEL_TOP = RK.PLAY_HEIGHT;   // 480
    this.WELL_W    = 80;
    this.WELL_H    = 80;
    this.WELL_GAP  = 10;

    const totalW     = RK.BEAT_COUNT * this.WELL_W + (RK.BEAT_COUNT - 1) * this.WELL_GAP;
    this.wellStartX  = (RK.WIDTH - totalW) / 2;
    this.WELL_CY     = this.PANEL_TOP + 60;

    this._buildPanel();
    this._buildWells();
    this._buildPlayhead();
    this._buildModeBadge();
    this._buildUnlockIndicator();

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.on('pointerdown', this._onPointerDown, this);

    this.game.events.on('rk_beat',          this._onBeat,          this);
    this.game.events.on('rk_player_dead',   this._onPlayerDead,    this);
    this.game.events.on('rk_level_complete',this._onLevelComplete,  this);
    this.game.events.on('rk_slot_success',  this._onSlotSuccess,   this);
    this.game.events.on('rk_slot_invalid',  this._onSlotInvalid,   this);
    this.game.events.on('rk_mode_change',   this._onModeChange,    this);
    this.game.events.on('rk_action_unlock', this._onActionUnlock,  this);
  }

  // ---------------------------------------------------------------------------
  _wellX(i) {
    return this.wellStartX + i * (this.WELL_W + this.WELL_GAP) + this.WELL_W / 2;
  }

  // ---------------------------------------------------------------------------
  _buildPanel() {
    this.add.image(RK.WIDTH / 2, this.PANEL_TOP + RK.UI_HEIGHT / 2, 'ui_panel')
      .setDepth(0);
  }

  _buildWells() {
    this.wellBgs    = [];
    this.wellIcons  = [];
    this.wellGlows  = [];
    this.beatNums   = [];

    for (let i = 0; i < RK.BEAT_COUNT; i++) {
      const cx = this._wellX(i);
      const cy = this.WELL_CY;

      // Beat number label
      const numStyle = { fontSize: '11px', color: '#cc9933', fontFamily: 'monospace', fontStyle: 'bold' };
      const num = this.add.text(cx, cy - 44, String(i + 1), numStyle).setOrigin(0.5).setDepth(2);
      this.beatNums.push(num);

      // Stone well base
      const bg = this.add.image(cx, cy, 'beat_well').setDepth(1);
      this.wellBgs.push(bg);

      // Glow overlay (initially invisible)
      const glow = this.add.rectangle(cx, cy, this.WELL_W - 16, this.WELL_H - 16, 0x44ffaa, 0)
        .setDepth(2);
      this.wellGlows.push(glow);

      // Action icon (initially hidden)
      const icon = this.add.image(cx, cy, 'action_jump').setDepth(3).setAlpha(0).setScale(0.9);
      this.wellIcons.push(icon);

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
      .setDepth(4).setAlpha(0.9);
  }

  _buildModeBadge() {
    const bx = RK.WIDTH - 70;
    const by = this.PANEL_TOP + 20;
    this._modeBg = this.add.rectangle(bx, by, 110, 24, 0xffcc00)
      .setDepth(5).setStrokeStyle(2, 0xaa8800);
    this._modeTxt = this.add.text(bx, by, 'EDIT', {
      fontSize: '11px', fontStyle: 'bold', color: '#000000', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(6);
    this.add.text(bx, by + 17, 'SPACE', {
      fontSize: '9px', color: '#887744', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(6);
  }

  _buildUnlockIndicator() {
    this._unlockTxt = this.add.text(12, this.PANEL_TOP + 12, '', {
      fontSize: '9px', color: '#44ffaa', fontFamily: 'monospace',
    }).setDepth(5);
    this._refreshUnlockDisplay();
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

      if (action) {
        const iconKey = 'action_' + action.toLowerCase();
        icon.setTexture(iconKey).setAlpha(1);
        const col = RK.ACTION_COLORS[action] || 0x888888;
        glow.setFillStyle(col, 0.18);
      } else {
        icon.setAlpha(0);
        glow.setFillStyle(0x44ffaa, 0);
      }
    }
  }

  // ---------------------------------------------------------------------------
  _onWellClick(index) {
    this.timeline.cycleSlot(index);
    this._updateWellVisuals();
    // Feedback pulse
    const glow = this.wellGlows[index];
    this.tweens.add({
      targets: glow, fillAlpha: 0.5, duration: 80, yoyo: true,
    });
  }

  _onPointerDown(pointer) {
    if (pointer.y < this.PANEL_TOP) return;
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
      targets: bg, scaleX: 1.08, scaleY: 1.08,
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
  _onModeChange(data) {
    this.mode = data.mode;
    this._updateModeBadge();
  }

  _onActionUnlock(data) {
    if (data && data.action && !this._unlockedActions.includes(data.action)) {
      this._unlockedActions.push(data.action);
      this.timeline.unlock(data.action);
      this._refreshUnlockDisplay();
    }
  }

  _onPlayerDead() {
    this.mode = 'edit';
    this._updateModeBadge();
    // Reset playhead to beat 0
    this._movePlayhead(0);
    this.currentBeat = 0;
  }

  _onLevelComplete() {
    this.mode = 'edit';
    this._updateModeBadge();
  }

  _updateModeBadge() {
    if (this.mode === 'play') {
      this._modeBg.setFillStyle(0x33bb44).setStrokeStyle(2, 0x228833);
      this._modeTxt.setText('▶ PLAY').setStyle({ color: '#ffffff' });
    } else {
      this._modeBg.setFillStyle(0xffcc00).setStrokeStyle(2, 0xaa8800);
      this._modeTxt.setText('✏ EDIT').setStyle({ color: '#000000' });
    }
  }

  // ---------------------------------------------------------------------------
  _toggleMode() {
    this.mode = this.mode === 'edit' ? 'play' : 'edit';
    this._updateModeBadge();
    this.game.events.emit('rk_mode_change', { mode: this.mode });
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this._toggleMode();
  }

  shutdown() {
    this.game.events.off('rk_beat',          this._onBeat,          this);
    this.game.events.off('rk_player_dead',   this._onPlayerDead,    this);
    this.game.events.off('rk_level_complete',this._onLevelComplete,  this);
    this.game.events.off('rk_slot_success',  this._onSlotSuccess,   this);
    this.game.events.off('rk_slot_invalid',  this._onSlotInvalid,   this);
    this.game.events.off('rk_mode_change',   this._onModeChange,    this);
    this.game.events.off('rk_action_unlock', this._onActionUnlock,  this);
  }
}
