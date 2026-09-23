# SKIN Try-On Tracker

[← Back to master tracker](./README.md) · [← Build plan](./SKIN-PLAN.md)

> **Build plan**: SKIN pehli category hai jiski koi real product "shade" match karne wali nahi hai — 8 me se kaunsi subcategories ka apna distinct visual banega, is app ke landmark-only (no segmentation) constraint ko dekhte hue actually kaunsi canvas techniques available hain, aur suggested build order - sab [SKIN-PLAN.md](./SKIN-PLAN.md) me plan kiya hua hai. **Scope decision** (visual-impact ke against finalize hui): sirf **MASK, MOISTURIZER, EYECREAM** banenge (priority order mein) - SERUM, TONER, SUNSCREEN, CLEANSER, EXFOLIATOR ko visual-tryon scope se drop kar diya gaya, kyunki inka effect is app ke landmark-only constraint ke saath deliberately subtle/invisible reh jaata (poori reasoning [SKIN-PLAN.md](./SKIN-PLAN.md#scope-decision---8-me-se-sirf-3-build-honge) me hai). Ye 5 abhi bhi real product categories hain, bas apna dedicated AR try-on nahi milega.

_Tracking model: face landmarks (face-oval region, same `FACE_OVAL_INDICES`/exclusion-hole technique jo FOUNDATION/BRONZER/BBCREAM/COMPACTPOWDER already use karte hain — is app me kahin bhi real segmentation nahi hai, FACE bhi nahi). Shared face-landmark engine pe depend karta hai — dekho [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

## Summary

Total sirf 3 **planned** subcategories (MASK/MOISTURIZER/EYECREAM) pe based hai - baaki 5 dropped hain, unke checklist items kabhi complete honge hi nahi, isliye unhe total math me count nahi kiya (warna % permanently 37.5% pe capped reh jaata).

| Subcategory | Status                    | Live (0/4) | Upload (0/4) | Overall       |
| ----------- | ------------------------- | ---------- | ------------ | ------------- |
| MASK        | ✅ Planned (1st)           | 0/4        | 0/4          | 0%            |
| MOISTURIZER | ✅ Planned (2nd)           | 0/4        | 0/4          | 0%            |
| EYECREAM    | ✅ Planned (3rd)           | 0/4        | 0/4          | 0%            |
| SERUM       | ❌ Dropped                 | N/A        | N/A          | N/A           |
| TONER       | ❌ Dropped                 | N/A        | N/A          | N/A           |
| SUNSCREEN   | ❌ Dropped                 | N/A        | N/A          | N/A           |
| CLEANSER    | ❌ Dropped                 | N/A        | N/A          | N/A           |
| EXFOLIATOR  | ❌ Dropped                 | N/A        | N/A          | N/A           |
| **Total**   | (3 planned subcategories) | **0/12**   | **0/12**     | **0% (0/24)** |

## Details

<details>
<summary><strong>MASK</strong> — 0% — priority 1</summary>

**Live**

- [ ] Camera capture + skin-region landmark tracking wired
- [ ] Instant-glow/plumped-skin simulation overlay real-time me render ho (strongest highlight-blob tuning, [SKIN-PLAN.md](./SKIN-PLAN.md) dekho)
- [ ] Variant/intensity picker functional (product variants se linked)
- [ ] Performance & cross-device QA (FPS, lighting conditions)

**Upload**

- [ ] Photo upload + skin-region landmark detection static image pe
- [ ] Instant-glow/plumped-skin simulation overlay image pe apply ho
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>MOISTURIZER</strong> — 0% — priority 2</summary>

**Live**

- [ ] Camera capture + skin-region landmark tracking wired
- [ ] Dewy-glow finish simulation overlay real-time me render ho (MASK jaise hi primitives, halki tuning)
- [ ] Variant/intensity picker functional (product variants se linked)
- [ ] Performance & cross-device QA (FPS, lighting conditions)

**Upload**

- [ ] Photo upload + skin-region landmark detection static image pe
- [ ] Dewy-glow finish simulation overlay image pe apply ho
- [ ] Variant/intensity picker functional
- [ ] Output preview/download QA

</details>

<details>
<summary><strong>EYECREAM</strong> — 0% — priority 3</summary>

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
<summary><strong>SERUM, TONER, SUNSCREEN, CLEANSER, EXFOLIATOR</strong> — Dropped, visual-tryon scope se bahar</summary>

Inka apna dedicated AR try-on nahi banega. Wajah: is app ke landmark-only constraint (koi real segmentation/lighting model nahi) ke saath, in paanch ka real effect deliberately subtle/invisible reh jaata - full detail reasoning [SKIN-PLAN.md](./SKIN-PLAN.md#subcategories--visual-language-buildability-aur-final-decision) me hai. Ye product catalog me real categories hain (`TRY_ON_MAP.SKIN` unhe list karta hai), bas visual try-on feature inke liye nahi banega jab tak koi behtar technique (real segmentation) available na ho.

</details>

---

[← Back to master tracker](./README.md) · [← Build plan](./SKIN-PLAN.md)
