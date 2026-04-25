# Rhythm Kingdom – Audio Assets

Drop ElevenLabs-generated WAV files into this folder to override the built-in
synthesised sounds. Any file that is missing will automatically fall back to
the procedural Web Audio API synth.

## Expected file names

| File name              | When it plays                                      | Suggested prompt / style          |
|------------------------|----------------------------------------------------|-----------------------------------|
| `jump_small.wav`       | JUMP action fires while player is in SMALL form    | Bright synth chirp, 440→880 Hz    |
| `jump_big.wav`         | JUMP action fires while player is in BIG or FIRE   | Same chirp + low thump bass hit   |
| `stomp.wav`            | STOMP action fires (BIG / FIRE form only)          | Punchy kick drum, 80→40 Hz        |
| `fire.wav`             | FIRE action fires (FIRE form only)                 | Snare crack + 800 Hz sine ping    |
| `metronome.wav`        | Empty beat slot ticks                              | Quiet click, ~50 ms               |
| `invalid.wav`          | Card on timeline is illegal for current form       | Muted buzz / low error tone       |
| `pickup_mushroom.wav`  | Player collects the mushroom (SMALL → BIG)         | Ascending arp: C4 E4 G4           |
| `pickup_flower.wav`    | Player collects the flower (BIG → FIRE)            | Ascending arp: C4 E4 G4 C5        |
| `hit.wav`              | Player takes damage and downgrades form            | Descending noise sweep            |
| `death.wav`            | Player dies (was in SMALL form when hit)           | Descending tones 440→220→110 Hz   |
| `level_complete.wav`   | Player reaches the exit door                       | Quick 5-note ascending scale      |

## Tips for ElevenLabs generation

- Keep each clip **under 500 ms** for action sounds, **under 1.5 s** for the
  level-complete fanfare.
- Use a **retro 8-bit / chiptune** style prompt for consistency with the pixel
  art aesthetic.
- Export as **WAV, 44.1 kHz, 16-bit mono** for best Web Audio API compatibility.
- All files must be reachable at their paths relative to `index.html` —
  i.e. `assets/audio/jump_small.wav`.

## Audio layer concept

The plan calls for each power-up form to add a richer audio layer:

- **SMALL form** → thin, minimal synth sounds
- **BIG form**   → same sounds + a low-end bass/body layer
- **FIRE form**  → full sounds + bright melody / percussive layer

You can achieve this by recording separate stems for each form's actions
(the `jump_small.wav` vs `jump_big.wav` split already does this for jumps).
For stomp and fire you can rely on the form context that the AudioManager
passes when calling `playActionSound(action, form)`.