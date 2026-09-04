# EYE Try-On Tracker

[← Back to master tracker](./README.md)

_Tracking model: face landmarks (eye/brow region — precision-heavy, thin lines/lashes). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Build plan**: EYE is the first category with a **color + pattern** dimension (LIP/FACE were color-only) — which subcategories get a pattern, what the pattern options are, and the suggested build order are all planned out in [EYE-PLAN.md](./EYE-PLAN.md), written before any EYE code exists.

> **Per-subcategory tracking**: same convention FACE's own tracker docs already established - as a subcategory actually gets built, it gets its own dedicated tracker file and this file's own inline checklist for it gets replaced with a summary-row + link. EYELINER is the first one built - [EYELINER.md](./EYELINER.md). The other 6 are still the generic placeholder checklist shape every category starts with (see FACE.md's own history).

## Summary

| Subcategory | Live (0/4) | Upload (0/4) | Overall                       |
| ----------- | ---------- | ------------ | ----------------------------- |
| EYEBROW     | 0/4        | 0/4          | 0%                            |
| EYELINER    | 3/4        | 3/4          | 75% — [detail](./EYELINER.md) |
| KAJAL       | 0/4        | 0/4          | 0%                            |
| EYESHADOW   | 0/4        | 0/4          | 0%                            |
| MASCARA     | 0/4        | 0/4          | 0%                            |
| LASHES      | 0/4        | 0/4          | 0%                            |
| BROWGEL     | 0/4        | 0/4          | 0%                            |
| **Total**   | **3/28**   | **3/28**     | **10.7% (6/56)**              |

## Details

<details>
<summary><strong>EYEBROW</strong> — 0%</summary>

**Live**

- [ ] Camera capture + brow-region landmark tracking wired
- [ ] Brow-hair stroke fill rendered along brow shape in real-time
- [ ] Shade/variant picker functional (linked to product variants)
- [ ] Performance & cross-device QA (FPS, lighting conditions)

**Upload**

- [ ] Photo upload + brow-region landmark detection on static image
- [ ] Brow-hair stroke fill applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>EYELINER</strong> — 75% — see <a href="./EYELINER.md">EYELINER.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[EYELINER.md](./EYELINER.md)**.

</details>

<details>
<summary><strong>KAJAL</strong> — 0%</summary>

**Live**

- [ ] Camera capture + waterline/inner-rim tracking wired
- [ ] Soft smudged stroke rendered along waterline in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + waterline/inner-rim detection on static image
- [ ] Soft smudged stroke applied along waterline on image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>EYESHADOW</strong> — 0%</summary>

**Live**

- [ ] Camera capture + eyelid-region landmark tracking wired
- [ ] Lid-region color-wash blend rendered in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + eyelid-region landmark detection on static image
- [ ] Lid-region color-wash blend applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>MASCARA</strong> — 0%</summary>

**Live**

- [ ] Camera capture + lash-strand tracking wired
- [ ] Lash darkening/volumizing overlay rendered in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + lash-strand detection on static image
- [ ] Lash darkening/volumizing overlay applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>LASHES</strong> — 0%</summary>

**Live**

- [ ] Camera capture + lash-line tracking wired
- [ ] False-lash strip/extension overlay rendered along lash line in real-time
- [ ] Shade/variant picker functional (style/length variants)
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + lash-line detection on static image
- [ ] False-lash strip/extension overlay applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>BROWGEL</strong> — 0%</summary>

**Live**

- [ ] Camera capture + brow-region landmark tracking wired
- [ ] Brow-hair tint + hold/texture overlay rendered in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + brow-region landmark detection on static image
- [ ] Brow-hair tint + hold/texture overlay applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

---

[← Back to master tracker](./README.md)
