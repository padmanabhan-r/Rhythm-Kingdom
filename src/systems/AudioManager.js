// =============================================================================
//  Rhythm Kingdom — AudioManager.js
//  Web Audio API manager. Loads MP3s, falls back to synth oscillators.
// =============================================================================

window.RK.AudioManager = class AudioManager {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this._unavailable = new Set();
    this._loopSources = {};
  }

  _ensureCtx() {
    if (!this.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  async loadSounds() {
    this._ensureCtx();
    const keys = [
      'backing_loop',
      'jump', 'roll', 'coconut_throw', 'coconut_impact', 'punch',
      'unlock_action', 'checkpoint',
      'invalid_beat', 'hit', 'death', 'level_complete',
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
  }

  _playBuf(key, vol) {
    vol = vol !== undefined ? vol : 0.7;
    const ctx = this._ensureCtx();
    if (!ctx || !this.buffers[key]) return false;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.connect(ctx.destination);
    const src = ctx.createBufferSource();
    src.buffer = this.buffers[key];
    src.connect(gain);
    src.start(ctx.currentTime);
    return true;
  }

  playLoop(key) {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    this.stopLoop(key);
    if (this.buffers[key]) {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.connect(ctx.destination);
      const src = ctx.createBufferSource();
      src.buffer = this.buffers[key];
      src.loop = true;
      src.connect(gain);
      src.start(ctx.currentTime);
      this._loopSources[key] = { src, gain };
    } else if (key === 'backing_loop') {
      this._startSynthLoop();
    }
  }

  stopLoop(key) {
    const entry = this._loopSources[key];
    if (entry) {
      try { entry.src.stop(); } catch (e) {}
      delete this._loopSources[key];
    }
    if (key === 'backing_loop') this._stopSynthLoop();
  }

  // --- Procedural jungle music loop -----------------------------------------
  // 8-step phrase (2 bars of 4/4 at 120 BPM) in A minor
  // Layers: kick + snare + hats + melodic bass + lead melody + ambient pad

  _startSynthLoop() {
    if (this._synthRunning) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    this._synthRunning = true;
    this._synthStep = 0;   // 0-7 (2-bar phrase)
    this._synthNext = ctx.currentTime + 0.05;
    this._synthInterval = setInterval(() => this._scheduleSynth(), 25);
    this._startAmbientPad();
  }

  _stopSynthLoop() {
    this._synthRunning = false;
    if (this._synthInterval) { clearInterval(this._synthInterval); this._synthInterval = null; }
    this._stopAmbientPad();
  }

  _scheduleSynth() {
    if (!this._synthRunning) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const BEAT = RK.BEAT_MS / 1000;
    while (this._synthNext < ctx.currentTime + 0.15) {
      this._jungleStep(this._synthStep, this._synthNext, BEAT);
      this._synthNext += BEAT;
      this._synthStep = (this._synthStep + 1) % 8;
    }
  }

  _jungleStep(s, t, BEAT) {
    // A natural minor: A(110/220) C(130/261) E(165/330) G(196/392) D(147/294)
    const BASS_NOTES = [110, 110, 98, 98, 110, 82.4, 98, 110]; // A2 A2 G2 G2 A2 E2 G2 A2
    const LEAD_NOTES = [330, 261, 294, 330, 440, 392, 330, 294]; // E4 C4 D4 E4 A4 G4 E4 D4
    const H = BEAT / 2; // 8th note

    // --- KICK: on steps 0, 4 (bar 1 and 2 downbeat) and step 2, 6 ---
    if (s === 0) this._kick(t, 0.75);
    if (s === 2) this._kick(t, 0.45);
    if (s === 4) this._kick(t, 0.7);
    if (s === 6) this._kick(t, 0.4);

    // --- SNARE/RIM: on 2 and 6 (backbeat) ---
    if (s === 2 || s === 6) this._snare(t, 0.45);

    // --- CONGA pattern: step 1, 3, 5, 7 ---
    const CONGA_F = [300, 370, 260, 420];
    if (s % 2 === 1) this._conga(t, CONGA_F[Math.floor(s / 2)], 0.28);

    // --- HI-HATS: closed every step, open on 0 and 4 ---
    this._hat(t, s === 0 || s === 4 ? 0.22 : 0.14, s === 0 || s === 4);
    this._hat(t + H * 0.5, 0.07, false); // 16th ghost

    // --- MELODIC BASS: every step ---
    this._tone(t, BASS_NOTES[s], 'sine', BEAT * 0.85, 0.3);

    // --- LEAD MELODY: every step, triangle ---
    this._tone(t, LEAD_NOTES[s], 'triangle', BEAT * 0.7, 0.12);

    // --- EXTRA: on step 3 and 7, high accent ---
    if (s === 3 || s === 7) this._tone(t + H * 0.5, 440, 'triangle', 0.08, 0.08);
  }

  _kick(t, vol) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.3);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + 0.33);
  }

  _snare(t, vol) {
    const ctx = this.ctx;
    // Tone layer
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = 200;
    og.gain.setValueAtTime(vol * 0.4, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(og); og.connect(ctx.destination); o.start(t); o.stop(t + 0.11);
    // Noise layer
    const frames = Math.floor(ctx.sampleRate * 0.12);
    const buf = ctx.createBuffer(1, frames, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const flt = ctx.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.value = 1500; flt.Q.value = 0.9;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    src.connect(flt); flt.connect(g); g.connect(ctx.destination); src.start(t);
  }

  _conga(t, freq, vol) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.12);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.15);
  }

  _hat(t, vol, open) {
    const ctx = this.ctx;
    const dur = open ? 0.08 : 0.03;
    const frames = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, frames, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const flt = ctx.createBiquadFilter(); flt.type = 'highpass'; flt.frequency.value = 7500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(flt); flt.connect(g); g.connect(ctx.destination); src.start(t);
  }

  _tone(t, freq, type, dur, vol) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.01);
  }

  // Sustained ambient pad — A minor chord drone beneath everything
  _startAmbientPad() {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    this._padNodes = [];
    // A2, E3, A3, C4 — A minor voicing
    [[110, 0.06], [164.8, 0.04], [220, 0.05], [261.6, 0.03]].forEach(([freq, vol]) => {
      const o = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const g = ctx.createGain();
      const flt = ctx.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = freq;
      lfo.type = 'sine'; lfo.frequency.value = 0.3 + Math.random() * 0.2;
      lfoGain.gain.value = freq * 0.003;
      lfo.connect(lfoGain); lfoGain.connect(o.frequency);
      flt.type = 'lowpass'; flt.frequency.value = 800; flt.Q.value = 1.2;
      g.gain.value = vol;
      o.connect(flt); flt.connect(g); g.connect(ctx.destination);
      lfo.start(); o.start();
      this._padNodes.push(o, lfo);
    });
  }

  _stopAmbientPad() {
    if (!this._padNodes) return;
    this._padNodes.forEach(n => { try { n.stop(); } catch(e) {} });
    this._padNodes = null;
  }

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
    if (freqEnd !== freqStart) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
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

  play(key, vol) {
    vol = vol !== undefined ? vol : 0.7;
    if (!this._playBuf(key, vol)) this._synthFallback(key);
  }

  _synthFallback(key) {
    switch (key) {
      case 'jump':
        this._osc('sine', 300, 700, 0.1, 0.5);
        break;
      case 'roll':
        this._noise(0.15, 0.3, 600);
        this._osc('sine', 180, 90, 0.15, 0.3);
        break;
      case 'coconut_throw':
        this._noise(0.06, 0.35, 1200);
        this._osc('square', 260, 260, 0.06, 0.3);
        break;
      case 'coconut_impact':
        this._osc('sine', 120, 60, 0.12, 0.5);
        this._noise(0.04, 0.2, 900);
        break;
      case 'punch':
        this._osc('sine', 80, 40, 0.1, 0.7);
        this._noise(0.04, 0.35, 2000);
        break;
      case 'unlock_action':
        [261, 329, 392, 523, 659].forEach((f, i) => {
          setTimeout(() => this._osc('triangle', f, f, 0.15, 0.5), i * 80);
        });
        break;
      case 'checkpoint':
        [440, 550, 660].forEach((f, i) => {
          setTimeout(() => this._osc('sine', f, f * 0.9, 0.2, 0.4), i * 120);
        });
        break;
      case 'invalid_beat':
        this._osc('sawtooth', 120, 80, 0.08, 0.12);
        break;
      case 'hit':
        this._noise(0.15, 0.4, 2000);
        this._osc('sawtooth', 320, 80, 0.08, 0.3);
        break;
      case 'death':
        [440, 220, 110].forEach((f, i) => {
          setTimeout(() => this._osc('sawtooth', f, f * 0.85, 0.15, 0.5), i * 150);
        });
        break;
      case 'level_complete':
        [261, 330, 392, 523, 659].forEach((f, i) => {
          setTimeout(() => this._osc('square', f, f, 0.15, 0.55), i * 100);
        });
        break;
    }
  }
};
