# HIGHLIGHTS (HAIR) Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to HAIR category](./HAIR.md) · [← Build plan](./HAIR-PLAN.md)

_Tracking model: pixel segmentation (MediaPipe `ImageSegmenter`, hair-confidence mask) - COLOR ka exact wahi engine/rendering stack reuse karta hai, koi naya infra nahi. Poori reasoning [HAIR-PLAN.md](./HAIR-PLAN.md#engine-architecture---shared-tryonenginebase-reuse-nahi-ho-sakta-as-is) mein hai._

> **HAIR ka chautha aur aakhri built finish - poori category ab 100% (saari 4 subcategories) build ho chuki hai**. Ek confidence mask sirf "ye pixel hair hai" batata hai, kabhi "ye kaunsi strand hai" nahi - isliye real per-strand highlighting possible nahi hai ([HAIR-PLAN.md](./HAIR-PLAN.md#subcategories--technique-buildability-aur-final-decision)'s apna honest ceiling). `applyHighlightsHair` (`utils/tryon-utils/hair.ts`) ek procedural soft-streak pattern (fixed-seed PRNG se, kabhi `Math.random()` nahi - EYEBROW ke hair-stroke patterns jaisa hi "deterministic jitter" precedent) ko hair confidence mask ke saath multiply karta hai, taaki sirf kuch columns recolor hon, poora hair nahi - COLOR/HENNA/OMBRE jaisa hi mask + `destination-in` + blend mechanism, bas ek naya per-pixel alpha-multiplier layer.

## Summary

| Mode    | Done  | Total | %                                   |
| ------- | ----- | ----- | ----------------------------------- |
| Live    | 0     | 4     | 0%                                  |
| Upload  | 4     | 4     | 100%                                |
| **All** | **4** | **8** | **50% — [detail](./HIGHLIGHTS.md)** |

## Checklist

**Live**

- [ ] Camera capture + full hair-segmentation mask wired - COLOR/HENNA/OMBRE ka hi `HairLiveEngine`/`withLiveCameraSegmentation`, koi finish-specific difference nahi hai is layer pe.
- [ ] Partial-strand streak recolor real-time me render ho - `applyHighlightsHair` `HairEngineBase.applyEffect`'s switch se wired - Live-specific execution abhi untested. Live mode mein ye specifically test karne layak hai kyunki streak pattern ka horizontal anchor (mask ka detected width) har frame recompute hota hai - jab tak wahi seed + wahi mask dimensions rahen, pattern stable rehna chahiye, lekin ye sirf Live pe hi genuinely confirm hota hai.
- [ ] Variant/intensity picker functional - engine-level `setMakeupState({color, range})` script se verified - real product page ke through abhi exercise nahi hua.
- [ ] Performance & cross-device QA - shuru nahi hua (standing convention - dekho [tryon-qa-deferred-until-all-built memory], sabhi categories ban jaane tak deferred).

**Upload**

- [x] Photo upload + full hair-segmentation mask static image pe - COLOR ka hi already-verified pipeline.
- [x] Partial-strand streak recolor image pe apply ho - do tarike se verify kiya: (1) synthetic unit tests - ek full-confidence mask pe sampled columns mein kam se kam ek near-original (streak ke beech) aur ek clearly-shifted (streak ka center) mila, aur ek determinism test confirm karta hai ki same mask size se hamesha bit-for-bit same pattern aata hai; (2) real model photo (`North-Indian.webp`) pe ek golden-blonde shade try kiya - screenshot se confirm kiya ki genuine partial streak patches dikhte hain, poora hair uniformly recolor nahi hota.
- [x] Shade/variant picker functional - engine-level verified (`setMakeupState` se color change karke re-render confirm kiya).
- [x] Output preview/download QA - COLOR ka hi already-verified `takeSnapshot()` path.

## Design notes

- **`buildMaskAlphaLayer` ko generalize kiya - row-based se full per-pixel multiplier**: OMBRE ke liye pehle ek `rowAlphaMultiplier: Float32Array` (length = mask.height) tha - HIGHLIGHTS ka pattern column-based hai, row-based nahi, isliye is param ko ek full per-pixel `alphaMultiplier: Float32Array` (length = mask.data.length, same shape jo `mask.data` khud use karta hai) mein generalize kiya. `buildMaskAlphaLayer` khud ab ye nahi jaanta ki multiplier row-based hai ya column-based - `applyOmbreHair` apna value `.fill()` se poori row mein broadcast karta hai, `applyHighlightsHair` apna `.set()` se poore column pattern ko har row mein repeat karta hai. Dono COLOR/HENNA jaisa hi (`undefined` → har pixel apni full confidence pe).
- **Fixed-seed PRNG, `Math.random()` nahi**: `createSeededRandom` (mulberry32) ek fixed constant seed (`HIGHLIGHTS_STREAK_SEED = 20260101`) se deterministic values deta hai - koi bhi do calls same seed ke saath bit-for-bit same sequence dete hain. Ye zaroori hai kyunki Live mode har frame `applyEffect` fresh call karta hai - agar streak positions `Math.random()` se aate, to har frame ek naya random arrangement milta (flicker/chaos), jabki fixed seed ka matlab hai same streaks hamesha same jagah - EYEBROW ke apne procedural hair-stroke patterns (Natural Hair-Stroke/Feathered-Fluffy) ka bhi yehi "deterministic per-stroke jitter" precedent tha.
- **Streak geometry: mask ke detected horizontal extent pe anchored, poore mask width pe nahi**: `findHairHorizontalExtent` (OMBRE ke `findHairVerticalExtent` ka horizontal mirror, same shared `HAIR_EXTENT_CONFIDENCE_THRESHOLD`) mask ke confident-hair columns ka min/max find karta hai - streak centers/widths isi range ke andar generate hote hain, poore frame width mein nahi (jisme background bhi hota). Har streak ek raised-cosine falloff (soft edges, hard rectangle nahi - is app ke har existing blob/wash primitive ka established preference) use karta hai; overlapping streaks apna max lete hain, sum nahi (over-bright hone se bachne ke liye).
- **`HIGHLIGHTS_STREAK_COUNT = 7`, width ratio `0.04-0.09`** - starting judgment call hain (koi real reference implementation ye specific numbers ke liye nahi hai), real-device visual testing se tune hone ki ummeed hai, is app ke har doosre approximate constant jaisa.
- **Honest limitation** (already [HAIR-PLAN.md](./HAIR-PLAN.md) mein flag kiya gaya tha, ab code mein bhi confirm hua): ye real balayage/foil-highlight jaisa per-strand precise nahi hai - jo milta hai wo "hair region ke andar procedurally-placed streak-shaped patches" hai. Real photo verification se confirm hua ki ye phir bhi genuinely visible aur distinct effect deta hai (SKIN ke dropped subcategories jaisa "kuch hua hi nahi" risk nahi hai).
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (120/120, `hair.smoke.test.ts` mein 3 naye HIGHLIGHTS tests samet - render smoke test, streak-selectivity numeric test, determinism test) sab clean/pass hoti hain. Real dev-server browser verification upar Checklist mein describe kiya hai.
- **Abhi kya baaki hai**: Live camera mode bilkul untested - HIGHLIGHTS ke liye ye baaki teeno se zyada relevant hai (streak anchor har frame recompute hota hai, per-frame stability specifically confirm karne layak hai). Real product page ka poora flow bhi untested.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), aur har FACE/EYE/COLOR/HENNA/OMBRE finish ka apna tracker.

> **Status**: HAIR category ka aakhri build - **HAIR ab 100% complete hai (saari 4 subcategories)**. Sabse naya/uncertain math tha (procedural pattern generation, is category ka koi doosra finish ye nahi karta tha) - determinism aur selectivity dono explicitly test kiye, real photo pe confirm kiya. Full formal real-device QA - is session ke apne standing convention ke hisaab se - deliberately deferred hai jab tak NAIL bhi exist na kar le.

| #   | Dimension            | Score    | Kyun                                                                                                                                                                                                             |
| --- | -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 6/10     | Sabse naya math (procedural streak generation) - koi doosri category isi tarah ka pattern generation nahi karti, isliye battle-tested reuse nahi mila (COLOR/HENNA/OMBRE jaisa).                                 |
| 2   | Test coverage        | 8/10     | 3 dedicated tests (render smoke + streak-selectivity + determinism) - Live-mode ka per-frame-recompute behavior bilkul untested.                                                                                 |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                       |
| 4   | Real-device QA       | 1/10     | Live camera mode bilkul test nahi hua; Upload mode ko engine-level ek real photo/browser verification mili.                                                                                                      |
| 5   | UX polish            | 6/10     | Shared shade picker/intensity slider reuse karta hai, real product-page flow abhi kabhi exercise nahi hua.                                                                                                       |
| 6   | Architecture         | 8/10     | `buildMaskAlphaLayer`'s generalization (row-based → full per-pixel) clean nikla - COLOR/HENNA/OMBRE ka behavior bilkul unchanged raha (poori pehle wali test suite bina change ke pass hui).                     |
| 7   | Feature completeness | 10/10 ✅ | HAIR ki saari 4 subcategories ab apni dedicated rendering rakhti hain - koi fallback nahi bacha.                                                                                                                 |
| 8   | Performance          | 5/10     | Har render pe ek extra full-mask horizontal-extent scan hai (OMBRE ke vertical scan jaisa hi) - do scans (vertical + horizontal) sirf OMBRE/HIGHLIGHTS ko chahiye, COLOR/HENNA ko nahi, koi real profiling nahi. |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                          |

**Overall**: ~**7/10** — sabse zyada naya-risk finish successfully add hua bina COLOR/HENNA/OMBRE mein koi regression ke (poori pehle wali suite unchanged pass hui). Live-mode/real-device coverage abhi bhi genuinely bacha hai, jaisa har doosre HAIR finish ka. **HAIR category ab poori tarah build ho chuki hai** - agla milestone poore category ka real-device pass hai, jaise FACE/EYE ka bhi hai.

---

[← Back to master tracker](./README.md) · [← Back to HAIR category](./HAIR.md) · [← Build plan](./HAIR-PLAN.md)
