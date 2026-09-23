# EYE Try-On Tracker

[← Back to master tracker](./README.md)

_Tracking model: face landmarks (eye/brow region — precision-heavy, thin lines/lashes). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Build plan**: EYE pehli category hai jisme **color + pattern** dono dimension hain (LIP/FACE dono color-only the) — kaunsi subcategories ko pattern milega, pattern options kya hain, aur suggested build order sab [EYE-PLAN.md](./EYE-PLAN.md) mein planned hai, koi bhi EYE code likhne se pehle likha gaya.

> **Per-subcategory tracking**: same convention jo FACE ke apne tracker docs already establish kar chuke hain - jaise-jaise ek subcategory actually build hoti hai, uski apni dedicated tracker file ban jaati hai aur is file ka apna inline checklist ek summary-row + link se replace ho jaata hai. **Saari 7 EYE subcategories ab build ho chuki hain** - [EYELINER.md](./EYELINER.md), [KAJAL.md](./KAJAL.md) (same underlying stroke primitive, [EYE-PLAN.md](./EYE-PLAN.md) ke apne build order ke hisaab se - "EYELINER + KAJAL together"), [EYESHADOW.md](./EYESHADOW.md) (ek genuinely nayi region-wash primitive), [EYEBROW.md](./EYEBROW.md) (ek real closed-region primitive plus ek nayi procedural hair-stroke technique), [BROWGEL.md](./BROWGEL.md) (color-only, EYEBROW ka apna fill primitive directly reuse karta hai), [MASCARA.md](./MASCARA.md) (ek genuinely nayi curved lash-stroke primitive), [LASHES.md](./LASHES.md) (MASCARA ka apna lash-stroke primitive directly reuse karta hai, ek shared `ILashStrokeTuning` shape mein generalized).

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
