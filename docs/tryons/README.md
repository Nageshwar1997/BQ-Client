# Try-On Feature — Master Tracker

Virtual tryon ko 6 main categories me build karna hai — **LIP, EYE, HAIR, FACE, NAIL, SKIN** — har ek ke apne subcategories, aur har subcategory do modes me kaam kare:

- **Live mode** — webcam se real-time tryon
- **Upload mode** — user apni photo upload karke tryon dekh sake

Per-category detail aur checklist alag file me hai. Ye file sirf overall status aur un cheezon ke liye hai jo **sab categories ke liye common/shared** hai (ek baar ban gayi to sabko fayda).

> Status snapshot: **LIP category ab poori tarah complete hai (10/10, [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md) done)** — real engine ban gaya (MediaPipe FaceLandmarker + canvas rendering), Live aur Upload dono modes me sabhi 11 subcategories (MATTE/STAIN/SATIN/GLOSS/BALM/SHIMMER/CRAYON/OIL/METALLIC/PLUMPER/LINER) actually render karte hain, shade+finish picker se driven, aur real-device QA (Android/iOS/Safari) bhi ho chuki hai. `ProductDetails` page pe "Try-On" button wired hai — [ProductDetails/index.tsx:324](../../src/pages/product/ProductDetails/index.tsx#L324). Engine architecture class-based hai (reference `src/commverse` se adapt kiya, dekh [LIP.md](./LIP.md)) — per-category `EngineBase` + do generic mixins (`withLiveCamera`/`withImageUpload`) jo sabhi categories reuse karenge, aur FACE ne ye bina kisi change ke prove kiya. **FACE category ki saari 8 subcategories ab build ho chuki hain** — FOUNDATION poori tarah complete hai (**10/10** ✅, [FOUNDATION.md](./FOUNDATION.md), real-device QA bhi ho chuki hai), baaki saat (BLUSH, CONCEALER, HIGHLIGHTER, CONTOUR, BRONZER, BBCREAM, COMPACTPOWDER) code/tests/docs se complete hain (~7.7/10 each, [BLUSH.md](./BLUSH.md), [CONCEALER.md](./CONCEALER.md), [HIGHLIGHTER.md](./HIGHLIGHTER.md), [CONTOUR.md](./CONTOUR.md), [BRONZER.md](./BRONZER.md), [BBCREAM.md](./BBCREAM.md), [COMPACTPOWDER.md](./COMPACTPOWDER.md)) aur abhi real-device QA ka wait kar rahe hain - agla FACE milestone poori category ka real-device pass hai. **EYE category ka build shuru ho chuka hai** ([EYE-PLAN.md](./EYE-PLAN.md) planning doc) — EYE pehli category hai jisme color ke saath **pattern/style** bhi hai (LIP/FACE dono color-only the). Pehle teen subcategories ban chuke hain. EYELINER (~7.4/10, [EYELINER.md](./EYELINER.md)) aur KAJAL (~7.7/10, [KAJAL.md](./KAJAL.md)) ek hi shared tapered-stroke primitive pe (per [EYE-PLAN.md](./EYE-PLAN.md)'s build order, "EYELINER + KAJAL together") - EYELINER 7 patterns (Classic Thin/Bold Thick/Winged/Double Wing/Smokey/Tightline/Underliner), KAJAL 4 (Thin Waterline/Tightline Lower Lash/Smudged-Smokey/Full Bold Kohl) traced along the lower lash line/waterline instead, zero new rendering code needed. EYESHADOW (~7.4/10, [EYESHADOW.md](./EYESHADOW.md)) is EYE ka pehla finish jo ek poori _region_ wash karta hai (lash line se crease tak), thin stroke nahi - 6 patterns (Single Wash/Two-Tone Gradient/Smokey Eye/Cut Crease/Halo Eye/Under-Eye Smudge), largely EYELINER/KAJAL ke hi geometry helpers reuse karke banaya (`fillTaperedPath`/`buildTaperedRibbonPath`) plus FACE se ported color-mixing techniques (`mixTowardWhite`/`mixTowardBlack`). Teeno ek real uploaded photo pe live browser-verify ho chuke hain (pixel-level confirm kiya, sirf synthetic check nahi) - EYELINER ka apna wing-gap/fragmentation bug bhi is session me flood-fill connected-component analysis se root-caused aur fix hua (see [EYELINER.md](./EYELINER.md)'s Design notes), jisse KAJAL/EYESHADOW ko wahi bug free-me nahi mila. Baaki 4 EYE subcategories abhi unbuilt hain.

## Shared prerequisites (ye pehle banao — sabko block karte hain)

- [x] Face-landmark tracking engine select + integrate — MediaPipe `@mediapipe/tasks-vision`, shared/cached singleton — [FaceLandmarkerCache.ts](../../src/classes/tryon/FaceLandmarkerCache.ts). LIP/EYE/FACE/HAIR/SKIN sab isi ko reuse kar sakte hain (same face mesh, alag landmark indices bas). Model file (~3.7MB) self-hosted hai (`public/models/tryon/face_landmarker.task`), Google ke CDN se nahi — uska `Cache-Control` sirf 1-hour tha, isliye self-host + [vercel.json](../../vercel.json) me explicit `max-age=31536000, immutable` header diya. WASM runtime jsDelivr se hi aata hai (usko already 1-saal immutable milta hai, move karne ki zaroorat nahi thi). Model kabhi update karna ho to naya file yahi path pe manually download/replace karna hoga - sirf pinned version number badalna kaafi nahi hoga (jaisa WASM ke liye hai)
- [ ] Hand/finger-landmark tracking engine select + integrate — sirf NAIL ke liye alag model chahiye
- [x] Shared camera-access module (permission handling, live `<video>` stream, mirror) — [withLiveCamera.ts](../../src/classes/tryon/withLiveCamera.ts) (mixin, ek baar likha, saari categories reuse karengi)
- [x] Shared photo-upload module (file input, preview, image validation) — [useTryOnUpload.ts](../../src/hooks/useTryOnUpload.ts) (validation) + [withImageUpload.ts](../../src/classes/tryon/withImageUpload.ts) (mixin, load+detect+render)
- [x] Shared Try-On modal/page shell — [components/layout/tryons/](../../src/components/layout/tryons/index.tsx)
- [x] Generic color/texture blend engine — [TryOnEngineBase.ts](../../src/classes/tryon/TryOnEngineBase.ts) ka `applyEffect` abstraction + category-specific rendering (LIP ke liye [tryon-utils/lip.ts](../../src/utils/tryon-utils/lip.ts), FACE ke liye [tryon-utils/face.ts](../../src/utils/tryon-utils/face.ts)) — dono categories ne bina kisi shared-code change ke reuse kiya
- [x] Result actions (partial) — screenshot/download ban gaya (`takeSnapshot()`); "Add to Cart" seedha tryon screen se abhi pending

Inme se koi bhi cheez kisi ek category ke andar dobara nahi likhni — ek baar yaha ban jaye to har category file usko "reused" maan legi.

## Category trackers

| Category    | Subcategories | Progress            | File                                                                                                                                                                                                                                                                                                               |
| ----------- | ------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| LIP         | 11            | 100% (88/88) ✅     | [LIP.md](./LIP.md)                                                                                                                                                                                                                                                                                                 |
| EYE         | 7             | 32.1% (18/56)       | [EYE.md](./EYE.md) — EYELINER [detail](./EYELINER.md), KAJAL [detail](./KAJAL.md), EYESHADOW [detail](./EYESHADOW.md)                                                                                                                                                                                              |
| HAIR        | 4             | 0% (0/32)           | [HAIR.md](./HAIR.md)                                                                                                                                                                                                                                                                                               |
| FACE        | 8             | 78.125% (50/64)     | [FACE.md](./FACE.md) — FOUNDATION [detail](./FOUNDATION.md) ✅, BLUSH [detail](./BLUSH.md), CONCEALER [detail](./CONCEALER.md), HIGHLIGHTER [detail](./HIGHLIGHTER.md), CONTOUR [detail](./CONTOUR.md), BRONZER [detail](./BRONZER.md), BBCREAM [detail](./BBCREAM.md), COMPACTPOWDER [detail](./COMPACTPOWDER.md) |
| NAIL        | 5             | 0% (0/40)           | [NAIL.md](./NAIL.md)                                                                                                                                                                                                                                                                                               |
| SKIN        | 8             | 0% (0/64)           | [SKIN.md](./SKIN.md)                                                                                                                                                                                                                                                                                               |
| **Overall** | **43**        | **45.3% (156/344)** | —                                                                                                                                                                                                                                                                                                                  |

## Suggested build order

1. **LIP** ✅ done — sabse simple region (single landmark ring), high product volume, sabse zyada learning yahi milegi baaki categories ke liye
2. **FACE** 🔄 saari 8 subcategories built (FOUNDATION ✅ done 10/10, baaki saat 🔄 pending real-device QA) — same face-landmark engine reuse, thoda bada region set
3. **EYE** 🔄 in progress (EYELINER + KAJAL ✅ built together same shared stroke primitive, EYESHADOW ✅ built too - a new region-wash primitive reusing the same geometry helpers - baaki 4 subcategories baaki) — precision-heavy (thin lines, lash detail), zyada QA chahiye
4. **HAIR** — segmentation-based (landmark nahi, poore strand ka mask), alag technique
5. **NAIL** — naya tracking model (hand/finger) integrate karna padega, isliye baad me
6. **SKIN** — sabse last, kyunki ismein ek design decision pending hai (neeche [SKIN.md](./SKIN.md) me note dekho) — ye "shade tryon" nahi, "finish/glow simulation" hai

## Progress kaise track karein

Har subcategory ke 8 checklist items hain — 4 Live mode ke, 4 Upload mode ke. `[ ]` ko `[x]` karo jaise-jaise kaam complete ho.

- **Subcategory %** = checked items / 8
- **Category %** = us category ke total checked items / total items (summary table upar hi bana hua hai har file me)
- **Overall %** = sabhi 344 items me se checked / 344

Jab bhi kaam land ho, checklist update karo + is file ke summary table ka % bhi update karo (ya mujhe bol do, main recompute kar dunga).
