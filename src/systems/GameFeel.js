// =============================================================================
//  Rhythm Kingdom — GameFeel.js
//  Hitstop, screen shake, squash/stretch, camera lead, particles.
// =============================================================================

window.RK.GameFeel = class GameFeel {
  constructor(scene) {
    this._scene = scene;
    this._particles = scene.add.group();
    this._beatAlt = false;
  }

  hitstop(ms) {
    ms = ms !== undefined ? ms : 60;
    const scene = this._scene;
    scene.physics.world.pause();
    scene.tweens.pauseAll();
    scene.time.delayedCall(ms, () => {
      scene.physics.world.resume();
      scene.tweens.resumeAll();
    });
  }

  screenShake(intensity, duration) {
    intensity = intensity !== undefined ? intensity : 6;
    duration  = duration  !== undefined ? duration  : 200;
    this._scene.cameras.main.shake(duration, intensity / 700);
  }

  squash(sprite, scaleX, scaleY, duration) {
    duration = duration !== undefined ? duration : 80;
    this._scene.tweens.add({
      targets: sprite,
      scaleX, scaleY,
      duration,
      yoyo: true,
      ease: 'Sine.easeOut',
    });
  }

  setCameraLead(dir) {
    const cam = this._scene.cameras.main;
    const target = -dir * 120;
    this._scene.tweens.add({
      targets: { val: cam.followOffset.x },
      val: target,
      duration: 300,
      ease: 'Sine.easeOut',
      onUpdate: (tween, obj) => cam.setFollowOffset(obj.val, 0),
    });
  }

  beatPulse(beatIndex) {
    const strong = beatIndex === 0;
    const cam = this._scene.cameras.main;
    // Gentle sway — halved from original
    const angle = (strong ? 0.9 : 0.45) * (this._beatAlt ? 1 : -1);
    this._beatAlt = !this._beatAlt;
    cam.rotation = angle * (Math.PI / 180);
    this._scene.tweens.add({
      targets: { rot: cam.rotation },
      rot: 0, duration: 220, ease: 'Sine.easeOut',
      onUpdate: (tween, obj) => { cam.rotation = obj.rot; },
    });
    // Color pulse handled by UIScene — no cam.flash here
  }

  dustBurst(x, y) {
    this._spawnParticles(x, y, 0xccaa66, 6, 80, 60);
  }

  impactSpark(x, y) {
    this._spawnParticles(x, y, 0xffcc44, 4, 100, 80);
  }

  rollTrail(x, y) {
    this._spawnParticles(x, y, 0x88bbff, 2, 40, 40);
  }

  _spawnParticles(x, y, color, count, speed, lifetime) {
    const scene = this._scene;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
      const spd = speed * (0.6 + Math.random() * 0.8);
      const size = 3 + Math.random() * 4;
      const p = scene.add.rectangle(x, y, size, size, color)
        .setDepth(50).setScrollFactor(1);
      const vx = Math.cos(angle) * spd;
      const vy = Math.sin(angle) * spd - 60;
      scene.tweens.add({
        targets: p,
        x: x + vx * 0.5,
        y: y + vy * 0.5 + 30,
        alpha: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        duration: lifetime + Math.random() * 80,
        ease: 'Sine.easeIn',
        onComplete: () => p.destroy(),
      });
    }
  }
};
