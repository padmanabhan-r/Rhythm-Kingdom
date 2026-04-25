// =============================================================================
//  Rhythm Kingdom — Coconut.js
//  Arc-physics coconut projectile for COCONUT_THROW action.
// =============================================================================

window.RK.Coconut = class Coconut extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, dir) {
    super(scene, x, y, 'coconut');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.alive = true;
    this._dir  = dir;

    this.body.setVelocity(dir * RK.COCONUT_SPEED, -200);
    this.body.setGravityY(500);
    this.body.setAllowGravity(true);
    this.body.setCollideWorldBounds(false);

    this.setDepth(6);

    // Spin tween
    this._spinTween = scene.tweens.add({
      targets: this, angle: dir * 360,
      duration: 600, repeat: -1,
    });
  }

  update() {
    if (!this.alive) return;
    // Out of bounds check
    const cam = this.scene.cameras.main;
    if (this.x < cam.worldView.x - 100 || this.x > cam.worldView.x + cam.worldView.width + 100
      || this.y > this.scene.scale.height + 100) {
      this.die();
    }
  }

  die() {
    if (!this.alive) return;
    this.alive = false;
    if (this._spinTween) this._spinTween.stop();
    this.body.setEnable(false);

    this.scene.tweens.add({
      targets: this, alpha: 0, scaleX: 1.5, scaleY: 1.5,
      duration: 150, ease: 'Sine.easeOut',
      onComplete: () => this.destroy(),
    });
  }
};
