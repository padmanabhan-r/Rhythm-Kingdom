// =============================================================================
//  Rhythm Kingdom — GameScene.js
//  Main gameplay scene. Jungle world, gorilla, rhythm actions, checkpoints.
// =============================================================================

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    this.levelKey   = (data && data.level) || 'level1';
    this.levelData  = RK.Levels[this.levelKey];
    this._complete        = false;
    this._checkpointX     = null;
    this._checkpointY     = null;
    this._activeBeatCount = RK.BEAT_COUNT;
    this._bananaCount     = 0;
    this._killCount       = 0;
    this._enemyDeath      = false;
  }

  create() {
    if (!this.levelData) return;
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
    this.wallGroup       = this.physics.add.staticGroup();
    this.waterGroup      = this.physics.add.staticGroup();
    this.enemyGroup      = this.add.group();
    this.pickupGroup     = this.add.group();
    this.coconutGroup    = this.add.group();
    this.bananaGroup     = this.add.group();
    this.checkpointGroup = [];

    RK.GameSceneBuilder.buildPlatforms(this, ld);
    RK.GameSceneBuilder.buildThorns(this, ld);
    RK.GameSceneBuilder.buildWater(this, ld);
    RK.GameSceneBuilder.buildEnemies(this, ld);
    RK.GameSceneBuilder.buildPickups(this, ld);
    RK.GameSceneBuilder.buildBananas(this, ld);
    RK.GameSceneBuilder.buildSigns(this, ld);
    RK.GameSceneBuilder.buildCheckpoints(this, ld);
    RK.GameSceneBuilder.buildExit(this, ld);

    this._gameFeel = new RK.GameFeel(this);

    this.player = new RK.Player(this, ld.playerStart.x, ld.playerStart.y);
    this.player.unlockedActions = (ld.unlockedActions || ['JUMP', 'ROLL']).slice();

    this._setupCollisions();
    this._setupCamera();
    this._buildHUD(ld);
    this._bindEvents();

    const loopKey = (window.RK._session && window.RK._session.trackKey) || ld.loopKey || 'backing_loop';
    this._rhythmClock = new RK.RhythmClock(this._audio, this.game.events, loopKey);
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
    const layers = [
      { key: 'plx_1', factor: 0.05, depth: -12 },
      { key: 'plx_2', factor: 0.12, depth: -11 },
      { key: 'plx_3', factor: 0.22, depth: -10 },
      { key: 'plx_4', factor: 0.38, depth: -9  },
      { key: 'plx_5', factor: 0.55, depth: -8  },
    ];
    this._plxSprites = [];
    this._plxFactors = [];

    const hasPlx = this.textures.exists('plx_1');

    if (hasPlx) {
      layers.forEach(({ key, factor, depth }) => {
        // Check individual key existence — fall through to procedural if any missing
        if (!this.textures.exists(key)) return;
        const spr = this.add.tileSprite(0, 0, RK.WIDTH, RK.PLAY_HEIGHT, key)
          .setOrigin(0, 0).setScrollFactor(0).setDepth(depth);
        this._plxSprites.push(spr);
        this._plxFactors.push(factor);
      });
    }

    // Fallback: procedural canopy if real assets didn't load
    if (this._plxSprites.length === 0) {
      this._buildProceduralBg(levelW);
    }

    // Scatter hanging vine decorations along level (world space, scrolls with level)
    if (this.textures.exists('vine_hang')) {
      [150, 380, 650, 950, 1300, 1650, 2000, 2400, 2800, 3100].forEach(vx => {
        this.add.image(vx, 0, 'vine_hang')
          .setOrigin(0.5, 0).setDepth(-7).setScrollFactor(1).setScale(1.5);
      });
    }

    // Ambient mist at bottom of play area
    this.add.rectangle(0, RK.PLAY_HEIGHT - 30, levelW * 2, 60, RK.COLORS.BG, 0.5)
      .setOrigin(0, 0).setDepth(-5);
  }

  _buildProceduralBg(levelW) {
    const g = this.add.graphics().setDepth(-10).setScrollFactor(0);
    g.fillStyle(0x020d06); g.fillRect(0, 0, RK.WIDTH, RK.PLAY_HEIGHT);

    const gMid = this.add.graphics().setDepth(-8).setScrollFactor(0.3);
    gMid.fillStyle(0x0d2e1a);
    [60, 160, 280, 420, 560, 700, 860, 1020, 1180, 1340, 1500].forEach(cx => {
      const h = 120 + Math.floor(Math.random() * 80);
      gMid.fillRect(cx, RK.PLAY_HEIGHT - h, 18, h);
    });

    const gNear = this.add.graphics().setDepth(-6).setScrollFactor(0.7);
    gNear.fillStyle(0x0a2010, 0.6);
    [0, 200, 450, 700, 950, 1200, 1500, 1800, 2100].forEach(vx => {
      gNear.fillRect(vx, 0, 8, 80 + Math.floor(Math.random() * 60));
    });
  }

  // ---------------------------------------------------------------------------
  //  HUD
  // ---------------------------------------------------------------------------

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

    this.add.text(6, RK.PLAY_HEIGHT - 12, 'A/D  move', {
      fontSize: '8px', color: '#334444', fontFamily: 'monospace',
    }).setDepth(10).setScrollFactor(0);

    this._bananaTxt = this.add.text(6, RK.UI_HEIGHT + 6, 'Fruits: 0', {
      fontSize: '10px', color: '#ffee22', fontFamily: 'monospace',
      backgroundColor: '#00000088', padding: { x: 4, y: 2 },
    }).setDepth(10).setScrollFactor(0);

    this._killTxt = this.add.text(6, RK.UI_HEIGHT + 24, 'Kills: 0', {
      fontSize: '10px', color: '#ff6644', fontFamily: 'monospace',
      backgroundColor: '#00000088', padding: { x: 4, y: 2 },
    }).setDepth(10).setScrollFactor(0);
  }

  // ---------------------------------------------------------------------------
  //  COLLISIONS
  // ---------------------------------------------------------------------------

  _setupCollisions() {
    this.physics.add.collider(this.player, this.platformGroup);
    this.physics.add.collider(this.player, this.ceilingGroup);
    this.physics.add.collider(this.player, this.wallGroup);
    this.physics.add.collider(this.enemyGroup, this.platformGroup);
    this.physics.add.collider(this.coconutGroup, this.platformGroup, (c) => { if (c.alive) c.die(); });

    this.physics.add.overlap(this.player, this.thornGroup,     () => this._playerHitThorn());
    this.physics.add.overlap(this.player, this.waterGroup,     () => { if (!this.player.dead) this.player.die(); });
    this.physics.add.overlap(this.player, this.enemyGroup,     (p, e) => this._playerHitEnemy(e));
    this.physics.add.overlap(this.player, this.pickupGroup,    (p, pk) => this._playerPickup(pk));
    this.physics.add.overlap(this.player, this.exitZone,       () => this._completeLevel());
    this.physics.add.overlap(this.player, this.bananaGroup,    (p, b) => this._collectBanana(b));
    this.physics.add.overlap(this.coconutGroup, this.enemyGroup, (c, e) => this._coconutHitEnemy(c, e));

    this.checkpointGroup.forEach(zone => {
      this.physics.add.overlap(this.player, zone, (p, z) => this._triggerCheckpoint(z));
    });
  }

  _setupCamera() {
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setFollowOffset(0, 40);
  }

  // ---------------------------------------------------------------------------
  //  EVENTS
  // ---------------------------------------------------------------------------

  _bindEvents() {
    this.game.events.on('rk_beat',               this._onBeat,            this);
    this.game.events.on('rk_spawn_coconut',      this._onSpawnCoconut,    this);
    this.game.events.on('rk_player_land',        this._onPlayerLand,      this);
    this.game.events.on('rk_player_roll',        this._onPlayerRoll,      this);
    this.game.events.on('rk_player_hit',         this._onPlayerHit,       this);
    this.game.events.on('rk_player_dead',        this._onPlayerDead,      this);
    this.game.events.on('rk_loop_change',        this._onLoopChange,      this);
    this.game.events.on('rk_beat_count_change',  this._onBeatCountChange, this);
  }

  // ---------------------------------------------------------------------------
  //  UPDATE
  // ---------------------------------------------------------------------------

  update(time, delta) {
    if (!this.player) return;

    // Parallax scroll update
    if (this._plxSprites && this._plxSprites.length > 0) {
      const sx = this.cameras.main.scrollX;
      this._plxSprites.forEach((spr, i) => {
        spr.tilePositionX = sx * this._plxFactors[i];
      });
    }
    // Water animation
    if (this._waterTiles) this._waterTiles.forEach(t => { t.tilePositionX += 0.4; });

    if (!this.player.dead) {
      this.player.update(delta, this.cursors);
      this.enemyGroup.getChildren().forEach(e => { if (e.alive) e.update(delta); });
      this.coconutGroup.getChildren().slice().forEach(c => { if (c.alive) c.update(); });

      if (this.player.body) {
        const dir = this.player.facingRight ? 1 : -1;
        this._gameFeel.setCameraLead(dir);
      }

      if (this.player.y > RK.PLAY_HEIGHT + 80) this.player.die();
    }
  }

  // ---------------------------------------------------------------------------
  //  BEAT EXECUTION
  // ---------------------------------------------------------------------------

  _onBeat(beatIndex) {
    if (!this.player || this.player.dead) return;

    this._gameFeel.beatPulse(beatIndex);

    // Ambient jungle sounds — time-based cooldown (was broken: used beatIndex 0-3 vs >=8)
    const now = this.time.now;
    if (now - (this._lastAmbientTime || 0) > (this._nextAmbientDelay || 5000)) {
      const sounds = ['chatter', 'hoot', 'monkey', 'bird', 'thunder'];
      this._audio.play(sounds[Math.floor(Math.random() * sounds.length)], 0.35);
      this._lastAmbientTime = now;
      this._nextAmbientDelay = Phaser.Math.Between(6000, 14000);
    }

    const action = this.timeline.getSlot(beatIndex);
    if (!action) return;

    if (!this.player.isActionUnlocked(action)) {
      this._audio.play('invalid_beat', 0.4);
      this.game.events.emit('rk_slot_invalid', beatIndex);
      return;
    }


    const SFX = { JUMP: 'jump', ROLL: 'roll', COCONUT: 'coconut_throw' };
    this._audio.play(SFX[action], 1.0);
    this.game.events.emit('rk_slot_success', beatIndex);

    switch (action) {
      case 'JUMP': {
        const n = this._activeBeatCount;
        const prev = this.timeline.getSlot((beatIndex - 1 + n) % n);
        if (prev === 'JUMP') this.player.doDoubleJump();
        else                 this.player.doJump();
        break;
      }
      case 'ROLL':    this.player.doRoll();    break;
      case 'COCONUT': this.player.doCoconut(); break;
    }
  }

  _onLoopChange(data) {
    if (this._rhythmClock) this._rhythmClock.setLoopKey(data.loopKey);
  }

  _onBeatCountChange({ count }) {
    this._activeBeatCount = count;
    if (this._rhythmClock) this._rhythmClock.setBeatCount(count);
  }

