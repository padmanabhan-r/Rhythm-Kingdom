// =============================================================================
//  Rhythm Kingdom — AudioManager.js
//  Web Audio API manager. Loads MP3s, falls back to synth oscillators.
// =============================================================================

window.RK.AudioManager = class AudioManager {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this._unavailable = new Set();
  }

  // --- Context management ---------------------------------------------------

  _ensureCtx() {
    if (!this.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // --- Load all MP3s --------------------------------------------------------

  async loadSounds() {
    this._ensureCtx();
    const keys = [
      'jump_small', 'jump_big', 'jump_fire',
      'stomp', 'fire_shoot',
      'metronome_tick', 'invalid_beat',
      'pickup_mushroom', 'pickup_flower',
      'hit', 'death', 'level_complete',
    ];
    const loads = keys.map(async (key) => {
      try {
        const res = await fetch('assets/audio/' + key + '.mp3');
        if (!res.ok) throw new Error(res.status);
        const buf = await this._ensureCtx().decodeAudioData(await res.arrayBuffer());
        this.buffers[key] = buf;
      } catch (e) {
        this._unavailable.add(key);
      }
    });
    await Promise.allSettled(loads);
    console.log('[AudioManager] loaded:', Object.keys(this.buffers).length,
      'synth fallback:', this._unavailable.size);
  }

  // --- Play a decoded buffer ------------------------------------------------

  _playBuf(key, vol) {
    vol = vol || 0.7;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const buf = this.buffers[key];
    if (!buf) return false;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.connect(ctx.destination);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(gain);
    src.start(ctx.currentTime);
    return true;
  }

  // --- Synth helpers --------------------------------------------------------

  _osc(type, freqStart, freqEnd, dur, vol) {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t);
    if (freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    }
    osc.connect(gain);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  }

  _noise(dur, vol, filterFreq) {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const frames = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq || 1000;
    filter.connect(ctx.destination);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    gain.connect(filter);

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(gain);
    src.start(t);
  }

  // --- Public play methods --------------------------------------------------

  playActionSound(action, form) {
    if (action === 'JUMP') {
      const key = form === 'SMALL' ? 'jump_small' : form === 'BIG' ? 'jump_big' : 'jump_fire';
      if (!this._playBuf(key, 0.7)) {
        this._osc('sine', 440, 880, 0.08, 0.5);
        if (form !== 'SMALL') this._osc('sine', 100, 55, 0.1, 0.4);
      }
    } else if (action === 'STOMP') {
      if (!this._playBuf('stomp', 0.8)) {
        this._osc('sine', 80, 40, 0.12, 0.6);
        this._noise(0.03, 0.25, 800);
      }
    } else if (action === 'FIRE') {
      if (!this._playBuf('fire_shoot', 0.7)) {
        this._noise(0.1, 0.38, 3000);
        this._osc('sine', 800, 400, 0.1, 0.42);
      }
    }
  }

  playMetronomeTick() {
    if (!this._playBuf('metronome_tick', 0.45)) {
      this._osc('sine', 660, 660, 0.05, 0.15);
    }
  }

  playInvalidBeat() {
    if (!this._playBuf('invalid_beat', 0.4)) {
      this._osc('sawtooth', 120, 80, 0.08, 0.12);
    }
  }

  playPickup(type) {
    const key = type === 'flower' ? 'pickup_flower' : 'pickup_mushroom';
    if (!this._playBuf(key, 0.7)) {
      const notes = type === 'flower' ? [261, 329, 392, 523] : [261, 329, 392];
      const dur = 0.04;
      notes.forEach((f, i) => {
        setTimeout(() => this._osc('square', f, f, dur, 0.5), i * dur * 1000);
      });
    }
  }

  playHit() {
    if (!this._playBuf('hit', 0.7)) {
      this._noise(0.2, 0.4, 2000);
      this._osc('sawtooth', 320, 80, 0.08, 0.3);
    }
  }

  playDeath() {
    if (!this._playBuf('death', 0.8)) {
      [440, 220, 110].forEach((f, i) => {
        setTimeout(() => this._osc('sawtooth', f, f * 0.85, 0.15, 0.5), i * 150);
      });
    }
  }

  playLevelComplete() {
    if (!this._playBuf('level_complete', 0.8)) {
      [261, 330, 392, 523, 659].forEach((f, i) => {
        setTimeout(() => this._osc('square', f, f, 0.15, 0.55), i * 100);
      });
    }
  }
};
