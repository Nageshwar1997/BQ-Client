# OMBRE (HAIR) Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to HAIR category](./HAIR.md) · [← Build plan](./HAIR-PLAN.md)

_Tracking model: pixel segmentation (MediaPipe `ImageSegmenter`, hair-confidence mask) - COLOR ka exact wahi engine/rendering stack reuse karta hai, koi naya infra nahi. Poori reasoning [HAIR-PLAN.md](./HAIR-PLAN.md#engine-architecture---shared-tryonenginebase-reuse-nahi-ho-sakta-as-is) mein hai._

> **HAIR ka teesra built finish**. Real ombre hair roots ko natural rehne deta hai aur sirf tips ki taraf gradually recolor karta hai - COLOR ka full-mask recolor isse ek uniform color mein flatten kar deta. `applyOmbreHair` (`utils/tryon-utils/hair.ts`) COLOR/HENNA ka wahi mask + `destination-in` + blend mechanism reuse karta hai, bas ek extra root(0)-to-tip(1) vertical alpha ramp multiply karta hai - [HAIR-PLAN.md](./HAIR-PLAN.md)'s apne planned "mask ka bounding box use karke gradient" idea ke exactly according. HIGHLIGHTS abhi bhi COLOR ke fallback pe render hota hai (`UNSUPPORTED_HAIR_FINISHES`, [HairEngineBase.ts](../../src/classes/tryon/categories/hair/HairEngineBase.ts)).

## Summary

| Mode    | Done  | Total | %                              |
| ------- | ----- | ----- | ------------------------------ |
| Live    | 0     | 4     | 0%                             |
| Upload  | 4     | 4     | 100%                           |
| **All** | **4** | **8** | **50% — [detail](./OMBRE.md)** |

## Checklist

**Live**

- [ ] Camera capture + full hair-segmentation mask wired - COLOR/HENNA ka hi `HairLiveEngine`/`withLiveCameraSegmentation`, koi finish-specific difference nahi hai is layer pe. [COLOR.md](./COLOR.md)'s apne identical point jaisa hi untested hai (real camera hardware is environment mein available nahi tha).
- [ ] Root-to-tip gradient recolor real-time me render ho - `applyOmbreHair` `HairEngineBase.applyEffect`'s switch se wired - Live-specific execution abhi untested (upar wale point jaisi hi wajah). Live mode mein gradient ka apna anchor (mask ka bounding box) har frame recompute hoga jaise-jaise face/hair frame mein move karta hai - ye specifically Live pe hi test karne layak hai, Upload ke single-frame check se poora confirm nahi hota.
- [ ] Variant/intensity picker functional - engine-level `setMakeupState({color, range})` script se verified (neeche Design notes dekho) - real product page ke through abhi exercise nahi hua.
- [ ] Performance & cross-device QA - shuru nahi hua (standing convention - dekho [tryon-qa-deferred-until-all-built memory], sabhi categories ban jaane tak deferred).

**Upload**

- [x] Photo upload + full hair-segmentation mask static image pe - COLOR ka hi already-verified pipeline, OMBRE-specific koi naya path nahi hai is layer pe.
- [x] Root-to-tip gradient recolor image pe apply ho - do tarike se verify kiya: (1) synthetic unit test - ek full-height solid mask pe root pixel neutral gray ke 10 units ke andar raha, tip pixel 30+ units door shift hua; (2) real model photo (`North-Indian.webp`) pe do shades try kiye (vivid blue-violet, warm honey-blonde) - pixel-sample se confirm kiya ki root region (crown/parting) dark/unrecolored raha aur tip region (strand ends) clearly target color ki taraf shift hua, screenshot se bhi ek real, natural-dikhne-wala "dark root → light tip" ombre look confirm hua.
- [x] Shade/variant picker functional - engine-level verified (`setMakeupState` se color change karke re-render confirm kiya).
- [x] Output preview/download QA - COLOR ka hi already-verified `takeSnapshot()` path, OMBRE-specific koi difference nahi.

## Design notes

- **Naya code: sirf ek extra alpha-ramp step, koi naya compositing mechanism nahi**: `buildMaskAlphaLayer` (`utils/tryon-utils/hair.ts`) ko ek optional `rowAlphaMultiplier: Float32Array` param diya - jab diya jata hai, har row ka mask-confidence alpha us row ke apne extra multiplier se scale hota hai likhne se pehle. COLOR/HENNA kabhi ye param pass nahi karte (`undefined` → har row apni full confidence pe rehti hai, behavior unchanged). Sirf `applyOmbreHair` ye pass karta hai.
- **Gradient anchor: mask ka apna bounding box, poora canvas nahi**: `findHairVerticalExtent` mask ke data ko scan karke confident-hair rows ka min/max find karta hai (0.3 threshold - `HAIR_DETECTION_CONFIDENCE_THRESHOLD` se jaan-boojh kar lower, kyunki ye sirf "extent" decide kar raha hai, per-pixel recolor nahi). Poore canvas ke 0..height range pe anchor karne se root galat jagah (photo ke top edge, jo aksar background hota hai, hair nahi) land hota - mask ke apne detected bounding box pe anchor karna hi root ko actual visible roots pe rakhta hai.
- **Ramp math**: `buildRootToTipRowAlpha` har row ke liye `(row - minRow) / (maxRow - minRow)` compute karta hai, `[0,1]` pe clamped - root row par ~0 (COLOR/HENNA ka full recolor us row pe near-invisible ho jaata hai), tip row par ~1 (COLOR jaisa hi full recolor). Degenerate case (`span <= 0`, jaise ek extreme close-up crop jahan poora hair ek hi row mein detect ho) fully-recolored pe fallback karta hai, divide-by-zero nahi.
- **Real-photo verification ka nuance**: dark/black natural hair pe ek dark-toned target color (jaisa blue-violet) ke saath root-to-tip transition screenshot mein subtle dikh sakta hai (root already dark hai, target bhi dark-ish), lekin pixel-level sampling se confirm hota hai ki genuinely kaam kar raha hai (root pixels near-neutral rahe, tip pixels strongly target-hue-shifted). Ek lighter/warmer target (honey-blonde) is app ke apne visual-verification ke liye zyada obvious tha - real ombre products bhi typically isi "dark root, lighter tip" combination mein sabse zyada popular hain.
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (117/117, `hair.smoke.test.ts` mein 2 naye OMBRE tests samet - render smoke test + ek synthetic root-vs-tip numeric regression test) sab clean/pass hoti hain. Real dev-server browser verification upar Checklist mein describe kiya hai.
- **Abhi kya baaki hai**: Live camera mode bilkul untested (COLOR/HENNA jaisa hi starting point) - ye specifically OMBRE ke liye zyada relevant hai kyunki gradient anchor har frame recompute hota hai. Real product page ka poora flow bhi untested. HIGHLIGHTS abhi COLOR ke fallback pe render hota hai.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), aur har FACE/EYE/COLOR/HENNA finish ka apna tracker.

