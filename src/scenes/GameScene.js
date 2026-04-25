// =============================================================================
//  Rhythm Kingdom — GameScene.js
//  Main gameplay scene. Jungle world, gorilla, rhythm actions, checkpoints.
// =============================================================================

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    this.levelKey   = (data && data.level) || 'level1';
    this.levelData  = RK.Levels[this.levelKey];
    this.mode       = 'edit';
    this._complete  = false;
    this._checkpointX = null;
    this._checkpointY = null;
  }

  create() {
    if (!this.levelData) { console.error('[RK] Missing level:', this.levelKey); return; }
    const ld = this.levelData;

    this._audio    = window.RK._audio || new RK.AudioManager();
    this.timeline  = new RK.Timeline();
    this.timeline.setUnlocked(ld.unlockedActions || ['JUMP', 'ROLL']);

    const levelW = ld.width || RK.WIDTH;
    this.physics.world.setBounds(0, 0, levelW, RK.PLAY_HEIGHT + 200);
    this.cameras.main.setBackgroundColor(ld.bgColor || RK.COLORS.BG);
    this.cameras.main.setBounds(0, 0, levelW, RK.PLAY_HEIGHT);

    this._buildParallax(levelW);

    this.platformGroup   = this.physics.add.staticGroup();
    this.ceilingGroup    = this.physics.add.staticGroup();
    this.thornGroup      = this.physics.add.staticGroup();
    this.enemyGroup      = this.add.group();
    this.pickupGroup     = this.add.group();
    this.coconutGroup    = this.add.group();
    this.checkpointGroup = [];

    this._buildPlatforms(ld);
    this._buildThorns(ld);
    this._buildEnemies(ld);
    this._buildPickups(ld);
    this._buildCheckpoints(ld);
    this._buildExit(ld);

    this._gameFeel = new RK.GameFeel(this);

    this.player = new RK.Player(this, ld.playerStart.x, ld.playerStart.y);
    this.player.unlockedActions = (ld.unlockedActions || ['JUMP', 'ROLL']).slice();

    this._setupCollisions();
    this._setupCamera();
    this._buildHUD(ld);
    this._bindEvents();

    const loopKey = (ld.loopKey || 'backing_loop');
    this._rhythmClock = new RK.RhythmClock(this._audio, this.game.events, loopKey);
    // Start immediately — user already gave a gesture (Space on menu)
    this._audio._ensureCtx();
    this._rhythmClock.start();

    this.cursors = this.input.keyboard.addKeys({
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.scene.launch('UIScene', { timeline: this.timeline });
  }

  // ---------------------------------------------------------------------------
  //  PARALLAX
  // ---------------------------------------------------------------------------

  _buildParallax(levelW) {
    // Layer 0: far canopy (tileSprite, scrollFactor=0, updated in update)
    this._bg0 = this.add.tileSprite(0, 0, RK.WIDTH, 300, 'bg_canopy')
      .setOrigin(0, 0).setScrollFactor(0).setDepth(-10);

    // Layer 1: mid ruins (graphics, scrollFactor=0.3)
    const gMid = this.add.graphics().setDepth(-8).setScrollFactor(0.3);
    gMid.fillStyle(0x0d2e1a);
    const colPositions = [60, 160, 280, 420, 560, 700, 860, 1020, 1180, 1340, 1500];
    colPositions.forEach(cx => {
      const h = 120 + Math.floor(Math.random() * 80);
      gMid.fillRect(cx, RK.PLAY_HEIGHT - h, 18, h);
      gMid.fillStyle(0x142e1a); gMid.fillRect(cx - 4, RK.PLAY_HEIGHT - h, 26, 8);
      gMid.fillStyle(0x0d2e1a);
    });

    // Layer 2: near foreground vines (scrollFactor=0.7)
    const gNear = this.add.graphics().setDepth(-6).setScrollFactor(0.7);
    gNear.fillStyle(0x0a2010, 0.6);
    [0, 200, 450, 700, 950, 1200, 1500, 1800, 2100].forEach(vx => {
      gNear.fillRect(vx, 0, 8, 80 + Math.floor(Math.random() * 60));
      gNear.fillRect(vx + 4, 0, 3, 50 + Math.floor(Math.random() * 40));
    });

    // Ambient mist at bottom of play area
    const mist = this.add.rectangle(0, RK.PLAY_HEIGHT - 30, levelW * 2, 60, RK.COLORS.BG, 0.5)
      .setOrigin(0, 0).setDepth(-5);
  }

  // ---------------------------------------------------------------------------
  //  LEVEL BUILDING
  // ---------------------------------------------------------------------------

  _buildPlatforms(ld) {
    ld.platforms.forEach(p => {
      const w = p.w, h = 20, gfx = this.add.graphics().setDepth(1);
      if (p.type === 'ceiling') {
        // Invisible ceiling (just visual stone overhang)
        gfx.fillStyle(0x2a2015); gfx.fillRect(p.x, p.y, w, h);
        gfx.fillStyle(0x1a1408); gfx.fillRect(p.x, p.y + h - 4, w, 4);
        // Root detail hanging down
        gfx.fillStyle(0x1a4020); gfx.fillRect(p.x + 10, p.y + h, 4, 20);
        gfx.fillRect(p.x + 30, p.y + h, 3, 14); gfx.fillRect(p.x + 60, p.y + h, 5, 18);
        const body = this.ceilingGroup.create(p.x + w / 2, p.y + h / 2, 'px');
        body.setDisplaySize(w, h).setAlpha(0).refreshBody();
        return;
      }
      // Jungle platform: moss top + carved stone base
      gfx.fillStyle(0x1a4a22); gfx.fillRect(p.x, p.y, w, 6);
      gfx.fillStyle(0x228833); gfx.fillRect(p.x + 1, p.y + 1, w - 2, 3);
      gfx.fillStyle(0x33aa44); gfx.fillRect(p.x + 2, p.y + 1, w - 4, 1);
      gfx.fillStyle(0x3a2e1a); gfx.fillRect(p.x, p.y + 6, w, h - 6);
      gfx.fillStyle(0x4a3c26); gfx.fillRect(p.x + 1, p.y + 7, w - 2, 4);
      gfx.fillStyle(0x2a2015); gfx.fillRect(p.x, p.y + h - 3, w, 3);
      // Gold rune marks
      gfx.fillStyle(0xcc9933, 0.5);
      for (let rx = p.x + 20; rx < p.x + w - 10; rx += 32) {
        gfx.fillRect(rx, p.y + 9, 8, 2);
      }
      // Physics body
      const body = this.platformGroup.create(p.x + w / 2, p.y + h / 2, 'px');
      body.setDisplaySize(w, h).setAlpha(0).refreshBody();
    });
  }

  _buildThorns(ld) {
    const thorns = ld.thorns || ld.spikes || [];
    thorns.forEach(s => {
      const gfx = this.add.graphics().setDepth(1);
      gfx.fillStyle(0x1a5c18); gfx.fillTriangle(s.x + 8, s.y, s.x, s.y + 20, s.x + 16, s.y + 20);
      gfx.fillStyle(0x228822); gfx.fillTriangle(s.x + 8, s.y + 3, s.x + 2, s.y + 20, s.x + 14, s.y + 20);
      gfx.fillStyle(0x44cc44); gfx.fillRect(s.x + 7, s.y + 3, 2, 5);
      const body = this.thornGroup.create(s.x + 8, s.y + 10, 'px');
      body.setDisplaySize(12, 16).setAlpha(0).refreshBody();
    });
  }

  _buildEnemies(ld) {
    (ld.enemies || []).forEach(e => {
      const enemy = new RK.Enemy(this, e.x, e.y, e.type);
      const patrol = e.patrol || [e.x - 64, e.x + 64];
      enemy.setPatrol(patrol[0], patrol[1]);
      this.enemyGroup.add(enemy);
    });
  }

  _buildPickups(ld) {
    (ld.pickups || []).forEach(p => {
      const sprite = this.physics.add.sprite(p.x, p.y, 'relic_shard');
      sprite.body.setAllowGravity(false);
      sprite.body.setImmovable(true);
      sprite.setDepth(3);
      sprite.setData('unlocks', p.unlocks);
      // Color tint per unlocked action
      const tints = { COCONUT: 0xddaa22, PUNCH: 0xff4433 };
      if (tints[p.unlocks]) sprite.setTint(tints[p.unlocks]);
      this.tweens.add({
        targets: sprite, y: p.y - 8, angle: 360,
        duration: 1200, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      });
      this.pickupGroup.add(sprite);
    });
  }

  _buildCheckpoints(ld) {
    (ld.checkpoints || []).forEach((cp, i) => {
      const gfx = this.add.graphics().setDepth(2);
      gfx.fillStyle(0x4a4035); gfx.fillRect(cp.x, cp.y, 24, 40);
      gfx.fillStyle(0x44ffaa); gfx.fillRect(cp.x + 10, cp.y + 8, 4, 24);
      gfx.fillRect(cp.x + 8, cp.y + 8, 8, 4);
      gfx.fillRect(cp.x + 8, cp.y + 20, 8, 4);
      const zone = this.physics.add.sprite(cp.x + 12, cp.y + 20, 'px');
      zone.setAlpha(0);
      if (zone.body) {
        zone.body.setSize(24, 40).setAllowGravity(false);
      }
      zone.setData('cpIndex', i);
      zone.setData('cpX', cp.x + 12);
      zone.setData('cpY', cp.y);
      this.checkpointGroup.push(zone);
    });
  }

  _buildExit(ld) {
    const ex = ld.exit;
    this.add.image(ex.x + 24, ex.y - 28, 'exit_arch').setDepth(2);
    this.tweens.add({
      targets: this.add.rectangle(ex.x + 24, ex.y - 8, 24, 48, RK.COLORS.JADE, 0.2)
        .setDepth(2),
      alpha: { from: 0.1, to: 0.5 },
      duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
    this.exitZone = this.physics.add.sprite(ex.x + 24, ex.y - 8, 'px');
    this.exitZone.setAlpha(0);
    if (this.exitZone.body) {
      this.exitZone.body.setSize(30, 60).setAllowGravity(false);
    }
  }

  _buildHUD(ld) {
    const style = { fontSize: '9px', color: '#44ffaa', fontFamily: 'monospace',
      backgroundColor: '#00000088', padding: { x: 8, y: 4 } };
    this.add.text(RK.WIDTH - 8, 8, ld.name || '', {
      fontSize: '9px', color: '#cc9933', fontFamily: 'monospace',
    }).setOrigin(1, 0).setDepth(10).setScrollFactor(0);

    if (ld.hint) {
      const hint = this.add.text(RK.WIDTH / 2, 10, ld.hint, style)
        .setOrigin(0.5, 0).setDepth(10).setScrollFactor(0);
      this.time.delayedCall(5000, () => {
        this.tweens.add({ targets: hint, alpha: 0, duration: 800, onComplete: () => hint.destroy() });
      });
    }

    this.add.text(6, RK.PLAY_HEIGHT - 12, 'A/D move  SPACE edit/play', {
      fontSize: '8px', color: '#334444', fontFamily: 'monospace',
    }).setDepth(10).setScrollFactor(0);
  }

  // ---------------------------------------------------------------------------
  //  COLLISIONS
  // ---------------------------------------------------------------------------

  _setupCollisions() {
    this.physics.add.collider(this.player, this.platformGroup);
    this.physics.add.collider(this.player, this.ceilingGroup);
    this.physics.add.collider(this.enemyGroup, this.platformGroup);
    this.physics.add.collider(this.coconutGroup, this.platformGroup, (c) => { if (c.alive) c.die(); });

    this.physics.add.overlap(this.player, this.thornGroup,     () => this._playerHitThorn());
    this.physics.add.overlap(this.player, this.enemyGroup,     (p, e) => this._playerHitEnemy(e));
    this.physics.add.overlap(this.player, this.pickupGroup,    (p, pk) => this._playerPickup(pk));
    this.physics.add.overlap(this.player, this.exitZone,       () => this._completeLevel());
    this.physics.add.overlap(this.coconutGroup, this.enemyGroup, (c, e) => this._coconutHitEnemy(c, e));

    this.checkpointGroup.forEach(zone => {
      this.physics.add.overlap(this.player, zone, (p, z) => this._triggerCheckpoint(z));
    });
  }

  _setupCamera() {
    const ld = this.levelData;
    const levelW = ld.width || RK.WIDTH;
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setFollowOffset(0, 40);
  }

  // ---------------------------------------------------------------------------
  //  EVENTS
  // ---------------------------------------------------------------------------

  _bindEvents() {
    this.game.events.on('rk_beat',          this._onBeat,          this);
    this.game.events.on('rk_mode_change',   this._onModeChange,    this);
    this.game.events.on('rk_spawn_coconut', this._onSpawnCoconut,  this);
    this.game.events.on('rk_player_punch',  this._onPlayerPunch,   this);
    this.game.events.on('rk_player_land',   this._onPlayerLand,    this);
    this.game.events.on('rk_player_roll',   this._onPlayerRoll,    this);
    this.game.events.on('rk_player_hit',    this._onPlayerHit,     this);
    this.game.events.on('rk_player_dead',   this._onPlayerDead,    this);
    this.game.events.on('rk_loop_change',   this._onLoopChange,    this);
  }

  // ---------------------------------------------------------------------------
  //  UPDATE
  // ---------------------------------------------------------------------------

  update(time, delta) {
    if (!this.player) return;

    // Parallax far layer update
    if (this._bg0) this._bg0.tilePositionX = this.cameras.main.scrollX * 0.08;

    if (this.mode === 'play' && !this.player.dead) {
      this.player.update(delta, this.cursors);
      this.enemyGroup.getChildren().forEach(e => { if (e.alive) e.update(delta); });
      this.coconutGroup.getChildren().slice().forEach(c => { if (c.alive) c.update(); });

      // Camera lead
      if (this.player.body) {
        const dir = this.player.facingRight ? 1 : -1;
        this._gameFeel.setCameraLead(dir);
      }

      // Fall death
      if (this.player.y > RK.PLAY_HEIGHT + 80) this.player.die();
    }
  }

  // ---------------------------------------------------------------------------
  //  BEAT EXECUTION
  // ---------------------------------------------------------------------------

  _onBeat(beatIndex) {
    if (!this.player || this.player.dead) return;

    this._gameFeel.beatPulse(beatIndex === 0);

    // Random ambient jungle sounds
    if (Math.random() < 0.08) {
      const ambient = ['chatter', 'hoot', 'monkey', 'bird', 'thunder'][Math.floor(Math.random() * 5)];
      this._audio.play(ambient, 0.35);
    }

    const action = this.timeline.getSlot(beatIndex);
    if (!action) return;

    if (!this.player.isActionUnlocked(action)) {
      if (this.mode === 'play') {
        this._audio.play('invalid_beat', 0.4);
        this.game.events.emit('rk_slot_invalid', beatIndex);
      }
      return;
    }

    // SFX plays in both edit + play mode — composition feel
    const SFX = { JUMP: 'jump', ROLL: 'roll', COCONUT: 'coconut_throw', PUNCH: 'punch' };
    this._audio.play(SFX[action], 1.0);
    this.game.events.emit('rk_slot_success', beatIndex);

    // Gameplay actions only execute in play mode
    if (this.mode !== 'play') return;

    switch (action) {
      case 'JUMP':    this.player.doJump();    break;
      case 'ROLL':    this.player.doRoll();    break;
      case 'COCONUT': this.player.doCoconut(); break;
      case 'PUNCH':   this.player.doPunch();   break;
    }
  }

  _onModeChange(data) {
    this.mode = data.mode;
  }

  _onLoopChange(data) {
    if (this._rhythmClock) this._rhythmClock.setLoopKey(data.loopKey);
  }

  // ---------------------------------------------------------------------------
  //  ACTION HANDLERS
  // ---------------------------------------------------------------------------

  _onSpawnCoconut(data) {
    const c = new RK.Coconut(this, data.x, data.y, data.dir);
    this.coconutGroup.add(c);
  }

  _onPlayerPunch(data) {
    // Check for enemies in punch range
    let hit = false;
    this.enemyGroup.getChildren().forEach(e => {
      if (!e.alive) return;
      const dx = Math.abs(e.x - data.x);
      const dy = Math.abs(e.y - data.y);
      if (dx < 60 && dy < 40 && e.canPunch()) {
        e.die(); hit = true;
        this._gameFeel.impactSpark(e.x, e.y);
      }
    });
    if (hit) {
      this._gameFeel.hitstop(60);
      this._gameFeel.screenShake(3, 150);
    }
  }

  _onPlayerLand(data) {
    this._gameFeel.dustBurst(data.x, data.y + 14);
  }

  _onPlayerRoll(data) {
    this._gameFeel.rollTrail(data.x, data.y);
  }

  _onPlayerHit() {
    this._audio.play('hit', 0.7);
    this._gameFeel.screenShake(4, 200);
  }

  _onPlayerDead() {
    this._audio.play('death', 0.8);
    this.cameras.main.flash(200, 255, 60, 60);
    if (this._rhythmClock) this._rhythmClock.stop();

    if (this._checkpointX !== null) {
      // Respawn at checkpoint
      this.time.delayedCall(600, () => {
        this.player.revive(this._checkpointX, this._checkpointY - 40);
        this.timeline.clearAll();
        this.game.events.emit('rk_mode_change', { mode: 'edit' });
      });
    } else {
      // Full restart
      this.add.text(RK.WIDTH / 2, RK.PLAY_HEIGHT / 2, 'Gone…', {
        fontSize: '28px', color: '#ff4444', fontFamily: 'monospace',
        stroke: '#660000', strokeThickness: 4,
      }).setOrigin(0.5).setDepth(30).setScrollFactor(0);

      this.time.delayedCall(1600, () => {
        this.scene.stop('UIScene');
        this.scene.restart({ level: this.levelKey });
      });
    }
  }

  // ---------------------------------------------------------------------------
  //  COLLISIONS
  // ---------------------------------------------------------------------------

  _playerHitThorn() {
    if (this.player.isRolling) return; // rolling is safe
    this.player.takeDamage();
  }

  _playerHitEnemy(enemy) {
    if (!enemy || !enemy.alive || this.player.invincible || this.player.dead) return;
    // Rolling through lizard = kill
    if (this.player.isRolling && enemy.canRoll()) {
      enemy.die();
      this._gameFeel.dustBurst(enemy.x, enemy.y);
      return;
    }
    this.player.takeDamage(enemy.x < this.player.x ? 1 : -1);
  }

  _playerPickup(pickup) {
    if (!pickup || !pickup.active) return;
    pickup.setActive(false).setVisible(false);
    if (pickup.body) pickup.body.enable = false;

    const unlocks = pickup.getData('unlocks');
    if (unlocks) {
      this.player.unlock(unlocks);
      this.timeline.unlock(unlocks);
      this.game.events.emit('rk_action_unlock', { action: unlocks });
      this._audio.play('unlock_action', 0.8);
      this._gameFeel.impactSpark(pickup.x, pickup.y);
    }

    this.time.delayedCall(16, () => { if (pickup) pickup.destroy(); });
  }

  _coconutHitEnemy(coconut, enemy) {
    if (!coconut || !coconut.alive || !enemy || !enemy.alive) return;
    coconut.die();
    if (enemy.canCoconut()) {
      enemy.die();
      this._audio.play('coconut_impact', 0.7);
      this._gameFeel.dustBurst(enemy.x, enemy.y);
    }
  }

  _triggerCheckpoint(zone) {
    const cpX = zone.getData('cpX');
    const cpY = zone.getData('cpY');
    if (cpX === this._checkpointX) return; // already activated
    this._checkpointX = cpX;
    this._checkpointY = cpY;
    this._audio.play('checkpoint', 0.7);
    // Glow flash at checkpoint
    const flash = this.add.rectangle(cpX, cpY, 60, 100, RK.COLORS.JADE, 0.5).setDepth(5);
    this.tweens.add({ targets: flash, alpha: 0, duration: 600, onComplete: () => flash.destroy() });
  }

  // ---------------------------------------------------------------------------
  //  LEVEL COMPLETE
  // ---------------------------------------------------------------------------

  _completeLevel() {
    if (this._complete) return;
    this._complete = true;
    if (this._rhythmClock) this._rhythmClock.stop();

    this._audio.play('level_complete', 0.9);
    this.cameras.main.flash(300, 255, 240, 100);
    this.game.events.emit('rk_level_complete');

    const banner = this.add.text(RK.WIDTH / 2, RK.PLAY_HEIGHT / 2 - 40, 'LEVEL COMPLETE', {
      fontSize: '24px', color: '#ffcc44', fontFamily: 'monospace',
      stroke: '#885500', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(30).setScrollFactor(0);
    this.tweens.add({ targets: banner, scale: { from: 0.2, to: 1 }, duration: 400, ease: 'Back.easeOut' });

    const next = this.levelData.nextLevel;
    this.time.delayedCall(2400, () => {
      this.scene.stop('UIScene');
      if (next) {
        this.scene.start('GameScene', { level: next });
      } else {
        this._showWinScreen();
      }
    });
  }

  _showWinScreen() {
    const W = RK.WIDTH, H = RK.PLAY_HEIGHT;
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.8).setDepth(28).setScrollFactor(0);
    this.add.text(W / 2, H / 2 - 60, 'YOU DID IT', {
      fontSize: '36px', color: '#ffcc44', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(29).setScrollFactor(0);
    this.add.text(W / 2, H / 2,
      'Movement is manual.\nRhythm is power.\nYou are the beat.', {
        fontSize: '11px', color: '#44ffaa', fontFamily: 'monospace',
        align: 'center', lineSpacing: 8,
      }).setOrigin(0.5).setDepth(29).setScrollFactor(0);
    const p = this.add.text(W / 2, H / 2 + 80, 'SPACE to menu', {
      fontSize: '11px', color: '#ffffff', fontFamily: 'monospace',
    }).setOrigin(0.5).setDepth(29).setScrollFactor(0);
    this.tweens.add({ targets: p, alpha: 0, duration: 550, yoyo: true, repeat: -1 });
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('MenuScene'));
  }

  // ---------------------------------------------------------------------------
  shutdown() {
    if (this._rhythmClock) this._rhythmClock.stop();
    this.game.events.off('rk_beat',          this._onBeat,          this);
    this.game.events.off('rk_mode_change',   this._onModeChange,    this);
    this.game.events.off('rk_spawn_coconut', this._onSpawnCoconut,  this);
    this.game.events.off('rk_player_punch',  this._onPlayerPunch,   this);
    this.game.events.off('rk_player_land',   this._onPlayerLand,    this);
    this.game.events.off('rk_player_roll',   this._onPlayerRoll,    this);
    this.game.events.off('rk_player_hit',    this._onPlayerHit,     this);
    this.game.events.off('rk_player_dead',   this._onPlayerDead,    this);
  }
}
