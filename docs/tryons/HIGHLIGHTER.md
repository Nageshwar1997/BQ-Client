# HIGHLIGHTER Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (cheekbone anchor points, ek per side) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke sabhi 8 subcategories ki ab apni-apni dedicated tracker file ban chuki hai (isi HIGHLIGHTER.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[CONCEALER.md](./CONCEALER.md)/[CONTOUR.md](./CONTOUR.md)/[BRONZER.md](./BRONZER.md)/[BBCREAM.md](./BBCREAM.md)/[COMPACTPOWDER.md](./COMPACTPOWDER.md) jaisi) - [FACE.md](./FACE.md) ab sirf ek index/summary reh gaya hai, waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyHighlighterFace`](../../src/utils/tryon-utils/face.ts) - cheekbone anchor (`CHEEKBONE_LEFT_INDEX`/`CHEEKBONE_RIGHT_INDEX` - constants mein already prepared, pehle sirf turn-detection ke liye use ho rahe the) par centered ek tight, feathered glow blob (BLUSH ke broader cheek-wash se chhota - `HIGHLIGHTER_BLOB_RADIUS_RATIO` `LOCALIZED_BLOB_RADIUS_RATIO` se kam hai, kyunki real highlight ek concentrated point hoti hai, poori cheek ka flush nahi). Sabse bada difference: color khud shade ke raw hue se paint nahi hota - `mixTowardWhite` use karke white ki taraf mix kiya jaata hai (`HIGHLIGHTER_WHITEN_RATIO`) taaki "light catch karna" wala glow-jaisa look mile, sirf ek flat pale patch nahi. Ye pure RGB math hai (koi canvas blend mode nahi) - FOUNDATION ke `multiply`-on-blank-canvas history ke baad, blend modes deliberately avoid kiye gaye hain. Face-oval mein clip hota hai (safety net). Eye-erase ki zaroorat nahi thi (CONCEALER ke ulat) - cheekbone anchor eyes se kaafi door hai, synthetic-face check se confirm kiya.

## Summary

| Mode    | Done  | Total | %                                    |
| ------- | ----- | ----- | ------------------------------------ |
| Live    | 3     | 4     | 75%                                  |
| Upload  | 3     | 4     | 75%                                  |
| **All** | **6** | **8** | **75% — [detail](./HIGHLIGHTER.md)** |

## Checklist

**Live**

- [x] Camera capture + cheekbone/brow-bone landmark tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, cheekbone indices samet, extra wiring nahi chahiye.
- [x] Glow overlay high points ke saath real-time me render hota hai — `applyHighlighterFace` ko `FaceEngineBase.applyEffect`'s switch mein `'HIGHLIGHTER'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai FOUNDATION/BLUSH/CONCEALER jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional — generic FACE UI, FOUNDATION/BLUSH/CONCEALER ke liye already proven working, HIGHLIGHTER-specific change nahi chahiye.
- [ ] Performance & cross-device QA — real-device pass abhi shuru nahi hua.

**Upload**

