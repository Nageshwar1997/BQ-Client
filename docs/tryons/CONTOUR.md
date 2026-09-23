# CONTOUR Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (jaw-hollow anchor points, ek per side) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke sabhi 8 subcategories ki ab apni-apni dedicated tracker file ban chuki hai (isi CONTOUR.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[CONCEALER.md](./CONCEALER.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[BRONZER.md](./BRONZER.md)/[BBCREAM.md](./BBCREAM.md)/[COMPACTPOWDER.md](./COMPACTPOWDER.md) jaisi) - [FACE.md](./FACE.md) ab sirf ek index/summary reh gaya hai, waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyContourFace`](../../src/utils/tryon-utils/face.ts) - jaw-hollow anchor (`JAW_HOLLOW_LEFT_INDEX`/`JAW_HOLLOW_RIGHT_INDEX` - constants mein already prepared) par centered ek taller-than-wide feathered shadow (HIGHLIGHTER ka ekdum ulta - `mixTowardBlack` use karke shade ko black ki taraf mix kiya jaata hai, taaki "shadow/hollow" wala look mile, sirf ek dark patch nahi). In dono anchors already face-oval boundary pe hi baithe hain (jaw edge), isliye anchor ko inward + upward offset diya jaata hai taaki wo cheek ki actual hollow mein land ho, seedha jaw edge pe nahi. Face-oval mein clip hota hai (safety net). Eye/mouth-erase ki zaroorat nahi thi - anchor dono se kaafi door hai, synthetic-face check se confirm kiya.

## Summary

| Mode    | Done  | Total | %                                |
| ------- | ----- | ----- | -------------------------------- |
| Live    | 3     | 4     | 75%                              |
| Upload  | 3     | 4     | 75%                              |
| **All** | **6** | **8** | **75% — [detail](./CONTOUR.md)** |

## Checklist

**Live**

- [x] Camera capture + jaw/cheek/nose-hollow landmark tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, jaw-hollow indices samet, extra wiring nahi chahiye.
- [x] Shading blend facial hollows ke saath real-time me render hota hai — `applyContourFace` ko `FaceEngineBase.applyEffect`'s switch mein `'CONTOUR'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai baaki teen localized finishes jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional — generic FACE UI, FOUNDATION/BLUSH/CONCEALER/HIGHLIGHTER ke liye already proven working, CONTOUR-specific change nahi chahiye.
- [ ] Performance & cross-device QA — real-device pass abhi shuru nahi hua.

**Upload**

