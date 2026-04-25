// =============================================================================
//  Rhythm Kingdom — DanceMonkey.js
//  Dancing ambient monkey. Cycles dance frames to the beat, plays monkey sound.
// =============================================================================

window.RK.DanceMonkey = class DanceMonkey extends Phaser.GameObjects.Container {

  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);

    this._scene = scene;
    this._frames = ['dance_monk_idle', 'dance_monk_l', 'dance_monk_idle', 'dance_monk_r'];
    this._frameIdx = 0;

    this._sprite = scene.add.image(0, 0, 'dance_monk_idle').setDepth(7);
    this.add(this._sprite);

    // Float bob animation
    this._bobTween = scene.tweens.add({
      targets: this,
      y: y - 6,
      duration: 500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  dance() {
    this._frameIdx = (this._frameIdx + 1) % this._frames.length;
    this._sprite.setTexture(this._frames[this._frameIdx]);
  }

  playSound() {
    if (window.RK && RK._audio) {
      RK._audio.play('monkey', 0.5);
    }
  }

  destroy() {
    if (this._bobTween) this._bobTween.stop();
    super.destroy();
  }
};
