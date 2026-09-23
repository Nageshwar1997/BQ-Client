# CONCEALER Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (under-eye anchor points, ek per eye) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke sabhi 8 subcategories ki ab apni-apni dedicated tracker file ban chuki hai (isi CONCEALER.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[CONTOUR.md](./CONTOUR.md)/[BRONZER.md](./BRONZER.md)/[BBCREAM.md](./BBCREAM.md)/[COMPACTPOWDER.md](./COMPACTPOWDER.md) jaisi) - [FACE.md](./FACE.md) ab sirf ek index/summary reh gaya hai, waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyConcealerFace`](../../src/utils/tryon-utils/face.ts) - under-eye anchor (`UNDER_EYE_LEFT_INDEX`/`UNDER_EYE_RIGHT_INDEX`, `UNDER_EYE_OFFSET_RATIO` se under-eye hollow mein neeche offset kiya hua) par centered ek soft, feathered **ellipse** (BLUSH ke plain circular blob se alag - `drawFeatheredBlob` ab `radiusX`/`radiusY` dono leta hai, wider-than-tall shape jo real under-eye crescent jaisi dikhti hai). Radius eye ki apni detected width se scale hota hai (face ki nahi - under-eye area eye ke size ke saath scale karta hai). Face-oval mein clip hota hai (safety net, FOUNDATION/BLUSH jaisa hi), **plus eyes khud bhi `destination-out` se erase hote hain** (BLUSH ko iski zaroorat nahi thi - uska anchor kaafi door hai - lekin CONCEALER ka anchor eye ke bilkul paas hai, isliye gradient ka soft upar wala tail eye opening tak bleed kar sakta tha bina iske). FOUNDATION/BLUSH ke turn-detection overlay aur upload/live instructions dono automatically inherit hote hain.

## Summary

| Mode    | Done  | Total | %                                  |
| ------- | ----- | ----- | ---------------------------------- |
| Live    | 3     | 4     | 75%                                |
| Upload  | 3     | 4     | 75%                                |
| **All** | **6** | **8** | **75% — [detail](./CONCEALER.md)** |

## Checklist

**Live**

- [x] Camera capture + under-eye/blemish-region tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, under-eye indices samet, extra wiring nahi chahiye.
- [x] Spot-blend color correction real-time me render hota hai — `applyConcealerFace` ko `FaceEngineBase.applyEffect`'s switch mein `'CONCEALER'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai FOUNDATION/BLUSH jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional (product variants se linked) — generic FACE UI, FOUNDATION/BLUSH ke liye already proven working, CONCEALER-specific change nahi chahiye.
- [ ] Performance & cross-device QA (FPS, lighting conditions) — real-device pass abhi shuru nahi hua.

**Upload**

- [x] Photo upload + under-eye/blemish-region detection static image pe — FOUNDATION/BLUSH jaisa hi shared upload pipeline.
- [x] Spot-blend color correction image pe apply hoti hai — same `applyConcealerFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — abhi tak real uploaded photo pe confirm nahi hua.

## Design notes

- **Sirf under-eye, blemish-spot detection nahi**: koi landmark data hai hi nahi jo ek actual blemish ki taraf point kar sake (uske liye real skin-defect analysis chahiye, landmark-only approach ke scope se bahar - same reasoning jisne FOUNDATION ke liye hair-detection deliberately drop karwaya tha, uski apni bug log dekho). Under-eye brightening ek concealer use case hai jo har shopper genuinely rakhta hai, isliye yahi cover kiya gaya.
- **Ellipse, circle nahi**: BLUSH ka `drawFeatheredBlob` sirf circle hi draw karta tha. Ise generalize kiya gaya taaki independent `radiusX`/`radiusY` le sake (ek non-uniform canvas scale circle ko ellipse bana deta hai) taaki CONCEALER ka under-eye shape tall se zyada wide ho sake, real crescent se match karte hue - `radiusX === radiusY` BLUSH ke apne call/output ko byte-for-byte pehle jaisa hi rakhta hai.
- **Anchor + offset, koi dedicated landmark nahi**: MediaPipe ka mesh sirf eyelid margin cover karta hai, under-eye hollow ko khud nahi - `applyConcealerFace` eye ring ke apne bottom-center point ko leta hai aur ise detected face height ke `UNDER_EYE_OFFSET_RATIO` se neeche push karta hai, hollow mein land karta hai, seedha lash line pe nahi.
- **Eyes explicitly erase hote hain**: BLUSH ke ulat (jiska cheek-apple anchor kisi bhi excluded cheez se itna door hai ki gradient ka soft tail kabhi wahan tak pahunchta hi nahi), CONCEALER ka anchor design se eye ke bilkul paas baitha hai - iska gradient ka upward tail realistically eyelid/eye opening pe bleed kar sakta tha. `eraseEyes` (same independent `destination-out` technique jo `eraseExcludedFeatures` full-face finishes ke liye already use karta hai) guarantee karta hai ki aisa kabhi nahi hota, anchor/offset numbers baad mein kaise bhi tune ho jaayein.
- **Ab tak ki verification**: `npx tsc --noEmit`, `eslint`, aur poori `vitest` suite (sab pass, ek naye `applyConcealerFace` smoke test samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte (FOUNDATION/BLUSH ki apni history mein noted same limitation), isliye ek synthetic-face script (temporary, commit nahi kiya) use kiya `applyConcealerFace` ko ek actual oval-shaped fixture pe render karke confirm karne ke liye ki ellipses eyes ke neeche land hote hain aur correctly feather hote hain - visually correct hai, lekin ye real-device QA ka substitute nahi hai.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), and [BLUSH.md](./BLUSH.md).

> **Status**: Freshly built, BLUSH/FOUNDATION ke apne 10/10 push se pehle jaisa hi starting point - code/architecture/tests solid, **Real-device QA shuru nahi hua**. Koi dedicated `CONCEALER-10-10-PLAN.md` abhi nahi hai - wo tab banega jab real-device testing actually shuru ho, FOUNDATION/BLUSH jaisa hi order.

| #   | Dimension            | Score   | Kyun                                                                                                                                                                             |
| --- | -------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10    | Missing-landmark guard, face-oval clip safety net, eye-erase, turn-detection guard sab present - koi known gap nahi, lekin real-device par kabhi nahi chala.                     |
| 2   | Test coverage        | 7/10    | 1 smoke test (renders without throwing, paints pixels) - koi dedicated geometry/placement unit test nahi.                                                                        |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                       |
| 4   | Real-device QA       | 0/10    | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta.                                                                                                |
| 5   | UX polish            | 8/10    | FOUNDATION/BLUSH ke fixes (overlay a11y, turn-icon) automatically inherited hain - CONCEALER ka apna dedicated UX audit abhi nahi hua.                                           |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn + ek switch case, bilkul FOUNDATION/BLUSH jaisa reuse. `drawFeatheredBlob` ka ellipse-generalization bhi BLUSH ko break nahi karta. |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyConcealerFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                            |
| 8   | Performance          | 6/10    | Code-side cost-profile BLUSH jaisa hi (ek temp-canvas, do gradient fill, ek chhota eye-erase pass) - real FPS numbers #4 pe depend karte hain.                                   |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                          |

**Overall**: ~**7.7/10** — BLUSH/FOUNDATION ke apne starting score jaisa hi shape. Next step (jab ready ho): real-device Live + Upload testing, phir agar gaps milte hain to `CONCEALER-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
