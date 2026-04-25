"""Generate all game music and sound effects using ElevenLabs APIs."""
import os
from elevenlabs import ElevenLabs

client = ElevenLabs(api_key=os.environ.get("ELEVENLABS_API_KEY", ""))
OUT_DIR = "assets/audio"

LOOPS = {
    "backing_loop_chill":   ("African jungle groove, 120 BPM exactly, deep rumbling dundun bass, "
                             "soft djembe hand drums, rainstick, distant birdsong, kalabash shakers, "
                             "warm ambient bass drone, mellow organic jungle, seamless loop, full room-filling"),
    "backing_loop":         ("1-bar 4/4 African jungle tribal loop, 120 BPM, wooden drums, "
                             "shakers, kalabash, birdsong, rhythmic hand drums, warm organic, "
                             "deep bass presence, rainstick, full room-filling groove, seamless loop"),
    "backing_loop_intense": ("feral African jungle drum battle, 120 BPM exactly, triple-time djembe "
                             "sprints, rumbling dundun bass, wild shakers, thunder, stampeding "
                             "percussion, savage high-energy, full room-filling, seamless loop"),
}
SOUNDS = {
    "jump":           ("kpanlogo drum hit, Ghanaian bell drum, bright resonant metal-wood "
                       "slap, authentic African percussion accent, ringing hollow tone, "
                       "one-shot, crisp clear pitch", 0.5, False, None),
    "roll":           ("heavy dundun bass drum, deep African talking drum hit, "
                       "resonant thud, rumbling percussion, one-shot",            0.5, False, None),
    "coconut_throw":  ("log drum strike, deep kalabash clatter, tropical wood percussion, "
                       "African rhythm accent, one-shot",                        0.5, False, None),
    "coconut_impact": ("deep kpanlogo drum bass hit, hollow African drum thud, "
                       "low resonant impact, one-shot heavy",                   0.5, False, None),
    "punch":          ("massive djembe bass slap, thunderous African drum punch, "
                       "deep powerful skin hit, one-shot thunder",              0.6, False, None),
    "hoot":           ("African tribal warrior hoot, deep male vocal call, distant "
                       "jungle holler, rhythmic tribal shout, one-shot, African male voice",   0.3, False, None),
    "monkey":         ("African jungle monkey chatter, vervet monkey alarm call, "
                       "screeching primate shriek, one-shot, jungle animal sound",  0.3, False, None),
    "bird":           ("exotic jungle bird call, bright tropical bird chirp, "
                       "African bird whistle, one-shot, ambient wildlife sound",   0.3, False, None),
    "thunder":        ("distant tropical thunder crack, deep rumbling thunder, "
                       "storm lightning rumble, one-shot, atmospheric jungle",     0.3, False, None),
    "chatter":        ("African tribal vocal chants, group male voices chanting, "
                       "ritual drumming rhythm call and response, one-shot, tribal voices",  0.3, False, None),
    "monkey":         ("African jungle monkey chatter, vervet monkey alarm call, "
                       "screeching primate shriek, one-shot, jungle animal sound",  0.3, False, None),
    "bird":           ("exotic jungle bird call, bright tropical bird chirp, "
                       "African bird whistle, one-shot, ambient wildlife sound",   0.3, False, None),
    "thunder":        ("distant tropical thunder crack, deep rumbling thunder, "
                       "storm lightning rumble, one-shot, atmospheric jungle",     0.3, False, None),
    "rain_long":      ("heavy tropical rain, monsoon downpour, pouring rain "
                       "on jungle canopy, ambient looping texture",        0.3, True,  4.0),
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


def generate_music(name, prompt, duration_ms=30000):
    """Generate looping music track using ElevenLabs Music API."""
    path = f"{OUT_DIR}/{name}.mp3"
    if os.path.exists(path):
        print(f"skip  {name}")
        return
    try:
        track_iter = client.music.compose(
            prompt=prompt,
            music_length_ms=duration_ms,
        )
        audio_bytes = b"".join(track_iter)
        with open(path, "wb") as f:
            f.write(audio_bytes)
        print(f"ok    {name}.mp3  ({len(audio_bytes):,} bytes)")
    except Exception as e:
        print(f"FAIL  {name}: {e}")


def generate_sfx(name, prompt, influence, loop, duration):
    """Generate one-shot SFX using ElevenLabs Sound Effects API."""
    path = f"{OUT_DIR}/{name}.mp3"
    if os.path.exists(path):
        print(f"skip  {name}")
        return
    try:
        kwargs = dict(text=prompt, prompt_influence=influence, output_format="mp3_44100_192")
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


# Generate looping music tracks (30s to allow seamless loop)
for name, prompt in LOOPS.items():
    generate_music(name, prompt, duration_ms=30000)

# Then one-shot SFX
for name, (prompt, influence, loop, duration) in SOUNDS.items():
    generate_sfx(name, prompt, influence, loop, duration)

print("\nDone!")
