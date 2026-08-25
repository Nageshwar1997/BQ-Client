# SKIN Try-On Tracker

[← Back to master tracker](./README.md)

> ⚠️ **Design decision pending before starting this category.** Skincare products (moisturizer, serum, sunscreen, etc.) don't have a "shade" to match like makeup — a real try-on here means simulating a **finish/glow effect**, not applying a color. Confirm the visual approach (e.g. a subtle "after" overlay showing dewiness/brightness/matte-ness) before building. `CLEANSER` especially has almost nothing visual to try on — consider deprioritizing or dropping it in favor of a simple before/after marketing visual instead of a true AR filter.

*Tracking model: face segmentation (skin region only, no fine landmarks needed). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain).*

## Summary

| Subcategory | Live (0/4) | Upload (0/4) | Overall |
|---|---|---|---|
| MOISTURIZER | 0/4 | 0/4 | 0% |
| SERUM | 0/4 | 0/4 | 0% |
| TONER | 0/4 | 0/4 | 0% |
| CLEANSER | 0/4 | 0/4 | 0% |
| SUNSCREEN | 0/4 | 0/4 | 0% |
| MASK | 0/4 | 0/4 | 0% |
| EYECREAM | 0/4 | 0/4 | 0% |
| EXFOLIATOR | 0/4 | 0/4 | 0% |
| **Total** | **0/32** | **0/32** | **0% (0/64)** |

## Details

<details>
<summary><strong>MOISTURIZER</strong> — 0%</summary>

**Live**
- [ ] Camera capture + skin-region segmentation wired
- [ ] Dewy-glow finish simulation overlay rendered in real-time
- [ ] Variant/intensity picker functional (linked to product variants)
- [ ] Performance & cross-device QA (FPS, lighting conditions)

**Upload**
- [ ] Photo upload + skin-region segmentation on static image
- [ ] Dewy-glow finish simulation overlay applied to image
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>SERUM</strong> — 0%</summary>

**Live**
- [ ] Camera capture + skin-region segmentation wired
- [ ] Subtle glow/smoothness simulation overlay rendered in real-time
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**
- [ ] Photo upload + skin-region segmentation on static image
- [ ] Subtle glow/smoothness simulation overlay applied to image
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>TONER</strong> — 0%</summary>

**Live**
- [ ] Camera capture + skin-region segmentation wired
- [ ] Even-tone/brightness simulation overlay rendered in real-time
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**
- [ ] Photo upload + skin-region segmentation on static image
- [ ] Even-tone/brightness simulation overlay applied to image
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>CLEANSER</strong> — 0%</summary>

**Live**
- [ ] Camera capture + skin-region segmentation wired
- [ ] Before/after clarity simulation overlay rendered in real-time (low AR value — confirm scope first)
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**
- [ ] Photo upload + skin-region segmentation on static image
- [ ] Before/after clarity simulation overlay applied to image
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>SUNSCREEN</strong> — 0%</summary>

**Live**
- [ ] Camera capture + skin-region segmentation wired
- [ ] Matte/no-white-cast finish simulation overlay rendered in real-time
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**
- [ ] Photo upload + skin-region segmentation on static image
- [ ] Matte/no-white-cast finish simulation overlay applied to image
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>MASK</strong> — 0%</summary>

**Live**
- [ ] Camera capture + skin-region segmentation wired
- [ ] Instant-glow/plumped-skin simulation overlay rendered in real-time
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**
- [ ] Photo upload + skin-region segmentation on static image
- [ ] Instant-glow/plumped-skin simulation overlay applied to image
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>EYECREAM</strong> — 0%</summary>

**Live**
- [ ] Camera capture + under-eye region tracking wired
- [ ] Brightness/de-puff simulation overlay rendered in real-time
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**
- [ ] Photo upload + under-eye region detection on static image
- [ ] Brightness/de-puff simulation overlay applied to image
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA
</details>

<details>
<summary><strong>EXFOLIATOR</strong> — 0%</summary>

**Live**
- [ ] Camera capture + skin-region segmentation wired
- [ ] Smooth-texture simulation overlay rendered in real-time
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**
- [ ] Photo upload + skin-region segmentation on static image
- [ ] Smooth-texture simulation overlay applied to image
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA
</details>

---
[← Back to master tracker](./README.md)
