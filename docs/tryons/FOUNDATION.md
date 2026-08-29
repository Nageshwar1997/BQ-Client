# FOUNDATION Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (face-oval region, minus eyes/eyebrows/mouth) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke baaki 7 subcategories (CONCEALER/HIGHLIGHTER/BLUSH/CONTOUR/BRONZER/BBCREAM/COMPACTPOWDER) abhi unbuilt hain, isliye unki apni-apni tracker file nahi bani - unka status abhi bhi [FACE.md](./FACE.md) me hi hai. Jaise-jaise wo ban'te jayenge, waisi hi ek-ek dedicated file milegi (isi FOUNDATION.md jaisi), FACE.md sirf ek index/summary reh jayega - waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`, same shared `TryOnEngineBase`/`withLiveCamera`/`withImageUpload` LIP already proved out - zero changes needed to any of the three). Rendering: [`applyFoundationFace`](../../src/utils/tryon-utils/face.ts) - face-oval clip (forehead-extended past the raw landmark hairline), eyes/eyebrows/mouth punched out as independent `destination-out` erases, `multiply` blend so real skin shading shows through instead of a flat mask. Both Live aur Upload mode me end-to-end render hota hai.

## Summary

| Mode    | Done  | Total | %       |
| ------- | ----- | ----- | ------- |
| Live    | 3     | 4     | 75%     |
| Upload  | 3     | 4     | 75%     |
| **All** | **6** | **8** | **75%** |

## Checklist

**Live**

