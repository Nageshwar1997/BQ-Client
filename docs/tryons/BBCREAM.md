# BBCREAM Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (face-oval region, minus eyes/eyebrows/mouth) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke sabhi 8 subcategories ki ab apni-apni dedicated tracker file ban chuki hai (isi BBCREAM.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[CONCEALER.md](./CONCEALER.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[CONTOUR.md](./CONTOUR.md)/[BRONZER.md](./BRONZER.md)/[COMPACTPOWDER.md](./COMPACTPOWDER.md) jaisi) - [FACE.md](./FACE.md) ab sirf ek index/summary reh gaya hai, waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyBbCreamFace`](../../src/utils/tryon-utils/face.ts) - FOUNDATION/BRONZER jaisa hi **full-face wash** hai (face-oval clip, eyes/eyebrows/mouth punched out, same shared `fillFaceOvalRegion` helper), FACE.md ki apni description ("full-face segmentation", "sheer full-face tinted blend, lighter than foundation") ke saath match karta hai. Farak sirf itna hai: koi color-mix transform nahi lagta (na HIGHLIGHTER jaisa whitening, na BRONZER jaisa warm-shift) - "lighter than foundation" ek alpha concern hai, hue concern nahi, isliye `applyBbCreamFace` seedha `BBCREAM_BASE_ALPHA` (0.35) ko apne color string mein bake karta hai FOUNDATION ke fixed 0.6 ki jagah, phir wahi `fillFaceOvalRegion` ko reuse karta hai.

## Summary

| Mode    | Done  | Total | %                                |
| ------- | ----- | ----- | -------------------------------- |
| Live    | 3     | 4     | 75%                              |
| Upload  | 3     | 4     | 75%                              |
| **All** | **6** | **8** | **75% — [detail](./BBCREAM.md)** |

## Checklist

**Live**

- [x] Camera capture + full-face segmentation wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, extra wiring nahi chahiye.
- [x] Sheer full-face tinted blend (foundation se lighter) real-time me render hota hai — `applyBbCreamFace` ko `FaceEngineBase.applyEffect`'s switch mein `'BBCREAM'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai FOUNDATION/BRONZER jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional — generic FACE UI, har doosri FACE finish ke liye already proven working, BBCREAM-specific change nahi chahiye.
- [ ] Performance & cross-device QA — real-device pass abhi shuru nahi hua.

**Upload**

