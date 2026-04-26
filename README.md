# Rhythm Kingdom

**Movement is manual. Actions are rhythm-locked. Power-ups unlock new notes in the loop.**

> **ElevenHacks Hackathon** — A browser-based action-platformer where the beat drives everything.

[![Play](https://img.shields.io/badge/Play-rhythm--kingdom.pages.dev-brightgreen?style=flat-square&logo=googlechrome&logoColor=white)](https://rhythm-kingdom.pages.dev)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Sound%20Effects%20%2B%20Music-FF6B35?style=flat-square&logoColor=white)](https://elevenlabs.io)
[![Phaser](https://img.shields.io/badge/Phaser-3.60-blueviolet?style=flat-square&logoColor=white)](https://phaser.io)
[![Web Audio](https://img.shields.io/badge/Web%20Audio%20API-sample--accurate-orange?style=flat-square&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-ES6-yellow?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![ElevenHacks](https://img.shields.io/badge/Built%20for-ElevenHacks-FF6B35?style=flat-square&logoColor=white)](https://elevenlabs.io)

> You move the monkey. The runes move the world.
>
> Place action runes into beat wells. They fire on the rhythm — jump over water, roll under gaps, throw coconuts at enemies. Every successful action plays an ElevenLabs-generated stem. The soundtrack evolves as you unlock power.

<p align="center">
  <img src="cover-art.png" alt="Rhythm Kingdom — A Monkey's Rhythm Journey" width="800" />
</p>

---

## Table of Contents

- [What is Rhythm Kingdom?](#what-is-rhythm-kingdom)
- [How It Works](#how-it-works)
- [Key Features](#key-features)
- [Rune System](#rune-system)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Running Locally](#running-locally)
- [ElevenLabs Integration](#elevenlabs-integration)
- [License](#license)

---

## What is Rhythm Kingdom?

Rhythm Kingdom is a **split-controller action-puzzle platformer** built entirely in the browser — no backend, no bundler, no build step.

You control the monkey manually with A/D or arrow keys. But jumps, rolls, and coconut throws only happen on the beat — placed as runes in a sequencer panel at the top of the screen. Stack two JUMP runes for a double jump. Chain ROLL into a gap. Time your coconut throw to hit a snake mid-patrol.

The ElevenLabs Sound Effects API generated every audio stem in the game — retro percussion, ambient jungle sounds, action SFX, and three full backing tracks (Chill, Groove, Intense).

---

## How It Works

**1. Place Runes** — Click the beat wells at the top of the screen to cycle through available runes (JUMP, ROLL, COCONUT). Each well corresponds to a beat in the loop.

**2. The Beat Fires** — At 120 BPM, the sequencer advances through your wells. When it hits a filled slot, the action executes — no button press needed.

**3. Move Freely** — Use A/D or ← / → to move the monkey left and right at any time. Timing the movement with your rune placement is the core skill.

**4. Unlock Runes** — Collect rune shards hidden in the levels to unlock new abilities. Start with JUMP and ROLL. Unlock COCONUT throw in level 2.

**5. Survive** — Snakes mean instant death. Water pits require precise jumping. Wide gaps need double jumps. Roll under the standing pillar.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Rune Sequencer** | 2–8 configurable beat wells — place and cycle runes to schedule actions |
| **Double Jump** | Stack JUMP in two consecutive wells for a higher arc — max 2 in a row |
| **Party Lights** | Full-screen colour pulse on every beat — white, red, yellow, green cycling |
| **Fruit Collectibles** | Melons scattered on elevated platforms — collect for score |
| **Enemy System** | Snakes and lizards patrol the ground — touch = instant death + restart |
| **6 Music Variants** | 3 tracks (Chill / Groove / Intense) × 2 variants each (A/B) — switch anytime via gear ⚙ menu |
| **Session Persistence** | Well count and music track survive death and level transitions |
| **Tutorial Overlays** | Contextual hints appear as you reach key moments — dismiss with E |
| **Procedural Art** | All game sprites generated at runtime via Phaser Graphics — zero image assets for gameplay |

---

## Rune System

```
JUMP    — leaps the monkey over water pits and gaps
ROLL    — ground dash with reduced hitbox, slides under pillars
COCONUT — throws a spinning coconut that kills enemies on impact
```

**Unlock progression:**
- **Level 1 — The Root Gate:** JUMP + ROLL
- **Level 2 — Temple of Echoes:** + COCONUT (collect rune shard)
- **Level 3 — Canopy Heart:** All runes active

**Double jump:** Place JUMP in two consecutive wells. Second JUMP fires in the air with higher force. Three consecutive JUMPs blocked — max 2.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Game Engine** | Phaser 3.60 — WebGL/Canvas, arcade physics, CDN-loaded |
| **Audio** | Web Audio API — sample-accurate scheduling, synth fallbacks |
| **Sound Generation** | ElevenLabs Sound Effects API (`eleven_text_to_sound_v2`) |
| **Music Generation** | ElevenLabs Music API (`music.compose`) |
| **Language** | Vanilla JS ES6 — no bundler, no TypeScript, `window.RK` namespace |
| **Fonts** | Cinzel Decorative + Press Start 2P — self-hosted woff2 |
| **Deploy** | Cloudflare Pages — static, unlimited bandwidth |
| **Audio Script** | Python 3 + ElevenLabs SDK (`generate_audio.py`) |

---

## Screenshots

**Home Screen — Title & How To Play**
<p align="center">
  <img src="images/screenshot-menu.png" alt="Rhythm Kingdom title screen — dancing monkey with maracas, HOW TO PLAY panel, green PLAY button, jungle parallax background" width="700" />
</p>

**Level 1 — Jungle Platforming**
<p align="center">
  <img src="images/screenshot-level1.png" alt="Level 1 gameplay — monkey on floating jungle platform, 8 octagonal beat wells at top with JUMP/ROLL/COCONUT runes, fruit collectibles, water below" width="700" />
</p>

**Rune Tutorial — Rolling Under the Gap**
<p align="center">
  <img src="images/screenshot-wells.png" alt="Tutorial overlay: Place a ROLL rune — monkey sliding under a tall standing pillar" width="700" />
</p>

**Mid-Air — Jump + Coconut Throw**
<p align="center">
  <img src="images/screenshot-doublejump.png" alt="Monkey mid-air above jungle platforms, all 8 beat wells filled, coconut projectile in flight" width="700" />
</p>

---

## Running Locally

No build step. Pure static files.

```bash
# Clone
git clone https://github.com/padmanabhan-r/Rhythm-Kingdom
cd Rhythm-Kingdom

# Start local server (audio requires HTTP, not file://)
./start.sh
# or: python3 -m http.server 8080

# Open browser
open http://localhost:8080
```

### Generate Audio Assets (optional)

Audio files are pre-generated and committed. Regenerate only if you want new stems:

```bash
pip install elevenlabs
ELEVENLABS_API_KEY=your_key python3 generate_audio.py
```

> Game runs without WAV/MP3 files — AudioManager synth fallbacks cover every key.

### Deploy to Cloudflare Pages

```bash
./deploy.sh
# or: wrangler pages deploy . --project-name rhythm-kingdom --commit-dirty=true
```

---

## ElevenLabs Integration

| Product | Usage |
|---------|-------|
| **Sound Effects API** | Generated all 23 game SFX — jump, roll, coconut throw, hit, death, checkpoint, level complete, ambient jungle sounds |
| **Music API** | 6 backing tracks: Chill / Groove / Intense × 2 variants (A/B) — African jungle drum compositions at 120 BPM |
| **Text-to-Sound** | Menu music — wild African jungle ambience with monkey calls, djembe percussion, dundun bass |

All audio generated with `eleven_text_to_sound_v2`. Prompts use audio terminology: `one-shot`, `loop`, `stem`, `120 BPM`, `African jungle`, `djembe`, `dundun`, `seamless loop`.

---

## License

<p>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" />
  </a>
</p>

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

<p align="center">
  <i>Powered by the Rhythm of ElevenLabs &nbsp;|&nbsp; Developed using Zed</i>
</p>
