// =============================================================================
//  Rhythm Kingdom — UIScene.js
//  Timeline overlay. Runs parallel to GameScene.
// =============================================================================

const _UI_PX = "'Press Start 2P', monospace";

class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UIScene' }); }

  init(data) {
    this.playerForm  = (data && data.startForm) || 'SMALL';
    this.timeline    = (data && data.timeline) || new RK.Timeline();
    this.currentBeat = 0;
    this.mode        = 'edit';
  }

  create() {
    this.PANEL_TOP = RK.PLAY_HEIGHT;   // 480
    this.SLOT_W    = 56;
    this.SLOT_H    = 44;
    this.SLOT_GAP  = 6;

    const totalW      = RK.BEAT_COUNT * this.SLOT_W + (RK.BEAT_COUNT - 1) * this.SLOT_GAP;
    this.slotStartX   = (RK.WIDTH - totalW) / 2;
    this.SLOT_CY      = this.PANEL_TOP + 52;

    this._buildPanel();
    this._buildSlots();
    this._buildCardPalette();
    this._buildCursor();
    this._buildFormIndicator();
    this._buildModeBadge();

    this.beatTimer = this.time.addEvent({
      delay: RK.BEAT_MS, callback: this._onBeat,
      callbackScope: this, loop: true, paused: true,
    });

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.input.on('pointerdown', this._onPointerDown, this);

    this.input.on('dragstart', (ptr, obj) => { obj.setDepth(20); obj.setScale(1.12); });
    this.input.on('drag',      (ptr, obj, dx, dy) => { obj.setPosition(dx, dy); });
    this.input.on('dragend',   (ptr, obj) => {
      obj.setDepth(10);
      obj.setScale(1);
      const slotIdx = this._getSlotAtX(ptr.x, ptr.y);
      if (slotIdx !== -1) {
        this.timeline.setSlot(slotIdx, obj.actionType);
        this._updateSlotVisuals();
      }
      obj.setPosition(obj.homeX, obj.homeY);
    });

    this.game.events.on('rk_form_change',  this._onFormChange,  this);
    this.game.events.on('rk_player_dead',  this._onPlayerDead,  this);
    this.game.events.on('rk_level_complete', this._onLevelComplete, this);
  }

  // ===========================================================================
  //  Layout helpers
  // ===========================================================================

  _slotX(i) {
    return this.slotStartX + i * (this.SLOT_W + this.SLOT_GAP) + this.SLOT_W / 2;
  }

  _getSlotAtX(px, py) {
    if (py < this.PANEL_TOP || py > RK.HEIGHT) return -1;
    for (let i = 0; i < RK.BEAT_COUNT; i++) {
      const cx = this._slotX(i);
      if (px >= cx - this.SLOT_W / 2 && px <= cx + this.SLOT_W / 2 &&
          py >= this.SLOT_CY - this.SLOT_H / 2 && py <= this.SLOT_CY + this.SLOT_H / 2) {
        return i;
      }
    }
    return -1;
  }

  // ===========================================================================
  //  UI construction
  // ===========================================================================

  _buildPanel() {
    const W   = RK.WIDTH;
    const PT  = this.PANEL_TOP;
    const gfx = this.add.graphics();

    // Panel body
    gfx.fillStyle(0x080820); gfx.fillRect(0, PT, W, RK.UI_HEIGHT);

    // Top border (bright) + inner glow
    gfx.fillStyle(0x5577ff); gfx.fillRect(0, PT, W, 2);
    gfx.fillStyle(0x2233aa, 0.5); gfx.fillRect(0, PT + 2, W, 3);

    // Side accent bars
    gfx.fillStyle(0x3344aa); gfx.fillRect(0, PT, 3, RK.UI_HEIGHT);
    gfx.fillStyle(0x3344aa); gfx.fillRect(W - 3, PT, 3, RK.UI_HEIGHT);

    // Divider below top controls row
    gfx.fillStyle(0x1a1a3a); gfx.fillRect(3, PT + 32, W - 6, 1);

    // Beat track background (slot row area)
    gfx.fillStyle(0x0a0a1e); gfx.fillRect(3, PT + 34, W - 6, 72);
    gfx.lineStyle(1, 0x1e1e44); gfx.strokeRect(3, PT + 34, W - 6, 72);
  }

  _buildSlots() {
    this.slotBgs    = [];
    this.slotLabels = [];

    for (let i = 0; i < RK.BEAT_COUNT; i++) {
      const cx = this._slotX(i);
      const cy = this.SLOT_CY;

      // Beat number
      this.add.text(cx, cy - this.SLOT_H / 2 - 9, String(i + 1), {
        fontFamily: _UI_PX, fontSize: '7px', color: '#2a3a5a',
      }).setOrigin(0.5, 1);

      // Slot background rect
      const bg = this.add.rectangle(cx, cy, this.SLOT_W, this.SLOT_H, 0x0e0e28)
        .setStrokeStyle(1, 0x2a2a5a)
        .setInteractive({ useHandCursor: true });
      this.slotBgs.push(bg);

      // Action label
      const lbl = this.add.text(cx, cy, '', {
        fontFamily: _UI_PX, fontSize: '7px', fontStyle: 'bold',
        color: '#ffffff', align: 'center',
      }).setOrigin(0.5);
      this.slotLabels.push(lbl);
    }

    this._updateSlotVisuals();
  }

  _buildCardPalette() {
    this.paletteCards = [];
    const actions  = ['JUMP', 'STOMP', 'FIRE'];
    const texKeys  = { JUMP: 'card_jump', STOMP: 'card_stomp', FIRE: 'card_fire' };
    const labels   = { JUMP: '↑ JUMP', STOMP: '↓ STOMP', FIRE: '★ FIRE' };
    const labelCol = { JUMP: '#88ff88', STOMP: '#ffdd44', FIRE: '#ff8866' };
    const paletteY = this.PANEL_TOP + 100;

    // Palette area label
    this.add.text(this.slotStartX + 8 * (this.SLOT_W + this.SLOT_GAP) + 16, paletteY - 12,
      'DRAG →', { fontFamily: _UI_PX, fontSize: '7px', color: '#334466' });

    actions.forEach((action, i) => {
      const px = 80 + i * 66;
      const card = this.add.image(px, paletteY, texKeys[action])
        .setDisplaySize(52, 38)
        .setInteractive({ draggable: true, useHandCursor: true })
        .setDepth(10);
      card.actionType = action;
      card.homeX = px;
      card.homeY = paletteY;
      this.input.setDraggable(card);

      this.add.text(px, paletteY, labels[action], {
        fontFamily: _UI_PX, fontSize: '7px', fontStyle: 'bold',
        color: labelCol[action],
      }).setOrigin(0.5).setDepth(11);

      this.paletteCards.push(card);
    });

    this._updatePaletteVisibility();
  }

  _updatePaletteVisibility() {
    const allowed = RK.ALLOWED[this.playerForm] || [];
    this.paletteCards.forEach(card => {
      const legal = allowed.includes(card.actionType);
      card.setAlpha(legal ? 1 : 0.2);
      if (!legal) card.disableInteractive();
      else card.setInteractive({ draggable: true, useHandCursor: true });
    });
  }

  _buildCursor() {
    this.beatCursor = this.add.rectangle(
      this._slotX(0), this.SLOT_CY,
      this.SLOT_W + 6, this.SLOT_H + 6,
      0xffffff, 0.06
    ).setStrokeStyle(2, 0xffffff, 0.7);
  }

  _buildFormIndicator() {
    const py  = this.PANEL_TOP + 16;
    const col = RK.FORM_TINTS[this.playerForm] || 0x4488ff;

    this.formDot = this.add.circle(14, py, 7, col)
      .setStrokeStyle(1, 0x000000);

    this.formNameTxt = this.add.text(26, py - 8, this.playerForm, {
      fontFamily: _UI_PX, fontSize: '9px', fontStyle: 'bold',
      color: '#' + col.toString(16).padStart(6, '0'),
    });

    this.formAllowedTxt = this.add.text(26, py + 5, (RK.ALLOWED[this.playerForm] || []).join(' + '), {
      fontFamily: _UI_PX, fontSize: '7px', color: '#556688',
    });
  }

  _buildModeBadge() {
    const bx  = RK.WIDTH - 80;
    const py  = this.PANEL_TOP + 16;

    this.modeBg  = this.add.rectangle(bx, py, 136, 26, 0xffcc00)
      .setStrokeStyle(2, 0xaa8800);
    this.modeTxt = this.add.text(bx, py, 'EDIT', {
      fontFamily: _UI_PX, fontSize: '10px', fontStyle: 'bold', color: '#000000',
    }).setOrigin(0.5);

    this.add.text(bx, py + 18, 'SPACE = toggle', {
      fontFamily: _UI_PX, fontSize: '6px', color: '#334455',
    }).setOrigin(0.5);
  }

  // ===========================================================================
  //  Slot visuals
  // ===========================================================================

  _updateSlotVisuals() {
    const allowed = RK.ALLOWED[this.playerForm] || [];

    for (let i = 0; i < RK.BEAT_COUNT; i++) {
      const action  = this.timeline.getSlot(i);
      const isNext  = (i === this.currentBeat);
      const isLegal = !action || allowed.includes(action);
      const bg      = this.slotBgs[i];
      const lbl     = this.slotLabels[i];

      if (!action) {
        bg.setFillStyle(0x0e0e28);
        bg.setStrokeStyle(isNext ? 2 : 1, isNext ? 0x6688dd : 0x2a2a5a);
        lbl.setText('');
      } else {
        const cc = RK.CARD_COLORS[action] || 0x888888;
        if (isLegal) {
          bg.setFillStyle(cc, 0.5);
          bg.setStrokeStyle(isNext ? 2 : 1, isNext ? 0xffffff : cc);
          lbl.setText(action).setStyle({ color: '#ffffff' });
        } else {
          bg.setFillStyle(0x2a1a1a, 0.9);
          bg.setStrokeStyle(1, 0x664444);
          lbl.setText(action + '\n✗').setStyle({ color: '#ff4444' });
        }
      }
    }
  }

  // ===========================================================================
  //  Pointer input
  // ===========================================================================

  _onPointerDown(pointer) {
    if (pointer.y < this.PANEL_TOP) return;
    const idx = this._getSlotAtX(pointer.x, pointer.y);
    if (idx === -1) return;

    if (pointer.rightButtonDown()) {
      this.timeline.clearSlot(idx);
    } else {
      const allowed = RK.ALLOWED[this.playerForm] || [];
      this.timeline.cycleSlot(idx, allowed);
    }
    this._updateSlotVisuals();
  }

  // ===========================================================================
  //  Beat tick
  // ===========================================================================

  _onBeat() {
    const beat = this.currentBeat;
    this.game.events.emit('rk_beat', beat);
    this.currentBeat = (this.currentBeat + 1) % RK.BEAT_COUNT;
    this._moveCursor(this.currentBeat);
    this._updateSlotVisuals();
    this._flashSlot(beat);
  }

  _flashSlot(index) {
    if (index < 0 || index >= RK.BEAT_COUNT) return;
    const bg      = this.slotBgs[index];
    const action  = this.timeline.getSlot(index);
    const allowed = RK.ALLOWED[this.playerForm] || [];
    const legal   = !action || allowed.includes(action);
    const color   = (legal && action) ? 0xffffff : (action ? 0xff2222 : 0x334477);

    bg.setFillStyle(color, 0.75);
    this.time.delayedCall(130, () => {
      if (bg && bg.scene) this._updateSlotVisuals();
    });
  }

  _moveCursor(index) {
    this.tweens.killTweensOf(this.beatCursor);
    this.tweens.add({
      targets: this.beatCursor, x: this._slotX(index),
      duration: 75, ease: 'Quad.easeOut',
    });
  }

  // ===========================================================================
  //  Form change
  // ===========================================================================

  _onFormChange(data) {
    this.playerForm = data.form;
    this.timeline.setForm(data.form);
    this._updateFormIndicator();
    this._updateSlotVisuals();
    this._updatePaletteVisibility();
  }

  _updateFormIndicator() {
    const col = RK.FORM_TINTS[this.playerForm] || 0x4488ff;
    const hex = '#' + col.toString(16).padStart(6, '0');
    this.formDot.setFillStyle(col);
    this.formNameTxt.setText(this.playerForm).setStyle({ color: hex });
    this.formAllowedTxt.setText((RK.ALLOWED[this.playerForm] || []).join(' + '));
  }

  // ===========================================================================
  //  Player dead / level complete
  // ===========================================================================

  _onPlayerDead() {
    if (this.beatTimer) this.beatTimer.paused = true;
    this.mode = 'edit';
    this._updateModeBadge();
  }

  _onLevelComplete() {
    if (this.beatTimer) this.beatTimer.paused = true;
    this.mode = 'edit';
    this._updateModeBadge();
  }

  // ===========================================================================
  //  Mode toggle
  // ===========================================================================

  _toggleMode() {
    this.mode = this.mode === 'edit' ? 'play' : 'edit';
    this.beatTimer.paused = (this.mode !== 'play');
    this._updateModeBadge();
    this.game.events.emit('rk_mode_change', { mode: this.mode });
  }

  _updateModeBadge() {
    if (this.mode === 'play') {
      this.modeBg.setFillStyle(0x33bb44).setStrokeStyle(2, 0x228833);
      this.modeTxt.setText('▶ PLAY').setStyle({ color: '#ffffff' });
    } else {
      this.modeBg.setFillStyle(0xffcc00).setStrokeStyle(2, 0xaa8800);
      this.modeTxt.setText('EDIT').setStyle({ color: '#000000' });
    }
  }

  // ===========================================================================
  //  Update
  // ===========================================================================

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) this._toggleMode();
  }

  // ===========================================================================
  //  Cleanup
  // ===========================================================================

  shutdown() {
    if (this.beatTimer) { this.beatTimer.remove(false); this.beatTimer = null; }
    this.game.events.off('rk_form_change',   this._onFormChange,   this);
    this.game.events.off('rk_player_dead',   this._onPlayerDead,   this);
    this.game.events.off('rk_level_complete', this._onLevelComplete, this);
  }
}
