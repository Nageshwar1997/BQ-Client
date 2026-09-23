# SKIN Try-On Tracker

[← Back to master tracker](./README.md) · [← Build plan](./SKIN-PLAN.md)

> **Build plan**: SKIN is the first category with no real product "shade" to match — which of the 8 subcategories get a distinct visual, what canvas techniques are actually available given this app's landmark-only (no segmentation) constraint, open questions still needing a decision (CLEANSER/EXFOLIATOR's low visual value, what the shade picker even means here), and the suggested build order are all planned out in [SKIN-PLAN.md](./SKIN-PLAN.md), written before any SKIN code exists.

_Tracking model: face landmarks (face-oval region, same `FACE_OVAL_INDICES`/exclusion-hole technique FOUNDATION/BRONZER/BBCREAM/COMPACTPOWDER already use — no real segmentation anywhere in this app, FACE included). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

## Summary

| Subcategory | Live (0/4) | Upload (0/4) | Overall       |
| ----------- | ---------- | ------------ | ------------- |
| MOISTURIZER | 0/4        | 0/4          | 0%            |
| SERUM       | 0/4        | 0/4          | 0%            |
| TONER       | 0/4        | 0/4          | 0%            |
| CLEANSER    | 0/4        | 0/4          | 0%            |
| SUNSCREEN   | 0/4        | 0/4          | 0%            |
| MASK        | 0/4        | 0/4          | 0%            |
| EYECREAM    | 0/4        | 0/4          | 0%            |
| EXFOLIATOR  | 0/4        | 0/4          | 0%            |
| **Total**   | **0/32**   | **0/32**     | **0% (0/64)** |

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
