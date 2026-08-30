# Try-On Feature — Master Tracker

Virtual try-on ko 6 main categories me build karna hai — **LIP, EYE, HAIR, FACE, NAIL, SKIN** — har ek ke apne subcategories, aur har subcategory do modes me kaam kare:

- **Live mode** — webcam se real-time try-on
- **Upload mode** — user apni photo upload karke try-on dekh sake

Per-category detail aur checklist alag file me hai. Ye file sirf overall status aur un cheezon ke liye hai jo **sab categories ke liye common/shared** hai (ek baar ban gayi to sabko fayda).

> Status snapshot: **LIP category ab poori tarah complete hai (10/10, [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md) done)** — real engine ban gaya (MediaPipe FaceLandmarker + canvas rendering), Live aur Upload dono modes me sabhi 11 subcategories (MATTE/STAIN/SATIN/GLOSS/BALM/SHIMMER/CRAYON/OIL/METALLIC/PLUMPER/LINER) actually render karte hain, shade+finish picker se driven, aur real-device QA (Android/iOS/Safari) bhi ho chuki hai. `ProductDetails` page pe "Try-On" button wired hai — [ProductDetails/index.tsx:324](../../src/pages/product/ProductDetails/index.tsx#L324). Engine architecture class-based hai (reference `src/commverse` se adapt kiya, dekh [LIP.md](./LIP.md)) — per-category `EngineBase` + do generic mixins (`withLiveCamera`/`withImageUpload`) jo sabhi categories reuse karenge, aur FACE ne ye bina kisi change ke prove kiya. **FACE category shuru ho chuki hai** — FOUNDATION poori tarah complete hai (**10/10** ✅, [FOUNDATION.md](./FOUNDATION.md), real-device QA bhi ho chuki hai), BLUSH build ho chuki hai (~7.7/10, [BLUSH.md](./BLUSH.md), abhi real-device QA baaki hai), baaki 6 subcategories abhi unbuilt hain.

## Shared prerequisites (ye pehle banao — sabko block karte hain)

- [x] Face-landmark tracking engine select + integrate — MediaPipe `@mediapipe/tasks-vision`, shared/cached singleton — [FaceLandmarkerCache.ts](../../src/classes/tryon/FaceLandmarkerCache.ts). LIP/EYE/FACE/HAIR/SKIN sab isi ko reuse kar sakte hain (same face mesh, alag landmark indices bas). Model file (~3.7MB) self-hosted hai (`public/models/try-on/face_landmarker.task`), Google ke CDN se nahi — uska `Cache-Control` sirf 1-hour tha, isliye self-host + [vercel.json](../../vercel.json) me explicit `max-age=31536000, immutable` header diya. WASM runtime jsDelivr se hi aata hai (usko already 1-saal immutable milta hai, move karne ki zaroorat nahi thi). Model kabhi update karna ho to naya file yahi path pe manually download/replace karna hoga - sirf pinned version number badalna kaafi nahi hoga (jaisa WASM ke liye hai)
- [ ] Hand/finger-landmark tracking engine select + integrate — sirf NAIL ke liye alag model chahiye
- [x] Shared camera-access module (permission handling, live `<video>` stream, mirror) — [withLiveCamera.ts](../../src/classes/tryon/withLiveCamera.ts) (mixin, ek baar likha, saari categories reuse karengi)
- [x] Shared photo-upload module (file input, preview, image validation) — [useTryOnUpload.ts](../../src/hooks/useTryOnUpload.ts) (validation) + [withImageUpload.ts](../../src/classes/tryon/withImageUpload.ts) (mixin, load+detect+render)
- [x] Shared Try-On modal/page shell — [components/layout/tryons/](../../src/components/layout/tryons/index.tsx)
- [x] Generic color/texture blend engine — [TryOnEngineBase.ts](../../src/classes/tryon/TryOnEngineBase.ts) ka `applyEffect` abstraction + category-specific rendering (LIP ke liye [tryon-utils/lip.ts](../../src/utils/tryon-utils/lip.ts), FACE ke liye [tryon-utils/face.ts](../../src/utils/tryon-utils/face.ts)) — dono categories ne bina kisi shared-code change ke reuse kiya
- [x] Result actions (partial) — screenshot/download ban gaya (`takeSnapshot()`); "Add to Cart" seedha try-on screen se abhi pending

Inme se koi bhi cheez kisi ek category ke andar dobara nahi likhni — ek baar yaha ban jaye to har category file usko "reused" maan legi.

## Category trackers

| Category    | Subcategories | Progress          | File                                                                                       |
| ----------- | ------------- | ----------------- | ------------------------------------------------------------------------------------------ |
| LIP         | 11            | 100% (88/88) ✅   | [LIP.md](./LIP.md)                                                                         |
| EYE         | 7             | 0% (0/56)         | [EYE.md](./EYE.md)                                                                         |
| HAIR        | 4             | 0% (0/32)         | [HAIR.md](./HAIR.md)                                                                       |
| FACE        | 8             | 21.9% (14/64)     | [FACE.md](./FACE.md) — FOUNDATION [detail](./FOUNDATION.md) ✅, BLUSH [detail](./BLUSH.md) |
| NAIL        | 5             | 0% (0/40)         | [NAIL.md](./NAIL.md)                                                                       |
| SKIN        | 8             | 0% (0/64)         | [SKIN.md](./SKIN.md)                                                                       |
| **Overall** | **43**        | **30% (102/344)** | —                                                                                          |

## Suggested build order

1. **LIP** ✅ done — sabse simple region (single landmark ring), high product volume, sabse zyada learning yahi milegi baaki categories ke liye
2. **FACE** 🔄 in progress (FOUNDATION ✅ done 10/10, BLUSH 🔄 built/pending real-device QA, 6 aur subcategories baaki) — same face-landmark engine reuse, thoda bada region set
3. **EYE** — precision-heavy (thin lines, lash detail), zyada QA chahiye
4. **HAIR** — segmentation-based (landmark nahi, poore strand ka mask), alag technique
5. **NAIL** — naya tracking model (hand/finger) integrate karna padega, isliye baad me
6. **SKIN** — sabse last, kyunki ismein ek design decision pending hai (neeche [SKIN.md](./SKIN.md) me note dekho) — ye "shade try-on" nahi, "finish/glow simulation" hai

## Progress kaise track karein

Har subcategory ke 8 checklist items hain — 4 Live mode ke, 4 Upload mode ke. `[ ]` ko `[x]` karo jaise-jaise kaam complete ho.

- **Subcategory %** = checked items / 8
- **Category %** = us category ke total checked items / total items (summary table upar hi bana hua hai har file me)
- **Overall %** = sabhi 344 items me se checked / 344

Jab bhi kaam land ho, checklist update karo + is file ke summary table ka % bhi update karo (ya mujhe bol do, main recompute kar dunga).