- [x] Photo upload + jaw/cheek/nose-hollow detection static image pe — baaki FACE finishes jaisa hi shared upload pipeline.
- [x] Shading blend facial hollows ke saath image pe apply hoti hai — same `applyContourFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — abhi tak real uploaded photo pe confirm nahi hua.

## Design notes

- **Sirf jaw hollow, nose-hollow/temple nahi**: ek real contour routine kayi hollows hit karta hai, lekin BLUSH/CONCEALER/HIGHLIGHTER ka apna v1 scope do anchors tak hi seemit raha - ye bhi same precedent follow karta hai (cheekbone ke neeche jaw ke saath wali hollow sabse universal contour placement hai) har real-world spot ek saath cover karne ki jagah. `JAW_HOLLOW_LEFT_INDEX`/`JAW_HOLLOW_RIGHT_INDEX` is build se pehle hi constants file ke apne comment mein exactly isi ke liye reserve the.
- **Anchor + offset, raw landmark nahi**: `JAW_HOLLOW_LEFT_INDEX`/`JAW_HOLLOW_RIGHT_INDEX` `FACE_OVAL_INDICES` ke apne boundary loop ka part hain (wo seedha jaw edge pe baithte hain, cheek ki hollow ke andar nahi) - `applyContourFace` anchor ko draw karne se pehle inward (face ke horizontal center ki taraf, `CONTOUR_INWARD_OFFSET_RATIO`) aur upward (jawline ke upar cheek hollow ki taraf, `CONTOUR_UPWARD_OFFSET_RATIO`) nudge karta hai, same "anchor + offset" pattern jo CONCEALER ka `UNDER_EYE_OFFSET_RATIO` already establish kar chuka hai.
- **Black ki taraf darkened, raw shade color pe painted nahi**: HIGHLIGHTER ke `mixTowardWhite` ka mirror image - ek naya `mixTowardBlack` helper (`CONTOUR_DARKEN_RATIO = 0.35`) shade ke RGB ko gradient tak pahunchne se pehle black ki taraf mix karta hai, poori tarah plain JS math mein, koi canvas blend mode nahi - same reasoning jo HIGHLIGHTER ki apni whitening already establish kar chuki hai (blend-mode-over-blank-canvas bug class ko sidestep karta hai jo FOUNDATION ki real-device history ne already prove kiya tha).
- **Taller ellipse, BLUSH ka circle ya CONCEALER ka flat crescent nahi**: `CONTOUR_BLOB_ASPECT_RATIO = 1.4` (> 1, `radiusY > radiusX`) jaw hollow ke apne vertical drop ko follow karta hai, CONCEALER ke wider-than-tall under-eye shape se ulti orientation.
- **`drawFeatheredBlob` as-is reuse hua**: shared gradient-blob primitive mein koi change nahi chahiye tha (CONCEALER ne already `radiusX`/`radiusY` ke liye generalize kar diya tha); CONTOUR bas `radiusY > radiusX` aur ek darkened color ke saath call karta hai, lightened color ki jagah.
- **Ab tak ki verification**: `npx tsc --noEmit`, `eslint`, aur poori `vitest` suite (63/63, ek naye `applyContourFace` smoke test samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte, isliye ek synthetic-face script (temporary, commit nahi kiya) use kiya `applyContourFace` ko ek actual oval-shaped fixture pe (eyes/mouth drawn in) render karke - confirm hua ki shadow cheek hollow mein land hoti hai (raw jaw anchor se visibly offset, alag se marked), base tone se visibly darker rehti hai, aur kabhi eyes ya mouth ko touch nahi karti. Visually correct hai, lekin ye real-device QA ka substitute nahi hai. HIGHLIGHTER ke apne real-device follow-up ne paaya ki uska default alpha real photo pe notice karne layak nahi tha, isliye CONTOUR ka apna default (`0.25`, ek `{0.1, 0.5}` range ka) real-device testing shuru hote hi wahi real-photo sanity check paana chahiye, sirf ye assume karne ki jagah ki synthetic check ki visibility carry over hogi.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), [BLUSH.md](./BLUSH.md), [CONCEALER.md](./CONCEALER.md), and [HIGHLIGHTER.md](./HIGHLIGHTER.md).

> **Status**: Freshly built, baaki teen localized finishes ke apne real-device pass se pehle jaisa hi starting point - code/architecture/tests solid, **Real-device QA shuru nahi hua**. Koi dedicated `CONTOUR-10-10-PLAN.md` abhi nahi hai - wo tab banega jab real-device testing actually shuru ho, baaki jaisa hi order.

| #   | Dimension            | Score   | Kyun                                                                                                                                                                                                              |
| --- | -------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10    | Missing-landmark guard, face-oval clip safety net, turn-detection guard sab present - koi known gap nahi, lekin real-device par kabhi nahi chala.                                                                 |
| 2   | Test coverage        | 7/10    | 1 smoke test (renders without throwing, paints pixels) - koi dedicated geometry/darkening unit test nahi.                                                                                                         |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                        |
| 4   | Real-device QA       | 0/10    | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta. HIGHLIGHTER ke "default alpha real photo pe barely visible tha" lesson yahan bhi lag sakta hai - explicitly flag kiya gaya hai. |
| 5   | UX polish            | 8/10    | FOUNDATION/BLUSH/CONCEALER/HIGHLIGHTER ke fixes (overlay a11y, turn-icon) automatically inherited hain - CONTOUR ka apna dedicated UX audit abhi nahi hua.                                                        |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn + ek switch case, bilkul baaki finishes jaisa reuse. Naya `mixTowardBlack` helper bhi self-contained hai.                                                            |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyContourFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                                                               |
| 8   | Performance          | 6/10    | Code-side cost-profile baaki localized finishes jaisa hi (ek temp-canvas, do gradient fill) - real FPS numbers #4 pe depend karte hain.                                                                           |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                           |

**Overall**: ~**7.7/10** — BLUSH/CONCEALER/HIGHLIGHTER ke apne starting score jaisa hi shape. Next step (jab ready ho): real-device Live + Upload testing (default alpha ki real-photo visibility bhi explicitly check karna, HIGHLIGHTER ke real-device lesson ke baad), phir agar gaps milte hain to `CONTOUR-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
