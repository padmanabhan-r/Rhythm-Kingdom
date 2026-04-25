// =============================================================================
//  Rhythm Kingdom — Enemy.js
//  Patrol enemy. Types: 'stomp' | 'fireonly' | 'hazard'
// =============================================================================

window.RK.Enemy = class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, type) {
    const texKey = {
      stomp: 'enemy_stomp',
      fireonly: 'enemy_fire',
      hazard: 'enemy_hazard',
    }[type] || 'enemy_stomp';

    super(scene, x, y, texKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.type = type;
    this.alive = true;
    this.leftBound = x - 64;
    this.rightBound = x + 64;
    this.speed = 60;
    this.direction = 1;

    this.body.setCollideWorldBounds(true);
    this.body.setAllowGravity(true);
    this.setDepth(4);
  }

  setPatrol(left, right) {
    if (left !== undefined) this.leftBound = left;
    if (right !== undefined) this.rightBound = right;
  }

  canStomp() { return this.type === 'stomp'; }
  canFire()  { return this.type === 'fireonly'; }

  update(delta) {
    if (!this.alive) return;

    // Reverse at patrol bounds
    if (this.direction === 1 && this.x >= this.rightBound) {
      this.direction = -1;
      this.setFlipX(true);
    } else if (this.direction === -1 && this.x <= this.leftBound) {
      this.direction = 1;
      this.setFlipX(false);
    }

    // Reverse on wall
    if (this.body.blocked.right && this.direction === 1) {
      this.direction = -1;
      this.setFlipX(true);
    } else if (this.body.blocked.left && this.direction === -1) {
      this.direction = 1;
      this.setFlipX(false);
    }

    this.body.setVelocityX(this.speed * this.direction);
  }

  die(method) {
    if (!this.alive) return;
    this.alive = false;
    this.body.setVelocity(0, 0);
    this.body.setAllowGravity(false);
    this.body.setEnable(false);

    this.scene.tweens.add({
      targets: this,
      scaleX: 0, scaleY: 0, alpha: 0,
      duration: 220,
      ease: 'Back.easeIn',
      onComplete: () => this.destroy(),
    });
  }
};
