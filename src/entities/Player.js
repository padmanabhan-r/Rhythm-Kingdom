// =============================================================================
//  Rhythm Kingdom — Player.js
//  Gorilla protagonist. 4 actions, progressive unlock, game feel.
// =============================================================================

window.RK.Player = class Player extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'gorilla_idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.unlockedActions = ['JUMP', 'ROLL'];
    this.isOnGround = false;
    this.isRolling = false;
    this.rollTimer = 0;
    this.facingRight = true;
    this.coyoteTimer = 0;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.dead = false;
    this._lastGrounded = false;

    this.body.setCollideWorldBounds(true);
    this.body.setSize(RK.PLAYER_W, RK.PLAYER_H);
    this.body.setOffset((28 - RK.PLAYER_W) / 2, 36 - RK.PLAYER_H);
    this.setDepth(5);
  }

  update(delta, cursors) {
    if (this.dead) return;

    // Invincibility flash
    if (this.invincible) {
      this.invincibleTimer -= delta;
      this.setAlpha(Math.floor(this.invincibleTimer / 80) % 2 === 0 ? 1 : 0.3);
      if (this.invincibleTimer <= 0) { this.invincible = false; this.setAlpha(1); }
    }

    // Coyote time
    const grounded = this.body.blocked.down;
    if (grounded) {
      this.coyoteTimer = RK.COYOTE_MS;
      // Landing detection
      if (!this._lastGrounded) this._onLand();
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }
    this._lastGrounded = grounded;
    this.isOnGround = grounded || this.coyoteTimer > 0;

    // Roll timer
    if (this.isRolling) {
      this.rollTimer -= delta;
      if (this.rollTimer <= 0) this._endRoll();
    }

    // Horizontal movement
    const spd = this.isRolling ? RK.PLAYER_SPEED * 1.6 : RK.PLAYER_SPEED;
    if (cursors.left.isDown) {
      this.body.setVelocityX(-spd);
      if (!this.isRolling) { this.facingRight = false; this.setFlipX(true); }
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(spd);
      if (!this.isRolling) { this.facingRight = true; this.setFlipX(false); }
    } else {
      this.body.setVelocityX(this.body.velocity.x * 0.8);
    }

    // Running texture
    if (!this.isRolling && !this.invincible) {
      if (!grounded) {
        this.setTexture('gorilla_jump');
      } else if (Math.abs(this.body.velocity.x) > 30) {
        this.setTexture('gorilla_run');
      } else {
        this.setTexture('gorilla_idle');
      }
    }
  }

  // --- Actions ---------------------------------------------------------------

  doJump() {
    if (!this.isOnGround || this.isRolling) return;
    this.body.setVelocityY(RK.JUMP_FORCE);
    this.coyoteTimer = 0;
    // Stretch on launch
    this.setScale(0.85, 1.3);
    this.scene.tweens.add({
      targets: this, scaleX: 1, scaleY: 1, duration: 200, ease: 'Back.easeOut',
    });
    this.scene.game.events.emit('rk_player_jump', { x: this.x, y: this.y });
  }

  doRoll() {
    if (!this.isOnGround || this.isRolling) return;
    this.isRolling = true;
    this.rollTimer = 300;
    // Shrink hitbox for roll
    this.body.setSize(RK.ROLL_W, RK.ROLL_H);
    this.body.setOffset((28 - RK.ROLL_W) / 2, 36 - RK.ROLL_H);
    // Burst in facing direction
    const dir = this.facingRight ? 1 : -1;
    this.body.setVelocityX(dir * RK.PLAYER_SPEED * 1.8);
    // Horizontal stretch
    this.setScale(1.4, 0.7);
    this.scene.game.events.emit('rk_player_roll', { x: this.x, y: this.y });
  }

  doCoconut() {
    const dir = this.facingRight ? 1 : -1;
    const ox = (28 / 2 + 6) * dir;
    this.scene.game.events.emit('rk_spawn_coconut', {
      x: this.x + ox,
      y: this.y - 4,
      dir,
    });
  }

  doPunch() {
    const dir = this.facingRight ? 1 : -1;
    // Visual punch lean
    this.setScale(1.2, 0.9);
    this.scene.tweens.add({
      targets: this, scaleX: 1, scaleY: 1, duration: 120, ease: 'Sine.easeOut',
    });
    this.scene.game.events.emit('rk_player_punch', {
      x: this.x + dir * 40,
      y: this.y,
      dir,
    });
  }

  unlock(action) {
    if (!this.unlockedActions.includes(action)) {
      this.unlockedActions.push(action);
    }
  }

  isActionUnlocked(action) {
    return this.unlockedActions.includes(action);
  }

  // --- Damage / death --------------------------------------------------------

  takeDamage(knockDir) {
    if (this.invincible || this.dead) return;
    this.invincible = true;
    this.invincibleTimer = 1200;
    const kx = (knockDir !== undefined ? knockDir : (this.facingRight ? -1 : 1));
    this.body.setVelocityX(kx * 200);
    this.body.setVelocityY(-250);
    this.scene.game.events.emit('rk_player_hit');
  }

  die() {
    if (this.dead) return;
    this.dead = true;
    this.body.setVelocity(0, 0);
    this.body.setAllowGravity(false);
    this.scene.tweens.add({
      targets: this, alpha: 0, scaleX: 0.5, scaleY: 0.5,
      duration: 300, ease: 'Sine.easeIn',
      onComplete: () => this.scene.game.events.emit('rk_player_dead'),
    });
  }

  revive(x, y) {
    this.dead = false;
    this.invincible = true;
    this.invincibleTimer = 1500;
    this.isRolling = false;
    this.rollTimer = 0;
    this.body.setAllowGravity(true);
    this.body.setVelocity(0, 0);
    this.body.setSize(RK.PLAYER_W, RK.PLAYER_H);
    this.body.setOffset((28 - RK.PLAYER_W) / 2, 36 - RK.PLAYER_H);
    this.setPosition(x, y);
    this.setAlpha(0);
    this.setScale(1, 1);
    this.scene.tweens.add({ targets: this, alpha: 1, duration: 400 });
  }

  // --- Internal helpers ------------------------------------------------------

  _onLand() {
    // Squash on landing
    this.setScale(1.3, 0.7);
    this.scene.tweens.add({
      targets: this, scaleX: 1, scaleY: 1, duration: 120, ease: 'Back.easeOut',
    });
    this.scene.game.events.emit('rk_player_land', { x: this.x, y: this.y });
  }

  _endRoll() {
    this.isRolling = false;
    this.body.setSize(RK.PLAYER_W, RK.PLAYER_H);
    this.body.setOffset((28 - RK.PLAYER_W) / 2, 36 - RK.PLAYER_H);
    this.setScale(1, 1);
  }
};
