# BRONZER Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (face-oval region, minus eyes/eyebrows/mouth) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke sabhi 8 subcategories ki ab apni-apni dedicated tracker file ban chuki hai (isi BRONZER.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[CONCEALER.md](./CONCEALER.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[CONTOUR.md](./CONTOUR.md)/[BBCREAM.md](./BBCREAM.md)/[COMPACTPOWDER.md](./COMPACTPOWDER.md) jaisi) - [FACE.md](./FACE.md) ab sirf ek index/summary reh gaya hai, waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyBronzerFace`](../../src/utils/tryon-utils/face.ts) - BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR ke localized blobs se alag, ye **FOUNDATION jaisa hi full-face wash** hai (face-oval clip, eyes/eyebrows/mouth punched out) - FACE.md ki apni description ("full-face segmentation", "warm all-over glow") ke saath match karta hai. FOUNDATION ka poora fill/clip/erase/composite logic ek shared `fillFaceOvalRegion` helper mein nikal liya gaya (koi behavior change nahi, sirf extraction - FOUNDATION ka smoke test wahi pass hota hai jo pehle karta tha), phir BRONZER usi helper ko reuse karta hai. Farak sirf itna hai: paint karne se pehle chosen shade ko **warm-shift** kiya jaata hai (`applyWarmShift` - red thoda badhta hai, blue thoda ghatta hai) taaki ek neutral color-match wash na lage, balki ek genuine warm/sun-kissed glow lage.

## Summary

| Mode    | Done  | Total | %                                |
| ------- | ----- | ----- | -------------------------------- |
| Live    | 3     | 4     | 75%                              |
| Upload  | 3     | 4     | 75%                              |
| **All** | **6** | **8** | **75% — [detail](./BRONZER.md)** |

## Checklist

**Live**

- [x] Camera capture + full-face segmentation wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, extra wiring nahi chahiye.
- [x] Warm all-over glow blend real-time me render hota hai — `applyBronzerFace` ko `FaceEngineBase.applyEffect`'s switch mein `'BRONZER'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai FOUNDATION jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional — generic FACE UI, FOUNDATION aur har doosri FACE finish ke liye already proven working, BRONZER-specific change nahi chahiye.
- [ ] Performance & cross-device QA — real-device pass abhi shuru nahi hua.

**Upload**

- [x] Photo upload + full-face segmentation static image pe — FOUNDATION jaisa hi shared upload pipeline.
- [x] Warm all-over glow blend image pe apply hoti hai — same `applyBronzerFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — abhi tak real uploaded photo pe confirm nahi hua.

## Design notes

- **Full-face wash, koi localized blob nahi**: BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR (sab single-anchor feathered blobs) ke ulat, BRONZER architecturally FOUNDATION jaisa hi hai - poora face-oval region fill karta hai, ek spot nahi. Ye FACE.md ki apni BRONZER description ("full-face segmentation", "warm all-over glow blend") se match karta hai, ek localized-placement wale se nahi.
- **`fillFaceOvalRegion` FOUNDATION se nikala gaya**: FOUNDATION ka apna function body (temp-canvas, `clipToFaceOval`, fill, `eraseExcludedFeatures`, composite) ek shared helper mein nikal liya gaya taaki BRONZER (aur eventually BBCREAM/COMPACTPOWDER, jo FACE.md ke hisaab se dono full-face hain) usko reuse kar sakein, logic duplicate kiye bina. Ye ek pure extraction hai - FOUNDATION ka apna exported function ab bas helper ko exact same arguments ke saath call karta hai, aur iska apna smoke test unchanged pass hota hai, confirm karta hai ki jo pixels ye produce karta hai wo move nahi hue.
- **Warm-shifted, raw shade color pe painted nahi**: ek real bronzer ka poora kaam ek warm, sun-kissed glow jaisa dikhna hai, sirf ek neutral color-match wash nahi (same "make it read as the real cosmetic effect" reasoning jo HIGHLIGHTER ki whitening aur CONTOUR ki darkening localized finishes ke liye already establish kar chuki hai). `applyWarmShift` (`BRONZER_WARM_SHIFT`/`BRONZER_WARM_RATIO`) red ko upar aur blue ko neeche, ek fixed channel amount se shift karta hai - ek temperature-style shift, ek fixed absolute bronze color ki taraf mix nahi (jo har alag bronzer shade ko same hue ki taraf flatten kar deta). Plain per-channel RGB math hai, koi canvas blend mode nahi - same reasoning jo FOUNDATION ki apni real-device history batati hai ki blank temp canvas pe blend modes risky kyun hain.
- **Ab tak ki verification**: `npx tsc --noEmit`, `eslint`, aur poori `vitest` suite (64/64, ek naye `applyBronzerFace` smoke test samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte, isliye ek synthetic-face script (temporary, commit nahi kiya) ne BRONZER aur FOUNDATION ko exact same starting shade se side-by-side render kiya - confirm hua ki dono same face-oval region ko identically fill karte hain (same clip, same eye exclusion) aur BRONZER genuinely FOUNDATION ke plain wash se zyada warm/golden dikhta hai. Visually correct hai, lekin ye real-device QA ka substitute nahi hai - aur HIGHLIGHTER ke apne real-device lesson ke hisaab se (default alpha real photo pe notice karne layak nahi tha), BRONZER ka default alpha bhi real-device testing shuru hote hi wahi real-photo sanity check paana chahiye.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), [BLUSH.md](./BLUSH.md), [CONCEALER.md](./CONCEALER.md), [HIGHLIGHTER.md](./HIGHLIGHTER.md), and [CONTOUR.md](./CONTOUR.md).

> **Status**: Freshly built, baaki chaar finishes ke apne real-device pass se pehle jaisa hi starting point - code/architecture/tests solid, **Real-device QA shuru nahi hua**. Koi dedicated `BRONZER-10-10-PLAN.md` abhi nahi hai - wo tab banega jab real-device testing actually shuru ho, baaki jaisa hi order.

| #   | Dimension            | Score   | Kyun                                                                                                                                                                                |
| --- | -------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10    | Same guards FOUNDATION already has (missing-landmark, face-oval clip, turn-detection) - koi known gap nahi, lekin real-device par kabhi nahi chala.                                 |
| 2   | Test coverage        | 7/10    | 1 smoke test (renders without throwing, paints pixels) - koi dedicated warm-shift unit test nahi.                                                                                   |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                          |
| 4   | Real-device QA       | 0/10    | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta. HIGHLIGHTER ke "default alpha real photo pe barely visible tha" lesson yahan bhi check karna hai. |
| 5   | UX polish            | 8/10    | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - BRONZER ka apna dedicated UX audit abhi nahi hua.                                                      |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn + ek switch case. FOUNDATION ka `fillFaceOvalRegion` extraction bhi clean tha, iska smoke test unchanged pass hua.                     |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyBronzerFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                                 |
| 8   | Performance          | 6/10    | Code-side cost-profile FOUNDATION jaisa hi (ek temp-canvas, ek fill, warm-shift ek chhota extra RGB math) - real FPS numbers #4 pe depend karte hain.                               |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                             |

**Overall**: ~**7.7/10** — baaki chaar finishes ke apne starting score jaisa hi shape. Next step (jab ready ho): real-device Live + Upload testing (warm-shift ki real-photo visibility bhi explicitly check karna), phir agar gaps milte hain to `BRONZER-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
