# LIP Try-On Tracker

[← Back to master tracker](./README.md)

_Tracking model: face landmarks (lip contour ring). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> Engine built: [classes/tryon/categories/lip/](../../src/classes/tryon/categories/lip/) (`LipEngineBase` + `LipLiveEngine`/`LipUploadEngine`, on top of the shared generic `TryOnEngineBase`/`withLiveCamera`/`withImageUpload`). Sabhi 11 subcategories (MATTE/STAIN/SATIN/GLOSS/BALM/SHIMMER/CRAYON/OIL/METALLIC/PLUMPER/LINER) render for real (verified end-to-end in both modes: MediaPipe FaceLandmarker loads, texture assets load, shade+finish picker drives the engine live) — `UNSUPPORTED_LIP_FINISHES` (`LipEngineBase.ts`) empty hai, koi finish MATTE-fallback pe nahi hai. **Real-device QA bhi ho chuki hai** (Android/iOS/Safari, [LIP-REAL-DEVICE-QA.md](./LIP-REAL-DEVICE-QA.md) checklist ke against, user ne end-to-end confirm kiya) — see [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), jo ab **complete** hai.

## Summary

| Subcategory | Live (4/4) | Upload (4/4) | Overall             |
| ----------- | ---------- | ------------ | ------------------- |
| MATTE       | 4/4        | 4/4          | 100%                |
| SATIN       | 4/4        | 4/4          | 100%                |
| GLOSS       | 4/4        | 4/4          | 100%                |
| SHIMMER     | 4/4        | 4/4          | 100%                |
| STAIN       | 4/4        | 4/4          | 100%                |
| BALM        | 4/4        | 4/4          | 100%                |
| LINER       | 4/4        | 4/4          | 100%                |
| CRAYON      | 4/4        | 4/4          | 100%                |
| OIL         | 4/4        | 4/4          | 100%                |
| METALLIC    | 4/4        | 4/4          | 100%                |
| PLUMPER     | 4/4        | 4/4          | 100%                |
| **Total**   | **44/44**  | **44/44**    | **100% (88/88)** ✅ |

## Details

<details>
<summary><strong>MATTE</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Flat matte-color blend (no shine) rendered in real-time
- [x] Shade/variant picker functional (linked to product variants)
- [x] Performance & cross-device QA (FPS, lighting conditions)

**Upload**

- [x] Photo upload + lip-landmark detection on static image
- [x] Flat matte-color blend applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>SATIN</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Soft semi-sheen blend (low-gloss highlight) rendered in real-time
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection on static image
- [x] Soft semi-sheen blend applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>GLOSS</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Specular highlight + wet-shine overlay rendered in real-time
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection on static image
- [x] Specular highlight + wet-shine overlay applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>SHIMMER</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Sparkle/shimmer particle overlay rendered in real-time
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection on static image
- [x] Sparkle/shimmer particle overlay applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>STAIN</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Translucent low-opacity tint blend rendered in real-time
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection on static image
- [x] Translucent low-opacity tint blend applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>BALM</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Sheer glossy tint + moisture-shine overlay rendered in real-time
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection on static image
- [x] Sheer glossy tint + moisture-shine overlay applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>LINER</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-contour edge tracking wired
- [x] Wide, blurred stroke along the outer lip contour rendered in real-time, hard-clipped to the lip fill region — crisp cutoff on the outward (skin) side, soft natural fade on the inward (lip) side (`applyLinerLips`, `tryon-lip.util.ts`)
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-contour edge detection on static image
- [x] Same stroke rendering applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>CRAYON</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Matte stroke-texture fill (waxy finish) rendered in real-time
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection on static image
- [x] Matte stroke-texture fill applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>OIL</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] High-gloss fluid overlay with light-refraction shine rendered in real-time (dedicated `Oil-Upper/Lower.webp` assets, own `TEXTURED_FINISH_TUNING.OIL` entry)
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection on static image
- [x] High-gloss fluid overlay applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>METALLIC</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Chrome/foil reflective texture overlay rendered in real-time (dedicated `Metallic-Upper/Lower.webp` assets, own `TEXTURED_FINISH_TUNING.METALLIC` entry)
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection on static image
- [x] Chrome/foil reflective texture overlay applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

<details>
<summary><strong>PLUMPER</strong> — 100%</summary>

**Live**

- [x] Camera capture + lip-landmark tracking wired
- [x] Gloss-texture overlay rendered in real-time with its own dedicated alpha tuning (`TEXTURED_FINISH_TUNING.PLUMPER`) — deliberately shares GLOSS/SATIN/BALM's texture asset (`GLOSS_OR_SATIN_OR_BALM_OR_PLUMPER_TEXTURE_PATH_*`, see `tryon-lip.constants.ts`) rather than duplicating it, but stays independently swappable later since it's its own named field/tuning entry, not an alias. No geometric volume/distortion effect — not achievable with a canvas-2D color/texture overlay, out of scope
- [x] Shade/variant picker functional
- [x] Performance & cross-device QA

**Upload**

- [x] Photo upload + lip-landmark detection on static image
- [x] Same overlay applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA

</details>

---

[← Back to master tracker](./README.md)
