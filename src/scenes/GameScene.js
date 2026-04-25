// =============================================================================
//  Rhythm Kingdom — GameScene.js
//  Main gameplay scene. Builds level, manages player/enemies/projectiles,
//  responds to beat events from UIScene.
// =============================================================================

const PX = "'Press Start 2P', monospace";

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    this.levelKey = (data && data.level) || 'level1';
    this.levelData = RK.Levels[this.levelKey];
    this.mode = 'edit';
    this._levelComplete = false;
  }

  create() {
    if (!this.levelData) return;

    const ld = this.levelData;

    this.audioMgr = new RK.AudioManager();
    this.audioMgr._ensureCtx();
    this.audioMgr.loadSounds();

    this.timeline = new RK.Timeline();
    this.timeline.setForm(ld.startForm);

    this.physics.world.setBounds(0, 0, RK.WIDTH, RK.PLAY_HEIGHT);
    this.cameras.main.setBackgroundColor(ld.bgColor || 0x5c94fc);

    // Background decorative layers (below everything)
    this._buildBackground();

    // Level geometry
    this.platformGroup = this.physics.add.staticGroup();
    this.spikeGroup    = this.physics.add.staticGroup();
    this.enemyGroup    = this.add.group();
    this.pickupGroup   = this.add.group();
    this.projectiles   = this.add.group();

    this._buildPlatforms(ld);
    this._buildSpikes(ld);
    this._buildEnemies(ld);
    this._buildPickups(ld);
    this._buildExit(ld);

    this.player = new RK.Player(this, ld.playerStart.x, ld.playerStart.y, ld.startForm);

    this.physics.add.collider(this.player, this.platformGroup);
    this.physics.add.collider(this.enemyGroup, this.platformGroup);
    this.physics.add.collider(this.projectiles, this.platformGroup, (proj) => {
      if (proj && proj.alive) proj.die();
    });

    this.physics.add.overlap(this.player, this.spikeGroup,   () => this._hitPlayer());
    this.physics.add.overlap(this.player, this.enemyGroup,   (p, e) => this._playerHitEnemy(e));
    this.physics.add.overlap(this.player, this.pickupGroup,  (p, pk) => this._playerPickup(pk));
    this.physics.add.overlap(this.player, this.exitZone,     () => this._completeLevel());
    this.physics.add.overlap(this.projectiles, this.enemyGroup, (pr, en) => this._projHitEnemy(pr, en));

    this.cursors = this.input.keyboard.addKeys({
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this._buildHUD(ld);

    this.game.events.on('rk_beat',        this._onBeat,       this);
    this.game.events.on('rk_mode_change', this._onModeChange, this);
    this.game.events.on('rk_player_fire', this._onPlayerFire, this);

    this.scene.launch('UIScene', { startForm: ld.startForm, timeline: this.timeline });

    this.time.delayedCall(100, () => {
      this.game.events.emit('rk_form_change', { form: this.player.form });
    });
  }

  // ===========================================================================
  //  Background layers
  // ===========================================================================

  _buildBackground() {
    const W  = RK.WIDTH;
    const H  = RK.PLAY_HEIGHT;
    const bg = this.add.graphics().setDepth(-3);

    if (this.levelKey === 'level1') {
      // Distant mountains (soft blue silhouette)
      bg.fillStyle(0x8ab4f0, 0.65);
      bg.fillEllipse(130, H - 140, 310, 200);
      bg.fillEllipse(420, H - 120, 280, 170);
      bg.fillEllipse(690, H - 150, 300, 200);
      bg.fillEllipse(820, H - 110, 200, 150);

      // Near rolling hills (green)
      bg.fillStyle(0x48913e);
      bg.fillEllipse(70,  H - 65, 260, 150);
      bg.fillEllipse(330, H - 45, 300, 130);
      bg.fillEllipse(640, H - 75, 280, 160);
      bg.fillStyle(0x3a7f32);
      bg.fillEllipse(200, H - 38, 220, 110);
      bg.fillEllipse(500, H - 30, 250, 100);
      bg.fillEllipse(800, H - 45, 180, 110);

      // Ground strip
      bg.fillStyle(0x52a84c); bg.fillRect(0, H - 28, W, 28);
      bg.fillStyle(0x8b5e1c); bg.fillRect(0, H - 16, W, 16);

      // Animated clouds
      this._spawnCloud(48,  26000, 0);
      this._spawnCloud(78,  34000, 9000);
      this._spawnCloud(38,  29000, 18000);
      this._spawnCloud(62,  38000, 24000);

    } else if (this.levelKey === 'level2') {
      // Dark tree silhouettes at various heights
      const treeX = [30, 110, 200, 290, 370, 460, 550, 640, 720, 800];
      const treeH = [180, 220, 160, 250, 190, 210, 170, 240, 200, 180];
      treeX.forEach((tx, i) => {
        const th = treeH[i];
        bg.fillStyle(0x0e2010);
        bg.fillTriangle(tx, H - 28, tx - 34, H - 28 - th * 0.55, tx + 34, H - 28 - th * 0.55);
        bg.fillTriangle(tx, H - 28 - th * 0.35, tx - 26, H - 28 - th * 0.8, tx + 26, H - 28 - th * 0.8);
        bg.fillTriangle(tx, H - 28 - th * 0.6,  tx - 18, H - 28 - th, tx + 18, H - 28 - th);
        bg.fillStyle(0x0a1808);
        bg.fillRect(tx - 5, H - 28 - th * 0.55, 10, th * 0.55);
      });

      // Ground mist layer
      bg.fillStyle(0x2a4a22, 0.5); bg.fillRect(0, H - 60, W, 60);
      bg.fillStyle(0x3a5c2a, 0.4); bg.fillRect(0, H - 32, W, 32);

      // Background mushroom accent
      bg.fillStyle(0x661a1a, 0.5); bg.fillEllipse(180, H - 90, 50, 36);
      bg.fillStyle(0xeeccaa, 0.4); bg.fillRect(176, H - 72, 8, 44);
      bg.fillStyle(0x441111, 0.5); bg.fillEllipse(560, H - 75, 40, 28);
      bg.fillStyle(0xeeccaa, 0.4); bg.fillRect(557, H - 60, 6, 32);

      // Ground strip
      bg.fillStyle(0x3a6630); bg.fillRect(0, H - 28, W, 28);
      bg.fillStyle(0x2a4a20); bg.fillRect(0, H - 16, W, 16);

    } else if (this.levelKey === 'level3') {
      // Stalactites at top
      const stalX = [40, 110, 190, 270, 360, 440, 530, 610, 700, 770];
      const stalL = [70,  95,  55,  80,  100, 65,  90,  75,  85,  60];
      bg.fillStyle(0x2a1010);
      stalX.forEach((sx, i) => {
        const sl = stalL[i];
        bg.fillTriangle(sx, 0, sx - 18, sl, sx + 18, sl);
      });

      // Lava glow at bottom
      bg.fillStyle(0xff3300, 0.12); bg.fillRect(0, H - 70, W, 70);
      bg.fillStyle(0xff5500, 0.08); bg.fillRect(0, H - 45, W, 45);
      bg.fillStyle(0xff8800, 0.06); bg.fillRect(0, H - 20, W, 20);

      // Stone columns in background
      bg.fillStyle(0x281010);
      bg.fillRect(90,  H - 200, 22, 172);
      bg.fillRect(320, H - 240, 22, 212);
      bg.fillRect(570, H - 180, 22, 152);
      bg.fillRect(730, H - 210, 22, 182);
      // Column caps
      bg.fillStyle(0x3a1818);
      bg.fillRect(86,  H - 204, 30, 8);
      bg.fillRect(316, H - 244, 30, 8);
      bg.fillRect(566, H - 184, 30, 8);
      bg.fillRect(726, H - 214, 30, 8);

      // Ground lava strip
      bg.fillStyle(0x881100); bg.fillRect(0, H - 28, W, 28);
      bg.fillStyle(0xaa2200, 0.6); bg.fillRect(0, H - 18, W, 18);
    }
  }

  _spawnCloud(y, duration, delay) {
    const g = this.add.graphics().setDepth(-2);
    g.fillStyle(0xffffff, 0.9);
    g.fillEllipse(0,    0,  90, 46);
    g.fillEllipse(30,  -18, 58, 36);
    g.fillEllipse(-28, -14, 52, 32);
    g.fillStyle(0xddddff, 0.3);
    g.fillEllipse(0, 12, 84, 22);
    g.y = y;

    this.tweens.add({
      targets:  g,
      x:        { from: -160, to: RK.WIDTH + 160 },
      duration,
      repeat:   -1,
      delay,
      ease:     'Linear',
    });
  }

  // ===========================================================================
  //  Level building
  // ===========================================================================

  _buildPlatforms(ld) {
    ld.platforms.forEach(p => {
      const w = p.w;
      const h = 16;
      const gfx = this.add.graphics().setDepth(1);

      // Grass top
      gfx.fillStyle(0x52a84c); gfx.fillRect(p.x, p.y, w, 5);
      gfx.fillStyle(0x70cc60); gfx.fillRect(p.x, p.y, w, 2);          // top highlight
      gfx.fillStyle(0x3a8a32); gfx.fillRect(p.x, p.y + 4, w, 1);      // grass underline

      // Dirt body
      gfx.fillStyle(0x8b5e1c); gfx.fillRect(p.x, p.y + 5, w, h - 5);
      gfx.fillStyle(0xaa7030); gfx.fillRect(p.x, p.y + 5, 2, h - 7);  // left edge highlight
      gfx.fillStyle(0x5a3c0a); gfx.fillRect(p.x + w - 2, p.y + 5, 2, h - 7); // right edge shadow
      gfx.fillStyle(0x5a3c0a); gfx.fillRect(p.x, p.y + h - 2, w, 2);  // bottom shadow

      // Brick seam lines
      gfx.fillStyle(0x7a4e14, 0.5);
      for (let gx = p.x + 24; gx < p.x + w - 4; gx += 24) {
        gfx.fillRect(gx, p.y + 6, 1, h - 8);
      }

      // Physics body (invisible)
      const body = this.platformGroup.create(p.x + w / 2, p.y + h / 2, 'platform');
      body.setDisplaySize(w, h).setAlpha(0).refreshBody();
    });
  }

  _buildSpikes(ld) {
    ld.spikes.forEach(s => {
      const gfx = this.add.graphics().setDepth(1);

      // Base plate
      gfx.fillStyle(0x555566); gfx.fillRect(s.x, s.y + 10, 16, 6);
      gfx.fillStyle(0x777788); gfx.fillRect(s.x, s.y + 10, 16, 2);

      // Spike body
      gfx.fillStyle(0xbbbbcc); gfx.fillTriangle(s.x + 8, s.y, s.x + 1, s.y + 12, s.x + 15, s.y + 12);
      // Highlight strip
      gfx.fillStyle(0xddddef); gfx.fillTriangle(s.x + 8, s.y + 1, s.x + 10, s.y + 11, s.x + 8, s.y + 1);
      // Shiny tip
      gfx.fillStyle(0xffffff); gfx.fillRect(s.x + 7, s.y, 2, 2);

      const body = this.spikeGroup.create(s.x + 8, s.y + 8, 'spike');
      body.setDisplaySize(16, 16).setAlpha(0).refreshBody();
    });
  }

  _buildEnemies(ld) {
    ld.enemies.forEach(e => {
      const enemy = new RK.Enemy(this, e.x, e.y, e.type);
      enemy.setPatrol(e.left, e.right);
      this.enemyGroup.add(enemy);
    });
  }

  _buildPickups(ld) {
    ld.pickups.forEach(p => {
      const sprite = this.physics.add.sprite(p.x, p.y, 'pickup_' + p.type);
      sprite.body.setAllowGravity(false);
      sprite.body.setImmovable(true);
      sprite.setDepth(3);
      sprite.setData('type', p.type);
      this.tweens.add({
        targets: sprite, y: p.y - 6,
        duration: 800, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      });
      this.pickupGroup.add(sprite);
    });
  }

  _buildExit(ld) {
    const ex  = ld.exit;
    const vis = this.add.sprite(ex.x, ex.y, 'exit_door').setDepth(2);
    this.tweens.add({
      targets: vis, alpha: { from: 0.8, to: 1 },
      duration: 700, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });
    this.exitZone = this.physics.add.sprite(ex.x, ex.y, 'exit_door');
    this.exitZone.setAlpha(0);
    this.exitZone.body.setAllowGravity(false);
    this.exitZone.body.setImmovable(true);
  }

  _buildHUD(ld) {
    this.add.text(RK.WIDTH - 8, 6, ld.name, {
      fontFamily: PX, fontSize: '8px', color: '#556688',
    }).setOrigin(1, 0).setDepth(10);

    if (ld.hint) {
      const hint = this.add.text(RK.WIDTH / 2, 12, ld.hint, {
        fontFamily: PX, fontSize: '8px', color: '#ccffaa',
        backgroundColor: '#00000099', padding: { x: 10, y: 6 },
      }).setOrigin(0.5, 0).setDepth(10);

      this.time.delayedCall(4000, () => {
        this.tweens.add({ targets: hint, alpha: 0, duration: 700, onComplete: () => hint.destroy() });
      });
    }

    this.add.text(6, RK.PLAY_HEIGHT - 14, 'SPACE = Edit/Play  |  A/D = Move', {
      fontFamily: PX, fontSize: '7px', color: '#334455',
    }).setDepth(10);
  }

  // ===========================================================================
  //  Update
  // ===========================================================================

  update(time, delta) {
    if (!this.player || this.player.dead) return;

    if (this.mode === 'play') {
      this.player.update(delta, this.cursors);
      this.enemyGroup.getChildren().forEach(e => { if (e.alive) e.update(delta); });
      this.projectiles.getChildren().slice().forEach(p => { if (p.alive) p.update(); });
    } else {
      if (this.player.body) this.player.body.setVelocityX(0);
    }
  }

  // ===========================================================================
  //  Beat execution
  // ===========================================================================

  _onBeat(beatIndex) {
    if (this.mode !== 'play' || !this.player || this.player.dead) return;

    const action = this.timeline.getSlot(beatIndex);

    if (!action) {
      this.audioMgr.playMetronomeTick();
      return;
    }

    if (!this.timeline.isLegal(action)) {
      this.audioMgr.playInvalidBeat();
      this.game.events.emit('rk_slot_invalid', beatIndex);
      return;
    }

    if (action === 'JUMP')  this.player.doJump();
    if (action === 'STOMP') this.player.doStomp();
    if (action === 'FIRE')  this.player.doFire();

    this.audioMgr.playActionSound(action, this.player.form);
    this.game.events.emit('rk_slot_success', beatIndex);
  }

  _onModeChange(data) {
    this.mode = data.mode;
    if (this.mode === 'edit' && this.player && !this.player.dead) {
      this.player.body.setVelocityX(0);
    }
  }

  _onPlayerFire(data) {
    const proj = new RK.Projectile(this, data.x, data.y, data.dir);
    this.projectiles.add(proj);
  }

  // ===========================================================================
  //  Collision handlers
  // ===========================================================================

  _hitPlayer() {
    if (this.player.invincible || this.player.dead) return;

    const result = this.player.downgrade();
    if (result === 'dead') {
      this._killPlayer();
    } else {
      this.audioMgr.playHit();
      this.cameras.main.shake(120, 0.008);
      this.player.invincible = true;
      this.player.invincibleTimer = 1500;
      this.game.events.emit('rk_form_change', { form: this.player.form });
      this.timeline.setForm(this.player.form);
    }
  }

  _killPlayer() {
    if (!this.player || this.player.dead) return;
    this.player.dead = true;
    this.audioMgr.playDeath();
    this.cameras.main.flash(200, 255, 60, 60);
    this.game.events.emit('rk_player_dead');

    this.add.text(RK.WIDTH / 2, RK.PLAY_HEIGHT / 2 - 20, 'GAME OVER', {
      fontFamily: PX, fontSize: '28px', color: '#ff4444',
      stroke: '#660000', strokeThickness: 5, align: 'center',
    }).setOrigin(0.5).setDepth(30);

    this.add.text(RK.WIDTH / 2, RK.PLAY_HEIGHT / 2 + 20, 'Restarting…', {
      fontFamily: PX, fontSize: '12px', color: '#ffaaaa',
    }).setOrigin(0.5).setDepth(30);

    this.time.delayedCall(1800, () => {
      this.scene.stop('UIScene');
      this.scene.restart({ level: this.levelKey });
    });
  }

  _playerHitEnemy(enemy) {
    if (!enemy || !enemy.alive || this.player.invincible || this.player.dead) return;

    const vy    = this.player.body.velocity.y;
    const falling = vy > 80;
    const above   = this.player.body.bottom <= enemy.body.top + 10;

    if (falling && above && enemy.canStomp()) {
      enemy.die('stomp');
      this.player.body.setVelocityY(-250);
      this.audioMgr.playActionSound('STOMP', this.player.form);
    } else {
      this._hitPlayer();
    }
  }

  _playerPickup(pickup) {
    if (!pickup || !pickup.active) return;
    pickup.setActive(false).setVisible(false);
    if (pickup.body) pickup.body.enable = false;

    const type = pickup.getData('type');
    this.audioMgr.playPickup(type);

    const F = RK.FORMS;
    if (type === 'mushroom' && this.player.form === F.SMALL) {
      this.player.upgrade();
    } else if (type === 'flower') {
      if (this.player.form === F.SMALL) { this.player.upgrade(); this.player.upgrade(); }
      else if (this.player.form === F.BIG) { this.player.upgrade(); }
    }

    this.game.events.emit('rk_form_change', { form: this.player.form });
    this.timeline.setForm(this.player.form);

    this.time.delayedCall(16, () => { if (pickup) pickup.destroy(); });
  }

  _projHitEnemy(proj, enemy) {
    if (!proj || !proj.alive || !enemy || !enemy.alive) return;
    proj.die();
    if (enemy.type === 'stomp' || enemy.type === 'fireonly') enemy.die('fire');
  }

  // ===========================================================================
  //  Level completion
  // ===========================================================================

  _completeLevel() {
    if (this._levelComplete) return;
    this._levelComplete = true;

    this.audioMgr.playLevelComplete();
    this.cameras.main.flash(300, 255, 240, 100);
    this.game.events.emit('rk_level_complete');

    const banner = this.add.text(RK.WIDTH / 2, RK.PLAY_HEIGHT / 2 - 30, 'LEVEL\nCOMPLETE!', {
      fontFamily: PX, fontSize: '28px', color: '#ffcc00',
      stroke: '#aa7700', strokeThickness: 5, align: 'center',
    }).setOrigin(0.5).setDepth(30);

    this.tweens.add({ targets: banner, scale: { from: 0.2, to: 1 }, duration: 400, ease: 'Back.easeOut' });

    const nextLevel = this.levelData.nextLevel;
    const sub = nextLevel ? 'Get ready for the next level…' : 'You beat all 3 levels!';
    this.add.text(RK.WIDTH / 2, RK.PLAY_HEIGHT / 2 + 40, sub, {
      fontFamily: PX, fontSize: '10px', color: '#ffffff',
    }).setOrigin(0.5).setDepth(30);

    this.time.delayedCall(2400, () => {
      this.scene.stop('UIScene');
      if (nextLevel) {
        this.scene.start('GameScene', { level: nextLevel });
      } else {
        this._showWinScreen();
      }
    });
  }

  _showWinScreen() {
    const W = RK.WIDTH;
    const H = RK.PLAY_HEIGHT;
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.75).setDepth(28);

    this.add.text(W / 2, H / 2 - 70, 'YOU WIN!', {
      fontFamily: PX, fontSize: '40px', color: '#ffcc00',
      stroke: '#ff8800', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(29);

    this.add.text(W / 2, H / 2,
      'Movement is manual.\nActions are rhythm-locked.\nPower-ups unlock new notes.', {
        fontFamily: PX, fontSize: '10px', color: '#aaaaff',
        align: 'center', lineSpacing: 8,
      }).setOrigin(0.5).setDepth(29);

    const prompt = this.add.text(W / 2, H / 2 + 80, 'SPACE  to return to menu', {
      fontFamily: PX, fontSize: '10px', color: '#ffffff',
    }).setOrigin(0.5).setDepth(29);

    this.tweens.add({
      targets: prompt, alpha: { from: 1, to: 0 },
      duration: 550, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('MenuScene'));
  }

  // ===========================================================================
  //  Cleanup
  // ===========================================================================

  shutdown() {
    this.game.events.off('rk_beat',        this._onBeat,       this);
    this.game.events.off('rk_mode_change', this._onModeChange, this);
    this.game.events.off('rk_player_fire', this._onPlayerFire, this);
  }
}
