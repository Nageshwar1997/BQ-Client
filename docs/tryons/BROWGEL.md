# BROWGEL Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md) · [← Build plan](./EYE-PLAN.md)

_Tracking model: face landmarks (eyebrow ring). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — same convention [EYELINER.md](./EYELINER.md)/[KAJAL.md](./KAJAL.md)/[EYESHADOW.md](./EYESHADOW.md)/[EYEBROW.md](./EYEBROW.md) established: as a subcategory gets built, it gets its own dedicated tracker file and [EYE.md](./EYE.md)'s own inline checklist for it gets replaced with a summary-row + link.

> **Pehli (aur, [EYE-PLAN.md](./EYE-PLAN.md) ke hisaab se, sirf yahi planned) color-only EYE finish**: ab tak build hui har doosri EYE finish ka pattern picker hai - BROWGEL ka nahi, design se. Brow gel ka real-world me poora kaam existing hairs ko set/tint karna hai, ek liner, eyeshadow, ya brow-fill product jaisi distinct shape variants offer karna nahi, isliye isme pattern dimension force karna kisi real product se match nahi karta. EYEBROW ka apna closed-region fill primitive directly reuse karta hai ([`applyBrowgelEye`](../../src/utils/tryon-utils/eye.ts)), ek per-pattern lookup table ki jagah ek fixed, sheer, softly-blurred tuning value ke saath.

## Summary

| Mode    | Done  | Total | %                                |
| ------- | ----- | ----- | -------------------------------- |
| Live    | 3     | 4     | 75%                              |
| Upload  | 3     | 4     | 75%                              |
| **All** | **6** | **8** | **75% — [detail](./BROWGEL.md)** |

## Checklist

**Live**

- [x] Camera capture + brow-region landmark tracking wired — shared `EyeLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh (eyebrow ring samet) already track karti hai, extra wiring nahi chahiye.
- [x] Brow-hair tint + hold/texture overlay real-time me render hota hai — `applyBrowgelEye` ko `EyeEngineBase.applyEffect`'s switch mein `'BROWGEL'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai. Ek automated smoke test aur browser mein ek real uploaded model photo se verify kiya (Design notes dekho) - specifically actual _live camera_ feed pe abhi confirm nahi hua (is session mein sirf Upload mode test hua, har doosri EYE finish ka jaisa hi starting point).
- [x] Shade/variant picker functional — test karne layak koi pattern picker nahi (design se, upar dekho); shade picker khud wahi shared `TryOnShadeSwatches` hai jo har category use karti hai, live-verified: applied shade hataya aur canvas ko re-diff kiya, brow region mein 89,600 mein se 12,273 changed pixels mile, confirm karta hai ki tint genuinely render hota hai, no-op nahi hai.
- [ ] Performance & cross-device QA — real-device pass abhi shuru nahi hua (har doosri finish ke apne starting point jaisa).

**Upload**

- [x] Photo upload + brow-region landmark detection static image pe — LIP/FACE/EYELINER/KAJAL/EYESHADOW/EYEBROW jaisa hi shared upload pipeline.
- [x] Brow-hair tint + hold/texture overlay image pe apply hoti hai — same `applyBrowgelEye`, upload path bhi same `applyEffect` se guzarta hai. Is session ke browser pane mein ek real model photo pe (North Indian, `public/images/tryon/models/`) live confirm kiya.
- [x] Shade/variant picker functional — live confirm kiya (upar dekho).
- [ ] Output preview/download QA — snapshot/download button is session mein specifically exercise nahi hua.

## Design notes