// ---------------------------------------------------------------------------
  //  ACTION HANDLERS
  // ---------------------------------------------------------------------------

  _onSpawnCoconut(data) {
    const c = new RK.Coconut(this, data.x, data.y, data.dir);
    this.coconutGroup.add(c);
  }

_onPlayerLand(data) { this._gameFeel.dustBurst(data.x, data.y + 14); }
  _onPlayerRoll(data) { this._gameFeel.rollTrail(data.x, data.y); }

  _onPlayerHit() {
    this._audio.play('hit', 0.7);
    this._gameFeel.screenShake(4, 200);
  }

  _onPlayerDead() {
    this._audio.play('death', 0.8);
    this.cameras.main.flash(200, 255, 60, 60);
    if (this._rhythmClock) this._rhythmClock.stop();

    if (this._checkpointX !== null && !this._enemyDeath) {
      this.time.delayedCall(600, () => {
        this.player.revive(this._checkpointX, this._checkpointY - 40);
        this.timeline.clearAll();
        this._rhythmClock.start();
      });
    } else {
      this.add.text(RK.WIDTH / 2, RK.PLAY_HEIGHT / 2, 'Lost the Rhythm…', {
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
  //  COLLISION HANDLERS
  // ---------------------------------------------------------------------------

  _playerHitThorn() {
    if (this.player.isRolling) return;
    this.player.takeDamage();
  }

  _playerHitEnemy(enemy) {
    if (!enemy || !enemy.alive || this.player.dead) return;
    if (this.player.isRolling && enemy.canRoll()) {
      enemy.die();
      this._gameFeel.dustBurst(enemy.x, enemy.y);
      this._addKill();
      return;
    }
    if (this.player.invincible) return;
    // Enemy touch = instant death, restart from beginning
    this._enemyDeath = true;
    this.player.die();
  }

  _addKill() {
    this._killCount++;
    if (this._killTxt) this._killTxt.setText('Kills: ' + this._killCount);
  }

  _collectBanana(banana) {
    if (!banana || !banana.active) return;
    banana.setActive(false).setVisible(false);
    if (banana.body) banana.body.enable = false;
    this._bananaCount++;
    if (this._bananaTxt) this._bananaTxt.setText('Fruits: ' + this._bananaCount);
    this._gameFeel.impactSpark(banana.x, banana.y);
    this.time.delayedCall(16, () => { if (banana) banana.destroy(); });
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
      this._addKill();
    }
  }

  _triggerCheckpoint(zone) {
    const cpX = zone.getData('cpX');
    const cpY = zone.getData('cpY');
    if (cpX === this._checkpointX) return;
    this._checkpointX = cpX;
    this._checkpointY = cpY;
    this._audio.play('checkpoint', 0.7);
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
    this.game.events.off('rk_beat',               this._onBeat,            this);
    this.game.events.off('rk_spawn_coconut',      this._onSpawnCoconut,    this);
    this.game.events.off('rk_player_land',        this._onPlayerLand,      this);
    this.game.events.off('rk_player_roll',        this._onPlayerRoll,      this);
    this.game.events.off('rk_player_hit',         this._onPlayerHit,       this);
    this.game.events.off('rk_player_dead',        this._onPlayerDead,      this);
    this.game.events.off('rk_loop_change',        this._onLoopChange,      this);
    this.game.events.off('rk_beat_count_change',  this._onBeatCountChange, this);
  }
}
