// =============================================================================
//  Rhythm Kingdom — Projectile.js
//  Fireball projectile.
// =============================================================================

window.RK.Projectile = class Projectile extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, direction) {
    super(scene, x, y, 'projectile');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.alive = true;
    this._dir = direction;

    this.body.setAllowGravity(false);
    this.body.setVelocityX(RK.PROJ_SPEED * direction);
    this.setFlipX(direction === -1);
    this.setDepth(6);
  }

  update() {
    if (!this.alive) return;
    if (this.x < -50 || this.x > RK.WIDTH + 50) {
      this.die();
    }
  }

  die() {
    if (!this.alive) return;
    this.alive = false;
    this.body.setVelocity(0, 0);
    this.body.setEnable(false);

    this.scene.tweens.add({
      targets: this,
      alpha: 0, scaleX: 0, scaleY: 0,
      duration: 150,
      ease: 'Quad.easeOut',
      onComplete: () => this.destroy(),
    });
  }
};
