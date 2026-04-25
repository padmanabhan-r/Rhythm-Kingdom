// =============================================================================
//  Rhythm Kingdom — Timeline.js
//  8-slot action state machine.
// =============================================================================

window.RK.Timeline = class Timeline {
  constructor() {
    this.slots = new Array(RK.BEAT_COUNT).fill(null);
    this.currentBeat = 0;
    this.playerForm = 'SMALL';
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

  isLegal(action) {
    if (!action) return true;
    return (RK.ALLOWED[this.playerForm] || []).includes(action);
  }

  advance() {
    this.currentBeat = (this.currentBeat + 1) % RK.BEAT_COUNT;
  }

  getCurrentAction() { return this.slots[this.currentBeat]; }

  setForm(form) { this.playerForm = form; }

  /**
   * Cycle a slot through: null → allowed[0] → allowed[1] → ... → null
   */
  cycleSlot(index, allowedActions) {
    if (index < 0 || index >= this.slots.length) return;
    if (!allowedActions || allowedActions.length === 0) {
      this.slots[index] = null;
      return;
    }
    const current = this.slots[index];
    if (current === null) {
      this.slots[index] = allowedActions[0];
    } else {
      const idx = allowedActions.indexOf(current);
      if (idx === -1 || idx === allowedActions.length - 1) {
        this.slots[index] = null;
      } else {
        this.slots[index] = allowedActions[idx + 1];
      }
    }
  }
};
