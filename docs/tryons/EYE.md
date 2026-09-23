# EYE Try-On Tracker

[← Back to master tracker](./README.md)

_Tracking model: face landmarks (eye/brow region — precision-heavy, thin lines/lashes). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Build plan**: EYE is the first category with a **color + pattern** dimension (LIP/FACE were color-only) — which subcategories get a pattern, what the pattern options are, and the suggested build order are all planned out in [EYE-PLAN.md](./EYE-PLAN.md), written before any EYE code exists.

> **Per-subcategory tracking**: same convention FACE's own tracker docs already established - as a subcategory actually gets built, it gets its own dedicated tracker file and this file's own inline checklist for it gets replaced with a summary-row + link. **All 7 EYE subcategories are now built** - [EYELINER.md](./EYELINER.md), [KAJAL.md](./KAJAL.md) (same underlying stroke primitive, per [EYE-PLAN.md](./EYE-PLAN.md)'s own build order - "EYELINER + KAJAL together"), [EYESHADOW.md](./EYESHADOW.md) (a genuinely new region-wash primitive), [EYEBROW.md](./EYEBROW.md) (a real closed-region primitive plus a new procedural hair-stroke technique), [BROWGEL.md](./BROWGEL.md) (color-only, reusing EYEBROW's own fill primitive directly), [MASCARA.md](./MASCARA.md) (a genuinely new curved lash-stroke primitive), [LASHES.md](./LASHES.md) (reuses MASCARA's own lash-stroke primitive directly, generalized into a shared `ILashStrokeTuning` shape).

## Summary

| Subcategory | Live (0/4) | Upload (0/4) | Overall                        |
| ----------- | ---------- | ------------ | ------------------------------ |
| EYEBROW     | 3/4        | 3/4          | 75% — [detail](./EYEBROW.md)   |
| EYELINER    | 3/4        | 3/4          | 75% — [detail](./EYELINER.md)  |
| KAJAL       | 3/4        | 3/4          | 75% — [detail](./KAJAL.md)     |
| EYESHADOW   | 3/4        | 3/4          | 75% — [detail](./EYESHADOW.md) |
| MASCARA     | 3/4        | 3/4          | 75% — [detail](./MASCARA.md)   |
| LASHES      | 3/4        | 3/4          | 75% — [detail](./LASHES.md)    |
| BROWGEL     | 3/4        | 3/4          | 75% — [detail](./BROWGEL.md)   |
| **Total**   | **21/28**  | **21/28**    | **75% (42/56)**                |

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
<summary><strong>MASCARA</strong> — 75% — see <a href="./MASCARA.md">MASCARA.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[MASCARA.md](./MASCARA.md)**.

</details>

<details>
<summary><strong>LASHES</strong> — 75% — see <a href="./LASHES.md">LASHES.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[LASHES.md](./LASHES.md)**.

</details>

<details>
<summary><strong>BROWGEL</strong> — 75% — see <a href="./BROWGEL.md">BROWGEL.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[BROWGEL.md](./BROWGEL.md)**.

</details>

---

[← Back to master tracker](./README.md)
