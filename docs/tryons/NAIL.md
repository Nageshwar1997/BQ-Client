# NAIL Try-On Tracker

[← Back to master tracker](./README.md) · [← Build plan](./NAIL-PLAN.md)

_Tracking model: hand/finger landmarks (MediaPipe `HandLandmarker`, 21 points per hand) — LIP/EYE/FACE ke face-landmark engine se **poori tarah alag engine**, HAIR ke pixel-segmentation engine se bhi alag. Shared `TryOnEngineBase` yahan bhi reuse nahi hota (`HandLandmarkerResult` multiple hands deta hai, `IRenderTargetParams`'s single-`face` shape fit nahi hoti) - lekin `HandLandmarker`'s sync `detect`/`detectForVideo` HAIR ke `ImageSegmenter`'s callback-based complexity jitna divergent nahi hai. Poori research [NAIL-PLAN.md](./NAIL-PLAN.md) mein hai, koi bhi code likhne se pehle likha gaya._

> **Build plan**: NAIL ke liye koi ready-made "nail segmentation" model exist nahi karta (HAIR ke Hair Segmenter jaisa) - iski jagah hand-landmark (fingertip + pehle wale joint) se ek chhota rotated ellipse/rounded-rect approximate kiya jaata hai, har finger ke apne local direction pe. Suggested build order: LIQUID → GEL + DIPPOWDER → GLITTER → CHROME. Poori reasoning [NAIL-PLAN.md](./NAIL-PLAN.md) mein hai.

## Summary

| Subcategory | Live (0/4) | Upload (0/4) | Overall       |
| ----------- | ---------- | ------------ | ------------- |
| LIQUID      | 0/4        | 0/4          | 0%            |
| GEL         | 0/4        | 0/4          | 0%            |
| DIPPOWDER   | 0/4        | 0/4          | 0%            |
| GLITTER     | 0/4        | 0/4          | 0%            |
| CHROME      | 0/4        | 0/4          | 0%            |
| **Total**   | **0/20**   | **0/20**     | **0% (0/40)** |

## Details

<details>
<summary><strong>LIQUID</strong> — 0%</summary>

**Live**

- [ ] Camera capture + hand/finger-landmark tracking wired
- [ ] Standard-finish full-nail color fill real-time me render ho
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + hand/finger-landmark detection static image pe
- [ ] Standard-finish full-nail color fill image pe apply ho
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>GEL</strong> — 0%</summary>

**Live**

- [ ] Camera capture + hand/finger-landmark tracking wired
- [ ] Glossy full-nail color fill real-time me render ho
- [ ] Shade/variant picker functional (product variants se linked)
- [ ] Performance & cross-device QA (FPS, hand pose variation)

**Upload**

- [ ] Photo upload + hand/finger-landmark detection static image pe
- [ ] Glossy full-nail color fill image pe apply ho
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>DIPPOWDER</strong> — 0%</summary>

**Live**

- [ ] Camera capture + hand/finger-landmark tracking wired
- [ ] Matte-textured full-nail color fill real-time me render ho
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + hand/finger-landmark detection static image pe
- [ ] Matte-textured full-nail color fill image pe apply ho
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>GLITTER</strong> — 0%</summary>

**Live**

- [ ] Camera capture + hand/finger-landmark tracking wired
- [ ] Sparkle-particle overlay nail fill pe real-time me render ho
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + hand/finger-landmark detection static image pe
- [ ] Sparkle-particle overlay nail fill pe image pe apply ho
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>CHROME</strong> — 0%</summary>

**Live**

- [ ] Camera capture + hand/finger-landmark tracking wired
- [ ] Mirror-metallic reflective overlay nail fill pe real-time me render ho
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + hand/finger-landmark detection static image pe
- [ ] Mirror-metallic reflective overlay nail fill pe image pe apply ho
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

---

[← Back to master tracker](./README.md) · [← Build plan](./NAIL-PLAN.md)