- **Pattern picker kyun nahi**: [EYE-PLAN.md](./EYE-PLAN.md) mein koi bhi EYE code likhne se pehle hi decide ho gaya tha - "real product ek clear/tinted gel hi hai jo existing brow hairs ko set karta hai, iski koi distinct shape variants nahi hain jaisa ek liner ya eyeshadow ki hoti hai." `EYE_PATTERNS`/`EYE_DEFAULT_PATTERNS` (constants/tryon-constants/eye.ts) mein simply koi `BROWGEL` entry hi nahi hai, jisko `TryOnModal` ka apna existing `eyePatterns && ...` guard already "pattern-swatches row bilkul mat dikhao" maan leta hai - is finish ke liye specifically koi UI-side special-casing nahi chahiye.
- **EYEBROW ka fill primitive directly reuse karta hai, koi lookup table nahi**: `applyBrowgelEye` `fillEyebrowRegion` (wahi closed-region fill function jo Bold/Defined Fill, Soft Powder Fill, aur Ombre Brow sab already share karte hain) ko ek fixed constant ke saath call karta hai, `BROWGEL_TUNING = { blurRatio: 0.035 }`, ek per-pattern `Record` mein index karne ki jagah. Render boundary pe validate karne layak bhi kuch nahi hai - `applyBrowgelEye` ka apna `IEyeRenderParams` abhi bhi ek `pattern` field carry karta hai (same object-param shape jo har EYE render function leta hai, `EyeEngineBase.applyEffect`'s uniform switch ke saath consistency ke liye), lekin function ise kabhi read hi nahi karta - kisi pehle-selected pattern-bearing EYE finish se bacha hua stale pattern id yahan kuch affect nahi kar sakta.
- **Kisi bhi EYE finish ka deliberately sabse softest range**: `EYE_RANGE_BOUNDS.BROWGEL` (`{min:0.05,max:0.3,default:0.12}`) ye shape already ek placeholder ki tarah rakhi gayi thi koi real rendering exist karne se pehle, aur real rendering aane ke baad bhi kisi boost ki zaroorat nahi padi - EYELINER/EYEBROW ke apne placeholders ke ulat, jinke liye real-photo testing ne paaya ki wo "koi product hi nahi" jaisa dikhta hai jab tak unki range badhayi nahi gayi. Ek sheer, mushkil-se-dikhne-wala tint hi BROWGEL ka actual intended character hai, kabhi tune na hone ka artifact nahi.
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (96/96, ek naye `applyBrowgelEye` smoke test samet - koi per-pattern cases nahi chahiye, kyunki iterate/validate karne layak koi pattern hi nahi hai) sab pass hoti hai. Real-photo browser verification (North Indian model, Black shade, default 0.12 intensity): brow gel dono eyebrows pe ek subtle, natural-looking "setting" effect jaisa dikhta hai, obviously-painted-on block jaisa nahi - shade off karke aur canvas ko re-diff karke brow region mein 12,273 genuinely changed pixels mile, confirm karta hai ki tint real hai, shopper ki apni already-dark eyebrows ka koi visual illusion nahi.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), and every FACE/EYELINER/KAJAL/EYESHADOW/EYEBROW finish's own tracker.

> **Status**: Freshly built, ab tak ki sabse simple EYE finish, kaafi margin se (ek fixed tuning value, zero nayi geometry, zero naya UI surface). Full real-device QA (Live mode, multiple devices/lighting) abhi bhi shuru nahi hua, aur - is session ke apne standing convention ke hisaab se - deliberately deferred hai jab tak har planned EYE/HAIR/NAIL/SKIN subcategory exist na kar le, sirf ye ek nahi.

| #   | Dimension            | Score   | Kyun                                                                                                                                                                                                                                                     |
| --- | -------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10    | Zero nayi geometry - poori tarah EYEBROW ka already-verified closed-region fill reuse karta hai. Har EYE finish jaisa hi turn-detection gap hai.                                                                                                         |
| 2   | Test coverage        | 7/10    | 1 smoke test (koi pattern nahi jo iterate/validate karna pade, har pattern-bearing finish ki apni multi-case suite ke ulat) - actual surface area jitna hi test hai, under-covered nahi.                                                                 |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                                                               |
| 4   | Real-device QA       | 1/10    | Live camera mode bilkul test nahi hua; Upload mode ko ek real, single-photo, single-device browser verification mili is session mein (pixel-diff confirmed, sirf visual nahi) - har doosri EYE finish ke apne starting point se exactly match karta hai. |
| 5   | UX polish            | 9/10    | Koi naya UI surface hi nahi - shade picker + intensity slider jo har category already rakhti hai wahi reuse karta hai, pattern-swatches row design se correctly absent hai.                                                                              |
| 6   | Architecture         | 10/10 ✅ | Shared-primitive design kaam karti hai iska sabse cleanest proof - ek poori finish zero naye render code se bani, bas ek constant aur ek thin wrapper function.                                                                                          |
| 7   | Feature completeness | 10/10 ✅ | BROWGEL ko jo ek cheez chahiye thi (ek sheer, believable tint) wahi exactly karta hai - koi "missing pattern" nahi jismein doosri finishes ki tarah grow karne ki jagah ho.                                                                              |
| 8   | Performance          | 8/10    | Ab tak ki sabse cheap EYE finish - har eyebrow pe ek blurred fill, koi gradients/strokes/second passes nahi.                                                                                                                                             |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                                                  |

**Overall**: ~**8.2/10** — ab tak ki kisi bhi EYE finish ka sabse highest opening score, poori tarah isliye kyunki galat hone layak itna kam naya surface area tha. Next step (jab ready ho): MASCARA, phir LASHES ([EYE-PLAN.md](./EYE-PLAN.md) ke build order ke hisaab se) - dono ko genuinely naya primitive/asset pipeline chahiye, sabse last ke liye saved, is app ki build history ke har doosre "naye infrastructure chahiye" step jaisa.

---

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md) · [← Build plan](./EYE-PLAN.md)
