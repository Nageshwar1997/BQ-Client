# HAIR Try-On Tracker

[← Back to master tracker](./README.md) · [← Build plan](./HAIR-PLAN.md)

_Tracking model: hair segmentation (full-strand mask via MediaPipe `ImageSegmenter` confidence mask), point landmarks **nahi** — LIP/EYE/FACE se technically different, aur shared `TryOnEngineBase`/mixins bhi reuse nahi ho sakte as-is. Full research aur proposed architecture [HAIR-PLAN.md](./HAIR-PLAN.md) mein hai, koi bhi code likhne se pehle likha gaya._

> **Build plan**: HAIR is poore try-on feature ka pehla category hai jo face-landmark tracking use hi nahi karta - isko apna alag `ImageSegmenter`-based pixel-segmentation pipeline chahiye, aur isliye shared `TryOnEngineBase`/`withLiveCamera`/`withImageUpload`/render-param type-hierarchy bhi reuse nahi hote, ek parallel hierarchy banani padegi. 4 subcategories (COLOR, HIGHLIGHTS, HENNA, OMBRE) mein se kisi ko bhi drop nahi kiya gaya - sab genuinely visible effect de sakte hain. Suggested build order: COLOR → HENNA → OMBRE → HIGHLIGHTS. Poori reasoning [HAIR-PLAN.md](./HAIR-PLAN.md) mein hai.

## Summary

| Subcategory | Live (0/4) | Upload (0/4) | Overall       |
| ----------- | ---------- | ------------ | ------------- |
| COLOR       | 0/4        | 0/4          | 0%            |
| HIGHLIGHTS  | 0/4        | 0/4          | 0%            |
| HENNA       | 0/4        | 0/4          | 0%            |
| OMBRE       | 0/4        | 0/4          | 0%            |
| **Total**   | **0/16**   | **0/16**     | **0% (0/32)** |

## Details

<details>
<summary><strong>COLOR</strong> — 0%</summary>

**Live**

- [ ] Camera capture + full hair-segmentation mask wired
- [ ] Full-strand recolor blend real-time me render ho
- [ ] Shade/variant picker functional (product variants se linked)
- [ ] Performance & cross-device QA (FPS, lighting conditions)

**Upload**

- [ ] Photo upload + full hair-segmentation mask static image pe
- [ ] Full-strand recolor blend image pe apply ho
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>HIGHLIGHTS</strong> — 0%</summary>

**Live**

- [ ] Camera capture + hair-segmentation mask wired
- [ ] Partial-strand streak recolor real-time me render ho
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + hair-segmentation mask static image pe
- [ ] Partial-strand streak recolor image pe apply ho
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>HENNA</strong> — 0%</summary>

**Live**

- [ ] Camera capture + hair-segmentation mask wired
- [ ] Full-strand warm reddish-brown recolor natural texture ke saath real-time me render ho
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + hair-segmentation mask static image pe
- [ ] Full-strand warm reddish-brown recolor image pe apply ho
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>OMBRE</strong> — 0%</summary>

**Live**

- [ ] Camera capture + hair-segmentation mask wired
- [ ] Root-to-tip gradient recolor real-time me render ho
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + hair-segmentation mask static image pe
- [ ] Root-to-tip gradient recolor image pe apply ho
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

---

[← Back to master tracker](./README.md)
