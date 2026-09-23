# LIP Try-On Tracker

[← Back to master tracker](./README.md)

_Tracking model: face landmarks (lip contour ring). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> Engine built: [classes/tryon/categories/lip/](../../src/classes/tryon/categories/lip/) (`LipEngineBase` + `LipLiveEngine`/`LipUploadEngine`, on top of the shared generic `TryOnEngineBase`/`withLiveCamera`/`withImageUpload`). Sabhi 11 subcategories (MATTE/STAIN/SATIN/GLOSS/BALM/SHIMMER/CRAYON/OIL/METALLIC/PLUMPER/LINER) render for real (verified end-to-end in both modes: MediaPipe FaceLandmarker loads, texture assets load, shade+finish picker drives the engine live) — `UNSUPPORTED_LIP_FINISHES` (`LipEngineBase.ts`) empty hai, koi finish MATTE-fallback pe nahi hai. **Real-device QA bhi ho chuki hai** (Android/iOS/Safari, [LIP-REAL-DEVICE-QA.md](./LIP-REAL-DEVICE-QA.md) checklist ke against, user ne end-to-end confirm kiya) — see [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), jo ab **complete** hai.

## Summary

| Subcategory | Live (4/4) | Upload (4/4) | Overall            |
| ----------- | ---------- | ------------ | ------------------ |
| MATTE       | 4/4        | 4/4          | 100%               |
| SATIN       | 4/4        | 4/4          | 100%               |
| GLOSS       | 4/4        | 4/4          | 100%               |
| SHIMMER     | 4/4        | 4/4          | 100%               |
| STAIN       | 4/4        | 4/4          | 100%               |
| BALM        | 4/4        | 4/4          | 100%               |
| LINER       | 4/4        | 4/4          | 100%               |
| CRAYON      | 4/4        | 4/4          | 100%               |
| OIL         | 4/4        | 4/4          | 100%               |
| METALLIC    | 4/4        | 4/4          | 100%               |
| PLUMPER     | 4/4        | 4/4          | 100%               |
| **Total**   | **44/44**  | **44/44**    | **100% (88/88)** ✅ |

## Details

<details>
<summary><strong>MATTE</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Flat matte-color blend (koi shine nahi) real-time me render hota hai
- [x] Shade/variant picker functional (product variants se linked)
- [x] Performance & cross-device QA (FPS, lighting conditions)

**Upload**

- [x] Photo upload + lip-landmark detection static image pe
- [x] Flat matte-color blend image pe apply hota hai
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>SATIN</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Soft semi-sheen blend (low-gloss highlight) real-time me render hota hai
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection static image pe
- [x] Soft semi-sheen blend image pe apply hota hai
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>GLOSS</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Specular highlight + wet-shine overlay real-time me render hota hai
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection static image pe
- [x] Specular highlight + wet-shine overlay image pe apply hota hai
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>SHIMMER</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Sparkle/shimmer particle overlay real-time me render hota hai
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection static image pe
- [x] Sparkle/shimmer particle overlay image pe apply hota hai
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>STAIN</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Translucent low-opacity tint blend real-time me render hota hai
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection static image pe
- [x] Translucent low-opacity tint blend image pe apply hota hai
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>BALM</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Sheer glossy tint + moisture-shine overlay real-time me render hota hai
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection static image pe
- [x] Sheer glossy tint + moisture-shine overlay image pe apply hota hai
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>LINER</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-contour edge tracking wired
- [x] Outer lip contour ke saath ek wide, blurred stroke real-time me render hota hai, lip fill region mein hard-clipped - outward (skin) side pe crisp cutoff, inward (lip) side pe soft natural fade (`applyLinerLips`, `utils/tryon-utils/lip.ts`)
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-contour edge detection static image pe
- [x] Same stroke rendering image pe apply hoti hai
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>CRAYON</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Matte stroke-texture fill (waxy finish) real-time me render hota hai
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection static image pe
- [x] Matte stroke-texture fill image pe apply hota hai
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>OIL</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] High-gloss fluid overlay light-refraction shine ke saath real-time me render hota hai (dedicated `Oil-Upper/Lower.webp` assets, apna `TEXTURED_FINISH_TUNING.OIL` entry)
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection static image pe
- [x] High-gloss fluid overlay image pe apply hota hai
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>METALLIC</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Chrome/foil reflective texture overlay real-time me render hota hai (dedicated `Metallic-Upper/Lower.webp` assets, apna `TEXTURED_FINISH_TUNING.METALLIC` entry)
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection static image pe
- [x] Chrome/foil reflective texture overlay image pe apply hota hai
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>PLUMPER</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Gloss-texture overlay apni dedicated alpha tuning ke saath real-time me render hota hai (`TEXTURED_FINISH_TUNING.PLUMPER`) — deliberately GLOSS/SATIN/BALM ka texture asset share karta hai (`GLOSS_OR_SATIN_OR_BALM_OR_PLUMPER_TEXTURE_PATH_*`, `constants/tryon-constants/lip.ts` dekho) duplicate karne ki jagah, lekin baad mein independently swappable rehta hai kyunki ye apna named field/tuning entry hai, ek alias nahi. Koi geometric volume/distortion effect nahi - ek canvas-2D color/texture overlay se achieve karne layak nahi, scope se bahar
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection static image pe
- [x] Same overlay image pe apply hota hai
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

---

[← Back to master tracker](./README.md)
