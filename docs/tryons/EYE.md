# EYE Try-On Tracker

[← Back to master tracker](./README.md)

_Tracking model: face landmarks (eye/brow region — precision-heavy, thin lines/lashes). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Build plan**: EYE is the first category with a **color + pattern** dimension (LIP/FACE were color-only) — which subcategories get a pattern, what the pattern options are, and the suggested build order are all planned out in [EYE-PLAN.md](./EYE-PLAN.md), written before any EYE code exists.

> **Per-subcategory tracking**: same convention FACE's own tracker docs already established - as a subcategory actually gets built, it gets its own dedicated tracker file and this file's own inline checklist for it gets replaced with a summary-row + link. EYELINER, KAJAL, EYESHADOW, EYEBROW, and BROWGEL are built so far - [EYELINER.md](./EYELINER.md), [KAJAL.md](./KAJAL.md) (same underlying stroke primitive, per [EYE-PLAN.md](./EYE-PLAN.md)'s own build order - "EYELINER + KAJAL together"), [EYESHADOW.md](./EYESHADOW.md) (a genuinely new region-wash primitive), [EYEBROW.md](./EYEBROW.md) (a real closed-region primitive plus a new procedural hair-stroke technique), [BROWGEL.md](./BROWGEL.md) (color-only, reusing EYEBROW's own fill primitive directly). The other 2 are still the generic placeholder checklist shape every category starts with (see FACE.md's own history).

## Summary

| Subcategory | Live (0/4) | Upload (0/4) | Overall                        |
| ----------- | ---------- | ------------ | ------------------------------ |
| EYEBROW     | 3/4        | 3/4          | 75% — [detail](./EYEBROW.md)   |
| EYELINER    | 3/4        | 3/4          | 75% — [detail](./EYELINER.md)  |
| KAJAL       | 3/4        | 3/4          | 75% — [detail](./KAJAL.md)     |
| EYESHADOW   | 3/4        | 3/4          | 75% — [detail](./EYESHADOW.md) |
| MASCARA     | 0/4        | 0/4          | 0%                             |
| LASHES      | 0/4        | 0/4          | 0%                             |
| BROWGEL     | 3/4        | 3/4          | 75% — [detail](./BROWGEL.md)   |
| **Total**   | **15/28**  | **15/28**    | **53.6% (30/56)**              |

## Details

<details>
<summary><strong>EYEBROW</strong> — 75% — see <a href="./EYEBROW.md">EYEBROW.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[EYEBROW.md](./EYEBROW.md)**.

</details>

<details>
<summary><strong>EYELINER</strong> — 75% — see <a href="./EYELINER.md">EYELINER.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[EYELINER.md](./EYELINER.md)**.

</details>

<details>
<summary><strong>KAJAL</strong> — 75% — see <a href="./KAJAL.md">KAJAL.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[KAJAL.md](./KAJAL.md)**.

</details>

<details>
<summary><strong>EYESHADOW</strong> — 75% — see <a href="./EYESHADOW.md">EYESHADOW.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[EYESHADOW.md](./EYESHADOW.md)**.

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
<summary><strong>BROWGEL</strong> — 75% — see <a href="./BROWGEL.md">BROWGEL.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[BROWGEL.md](./BROWGEL.md)**.

</details>

---

[← Back to master tracker](./README.md)