- [x] Camera capture + full-face landmark tracking wired
- [x] Full-face base-tone blend rendered in real-time
- [x] Shade/variant picker functional (linked to product variants)
- [ ] Performance & cross-device QA (FPS, lighting conditions) — never run on a real device (sandboxed browser pane has no camera access) - see [Quality score](#quality-score) #4 neeche.

**Upload**

- [x] Photo upload + full-face landmark detection on static image
- [x] Full-face base-tone blend applied to image
- [x] Shade/variant picker functional
- [ ] Output preview/download QA — snapshot/download mechanism khud generic hai aur LIP ke liye already verified (`takeSnapshot()`), lekin FOUNDATION output specifically kabhi real device pe check nahi hua.

## Bugs found + fixed this session (real user testing se)

Sab already live-verified/pixel-diff-verified is session ke andar hi, code mein:

- [x] Forehead coverage — raw landmark oval hairline pe hi rukta tha, real forehead skin miss ho rahi thi. Fix: `applyForeheadExtension` (points ko upar taper ke saath push karta hai).
- [x] Sharp/faceted edges (eyebrows, face-oval) — plain `lineTo` polygon tha. Fix: `traceSmoothClosedPath` (quadratic-curve smoothing, LIP ke `applyLipTexture` wali hi technique).
- [x] Mouth-open bug — muh khulne pe andar (teeth/interior) tak tint chala jaata tha. Fix: `MOUTH_OUTER_CONTOUR_INDICES` (ek hi ring poori mouth-opening ke around, upper+lower band alag-alag nahi).
- [x] Hair/beard/mustache pe tint lagna — pehle ek pixel-color skin-detection heuristic try kiya (luminance/saturation based), lekin genuinely darker skin tones ko galat "hair" samajh leta tha - **fairness bug**, sirf tuning issue nahi. Poora hata diya. Fix: ab sirf landmark-geometry, hair-avoidance instructions screen pe hi hai (`FACE_UPLOAD_INSTRUCTIONS`/`FACE_LIVE_INSTRUCTIONS`).
- [x] Turned-head par eyebrow/eye/lips tak tint leak hona — eyes/eyebrows/mouth pehle outer-oval ke SAME evenodd path mein the; ek angle par ek feature ka apna ring self-intersect kar sakta tha, jo poore combined path ka count hi galat kar deta. Fix: `eraseExcludedFeatures` - har feature apna independent `destination-out` erase hai, ek doosre se cross-talk nahi.
- [x] Turned-head par tint nose ke aage tak "bulge" karna (occlusion-unaware 2D projection) — genuinely landmark-only approach se pura solve nahi ho sakta (real 3D/depth chahiye). Fix (mitigation): real-time turn-detection overlay - `isFaceTurnedTooMuch` (nose-tip se dono cheekbones ki symmetry check karta hai), turned-too-much hone par render hi nahi hota, user ko "face the camera directly" overlay dikhta hai.

## Quality score

Same 9 dimensions jo [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md) ke liye use hue the.

**Current overall: ~7.5/10** — LIP ki hi shuruaati state (8.5/10) jaisi shape: core rendering solid hai, sabse bada gap wahi hai jo LIP mein bhi tha - **real-device QA kabhi hui nahi hai**.

| #   | Dimension            | Score   | Kyun                                                                                                                                                                                                                                                                                                                               |
| --- | -------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10    | No-face/error paths LIP jaisi hi shared machinery se hi handle hote hain. Turned-head guard proactive hai, lekin abhi tak koi real turned-face test data se verify nahi hua (sirf unit-tested logic + no-false-positive frontal-photo check).                                                                                      |
| 2   | Test coverage        | 8/10    | `isFaceTurnedTooMuch` (5 tests) + `applyFoundationFace` smoke test (1 test) is session me hi add kiye. LIP jitni exhaustive nahi (LIP ke paas 11 finishes x smoke + derived-data tests the) but core function ab covered hai.                                                                                                      |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file khud abhi ban rahi hai - [FACE.md](./FACE.md)/[README.md](./README.md) bhi isi ke saath update ho rahe hain.                                                                                                                                                                                                               |
| 4   | Real-device QA       | 0/10    | **Kabhi nahi hui** - sandboxed browser pane me camera access nahi hai. Same gap jo LIP ke liye tha, LIP-REAL-DEVICE-QA.md jaisa ek FOUNDATION-specific checklist banana baaki hai.                                                                                                                                                 |
| 5   | UX polish            | 8/10    | Category-specific instructions (hair/frontal-facing tips) + turn-detection overlay ban chuke hain. Accessibility fixes (model-list aria-labels, focus-visible outline) LIP ke time hi generic components mein ho gaye the, FOUNDATION automatically inherit karta hai - lekin FOUNDATION ke liye khud se dedicated audit nahi hua. |
| 6   | Architecture         | 10/10 ✅ | `TryOnEngineBase`/mixins bina kisi change ke reuse hue - exactly jaisa LIP ke Architecture review ne predict kiya tha.                                                                                                                                                                                                             |
| 7   | Feature completeness | 10/10 ✅ | FOUNDATION khud fully built hai (Live+Upload, shade+range, sab end-to-end kaam karta hai).                                                                                                                                                                                                                                         |
| 8   | Performance          | 6/10    | Code-side sab shared infra hai (DPR cap, cached object-fit, GPU→CPU fallback, shared landmarker) - koi FOUNDATION-specific perf kaam nahi chahiye tha. Lekin real FPS/thermal numbers missing hain (#4 pe depend karta hai).                                                                                                       |
| 9   | Code hygiene         | 10/10 ✅ | Fresh scan - `TODO`/`FIXME`/`HACK`/`: any`/`as any` zero matches FACE-specific files mein. Dono exports (`applyFoundationFace`, `isFaceTurnedTooMuch`) genuinely consume ho rahe hain.                                                                                                                                             |

### 10/10 tak pahunchne ke liye baaki

- [ ] **Real-device QA** (#4) — sabse bada gap. Ek `FOUNDATION-REAL-DEVICE-QA.md` checklist banake user se end-to-end test karwana - forehead/hair/turned-angle/mouth-open sab real face pe verify karna, jo abhi sirf screenshots/pixel-diff se verify hua hai.
- [ ] **Performance** (#8) — #4 ka hi real-device data se unlock hoga, jaisa LIP mein hua tha.
- [ ] **UX polish** (#5) — FOUNDATION-specific accessibility audit (abhi sirf generic components se inherited hai, khud se check nahi hua).
- [ ] **Test coverage** (#2) — chaaho to aur exhaustive ho sakta hai (e.g. `eraseExcludedFeatures`/`clipToFaceOval` individually test karna), lekin LIP ne bhi utna deep nahi kiya tha - is level ko "acceptable" maan sakte hain agar #4/#8 solid ho jaye.
- [ ] **Robustness** (#1) — turned-head guard ka threshold ek baar real turned-face pe tune/confirm karna (#4 ke saath hi hoga).

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