- [x] Photo upload + full-face segmentation static image pe — FOUNDATION/BRONZER jaisa hi shared upload pipeline.
- [x] Sheer full-face tinted blend image pe apply hoti hai — same `applyBbCreamFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — abhi tak real uploaded photo pe confirm nahi hua.

## Design notes

- **Full-face wash, koi localized blob nahi**: FOUNDATION/BRONZER jaisi hi architecture family (dono shared `fillFaceOvalRegion` helper se poora face-oval region fill karte hain), BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR ke single-anchor feathered blobs jaisa nahi. FACE.md ki apni BB cream description ("full-face segmentation", "sheer full-face tinted blend") se match karta hai.
- **Koi color-mix transform nahi - sheerness ek alpha concern hai, hue concern nahi**: HIGHLIGHTER white ki taraf mix karta hai aur BRONZER warm-shift karta hai kyunki wo effects genuinely skin ka _color_ badalne ke baare me hain. BB cream aisa nahi hai - FACE.md ki apni wording sirf "lighter than foundation" hai, matlab same shade ka kam coverage, alag-color effect nahi. Isliye `applyBbCreamFace` koi bhi per-channel color transform skip karta hai aur iski jagah ek lower `BBCREAM_BASE_ALPHA` (0.35) apni color string mein bake karta hai, FOUNDATION ke fixed 0.6 base opacity ki jagah.
- **Sheerness ko render me kyun bake kiya, sirf slider bounds mein kyun nahi**: `FACE_RANGE_BOUNDS.BBCREAM` ki ceiling already FOUNDATION se kam hai (`max: 0.5`), lekin akeli lower ceiling sirf tab tak "lighter than foundation" guarantee karti hai jab tak koi slider ko us ceiling ke kareeb kisi aise foundation ke against na le jaye jiska apna alpha khud kam ho. `BBCREAM_BASE_ALPHA` ko render me hi bake karne se "sheerer than foundation" ek structural guarantee ban jaata hai, slider kahin bhi ho - same reasoning jo LIP ke `applyStainLips` ne already use ki thi (`Math.min(alpha, 0.35)`) taaki STAIN slider ki parwaah kiye bina genuinely sheer rahe.
- **Ab tak ki verification**: `npx tsc --noEmit`, `eslint`, aur poori `vitest` suite (65/65, ek naye `applyBbCreamFace` smoke test samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte, isliye ek synthetic-face script (temporary, commit nahi kiya) ne BBCREAM aur FOUNDATION ko ek identical mid-tone background pe, same shade aur same slider alpha pe side-by-side render kiya - confirm hua ki dono same face-oval region ko identically fill karte hain (same clip, same eye/eyebrow/mouth exclusion) aur BBCREAM ka average color FOUNDATION se measurably background ke kareeb baithta hai (matlab genuinely sheerer, background zyada dikhta hai), jo exported PNGs mein aankh se bhi dikhta hai. Visually correct hai, lekin ye real-device QA ka substitute nahi hai - aur HIGHLIGHTER ke apne real-device lesson ke hisaab se (default alpha real photo pe notice karne layak nahi tha), BBCREAM ka default alpha (already kisi bhi full-face FACE finish ka sabse lowest, design se) real-device testing shuru hote hi wahi real-photo sanity check paana chahiye - ye finish "kuch hua hi nahi" jaisa dikhne ke sabse zyada risk mein hai.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), [BLUSH.md](./BLUSH.md), [CONCEALER.md](./CONCEALER.md), [HIGHLIGHTER.md](./HIGHLIGHTER.md), [CONTOUR.md](./CONTOUR.md), and [BRONZER.md](./BRONZER.md).

> **Status**: Freshly built, baaki paanch finishes ke apne real-device pass se pehle jaisa hi starting point - code/architecture/tests solid, **Real-device QA shuru nahi hua**. Koi dedicated `BBCREAM-10-10-PLAN.md` abhi nahi hai - wo tab banega jab real-device testing actually shuru ho, baaki jaisa hi order.

| #   | Dimension            | Score   | Kyun                                                                                                                                                                                                                      |
| --- | -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10    | Same guards FOUNDATION/BRONZER already have (missing-landmark, face-oval clip, turn-detection) - koi known gap nahi, lekin real-device par kabhi nahi chala.                                                              |
| 2   | Test coverage        | 7/10    | 1 smoke test (renders without throwing, paints pixels) - koi dedicated "sheerer than FOUNDATION" comparison test committed nahi hai (sirf temporary script se manually confirm kiya).                                     |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                                |
| 4   | Real-device QA       | 0/10    | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta. HIGHLIGHTER ke "default alpha real photo pe barely visible tha" lesson yahan sabse zyada relevant hai (BBCREAM sabse sheer finish hai). |
| 5   | UX polish            | 8/10    | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - BBCREAM ka apna dedicated UX audit abhi nahi hua.                                                                                            |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn (no color-mix helper needed) + ek switch case. Same `fillFaceOvalRegion` reuse jo BRONZER ne establish kiya.                                                                 |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyBbCreamFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya - ab sirf COMPACTPOWDER bacha hai).                                                                     |
| 8   | Performance          | 6/10    | Code-side cost-profile FOUNDATION/BRONZER jaisa hi (ek temp-canvas, ek fill, koi extra color-math bhi nahi) - real FPS numbers #4 pe depend karte hain.                                                                   |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                   |

**Overall**: ~**7.7/10** — baaki paanch finishes ke apne starting score jaisa hi shape. Next step (jab ready ho): real-device Live + Upload testing (BBCREAM ki sheerness real photo pe visible/subtle dono check karna, kyunki ye sabse low-alpha FACE finish hai), phir agar gaps milte hain to `BBCREAM-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
