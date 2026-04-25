// =============================================================================
//  Rhythm Kingdom — Timeline.js
//  4-slot action state machine. Actions gated by unlockedActions[].
// =============================================================================

window.RK.Timeline = class Timeline {
  constructor() {
    this.slots = new Array(RK.BEAT_COUNT).fill(null);
    this.currentBeat = 0;
    this.unlockedActions = ['JUMP', 'ROLL'];
  }

  setSlot(index, action) {
    if (index >= 0 && index < this.slots.length) {
      this.slots[index] = action || null;
    }
  }

  clearSlot(index) { this.setSlot(index, null); }

  getSlot(index) {
    if (index >= 0 && index < this.slots.length) return this.slots[index];
    return null;
  }

  clearAll() {
    for (let i = 0; i < this.slots.length; i++) this.slots[i] = null;
  }

  setUnlocked(actions) { this.unlockedActions = actions.slice(); }

  unlock(action) {
    if (!this.unlockedActions.includes(action)) {
      this.unlockedActions.push(action);
    }
  }

  isUnlocked(action) {
    if (!action) return true;
    return this.unlockedActions.includes(action);
  }

  advance() {
    this.currentBeat = (this.currentBeat + 1) % RK.BEAT_COUNT;
  }

  getCurrentAction() { return this.slots[this.currentBeat]; }

  cycleSlot(index) {
    if (index < 0 || index >= this.slots.length) return;
    const allowed = this.unlockedActions;
    if (!allowed || allowed.length === 0) { this.slots[index] = null; return; }
    const current = this.slots[index];
    if (current === null) {
      this.slots[index] = allowed[0];
    } else {
      const idx = allowed.indexOf(current);
      if (idx === -1 || idx === allowed.length - 1) {
        this.slots[index] = null;
      } else {
        this.slots[index] = allowed[idx + 1];
      }
    }
  }
};
