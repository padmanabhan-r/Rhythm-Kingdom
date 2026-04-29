# Changelog

## v1.1.0 — Voice & Jungle SFX Update (2026-04-29)

### Audio
- 5 ElevenLabs TTS voice-overs (voice `oRHa7giAMnOuk9e9YaM3`, `eleven_multilingual_v2`):
  - "Rhythm Kingdom" — plays 500ms after tap-to-begin
  - "Level 1: The Root Gate", "Level 2: Temple of Echoes", "Level 3: Canopy Heart" — on level start
  - "You got the rhythm. The jungle bows to the beat." — on win screen
- Replaced roll SFX with jungle-themed organic tumble (roll_v3, volume 0.4)
- Replaced coconut throw SFX with jungle hurl sound (coconut_v4)

### Fixes
- Fixed "Rhythm Kingdom" voice playing twice: removed duplicate dismiss listener in MenuScene
- Fixed level 2 invisible pit near exit gate: split 1000px platform into two overlapping segments

---

## v1.0.0 — ElevenHacks Release (2026-04-27)

First public release of **Rhythm Kingdom** — a split-controller action-puzzle platformer built for the ElevenHacks hackathon.

### Gameplay
- 3 levels: First Loop → Heavy Beat → Final Track
- Manual movement (A/D) + rhythm-locked actions via 8-beat rune timeline
- Progressive form system: SMALL → BIG (mushroom) → FIRE (flower)
- Actions unlock as you power up: JUMP → STOMP → FIRE
- Checkpoints, water hazards, pits, snakes, and monkeys

### Audio
- ElevenLabs-generated retro stems for every action (jump, roll, stomp, fire)
- Backing loop variations: chill, normal, intense — player-selectable
- Web Audio API synth fallbacks so game runs without audio files
- Procedural jungle synth loop when MP3s not loaded

### UI / Feel
- 8-slot drag-click rune timeline with real-time playhead
- Configurable rune well count (2–8) via gear icon (⚙)
- Screen shake, dust bursts, beat pulse, camera lead
- Level intro flash with level name
- Persistent player name display mid-level

### Fixes (late session)
- Fixed duplicate action sounds on level transition and death/restart
- Fixed UIScene visual desync after checkpoint revive
- Fixed level 2 invisible pit (platform seam at x:2000)
- Fixed double-beat firing bug
- Fixed win screen text overlap ("LEVEL COMPLETE" + "YOU DID IT" stacking)

### Polish
- Win screen: celebratory messaging, "More levels & more runes coming soon"
- Mid-level tutorial hint in level 1 pointing to ⚙ settings
- Monkey favicon
