# FACE Try-On Tracker

[← Back to master tracker](./README.md)

_Tracking model: face landmarks + full-face segmentation. Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracking**: jaise-jaise ek FACE subcategory actually build hoti hai, uski apni dedicated tracker file bhi ban jaati hai (LIP ke [LIP.md](./LIP.md) jaisi) - is file (FACE.md) mein sirf uska summary-row + link reh jaata hai, poora detail nahi. Abhi tak sirf FOUNDATION ban chuki hai - [FOUNDATION.md](./FOUNDATION.md). Baaki 7 abhi bhi neeche inline hain (unbuilt).

## Summary

| Subcategory   | Live     | Upload   | Overall                             |
| ------------- | -------- | -------- | ----------------------------------- |
| CONCEALER     | 0/4      | 0/4      | 0%                                  |
| FOUNDATION    | 4/4      | 4/4      | 100% ✅ — [detail](./FOUNDATION.md) |
| HIGHLIGHTER   | 0/4      | 0/4      | 0%                                  |
| BLUSH         | 0/4      | 0/4      | 0%                                  |
| CONTOUR       | 0/4      | 0/4      | 0%                                  |
| BRONZER       | 0/4      | 0/4      | 0%                                  |
| BBCREAM       | 0/4      | 0/4      | 0%                                  |
| COMPACTPOWDER | 0/4      | 0/4      | 0%                                  |
| **Total**     | **4/32** | **4/32** | **12.5% (8/64)**                    |

## Details

<details>
<summary><strong>CONCEALER</strong> — 0%</summary>

**Live**

- [ ] Camera capture + under-eye/blemish-region tracking wired
- [ ] Spot-blend color correction rendered in real-time
- [ ] Shade/variant picker functional (linked to product variants)
- [ ] Performance & cross-device QA (FPS, lighting conditions)

**Upload**

- [ ] Photo upload + under-eye/blemish-region detection on static image
- [ ] Spot-blend color correction applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>FOUNDATION</strong> — 100% ✅ — see <a href="./FOUNDATION.md">FOUNDATION.md</a> for the full checklist, bugs-fixed log, and quality score</summary>

Ab yaha inline nahi hai - apni dedicated file mil chuki hai: **[FOUNDATION.md](./FOUNDATION.md)**.

</details>

<details>
<summary><strong>HIGHLIGHTER</strong> — 0%</summary>

**Live**

- [ ] Camera capture + cheekbone/brow-bone landmark tracking wired
- [ ] Glow overlay rendered along high points in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + cheekbone/brow-bone detection on static image
- [ ] Glow overlay applied along high points on image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>BLUSH</strong> — 0%</summary>

**Live**

- [ ] Camera capture + cheek-region landmark tracking wired
- [ ] Soft cheek color-wash blend rendered in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + cheek-region detection on static image
- [ ] Soft cheek color-wash blend applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>CONTOUR</strong> — 0%</summary>

**Live**

- [ ] Camera capture + jaw/cheek/nose-hollow landmark tracking wired
- [ ] Shading blend rendered along facial hollows in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + jaw/cheek/nose-hollow detection on static image
- [ ] Shading blend applied along facial hollows on image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>BRONZER</strong> — 0%</summary>

**Live**

- [ ] Camera capture + full-face segmentation wired
- [ ] Warm all-over glow blend rendered in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + full-face segmentation on static image
- [ ] Warm all-over glow blend applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>BBCREAM</strong> — 0%</summary>

**Live**

- [ ] Camera capture + full-face segmentation wired
- [ ] Sheer full-face tinted blend (lighter than foundation) rendered in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + full-face segmentation on static image
- [ ] Sheer full-face tinted blend applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>COMPACTPOWDER</strong> — 0%</summary>

**Live**

- [ ] Camera capture + full-face segmentation wired
- [ ] Matte-finish overlay (shine reduction) rendered in real-time
- [ ] Shade/variant picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + full-face segmentation on static image
- [ ] Matte-finish overlay applied to image
- [ ] Shade/variant picker functional
- [ ] Output preview/download QA

</details>

---

[← Back to master tracker](./README.md)
