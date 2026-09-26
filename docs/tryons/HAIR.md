# HAIR Try-On Tracker

[← Back to master tracker](./README.md) · [← Build plan](./HAIR-PLAN.md)

_Tracking model: hair segmentation (full-strand mask via MediaPipe `ImageSegmenter` confidence mask), point landmarks **nahi** — LIP/EYE/FACE se technically different, aur shared `TryOnEngineBase`/mixins bhi reuse nahi ho sakte as-is. Full research aur proposed architecture [HAIR-PLAN.md](./HAIR-PLAN.md) mein hai, koi bhi code likhne se pehle likha gaya._

> **Build plan**: HAIR is poore try-on feature ka pehla category hai jo face-landmark tracking use hi nahi karta - isko apna alag `ImageSegmenter`-based pixel-segmentation pipeline chahiye, aur isliye shared `TryOnEngineBase`/`withLiveCamera`/`withImageUpload`/render-param type-hierarchy bhi reuse nahi hote, ek parallel hierarchy banani padegi. 4 subcategories (COLOR, HIGHLIGHTS, HENNA, OMBRE) mein se kisi ko bhi drop nahi kiya gaya - sab genuinely visible effect de sakte hain. Suggested build order: COLOR → HENNA → OMBRE → HIGHLIGHTS. Poori reasoning [HAIR-PLAN.md](./HAIR-PLAN.md) mein hai.

> **Per-subcategory tracking**: same convention jo EYE/FACE ke apne tracker docs already establish kar chuke hain - jaise-jaise ek subcategory actually build hoti hai, uski apni dedicated tracker file ban jaati hai aur is file ka apna inline checklist ek summary-row + link se replace ho jaata hai. **HAIR ki saari 4 subcategories ab build ho chuki hain** - [COLOR.md](./COLOR.md), [HENNA.md](./HENNA.md), [OMBRE.md](./OMBRE.md), [HIGHLIGHTS.md](./HIGHLIGHTS.md). HENNA `applyColorHair` ka direct alias nikla (koi naya render code nahi chahiye pada), OMBRE ne COLOR ke mask-compositing primitive mein ek optional root-to-tip alpha-ramp param add kiya, HIGHLIGHTS ne usi param ko ek procedural (fixed-seed) streak-pattern ke liye generalize kiya. Ek real mobile-testing bug (blend-mode luminance-extreme failure, COLOR mein) already surface+fix ho chuka hai. Ye file ab sirf ek index/summary hai, poora detail nahi (FACE.md/EYE.md jaisa hi).

## Summary

| Subcategory | Live     | Upload    | Overall                         |
| ----------- | -------- | --------- | ------------------------------- |
| COLOR       | 0/4      | 4/4       | 50% — [detail](./COLOR.md)      |
| HENNA       | 0/4      | 4/4       | 50% — [detail](./HENNA.md)      |
| OMBRE       | 0/4      | 4/4       | 50% — [detail](./OMBRE.md)      |
| HIGHLIGHTS  | 0/4      | 4/4       | 50% — [detail](./HIGHLIGHTS.md) |
| **Total**   | **0/16** | **16/16** | **50% (16/32)**                 |

## Details

<details>
<summary><strong>COLOR</strong> — 50% — see <a href="./COLOR.md">COLOR.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[COLOR.md](./COLOR.md)**.

</details>

<details>
<summary><strong>HENNA</strong> — 50% — see <a href="./HENNA.md">HENNA.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[HENNA.md](./HENNA.md)**.

</details>

<details>
<summary><strong>OMBRE</strong> — 50% — see <a href="./OMBRE.md">OMBRE.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[OMBRE.md](./OMBRE.md)**.

</details>

<details>
<summary><strong>HIGHLIGHTS</strong> — 50% — see <a href="./HIGHLIGHTS.md">HIGHLIGHTS.md</a> for the full checklist, design notes, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[HIGHLIGHTS.md](./HIGHLIGHTS.md)**.

</details>

---

[← Back to master tracker](./README.md)