> **Status**: HAIR ka teesra build - is baar genuinely naya rendering behavior (gradient alpha ramp), COLOR/HENNA jaisa pure reuse nahi. Real photo pe pixel-level aur visual dono se confirm hua ki root-to-tip transition sahi kaam karta hai. Full formal real-device QA - is session ke apne standing convention ke hisaab se - deliberately deferred hai jab tak har planned HAIR/NAIL subcategory exist na kar le.

| #   | Dimension            | Score    | Kyun                                                                                                                                                                                           |
| --- | -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 7/10     | Naya math (bounding-box-anchored gradient) hai, lekin degenerate case (zero-span) explicitly handle kiya, aur COLOR ka already-proven compositing core hi reuse karta hai.                     |
| 2   | Test coverage        | 8/10     | 2 dedicated tests (render smoke + synthetic root-vs-tip numeric check) - Live-mode ka per-frame-recompute behavior bilkul untested.                                                            |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                     |
| 4   | Real-device QA       | 1/10     | Live camera mode bilkul test nahi hua; Upload mode ko engine-level ek real photo/browser verification mili (do shades, pixel-sampled).                                                         |
| 5   | UX polish            | 6/10     | Shared shade picker/intensity slider reuse karta hai, real product-page flow abhi kabhi exercise nahi hua.                                                                                     |
| 6   | Architecture         | 8/10     | Clean incremental extension (`buildMaskAlphaLayer`'s optional param) - COLOR/HENNA ka apna behavior bilkul unchanged rehta hai, koi breaking change nahi.                                      |
| 7   | Feature completeness | 7/10     | 4 mein se 3 HAIR finish ka apna dedicated rendering hai, sirf HIGHLIGHTS fallback pe hai.                                                                                                      |
| 8   | Performance          | 6/10     | Ek extra full-mask pass (`findHairVerticalExtent`) add hui hai per-render - COLOR/HENNA se thoda zyada compute, lekin still ek chhoti (mask-resolution) array pe, koi real profiling nahi hui. |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                        |

**Overall**: ~**7/10** — genuinely naya rendering behavior successfully add hua, real photo pe confirm hua, koi regression COLOR/HENNA mein nahi aaya. Next step: HIGHLIGHTS (naya procedural streak-pattern chahiye, sabse uncertain math) - [HAIR-PLAN.md](./HAIR-PLAN.md#suggested-build-order)'s build order ke hisaab se, HAIR ka aakhri planned finish.

---

[← Back to master tracker](./README.md) · [← Back to HAIR category](./HAIR.md) · [← Build plan](./HAIR-PLAN.md)
