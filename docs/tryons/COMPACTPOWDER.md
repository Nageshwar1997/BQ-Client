# COMPACTPOWDER Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (face-oval region, minus eyes/eyebrows/mouth) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke sabhi 8 subcategories ki ab apni-apni dedicated tracker file ban chuki hai (isi COMPACTPOWDER.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[CONCEALER.md](./CONCEALER.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[CONTOUR.md](./CONTOUR.md)/[BRONZER.md](./BRONZER.md)/[BBCREAM.md](./BBCREAM.md) jaisi) - [FACE.md](./FACE.md) ab sirf ek index/summary reh gaya hai, waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case (aur `UNSUPPORTED_FACE_FINISHES` ab poori tarah empty hai - FACE ki har finish ki apni dedicated rendering hai). Rendering: [`applyCompactPowderFace`](../../src/utils/tryon-utils/face.ts) - FOUNDATION/BRONZER/BBCREAM jaisa hi **full-face wash** hai (face-oval clip, eyes/eyebrows/mouth punched out, same shared `fillFaceOvalRegion` helper), FACE.md ki apni description ("full-face segmentation", "matte-finish overlay, shine reduction") ke saath match karta hai. Farak: koi doosri full-face finish jaisa mix-toward-white/black/warm nahi lagta - iski jagah shade ko **desaturate karke apne hi grayscale equivalent ki taraf mix** kiya jaata hai (`desaturateTowardGray`), jo "matte/shine-reduced" effect ka closest 2D-color-math approximation hai (is app ke flat, lighting-agnostic fill me real specular-highlight data hai hi nahi), phir sabse lowest baked base-alpha (`COMPACTPOWDER_BASE_ALPHA`) ke saath paint hota hai - kyunki compact powder real life me bhi ek near-invisible finishing veil hi hota hai, ek bold color layer nahi.

## Summary

| Mode    | Done  | Total | %                                      |
| ------- | ----- | ----- | -------------------------------------- |
| Live    | 3     | 4     | 75%                                    |
| Upload  | 3     | 4     | 75%                                    |
| **All** | **6** | **8** | **75% — [detail](./COMPACTPOWDER.md)** |

## Checklist

**Live**

- [x] Camera capture + full-face segmentation wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, extra wiring nahi chahiye.
- [x] Matte-finish overlay (shine reduction) real-time me render hota hai — `applyCompactPowderFace` ko `FaceEngineBase.applyEffect`'s switch mein `'COMPACTPOWDER'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai har doosri full-face finish jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua** (is session ke sandboxed browser pane ne ek pane-level WebGL limitation hit ki - MediaPipe ka GPU delegate wahan initialize hi nahi hota, console mein `useProgram: program not valid`, kaunsi bhi finish select ho, landmark detection block ho jaata hai - ye is change ki wajah se nahi hua).
- [x] Shade/variant picker functional — generic FACE UI, har doosri FACE finish ke liye already proven working, COMPACTPOWDER-specific change nahi chahiye.
- [ ] Performance & cross-device QA — real-device pass abhi shuru nahi hua.

**Upload**

