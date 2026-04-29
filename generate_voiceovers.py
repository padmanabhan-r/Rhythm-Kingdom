import os
from elevenlabs import ElevenLabs

VOICE_ID = "oRHa7giAMnOuk9e9YaM3"
MODEL = "eleven_multilingual_v2"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "assets", "audio")

LINES = [
    ("vo_title",  "Rhythm Kingdom"),
    ("vo_level1", "Level 1: The Root Gate"),
    ("vo_level2", "Level 2: Temple of Echoes"),
    ("vo_level3", "Level 3: Canopy Heart"),
    ("vo_win",    "You got the rhythm. The jungle bows to the beat."),
]

def main():
    api_key = os.environ.get("ELEVENLABS_API_KEY")
    if not api_key:
        raise ValueError("ELEVENLABS_API_KEY not set")

    client = ElevenLabs(api_key=api_key)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for name, text in LINES:
        out_path = os.path.join(OUTPUT_DIR, f"{name}.mp3")
        print(f"Generating {name}...")
        audio_iter = client.text_to_speech.convert(
            voice_id=VOICE_ID,
            text=text,
            model_id=MODEL,
            output_format="mp3_44100_128",
        )
        audio_bytes = b"".join(audio_iter)
        with open(out_path, "wb") as f:
            f.write(audio_bytes)
        print(f"  Saved -> {out_path} ({len(audio_bytes):,} bytes)")

    print("Done.")

if __name__ == "__main__":
    main()
