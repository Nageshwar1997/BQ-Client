# SKIN Try-On Tracker

[← Back to master tracker](./README.md) · [← Build plan](./SKIN-PLAN.md)

> **Build plan**: SKIN pehli category hai jiski koi real product "shade" match karne wali nahi hai — 8 me se kaunsi subcategories ka apna distinct visual banega, is app ke landmark-only (no segmentation) constraint ko dekhte hue actually kaunsi canvas techniques available hain, abhi bhi decision chahne wale open questions (CLEANSER/EXFOLIATOR ki low visual value, yahan shade picker ka matlab hi kya hai), aur suggested build order - sab [SKIN-PLAN.md](./SKIN-PLAN.md) me plan kiya hua hai, koi bhi SKIN code likhne se pehle.

_Tracking model: face landmarks (face-oval region, same `FACE_OVAL_INDICES`/exclusion-hole technique jo FOUNDATION/BRONZER/BBCREAM/COMPACTPOWDER already use karte hain — is app me kahin bhi real segmentation nahi hai, FACE bhi nahi). Shared face-landmark engine pe depend karta hai — dekho [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

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

- [ ] Camera capture + skin-region landmark tracking wired
- [ ] Dewy-glow finish simulation overlay real-time me render ho
- [ ] Variant/intensity picker functional (product variants se linked)
- [ ] Performance & cross-device QA (FPS, lighting conditions)

**Upload**

- [ ] Photo upload + skin-region landmark detection static image pe
- [ ] Dewy-glow finish simulation overlay image pe apply ho
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>SERUM</strong> — 0%</summary>

**Live**

- [ ] Camera capture + skin-region landmark tracking wired
- [ ] Subtle glow/smoothness simulation overlay real-time me render ho
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + skin-region landmark detection static image pe
- [ ] Subtle glow/smoothness simulation overlay image pe apply ho
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>TONER</strong> — 0%</summary>

**Live**

- [ ] Camera capture + skin-region landmark tracking wired
- [ ] Even-tone/brightness simulation overlay real-time me render ho
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + skin-region landmark detection static image pe
- [ ] Even-tone/brightness simulation overlay image pe apply ho
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>CLEANSER</strong> — 0%</summary>

**Live**

- [ ] Camera capture + skin-region landmark tracking wired
- [ ] Before/after clarity simulation overlay real-time me render ho (low AR value — pehle scope confirm karo)
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + skin-region landmark detection static image pe
- [ ] Before/after clarity simulation overlay image pe apply ho
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>SUNSCREEN</strong> — 0%</summary>

**Live**

- [ ] Camera capture + skin-region landmark tracking wired
- [ ] Matte/no-white-cast finish simulation overlay real-time me render ho
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + skin-region landmark detection static image pe
- [ ] Matte/no-white-cast finish simulation overlay image pe apply ho
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>MASK</strong> — 0%</summary>

**Live**

- [ ] Camera capture + skin-region landmark tracking wired
- [ ] Instant-glow/plumped-skin simulation overlay real-time me render ho
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + skin-region landmark detection static image pe
- [ ] Instant-glow/plumped-skin simulation overlay image pe apply ho
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>EYECREAM</strong> — 0%</summary>

**Live**

- [ ] Camera capture + under-eye region tracking wired
- [ ] Brightness/de-puff simulation overlay real-time me render ho
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + under-eye region detection static image pe
- [ ] Brightness/de-puff simulation overlay image pe apply ho
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>EXFOLIATOR</strong> — 0%</summary>

**Live**

- [ ] Camera capture + skin-region landmark tracking wired
- [ ] Smooth-texture simulation overlay real-time me render ho
- [ ] Variant/intensity picker functional
- [ ] Performance & cross-device QA

**Upload**

- [ ] Photo upload + skin-region landmark detection static image pe
- [ ] Smooth-texture simulation overlay image pe apply ho
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA

</details>

---

[← Back to master tracker](./README.md) · [← Build plan](./SKIN-PLAN.md)