- [x] Photo upload + full-face segmentation static image pe — har doosri full-face finish jaisa hi shared upload pipeline.
- [x] Matte-finish overlay image pe apply hoti hai — same `applyCompactPowderFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — abhi tak real uploaded photo pe confirm nahi hua.

## Design notes

- **Full-face wash, koi localized blob nahi**: FOUNDATION/BRONZER/BBCREAM jaisi hi architecture family (sab shared `fillFaceOvalRegion` helper se poora face-oval region fill karte hain), BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR ke single-anchor feathered blobs jaisa nahi. FACE.md ki apni compact powder description ("full-face segmentation", "matte-finish overlay, shine reduction") se match karta hai.
- **Desaturation, ek absolute color ki taraf mix nahi**: HIGHLIGHTER white ki taraf mix karta hai aur CONTOUR black ki taraf, kyunki wo effects genuinely badalte hain ki skin kitni light ya dark dikhti hai. Compact powder aisa nahi karta - ek real mattifying powder skin ko lighten ya darken nahi karta, ye _shine/gloss_ ko flatten karta hai. Is renderer ka koi lighting model nahi hai (koi specular highlights nahi jinko directly dampen kiya ja sake), isliye `desaturateTowardGray` "kam shine" ko "kam vibrant" se approximate karta hai: har shade ko apne hi luminance-matched gray (Rec. 601 luma weights) ki taraf mix karta hai, kisi ek fixed absolute color ki taraf nahi - isliye `mixTowardWhite`/`mixTowardBlack`/`applyWarmShift` ke ulat, ye kabhi hue ya overall brightness shift nahi karta, sirf vibrancy. `COMPACTPOWDER_MATTIFY_RATIO` (0.3) shade ka apna hue clearly recognizable rakhta hai, phir bhi ek straight wash se flatter dikhta hai.
- **Kisi bhi full-face finish ka sabse lowest baked base-alpha**: `COMPACTPOWDER_BASE_ALPHA` (0.25) `BBCREAM_BASE_ALPHA` (0.35) se bhi neeche baithta hai - ek real compact powder ka poora kaam ek near-invisible finishing veil hona hai (makeup set karna, shine kam karna), consciously dekhne layak color layer nahi, isliye ye ab tak build hui har FACE finish mein structurally sabse subtle hai. Same "render mein hi bake karo, sirf slider ki apni bounds pe depend mat karo" reasoning jo `BBCREAM_BASE_ALPHA` ka apna comment already use kar chuka hai - aur `FACE_RANGE_BOUNDS.COMPACTPOWDER` ki bhi kisi bhi FACE finish se sabse lowest ceiling hai (`max: 0.3`), isliye dono ek doosre ko compensate karne ki jagah saath mein kaam karte hain.
- **Ab tak ki verification**: `npx tsc --noEmit`, `eslint`, aur poori `vitest` suite (66/66, ek naye `applyCompactPowderFace` smoke test samet) sab pass hoti hai. Ek synthetic-face script (temporary, commit nahi kiya) ne COMPACTPOWDER aur FOUNDATION ko ek identical background pe side-by-side render kiya, ek deliberately vivid/saturated shade use karke taaki desaturation visually obvious ho - confirm hua ki dono same face-oval region ko identically fill karte hain (same clip, same eye/eyebrow/mouth exclusion) aur COMPACTPOWDER ke average color ka max-min channel spread FOUNDATION se measurably chhota hai (matlab genuinely kam saturated/zyada matte), jo exported PNGs mein aankh se bhi dikhta hai. Actual in-app flow bhi try kiya (Upload → ek project model photo) is session ke sandboxed browser pane mein, lekin MediaPipe ka GPU delegate wahan initialize hi nahi hua (`useProgram: program not valid` WebGL errors) aur landmark detection kabhi complete nahi hua - ye ek pane-level limitation hai, code regression nahi (model file khud theek se load hui, 200 OK, aur ye har FACE finish ko equally block karta hai, sirf isko nahi). Synthetic check se visually correct hai, lekin ye real-device QA ka substitute nahi hai - aur HIGHLIGHTER ke apne real-device lesson ke hisaab se (default alpha real photo pe notice karne layak nahi tha), COMPACTPOWDER ka default alpha (kisi bhi FACE finish ka sabse lowest, design se) real-device testing shuru hote hi wahi real-photo sanity check paana chahiye - BBCREAM jaisa, ye "kuch hua hi nahi" jaisa dikhne ke real risk mein hai, shayad aur zyada, kyunki desaturation ek color shift se zyada subtle visual cue hai.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), [BLUSH.md](./BLUSH.md), [CONCEALER.md](./CONCEALER.md), [HIGHLIGHTER.md](./HIGHLIGHTER.md), [CONTOUR.md](./CONTOUR.md), [BRONZER.md](./BRONZER.md), and [BBCREAM.md](./BBCREAM.md).

> **Status**: Freshly built, baaki chhe finishes ke apne real-device pass se pehle jaisa hi starting point - code/architecture/tests solid, **Real-device QA shuru nahi hua**. Koi dedicated `COMPACTPOWDER-10-10-PLAN.md` abhi nahi hai - wo tab banega jab real-device testing actually shuru ho, baaki jaisa hi order.

| #   | Dimension            | Score   | Kyun                                                                                                                                                                                                                                                                                    |
| --- | -------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10    | Same guards FOUNDATION/BRONZER/BBCREAM already have (missing-landmark, face-oval clip, turn-detection) - koi known gap nahi, lekin real-device par kabhi nahi chala.                                                                                                                    |
| 2   | Test coverage        | 7/10    | 1 smoke test (renders without throwing, paints pixels) - koi dedicated "less saturated than FOUNDATION" comparison test committed nahi hai (sirf temporary script se manually confirm kiya).                                                                                            |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                                                                                              |
| 4   | Real-device QA       | 0/10    | Shuru hi nahi hua - is session ke sandboxed browser pane me MediaPipe ka GPU delegate hi initialize nahi hua (WebGL limitation), landmark detection kabhi complete nahi hua. HIGHLIGHTER/BBCREAM ke "default alpha real photo pe barely visible" lesson yahan sabse zyada relevant hai. |
| 5   | UX polish            | 8/10    | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - COMPACTPOWDER ka apna dedicated UX audit abhi nahi hua.                                                                                                                                                    |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn (naya `desaturateTowardGray` helper, `mixTowardWhite`/`mixTowardBlack`/`applyWarmShift` jaisa hi pattern) + ek switch case. `UNSUPPORTED_FACE_FINISHES` ab poori tarah empty.                                                              |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyCompactPowderFace`, switch case) - **FACE category ki saari 8 subcategories ab dedicated rendering rakhti hain**.                                                                                                                      |
| 8   | Performance          | 6/10    | Code-side cost-profile FOUNDATION/BRONZER/BBCREAM jaisa hi (ek temp-canvas, ek fill, desaturate ek chhota extra RGB math) - real FPS numbers #4 pe depend karte hain.                                                                                                                   |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                                                                                 |

**Overall**: ~**7.7/10** — har doosri finish ke apne starting score jaisa hi shape. Next step (jab ready ho): real-device Live + Upload testing (COMPACTPOWDER ki subtlety real photo pe kaafi zyada check karna hai - ye sabse low-alpha FACE finish hai), phir agar gaps milte hain to `COMPACTPOWDER-10-10-PLAN.md` banega. Iske saath **FACE category ki saari 8 subcategories build ho chuki hain** - agla milestone poori category ka real-device QA pass hoga.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
