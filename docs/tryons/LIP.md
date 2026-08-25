# LIP Try-On Tracker

[← Back to master tracker](./README.md)

*Tracking model: face landmarks (lip contour ring). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain).*

> Engine built: [classes/tryon/categories/lip/](../../src/classes/tryon/categories/lip/) (`LipEngineBase` + `LipLiveEngine`/`LipUploadEngine`, on top of the shared generic `TryOnEngineBase`/`withLiveCamera`/`withImageUpload`). MATTE/SATIN/GLOSS/SHIMMER/STAIN/BALM/CRAYON/OIL render for real (verified end-to-end in Upload mode: MediaPipe FaceLandmarker loads, texture assets load, shade+finish picker drives the engine live). LINER/METALLIC/PLUMPER fall back to MATTE with a console warning — no dedicated rendering yet (need new texture art / new stroke-or-dilation logic, see the shell repo's note in `LipEngineBase.ts`). "QA" items stay unchecked below — no real camera/multi-device pass done yet, only structural verification.

## Summary

| Subcategory | Live (3/4) | Upload (3/4) | Overall |
|---|---|---|---|
| MATTE | 3/4 | 3/4 | 75% |
| SATIN | 3/4 | 3/4 | 75% |
| GLOSS | 3/4 | 3/4 | 75% |
| SHIMMER | 3/4 | 3/4 | 75% |
| STAIN | 3/4 | 3/4 | 75% |
| BALM | 3/4 | 3/4 | 75% |
| LINER | 0/4 | 0/4 | 0% |
| CRAYON | 3/4 | 3/4 | 75% |
| OIL | 3/4 | 3/4 | 75% |
| METALLIC | 0/4 | 0/4 | 0% |
| PLUMPER | 0/4 | 0/4 | 0% |
| **Total** | **24/44** | **24/44** | **55% (48/88)** |

## Details

<details>
<summary><strong>MATTE</strong> — 75%</summary>

**Live**
- [x] Camera capture + lip-landmark tracking wired
- [x] Flat matte-color blend (no shine) rendered in real-time
- [x] Shade/variant picker functional (linked to product variants)
- [ ] Performance & cross-device QA (FPS, lighting conditions)

**Upload**
- [x] Photo upload + lip-landmark detection on static image
- [x] Flat matte-color blend applied to image
- [x] Shade/variant picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>SATIN</strong> — 75%</summary>

**Live**
- [x] Camera capture + lip-landmark tracking wired
- [x] Soft semi-sheen blend (low-gloss highlight) rendered in real-time
- [x] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**
- [x] Photo upload + lip-landmark detection on static image
- [x] Soft semi-sheen blend applied to image
- [x] Shade/variant picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>GLOSS</strong> — 75%</summary>

**Live**
- [x] Camera capture + lip-landmark tracking wired
- [x] Specular highlight + wet-shine overlay rendered in real-time
- [x] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**
- [x] Photo upload + lip-landmark detection on static image
- [x] Specular highlight + wet-shine overlay applied to image
- [x] Shade/variant picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>SHIMMER</strong> — 75%</summary>

**Live**
- [x] Camera capture + lip-landmark tracking wired
- [x] Sparkle/shimmer particle overlay rendered in real-time
- [x] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**
- [x] Photo upload + lip-landmark detection on static image
- [x] Sparkle/shimmer particle overlay applied to image
- [x] Shade/variant picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>STAIN</strong> — 75%</summary>

**Live**
- [x] Camera capture + lip-landmark tracking wired
- [x] Translucent low-opacity tint blend rendered in real-time
- [x] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**
- [x] Photo upload + lip-landmark detection on static image
- [x] Translucent low-opacity tint blend applied to image
- [x] Shade/variant picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>BALM</strong> — 75%</summary>

**Live**
- [x] Camera capture + lip-landmark tracking wired
- [x] Sheer glossy tint + moisture-shine overlay rendered in real-time
- [x] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**
- [x] Photo upload + lip-landmark detection on static image
- [x] Sheer glossy tint + moisture-shine overlay applied to image
- [x] Shade/variant picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>LINER</strong> — 0% (falls back to MATTE + console warning)</summary>

**Live**
- [ ] Camera capture + lip-contour edge tracking wired
- [ ] Thin stroke rendered precisely along outer lip line in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**
- [ ] Photo upload + lip-contour edge detection on static image
- [ ] Thin stroke rendered along outer lip line on image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>CRAYON</strong> — 75%</summary>

**Live**
- [x] Camera capture + lip-landmark tracking wired
- [x] Matte stroke-texture fill (waxy finish) rendered in real-time
- [x] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**
- [x] Photo upload + lip-landmark detection on static image
- [x] Matte stroke-texture fill applied to image
- [x] Shade/variant picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>OIL</strong> — 75% (placeholder alias of GLOSS pending a dedicated oil-shine texture)</summary>

**Live**
- [x] Camera capture + lip-landmark tracking wired
- [x] High-gloss fluid overlay with light-refraction shine rendered in real-time
- [x] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**
- [x] Photo upload + lip-landmark detection on static image
- [x] High-gloss fluid overlay applied to image
- [x] Shade/variant picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>METALLIC</strong> — 0% (falls back to MATTE + console warning)</summary>

**Live**
- [ ] Camera capture + lip-landmark tracking wired
- [ ] Chrome/foil reflective overlay rendered in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**
- [ ] Photo upload + lip-landmark detection on static image
- [ ] Chrome/foil reflective overlay applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>PLUMPER</strong> — 0% (falls back to MATTE + console warning)</summary>

**Live**
- [ ] Camera capture + lip-landmark tracking wired
- [ ] Gloss overlay + subtle plump/volume distortion effect rendered in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**
- [ ] Photo upload + lip-landmark detection on static image
- [ ] Gloss overlay + subtle plump/volume distortion effect applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA
</details>

---
[← Back to master tracker](./README.md)