- [x] Photo upload + cheekbone/brow-bone detection static image pe — FOUNDATION/BLUSH/CONCEALER jaisa hi shared upload pipeline.
- [x] Glow overlay high points ke saath image pe apply hoti hai — same `applyHighlighterFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — abhi tak real uploaded photo pe confirm nahi hua.

## Design notes

- **Sirf cheekbone, brow-bone/nose-bridge/chin nahi**: ek real highlighter routine kayi high points hit karta hai, lekin BLUSH/CONCEALER ka apna v1 scope do anchors tak hi seemit raha - ye bhi same precedent follow karta hai (cheekbone ka top sabse universal, hamesha-recognizable placement hai) har real-world spot ek saath cover karne ki jagah. `CHEEKBONE_LEFT_INDEX`/`CHEEKBONE_RIGHT_INDEX` is build se pehle hi constants file ke apne comment mein exactly isi ke liye reserve the.
- **White ki taraf lightened, raw shade color pe painted nahi**: BLUSH/CONCEALER dono chosen shade ko directly paint karte hain (bas low alpha pe). Ek highlighter ka poora cosmetic kaam light catch aur reflect karna hai - product ki apni swatch se _lighter_ dikhna, sirf ek paler version nahi. `mixTowardWhite` (`HIGHLIGHTER_WHITEN_RATIO = 0.45`) shade ke RGB ko gradient tak pahunchne se pehle hi white ki taraf blend karta hai, poori tarah plain JS math mein - deliberately koi canvas blend mode nahi (`screen`/`lighten` waghera), kyunki FOUNDATION ki apni real-device history ne already prove kar diya tha ki ek blank temp canvas pe blend mode ek genuine cross-browser inconsistency hai (FOUNDATION.md ki bug log dekho). Ye poori bug class ko construction se hi sidestep kar deta hai.
- **BLUSH se tighter blob**: `HIGHLIGHTER_BLOB_RADIUS_RATIO` (0.1) `LOCALIZED_BLOB_RADIUS_RATIO` (0.16, BLUSH ka) se notably chhota hai - ek highlight ek concentrated point jaisa dikhta hai, broad flush nahi.
- **Eye-erase ki zaroorat nahi**: CONCEALER ke ulat (jiska under-eye anchor seedha eye ke saath baithta hai), cheekbone anchor eyes se itna door hai ki gradient ka soft tail kabhi wahan tak nahi pahunchta - same reasoning jispe BLUSH ka apna cheek-apple anchor already depend karta hai. Synthetic-face visual check se confirm kiya, sirf assume nahi kiya.
- **`drawFeatheredBlob` as-is reuse hua**: shared gradient-blob primitive mein koi change nahi chahiye (CONCEALER ne already `radiusX`/`radiusY` ke liye generalize kar diya apne ellipse ke liye; HIGHLIGHTER bas equal radii ke saath call karta hai, BLUSH jaisa).
- **Ab tak ki verification**: `npx tsc --noEmit`, `eslint`, aur poori `vitest` suite (62/62, ek naye `applyHighlighterFace` smoke test samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte, isliye ek synthetic-face script (temporary, commit nahi kiya) use kiya `applyHighlighterFace` ko ek actual oval-shaped fixture pe (eyes drawn in) render karke - confirm hua ki glow cheekbone pe land hota hai, base tone se visibly lighter rehta hai, aur kabhi eyes ko touch nahi karta. Visually correct hai, lekin ye real-device QA ka substitute nahi hai.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), [BLUSH.md](./BLUSH.md), and [CONCEALER.md](./CONCEALER.md).

> **Status**: Freshly built, BLUSH/CONCEALER/FOUNDATION ke apne 10/10 push se pehle jaisa hi starting point - code/architecture/tests solid, **Real-device QA shuru nahi hua**. Koi dedicated `HIGHLIGHTER-10-10-PLAN.md` abhi nahi hai - wo tab banega jab real-device testing actually shuru ho, baaki jaisa hi order.

| #   | Dimension            | Score   | Kyun                                                                                                                                                    |
| --- | -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10    | Missing-landmark guard, face-oval clip safety net, turn-detection guard sab present - koi known gap nahi, lekin real-device par kabhi nahi chala.       |
| 2   | Test coverage        | 7/10    | 1 smoke test (renders without throwing, paints pixels) - koi dedicated geometry/whitening unit test nahi.                                               |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                              |
| 4   | Real-device QA       | 0/10    | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta.                                                                       |
| 5   | UX polish            | 8/10    | FOUNDATION/BLUSH/CONCEALER ke fixes (overlay a11y, turn-icon) automatically inherited hain - HIGHLIGHTER ka apna dedicated UX audit abhi nahi hua.      |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn + ek switch case, bilkul BLUSH/CONCEALER jaisa reuse. Naya `mixTowardWhite` helper bhi self-contained hai. |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyHighlighterFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                 |
| 8   | Performance          | 6/10    | Code-side cost-profile BLUSH jaisa hi (ek temp-canvas, do gradient fill) - real FPS numbers #4 pe depend karte hain.                                    |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                 |

**Overall**: ~**7.7/10** — BLUSH/CONCEALER/FOUNDATION ke apne starting score jaisa hi shape. Next step (jab ready ho): real-device Live + Upload testing, phir agar gaps milte hain to `HIGHLIGHTER-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
