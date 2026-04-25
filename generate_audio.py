"""Generate all game sound effects using ElevenLabs Sound Effects API."""
import os
from elevenlabs import ElevenLabs

client = ElevenLabs(api_key=os.environ.get("ELEVENLABS_API_KEY", ""))
OUT_DIR = "assets/audio"

SOUNDS = {
    "jump_small":      ("8-bit retro game jump, bright synth chirp, one-shot", 0.3),
    "jump_big":        ("16-bit heavy platformer jump, bass thud with chirp", 0.4),
    "jump_fire":       ("retro fire powerup jump, sizzling ascending chirp", 0.3),
    "stomp":           ("retro game stomp, chunky heavy downbeat thud, one-shot", 0.4),
    "fire_shoot":      ("8-bit laser fire shoot, sharp snare crack, one-shot", 0.4),
    "metronome_tick":  ("soft subtle metronome tick, game UI beat click", 0.3),
    "invalid_beat":    ("retro game invalid action buzz, short muted error", 0.4),
    "pickup_mushroom": ("retro game power up, ascending arpeggio jingle", 0.3),
    "pickup_flower":   ("retro fire flower pickup, bright sparkle ascending scale", 0.3),
    "hit":             ("retro player damage hit, impact descending tone, one-shot", 0.4),
    "death":           ("retro player death, descending 8-bit melody", 0.4),
    "level_complete":  ("retro level complete short fanfare jingle", 0.3),
}

os.makedirs(OUT_DIR, exist_ok=True)

for name, (prompt, influence) in SOUNDS.items():
    path = f"{OUT_DIR}/{name}.mp3"
    if os.path.exists(path):
        print(f"skip {name}")
        continue
    try:
        audio_iter = client.text_to_sound_effects.convert(
            text=prompt,
            prompt_influence=influence,
            output_format="mp3_44100_192",
        )
        audio_bytes = b"".join(audio_iter)
        with open(path, "wb") as f:
            f.write(audio_bytes)
        print(f"ok {name}.mp3 ({len(audio_bytes)} bytes)")
    except Exception as e:
        print(f"FAIL {name}: {e}")

print("\nDone!")
