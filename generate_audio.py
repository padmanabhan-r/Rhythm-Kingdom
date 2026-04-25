"""Generate all game sound effects using ElevenLabs Sound Effects API."""
import os
from elevenlabs import ElevenLabs

client = ElevenLabs(api_key=os.environ.get("ELEVENLABS_API_KEY", ""))
OUT_DIR = "assets/audio"

# (prompt, prompt_influence, loop, duration_seconds or None)
SOUNDS = {
    "backing_loop":   ("1-bar 4/4 jungle tribal percussion loop, 120 BPM, "
                       "wooden drums, shakers, seamless loop, warm organic",   0.4, True,  2.0),
    "jump":           ("djembe high slap, sharp African drum hit, bright skin snap, "
                       "one-shot percussive, jungle drum accent",                0.4, False, None),
    "roll":           ("dundun bass drum roll, low African talking drum hit, "
                       "deep resonant thud, one-shot",                           0.4, False, None),
    "coconut_throw":  ("balafon wood mallet strike, bright xylophone hit, "
                       "African marimba accent, one-shot crisp",                 0.4, False, None),
    "coconut_impact": ("kpanlogo drum bass hit, deep hollow thud, African drum impact, "
                       "low resonant one-shot",                                  0.4, False, None),
    "punch":          ("giant djembe bass slap, massive African drum punch, "
                       "deep powerful skin hit, one-shot heavy impact",          0.5, False, None),
    "unlock_action":  ("ascending magical chime sequence, power unlock stinger, "
                       "mystical, 5 notes up",                                   0.4, False, 0.6),
    "checkpoint":     ("soft bell chime, save point resonance, gentle magical tone, "
                       "one-shot",                                               0.3, False, 0.5),
    "invalid_beat":   ("low buzz, short error tone, negative feedback, muted thud", 0.3, False, 0.2),
    "hit":            ("impact hit, player damage sound, percussive thud with rattle", 0.3, False, 0.3),
    "death":          ("descending musical phrase, failure, 3 notes down, sad resolve", 0.4, False, 0.5),
    "level_complete": ("short victory fanfare, magical ascending phrase, triumphant", 0.4, False, 0.8),
}

os.makedirs(OUT_DIR, exist_ok=True)

for name, (prompt, influence, loop, duration) in SOUNDS.items():
    path = f"{OUT_DIR}/{name}.mp3"
    if os.path.exists(path):
        print(f"skip  {name}")
        continue
    try:
        kwargs = dict(
            text=prompt,
            prompt_influence=influence,
            output_format="mp3_44100_192",
        )
        if loop:
            kwargs["loop"] = True
        if duration:
            kwargs["duration_seconds"] = duration
        audio_iter = client.text_to_sound_effects.convert(**kwargs)
        audio_bytes = b"".join(audio_iter)
        with open(path, "wb") as f:
            f.write(audio_bytes)
        print(f"ok    {name}.mp3  ({len(audio_bytes):,} bytes)")
    except Exception as e:
        print(f"FAIL  {name}: {e}")

print("\nDone!")
