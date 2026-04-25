// =============================================================================
//  Rhythm Kingdom — RhythmClock.js
//  Web Audio lookahead scheduler. Drives rk_beat events from the backing loop.
// =============================================================================

window.RK.RhythmClock = class RhythmClock {
  constructor(audioManager, gameEvents, loopKey) {
    this._audio = audioManager;
    this._events = gameEvents;
    this._loopKey = loopKey || 'backing_loop';
    this._intervalId = null;
    this._nextBeatTime = 0;
    this._beatIndex = 0;
    this._running = false;
  }

  start() {
    if (this._running) return;
    this._running = true;
    const ctx = this._audio._ensureCtx();
    if (!ctx) return;
    this._audio.playLoop(this._loopKey);
    this._nextBeatTime = ctx.currentTime + 0.05;
    this._beatIndex = 0;
    this._intervalId = setInterval(() => this._schedule(), 25);
  }

  stop() {
    this._running = false;
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    this._audio.stopLoop(this._loopKey);
  }

  setLoopKey(key) {
    const wasRunning = this._running;
    if (wasRunning) this.stop();
    this._loopKey = key;
    if (wasRunning) this.start();
  }

  reset() {
    this._beatIndex = 0;
    const ctx = this._audio._ensureCtx();
    if (ctx) this._nextBeatTime = ctx.currentTime + 0.05;
  }

  _schedule() {
    if (!this._running) return;
    const ctx = this._audio._ensureCtx();
    if (!ctx) return;
    const BEAT_S = RK.BEAT_MS / 1000;
    // Schedule beats up to 100ms ahead
    while (this._nextBeatTime < ctx.currentTime + 0.1) {
      const beatIdx = this._beatIndex;
      const fireAt = this._nextBeatTime;
      // Calculate delay for Phaser side
      const delay = Math.max(0, (fireAt - ctx.currentTime) * 1000);
      setTimeout(() => {
        if (this._running) {
          this._events.emit('rk_beat', beatIdx);
        }
      }, delay);
      this._nextBeatTime += BEAT_S;
      this._beatIndex = (this._beatIndex + 1) % RK.BEAT_COUNT;
    }
  }
};
