// =============================================================================
//  Rhythm Kingdom — Enemy.js
//  Jungle creature patrol enemy. Types: 'lizard' | 'bat' | 'guardian'
//  lizard: killed by ROLL or PUNCH or COCONUT
//  bat: killed by PUNCH or COCONUT (airborne, bypasses roll)
//  guardian: killed by COCONUT only (stone armour)
// =============================================================================

window.RK.Enemy = class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y, type) {
    const SNAKE_TEXS = ['snake_green', 'snake_corn', 'snake_red'];
    const isSnake = type === 'snake';
    const snakeTex = isSnake ? SNAKE_TEXS[Math.floor(Math.random() * SNAKE_TEXS.length)] : null;
    const tex = snakeTex || ({ lizard: 'enemy_lizard', bat: 'enemy_bat', guardian: 'enemy_guardian' }[type] || 'enemy_lizard');

    super(scene, x, y, tex, isSnake ? 0 : undefined);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.type   = type;
    this.alive  = true;
    this.direction = 1;
    this.speed  = type === 'bat' ? 50 : type === 'snake' ? 45 : 60;

    this.leftBound  = x - 64;
    this.rightBound = x + 64;

    this.body.setCollideWorldBounds(true);
    this.body.setAllowGravity(type !== 'bat');

    if (isSnake) {
      this.setScale(1.4);
      this.play(snakeTex);            // animation key matches texture key
      this.body.setSize(26, 14);
      this.body.setOffset(1, 14);
    }
    this.setDepth(4);

    if (type === 'bat') {
      // Bats hover — give slight vertical oscillation via tween
      this._floatTween = scene.tweens.add({
        targets: this, y: y - 14, duration: 900,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
    }
  }

  setPatrol(left, right) {
    if (left  !== undefined) this.leftBound  = left;
    if (right !== undefined) this.rightBound = right;
  }

  canRoll()    { return this.type === 'lizard' || this.type === 'snake'; }
  canCoconut() { return true; }

  update(delta) {
    if (!this.alive) return;

    // Reverse at patrol bounds
    if (this.direction === 1 && this.x >= this.rightBound) {
      this.direction = -1; this.setFlipX(true);
    } else if (this.direction === -1 && this.x <= this.leftBound) {
      this.direction = 1; this.setFlipX(false);
    }

    // Reverse on wall (ground enemies)
    if (this.type !== 'bat') {
      if (this.body.blocked.right && this.direction === 1)  { this.direction = -1; this.setFlipX(true); }
      if (this.body.blocked.left  && this.direction === -1) { this.direction = 1;  this.setFlipX(false); }
    }

    this.body.setVelocityX(this.speed * this.direction);
  }

  die() {
    if (!this.alive) return;
    this.alive = false;
    if (this._floatTween) this._floatTween.stop();
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
