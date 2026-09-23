# BLUSH Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (cheek-apple anchor points, ek per cheek) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke sabhi 8 subcategories ki ab apni-apni dedicated tracker file ban chuki hai (isi BLUSH.md/[FOUNDATION.md](./FOUNDATION.md)/[CONCEALER.md](./CONCEALER.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[CONTOUR.md](./CONTOUR.md)/[BRONZER.md](./BRONZER.md)/[BBCREAM.md](./BBCREAM.md)/[COMPACTPOWDER.md](./COMPACTPOWDER.md) jaisi) - [FACE.md](./FACE.md) ab sirf ek index/summary reh gaya hai, waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyBlushFace`](../../src/utils/tryon-utils/face.ts) - cheek-apple anchor (`CHEEK_APPLE_LEFT_INDEX`/`CHEEK_APPLE_RIGHT_INDEX`) par centered ek soft, radially-feathered blob (flat fill nahi, ek `createRadialGradient` jo center se radius tak fully-transparent ho jaata hai) - FOUNDATION ke poore-face wash se bilkul alag shape, real blush stick jaisa "ek dab, blend outward". Radius face ke apne detected width se scale hota hai (`LOCALIZED_BLOB_RADIUS_RATIO`), aur face-oval mein clip hota hai (safety net - normal proportions mein already andar rehta hai). FOUNDATION ke turn-detection overlay aur upload/live instructions dono automatically inherit hote hain (`FaceEngineBase`/`refineFaceDetectionStatus`/constants sab category-level hain, finish-specific nahi).

## Summary

| Mode    | Done  | Total | %                              |
| ------- | ----- | ----- | ------------------------------ |
| Live    | 3     | 4     | 75%                            |
| Upload  | 3     | 4     | 75%                            |
| **All** | **6** | **8** | **75% — [detail](./BLUSH.md)** |

## Checklist

**Live**

- [x] Camera capture + cheek-region landmark tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, cheek-apple indices samet, extra wiring nahi chahiye.
- [x] Soft cheek color-wash blend real-time me render hota hai — `applyBlushFace` ko `FaceEngineBase.applyEffect`'s switch mein `'BLUSH'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai FOUNDATION jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional (product variants se linked) — generic FACE UI, FOUNDATION ke liye already proven working, BLUSH-specific change nahi chahiye.
- [ ] Performance & cross-device QA (FPS, lighting conditions) — real-device pass abhi shuru nahi hua.

**Upload**

- [x] Photo upload + cheek-region detection static image pe — FOUNDATION jaisa hi shared upload pipeline.
- [x] Soft cheek color-wash blend image pe apply hoti hai — same `applyBlushFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — abhi tak real uploaded photo pe confirm nahi hua.

## Design notes

- **Feathered blob, flat fill nahi**: ek `createRadialGradient` (opaque-ish center → `radius` pe fully transparent) hai, flat circle + blur nahi - blur sirf un edges ko soften karta hai jo already exist karte hain, ye apne aap "beech mein concentrated, edge tak gone" jaisa falloff produce nahi kar sakta, aur itna wide chahiye hota ki color visibly shrink ho jaaye taaki itna soft dikhe. Falloff ko gradient stops mein hi bake karna us poore tuning knob ko sidestep kar deta hai.
- **`source-over`, `multiply` nahi** - FOUNDATION pe hard way se seekha gaya (uska apna bug log dekho): ek blank/transparent temp canvas pe blend mode ek genuine cross-browser rendering inconsistency hai. `applyBlushFace` kabhi `globalCompositeOperation` set hi nahi karta, isliye ye bug class yahan dobara nahi ho sakti.
- **Face-oval clip ek safety net ki tarah**: blob ka apna radius (`LOCALIZED_BLOB_RADIUS_RATIO = 0.16` face width ka) normal proportions mein already face ke andar hi rehta hai - clip bas guarantee karta hai ki kisi unusual face shape pe ye kabhi face oval se bahar paint na kare, cheap insurance jo FOUNDATION ka already-existing `clipToFaceOval` helper reuse karti hai.
- **Turn-detection, instructions, edge-margin fix - sab free mein inherited**: `isFaceTurnedTooMuch`, `FACE_UPLOAD_INSTRUCTIONS`/`FACE_LIVE_INSTRUCTIONS`, aur `FACE_FRAME_EDGE_MARGIN` mobile fix sab FACE-category level pe rehte hain (`FaceEngineBase`/shared constants/utils), FOUNDATION ke apne code ke andar nahi - BLUSH ko ye sab automatically mil jaata hai, kisi bhi future FACE finish ki tarah.
- **Ab tak ki verification**: `npx tsc --noEmit`, `eslint`, aur poori `vitest` suite (60/60, ek naye `applyBlushFace` smoke test samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte (FOUNDATION ki apni history mein noted same limitation), isliye ek synthetic-face script (temporary, commit nahi kiya) use kiya `applyBlushFace` ko ek actual oval-shaped fixture pe render karke confirm karne ke liye ki blob cheeks pe land hota hai aur correctly feather hota hai - visually correct hai, lekin ye real-device QA ka substitute nahi hai.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md) and [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md).

> **Status**: Freshly built, FOUNDATION ke apne 10/10 push se pehle jaisa hi starting point - code/architecture/tests solid, **Real-device QA shuru nahi hua**. Koi dedicated `BLUSH-10-10-PLAN.md` abhi nahi hai - wo tab banega jab real-device testing actually shuru ho, FOUNDATION jaisa hi order.

| #   | Dimension            | Score   | Kyun                                                                                                                                                              |
| --- | -------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10    | Missing-landmark guard, face-oval clip safety net, turn-detection guard sab inherited/present - koi known gap nahi, lekin real-device par kabhi nahi chala.       |
| 2   | Test coverage        | 7/10    | 1 smoke test (renders without throwing, paints pixels) - koi dedicated geometry/placement unit test nahi (jaisa FOUNDATION ke `isFaceTurnedTooMuch` ko mila tha). |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                        |
| 4   | Real-device QA       | 0/10    | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta.                                                                                 |
| 5   | UX polish            | 8/10    | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - BLUSH ka apna dedicated UX audit abhi nahi hua.                                      |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn + ek switch case, bilkul FOUNDATION jaisa reuse.                                                                     |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyBlushFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                 |
| 8   | Performance          | 6/10    | Code-side cost-profile FOUNDATION jaisa hi (ek temp-canvas, ek gradient fill x2) - real FPS numbers #4 pe depend karte hain.                                      |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                           |

**Overall**: ~**7.7/10** — FOUNDATION ke apne starting score jaisa hi shape. Next step (jab ready ho): real-device Live + Upload testing, phir agar gaps milte hain to `BLUSH-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
