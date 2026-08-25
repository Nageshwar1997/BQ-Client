# Try-On Feature — Master Tracker

Virtual try-on ko 6 main categories me build karna hai — **LIP, EYE, HAIR, FACE, NAIL, SKIN** — har ek ke apne subcategories, aur har subcategory do modes me kaam kare:

- **Live mode** — webcam se real-time try-on
- **Upload mode** — user apni photo upload karke try-on dekh sake

Per-category detail aur checklist alag file me hai. Ye file sirf overall status aur un cheezon ke liye hai jo **sab categories ke liye common/shared** hai (ek baar ban gayi to sabko fayda).

> Status snapshot: koi bhi category abhi build nahi hui. `ProductDetails` page pe "Try-On" button already hai but disabled/no-op — [ProductDetails/index.tsx:324](../../src/pages/product/ProductDetails/index.tsx#L324). `TryOn` layout component sirf placeholder stub hai — [components/layout/tryons/index.tsx](../../src/components/layout/tryons/index.tsx). Category/subcategory taxonomy `@beautinique/shared-constants` package se aata hai (`TRY_ON_MAP`), yaha isi ko reference kiya gaya hai.

## Shared prerequisites (ye pehle banao — sabko block karte hain)

- [ ] Face-landmark tracking engine select + integrate (MediaPipe / Banuba / ModiFace jaisa kuch) — LIP, EYE, FACE, HAIR, SKIN sab isi pe depend karte hain
- [ ] Hand/finger-landmark tracking engine select + integrate — sirf NAIL ke liye alag model chahiye
- [ ] Shared camera-access module (permission handling, live `<video>` stream component, mirror/orientation fix)
- [ ] Shared photo-upload module (file input, preview, crop/align, image validation)
- [ ] Shared Try-On modal/page shell — "Try-On" button se open ho, Live ⇄ Upload switcher ho, product ke `tryOn.category`/`subCategory` se sahi renderer load ho
- [ ] Generic color/texture blend engine — matte/gloss/shimmer/metallic jaise finishes reuse kar sake
- [ ] Result actions — screenshot save/download/share, aur "Add to Cart" seedha try-on screen se

Inme se koi bhi cheez kisi ek category ke andar dobara nahi likhni — ek baar yaha ban jaye to har category file usko "reused" maan legi.

## Category trackers

| Category | Subcategories | Progress | File |
|---|---|---|---|
| LIP | 11 | 0% (0/88) | [LIP.md](./LIP.md) |
| EYE | 7 | 0% (0/56) | [EYE.md](./EYE.md) |
| HAIR | 4 | 0% (0/32) | [HAIR.md](./HAIR.md) |
| FACE | 8 | 0% (0/64) | [FACE.md](./FACE.md) |
| NAIL | 5 | 0% (0/40) | [NAIL.md](./NAIL.md) |
| SKIN | 8 | 0% (0/64) | [SKIN.md](./SKIN.md) |
| **Overall** | **43** | **0% (0/344)** | — |

## Suggested build order

1. **LIP** — sabse simple region (single landmark ring), high product volume, sabse zyada learning yahi milegi baaki categories ke liye
2. **FACE** — same face-landmark engine reuse, thoda bada region set
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
