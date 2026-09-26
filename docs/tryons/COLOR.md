# COLOR (HAIR) Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to HAIR category](./HAIR.md) · [← Build plan](./HAIR-PLAN.md)

_Tracking model: pixel segmentation (MediaPipe `ImageSegmenter`, hair-confidence mask), **landmark nahi** - HAIR ki apni poori tarah alag `SegmentationEngineBase`/`withLiveCameraSegmentation`/`withImageUploadSegmentation` stack pe bani hai, LIP/EYE/FACE ka shared `TryOnEngineBase` reuse nahi karti. Poori reasoning [HAIR-PLAN.md](./HAIR-PLAN.md#engine-architecture---shared-tryonenginebase-reuse-nahi-ho-sakta-as-is) mein hai._

> **HAIR ka pehla built finish, aur poore is category ke naye engine/type/rendering stack ka foundation**. HIGHLIGHTS/HENNA/OMBRE abhi COLOR ke hi fallback pe render hote hain (`UNSUPPORTED_HAIR_FINISHES`, [HairEngineBase.ts](../../src/classes/tryon/categories/hair/HairEngineBase.ts)) - HENNA sabse kam marginal cost hoga (same primitive, alag fixed target hue), OMBRE ko ek vertical-gradient-alpha step, HIGHLIGHTS ko ek naya procedural streak-pattern chahiye, [HAIR-PLAN.md](./HAIR-PLAN.md#suggested-build-order)'s build order ke hisaab se.

## Summary

| Mode    | Done  | Total | %                              |
| ------- | ----- | ----- | ------------------------------- |
| Live    | 0     | 4     | 0%                              |
| Upload  | 4     | 4     | 100%                            |
| **All** | **4** | **8** | **50% — [detail](./COLOR.md)** |

## Checklist

**Live**

- [ ] Camera capture + full hair-segmentation mask wired - `HairLiveEngine`/`withLiveCameraSegmentation` likhe gaye, `withLiveCamera`'s exact shape mirror karte hain, bas `segmentForVideo`'s *callback* overload use karta hai (sync overload ke apne per-call mask-copy cost se bachne ke liye - dekho `withLiveCameraSegmentation.ts`'s comment). Is session mein genuinely test nahi hua (real camera hardware is environment mein available nahi tha) - Upload mode ka already-proven mask/compositing pipeline confidence deta hai, lekin Live-specific mechanics (callback-driven RAF loop) khud abhi unverified hain.
- [ ] Full-strand recolor overlay real-time me render ho - same `applyColorHair` jo Upload mode mein verified hai, `HairEngineBase.applyEffect`'s switch se wired - Live-specific execution abhi untested (upar wale point jaisi hi wajah).
- [ ] Variant/intensity picker functional - engine-level `setMakeupState({color, range})` script se verified (neeche Design notes dekho), `TryOnModal`'s UI wiring (`HAIR_RANGE_BOUNDS`, HAIR branch) bhi add ho chuka hai - real product page ke through abhi exercise nahi hua (dev DB mein koi HAIR-configured product nahi tha is session mein).
- [ ] Performance & cross-device QA - shuru nahi hua (standing convention - dekho [tryon-qa-deferred-until-all-built memory], sabhi categories ban jaane tak deferred).

**Upload**

- [x] Photo upload + full hair-segmentation mask static image pe - is session mein end-to-end browser-verified: real dev server pe, real self-hosted `hair_segmenter.tflite` model download+load hua, real uploaded model photo (`North-Indian.webp`) pe segmentation chala, `imageReady: true` aur `faceDetection: 'detected'` dono confirm hue.
- [x] Full-strand recolor overlay image pe apply ho - do distinctly alag test colors (dark brown `#3b1f0f`, vivid magenta `#e0206e`) ke saath screenshot-verified - mask hair ke boundary ko precisely follow karta hai (individual strand/flyaway edges samet), skin/background bilkul untouched rehte hain, aur `'color'` composite blend ki wajah se recolored hair ke andar bhi natural shading/highlights visible rehte hain (flat solid patch nahi banta).
- [x] Shade/variant picker functional - engine-level verified (`setMakeupState` se color aur range dono change karke re-render confirm kiya - range 0.9 vs 0.3 pe visibly alag intensity dikhi). Shared `TryOnShadeSwatches`/`TryOnRangeSlider` UI components khud already har category proven hain, HAIR-specific naya UI surface nahi hai.
- [x] Output preview/download QA - `takeSnapshot()` verified, ek valid `data:image/png` data URL return karta hai.

## Design notes

- **Poora naya engine stack, LIP/EYE/FACE ka nahi**: `TryOnEngineBase`/`withLiveCamera`/`withImageUpload`/`IRenderTargetParams` sab MediaPipe `FaceLandmarker` ke against hardcoded hain (`getSharedFaceLandmarker` direct call, `face: NormalizedLandmark[]` base field) - koi generic "detector" abstraction nahi hai jispe HAIR plug ho sake. Isliye ek poora parallel stack likha gaya: `SegmentationEngineBase` (`TryOnEngineBase` ka mirror), `withLiveCameraSegmentation`/`withImageUploadSegmentation` (mixins ka fork), `HairSegmenterCache` (`FaceLandmarkerCache` ka mirror, `ImageSegmenter` ke liye), aur `IHairRenderTargetParams`/`IHairRenderEffectBaseParams`/`IHairRenderParams`/`IApplyHairEffectParams` (`types/tryon-types/hair.ts` - `face` ki jagah `mask: IHairMask` carry karte hain, deliberately `IRenderTargetParams` extend nahi karte). Poori reasoning [HAIR-PLAN.md](./HAIR-PLAN.md#engine-architecture---shared-tryonenginebase-reuse-nahi-ho-sakta-as-is) mein hai.
- **Model choice**: Google ka published "Hair Segmenter" (`hair_segmenter.tflite`, ~782KB, background/hair 2-class, 512×512 input, `outputConfidenceMasks`) - Selfie Segmentation (koi hair class nahi), Multi-Class Selfie Segmentation (hair class hai, lekin aadhi resolution - 256×256 - kyunki 6 classes ke beech split hoti hai), aur DeepLab-v3 (galat domain, general scene objects) ke against compare karke choose kiya. `face_landmarker.task` jaisa hi self-hosted (`public/models/tryon/hair_segmenter.tflite`, `vercel.json`'s existing `/models/(.*)` cache rule already cover karta hai, koi naya config nahi chahiye tha).
- **Recolor technique - is app ka pehla blend-mode-based effect**: har LIP/FACE finish flat `source-over` alpha fill use karta hai - hair pe wahi lagane se natural strand shading poori tarah flat ho jaata (ek solid patch jaisa). Iski jagah `applyColorHair` (`utils/tryon-utils/hair.ts`) confidence mask ko ek chhoti (mask ke apne native resolution wali) alpha-only layer banata hai, use `destination-in` se ek flat-color rect pe punch karta hai (GPU-scaled `drawImage` se upscale hota hai, manual per-pixel resample loop nahi - Live-mode performance ke liye important), phir us masked-color layer ko already-drawn frame pe `globalCompositeOperation: 'color'` (hue+saturation source se, luminosity destination se) ke saath composite karta hai `alpha`-driven `globalAlpha` ke saath. Browser-verified ki natural highlights/shadows recolored hair ke andar bhi visible rehte hain.
- **Confidence mask, category mask nahi**: `outputConfidenceMasks: true` (`HairSegmenterCache.ts`) - ek hard 0/1 category mask hair ke edges pe jagged dikhta, confidence mask (0-1 float per pixel) wahi soft-edged quality deta hai jo is app ka har existing blob/wash primitive already prioritize karta hai.
- **`getHairDetectionStatus` - naya, mask-coverage based**: `getFaceDetectionStatus` (landmark bounding-box based) HAIR ke liye kaam nahi karta (koi landmark hi nahi) - iska apna parallel (`utils/tryon-utils/hair.ts`) mask ke confident-hair-pixel fraction ko ek threshold (3% coverage) ke against compare karta hai. Sirf `'detected'`/`'not-in-frame'` produce karta hai - `'turned'`/`'not-clear'` HAIR ke liye meaningful nahi hain (same "har category sirf apne actually-needed status values produce karti hai" precedent jo BROWGEL/LIP/EYE ke liye already established tha).
- **`ImageSegmenterResult`'s apna lifecycle handling**: Live mode `segmentForVideo`'s *callback* overload use karta hai (task-owned mask, callback khatam hote hi auto-freed), Upload mode sync `segment()` overload (app-owned copy, explicitly `.close()` karna padta hai) - `extractHairMask` (`HairSegmenterCache.ts`) dono cases handle karta hai `closeMask` param se. Dono cases mein `MPMask.getAsFloat32Array()` turant call hoti hai (jo apna independent copy return karti hai), taaki koi bhi lifetime-bound object khud store na ho.
- **Ab tak ki verification**: `tsc -b --force`, `eslint` (poore naye 16 files + 2 modified), aur poori `vitest` suite (117/117, ek naya `hair.smoke.test.ts` samet - `applyColorHair` + `getHairDetectionStatus` dono cover karta hai) sab clean/pass hoti hain. Real dev-server browser verification: `HairUploadEngine` ko directly instantiate karke (real product page ke through nahi, kyunki dev DB mein koi HAIR-configured product nahi tha), ek real model photo (`North-Indian.webp`) pe do alag colors/intensities try kiye, screenshot se confirm kiya ki recolor genuinely visible hai aur skin/background ko touch nahi karta, `takeSnapshot()` bhi verify kiya.
- **Abhi kya baaki hai**: Live camera mode bilkul untested (no hardware is environment mein). Real product page ka poora flow (ProductDetails → TryOnModal → shade swatches click) bhi untested - dev DB mein koi HAIR product configure nahi tha, sirf engine-level script test hua. HIGHLIGHTS/HENNA/OMBRE abhi COLOR ke fallback pe render hote hain, apni dedicated rendering nahi hai.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), aur har FACE/EYE finish ka apna tracker.

> **Status**: HAIR category ka pehla build, aur is poore try-on feature ka pehla segmentation-based finish. Naya engine stack (`SegmentationEngineBase` + segmentation mixins) end-to-end kaam karta hua verify hua - real model, real image, real recolor. Full real-device QA (Live mode, multiple devices/lighting) - is session ke apne standing convention ke hisaab se - deliberately deferred hai jab tak har planned HAIR/NAIL subcategory exist na kar le.

| #   | Dimension            | Score   | Kyun                                                                                                                                                                                                                        |
| --- | --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness            | 6/10    | Naya, pehli-baar-test-hua engine stack (koi doosri category isi code path pe already nahi chal rahi, LIP/EYE/FACE ke turn-detection jaisa multi-category battle-testing nahi mila abhi).                                  |
| 2   | Test coverage         | 6/10    | 1 smoke test (`applyColorHair` + `getHairDetectionStatus`) - Live-mode ka callback-driven path bilkul untested, koi automated coverage nahi.                                                                              |
| 3   | Docs accuracy         | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                                  |
| 4   | Real-device QA        | 1/10    | Live camera mode bilkul test nahi hua; Upload mode ko engine-level (real product page nahi) ek real photo/browser verification mili is session mein.                                                                      |
| 5   | UX polish             | 6/10    | Shared shade picker/intensity slider reuse karta hai (naya UI surface nahi), lekin real product-page flow (click-through) abhi kabhi exercise nahi hua.                                                                    |
| 6   | Architecture          | 8/10    | Clean parallel-hierarchy design (`SegmentationEngineBase`/`HairEngineBase`, existing `TryOnEngineBase`/`FaceEngineBase` ka exact mirror) - lekin abhi sirf ek hi consumer (COLOR khud), doosre 3 finishes ne isse stress nahi kiya.                     |
| 7   | Feature completeness  | 4/10    | 4 mein se 1 HAIR finish ka apna dedicated rendering hai, baaki 3 fallback pe hain.                                                                                                                                          |
| 8   | Performance           | 6/10    | Design-time decisions (confidence-mask-at-native-resolution + GPU-scaled `drawImage`, callback overload Live mode ke liye) performance-conscious hain, lekin koi real FPS/profiling measurement is session mein nahi hui. |
| 9   | Code hygiene          | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                     |

**Overall**: ~**6.3/10** — poora naya foundation kaam karta hua verify hua (yehi sabse bada risk tha), lekin Live-mode/real-device/multi-finish coverage abhi genuinely bacha hai, isliye BROWGEL (~8.2, ek already-proven pipeline pe simple reuse) jitna high nahi. Next step: HENNA (same primitive, alag fixed hue, near-zero marginal cost), phir OMBRE, phir HIGHLIGHTS - [HAIR-PLAN.md](./HAIR-PLAN.md#suggested-build-order)'s build order ke hisaab se.

---

[← Back to master tracker](./README.md) · [← Back to HAIR category](./HAIR.md) · [← Build plan](./HAIR-PLAN.md)
