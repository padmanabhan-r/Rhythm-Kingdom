// =============================================================================
//  Rhythm Kingdom — Player.js
//  Player entity. Extends Phaser.Physics.Arcade.Sprite.
// =============================================================================

window.RK.Player = class Player extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, startForm) {
    super(scene, x, y, 'player_small');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.form = null;
    this.isOnGround = false;
    this.coyoteTimer = 0;
    this.facingRight = true;
    this.dead = false;
    this.stomping = false;
    this.invincible = false;
    this.invincibleTimer = 0;

    this.body.setCollideWorldBounds(true);
    this.setDepth(5);

    this.setForm(startForm || 'SMALL');
  }

  update(delta, cursors) {
    if (this.dead) return;

    // --- Invincibility flash ---
    if (this.invincible) {
      this.invincibleTimer -= delta;
      this.setAlpha(Math.floor(this.invincibleTimer / 100) % 2 === 0 ? 1 : 0.3);
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
        this.setAlpha(1);
      }
    }

    // --- Ground detection & coyote time ---
    if (this.body.blocked.down) {
      this.coyoteTimer = RK.COYOTE_MS;
      this.stomping = false;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }
    this.isOnGround = this.body.blocked.down || this.coyoteTimer > 0;

    // --- Horizontal movement ---
    if (cursors.left.isDown) {
      this.body.setVelocityX(-RK.PLAYER_SPEED);
      this.facingRight = false;
      this.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(RK.PLAYER_SPEED);
      this.facingRight = true;
      this.setFlipX(false);
    } else {
      this.body.setVelocityX(this.body.velocity.x * 0.8);
    }
  }

  setForm(form) {
    this.form = form;
    const key = 'player_' + form.toLowerCase();
    this.setTexture(key);

    const hb = RK.HITBOX[form];
    this.body.setSize(hb.w, hb.h);
    const texW = 24;
    const texH = form === 'SMALL' ? 28 : 38;
    this.body.setOffset((texW - hb.w) / 2, texH - hb.h);
  }

  upgrade() {
    const F = RK.FORMS;
    if (this.form === F.SMALL) { this.setForm(F.BIG); return true; }
    if (this.form === F.BIG)   { this.setForm(F.FIRE); return true; }
    return false;
  }

  downgrade() {
    const F = RK.FORMS;
    if (this.form === F.FIRE)  { this.setForm(F.BIG); return 'downgraded'; }
    if (this.form === F.BIG)   { this.setForm(F.SMALL); return 'downgraded'; }
    this.dead = true;
    return 'dead';
  }

  doJump() {
    if (!this.isOnGround) return;
    this.body.setVelocityY(RK.JUMP_FORCE);
    this.coyoteTimer = 0;
  }

  doStomp() {
    if (this.body.blocked.down) return;
    this.body.setVelocityY(600);
    this.stomping = true;
  }

  doFire() {
    if (this.form !== RK.FORMS.FIRE) return;
    const dir = this.facingRight ? 1 : -1;
    const ox = (this.width / 2) + 4;
    this.scene.game.events.emit('rk_player_fire', {
      x: this.x + (dir * ox),
      y: this.y,
      dir: dir,
    });
  }

  getFireOrigin() {
    if (this.form !== RK.FORMS.FIRE) return null;
    const ox = (this.width / 2) + 4;
    return {
      x: this.x + (this.facingRight ? ox : -ox),
      y: this.y,
    };
  }
};
