# LASHES Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md) · [← Build plan](./EYE-PLAN.md)

_Tracking model: face landmarks (upper lash-line arc). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — same convention [EYELINER.md](./EYELINER.md)/[KAJAL.md](./KAJAL.md)/[EYESHADOW.md](./EYESHADOW.md)/[EYEBROW.md](./EYEBROW.md)/[BROWGEL.md](./BROWGEL.md)/[MASCARA.md](./MASCARA.md) established: as a subcategory gets built, it gets its own dedicated tracker file and [EYE.md](./EYE.md)'s own inline checklist for it gets replaced with a summary-row + link. **Ye last EYE subcategory hai** - EYE ab 7/7 built hai.

> **EYE-PLAN.md ke apne original guess se ek deliberate departure**: plan doc ne speculate kiya tha ki LASHES ko probably ek texture-asset pipeline chahiye hogi (ek image per style, LIP ke apne SHIMMER/GLOSS jaisa), ye MASCARA ka apna lash-stroke primitive exist karne se pehle likha gaya tha. Jab MASCARA ne wo primitive prove kar diya, use extend karna better call nikla - neeche Design notes dekho kyun.

## Summary

| Mode    | Done  | Total | %                               |
| ------- | ----- | ----- | ------------------------------- |
| Live    | 3     | 4     | 75%                             |
| Upload  | 3     | 4     | 75%                             |
| **All** | **6** | **8** | **75% — [detail](./LASHES.md)** |

## Checklist

**Live**

- [x] Camera capture + lash-line tracking wired — shared `EyeLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh (upper lash-line ring samet) already track karti hai, extra wiring nahi chahiye.
- [x] False-lash strip/extension overlay lash line ke saath real-time me render hota hai — `applyLashesEye` ko `EyeEngineBase.applyEffect`'s switch mein `'LASHES'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai. Automated smoke tests aur browser mein ek real uploaded model photo se verify kiya (Design notes dekho) - specifically actual _live camera_ feed pe abhi confirm nahi hua (is session mein sirf Upload mode test hua, har doosri EYE finish ke apne starting point jaisa).
- [x] Shade/variant picker functional (style/length variants) — `TryOnPatternSwatches` reuse karta hai (koi component change nahi chahiye), live-verified: sab 5 patterns same real photo pe visibly distinct results render karte hain, aur Natural/Everyday aur Winged ke beech ek pixel-diff ne lash region mein 49,500 mein se 1,881 changed pixels paaye, confirm karta hai ki pattern picker genuinely render badalta hai.
- [ ] Performance & cross-device QA — real-device pass abhi shuru nahi hua (har doosri finish ke apne starting point jaisa). Dramatic/Voluminous har eye pe 58 tak individual tapered-fill calls draw karta hai, same performance-watch flag jo MASCARA ke apne Volumizing pattern ne already raise kiya tha.

**Upload**

- [x] Photo upload + lash-line detection static image pe — LIP/FACE/EYELINER/KAJAL/EYESHADOW/EYEBROW/BROWGEL/MASCARA jaisa hi shared upload pipeline.
- [x] False-lash strip/extension overlay image pe apply hota hai — same `applyLashesEye`, upload path bhi same `applyEffect` se guzarta hai. Is session ke browser pane mein ek real model photo pe (North Indian, `public/images/tryon/models/`) live confirm kiya.
- [x] Shade/variant picker functional — live confirm kiya (upar dekho).
- [ ] Output preview/download QA — snapshot/download button is session mein specifically exercise nahi hua.

## Design notes

- **Procedural kyun jeeta texture assets se, EYE-PLAN.md ke apne original guess ke against**: plan doc ke apne LASHES section ne speculate kiya tha ki texture assets probably easier honge, kyunki ye koi lash-stroke code exist karne se pehle likha gaya tha. Jab tak LASHES actually aayi, MASCARA ne already ek curved-lash-stroke primitive (`buildLashPoints`/`rotateTowardUp`/`fillTaperedPath`) build aur ek real photo pe prove kar diya tha. False-lash _styles_ (Natural, Wispy, Dramatic, Winged, Doll-eye) mascara _styles_ (Natural, Volumizing, Dramatic/Length, Curled) se sirf **kitne strokes, kitne thick, kitne curled, aur - naya - har stroke ki apni length lash line ke saath position ke hisaab se kaise vary karti hai** mein differ karte hain - inme se har ek exact same primitive pe ek tuning knob hai, koi nayi rendering technique nahi. Isko reuse karne se real lash-strip art sourcing/licensing, har detected eye shape ke liye alpha-channel warping handle karna, aur ek poora naya asset-loading path (LIP ka apna texture pipeline) banane se bacha - ek difference ke liye jo purely parametric nikla.
- **Lash-stroke tuning interface ab explicitly shared hai, duplicate nahi**: `IMascaraPatternTuning` ko `ILashStrokeTuning` rename kiya gaya (constants/tryon-constants/eye.ts) aur `renderMascaraForEye` ko `renderLashStrokesForEye` (utils/tryon-utils/eye.ts) - exact same "ek interface/ek render function shared, do near-identical ki jagah" pattern jo `IEyeStrokePatternTuning`/`renderTaperedStrokeForEye` already EYELINER/KAJAL ke liye establish kar chuka tha. `applyMascaraEye` aur `applyLashesEye` ab dono thin wrappers hain: apna pattern apni tuning table mein lookup karo, same shared renderer call karo.
- **Ek genuinely nayi capability - per-position length shaping**: `lengthShape` (`{ kind: 'ramp-outer' | 'peak-center', amount }`) har stroke ki apni base length ko modulate karta hai ki wo lash line ke saath kahan baithta hai (`t`, inner corner pe 0, outer pe 1) - `ramp-outer` Winged ke liye outer corner ki taraf monotonically grow karta hai, `peak-center` Doll-eye ke liye exact same sine-arch shape reuse karta hai jo EYESHADOW ka apna `eyelidBandHeight` already establish kar chuka tha "beech mein tall, dono ends pe taper" ke liye (band height ki jagah length pe apply kiya). MASCARA ke apne 4 patterns aur LASHES ke apne Natural/Everyday, Wispy, aur Dramatic/Voluminous ye field unset chhodte hain, isliye `lashLengthShapeMultiplier` unke liye ek flat `1` (no-op) return karta hai - MASCARA ki apni rendering is addition se unaffected hai.
- **Wispy ki apni irregularity ek jitter-amplitude knob hai, nayi shape nahi**: `extraLengthJitter` existing per-stroke random-length spread (`strokeJitter`) ko widen karta hai, ek doosra randomization system introduce karne ki jagah - genuinely uneven strand lengths ("feathered" look) bina kisi naye math ke.
- **Range bounds shuru se hi pre-boosted the, hard way se discover nahi hue**: `EYE_RANGE_BOUNDS.LASHES` (`{min:0.3,max:0.85,default:0.6}`) ne MASCARA ka apna already-learned "thin individual strokes ko real texture ke against read hone ke liye boosted alpha chahiye" lesson shuru se hi match kiya, ek soft placeholder ship karne ki jagah.
- **Pattern-preview icons**: 5 icons (`public/images/tryon/eye/lashes/*.webp`) har doosri EYE finish ke apne icon set ka same base template reuse karte hain, ek one-off `canvas`-package Node script se generate kiye (commit nahi kiya, har doosri EYE finish ke apne icon generation jaisa hi temporary-tooling treatment) jo `rotateTowardUp`/`buildLashPoints`/`lashLengthShapeMultiplier` directly reimplement karta hai, taaki Winged/Doll-eye previews actual length-ramp/length-peak shape dikhayein, ek approximation nahi.
- **Ye EYE category ke apne "dedicated rendering" milestone ko close karta hai**: sab 7 planned EYE subcategories (EYELINER, KAJAL, EYESHADOW, EYEBROW, BROWGEL, MASCARA, LASHES) ab real rendering rakhti hain - `UNSUPPORTED_EYE_FINISHES` (EyeEngineBase.ts) ab ek empty set hai, jagah pe rakha gaya (remove karne ki jagah) agar EYE ko kabhi ek nayi finish milti hai to landing spot ke liye.
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (109/109, 8 naye `applyLashesEye` smoke tests samet - sab 5 patterns, ek unrecognized-pattern-id case, aur ek MASCARA-id-cross-contamination case) sab pass hoti hai. Real-photo browser verification (North Indian model, Ruby Red, sab 5 patterns): har pattern dono eyes pe symmetrically render hota hai ek visibly distinct look ke saath (Natural/Everyday ke clean fine strands; Wispy ki genuinely irregular lengths; Dramatic/Voluminous ka dense full coverage; Winged ke strands outer corner ki taraf longer ramp karte hain; Doll-eye ke strands horizontal center pe peak karte hain) - aur Natural/Everyday aur Winged ke beech ek pixel-diff ne 1,881 genuinely changed pixels paaye, confirm karta hai ki pattern picker actually render badalta hai. Ek stray typo (`#` `//` ki jagah) ne briefly dev server ke apne hot-reload ko mid-edit break kiya - commit tak pahunchne se pehle catch aur fix kiya, ek fresh `tsc -b --force` aur ek full page reload se baad mein clean confirm kiya.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), and every FACE/EYELINER/KAJAL/EYESHADOW/EYEBROW/BROWGEL/MASCARA finish's own tracker.

> **Status**: Freshly built, EYE category ka last planned subcategory, ek real photo pe sab 5 patterns ke across end-to-end proven. Full real-device QA (Live mode, multiple devices/lighting) abhi bhi shuru nahi hua, aur - is session ke apne standing convention ke hisaab se - deliberately deferred hai jab tak har planned EYE/HAIR/NAIL/SKIN subcategory exist na kar le, sirf ye ek nahi.

| #   | Dimension            | Score   | Kyun                                                                                                                                                                                                                                                                                     |
| --- | -------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10    | Zero nayi geometry primitive - poori tarah MASCARA ka already-verified lash-stroke rendering reuse karta hai, plus ek already-proven sine-arch shape EYESHADOW se borrowed. Har EYE finish jaisa hi turn-detection gap.                                                                  |
| 2   | Test coverage        | 8/10    | 8 smoke tests (sab 5 patterns + unrecognized-pattern + MASCARA-id-cross-contamination cases) - har doosri pattern-bearing EYE finish ke apne suite ne already establish ki hui same shape.                                                                                               |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                                                                                               |
| 4   | Real-device QA       | 1/10    | Live camera mode bilkul test nahi hua; Upload mode ko ek real, single-photo, single-device browser verification mili is session mein (pixel-diff confirmed, sirf visual nahi) - har doosri EYE finish ke apne starting point se exactly match karta hai.                                 |
| 5   | UX polish            | 8/10    | `TryOnPatternSwatches` ko zero component changes ke saath reuse karta hai - already-fixed "correct default shown immediately" behavior free mein inherit karta hai.                                                                                                                      |
| 6   | Architecture         | 9/10    | Ab tak ki sabse cleanest EYE finish addition - koi nayi primitive nahi, koi nayi geometry nahi, bas ek generalized shared interface (`ILashStrokeTuning`) aur ek naya optional tuning field dono finishes mein reused jinko chahiye.                                                     |
| 7   | Feature completeness | 10/10 ✅ | Sab 5 planned LASHES patterns implemented aur wired - ye last unbuilt EYE subcategory thi, isliye EYE ka apna "dedicated rendering" milestone ab poori tarah complete hai (7/7).                                                                                                         |
| 8   | Performance          | 5/10    | MASCARA jaisa hi per-frame draw-call profile (Dramatic/Voluminous ke liye per eye ~58 tak individual tapered-fill calls) - real FPS numbers dimension #4/real-device testing pe depend karte hain, aur ye (MASCARA ke baad) doosri EYE finish hai jahan ye ek genuine open question hai. |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean (ek transient typo mid-edit fix karne ke baad, commit tak pahunchne se pehle catch kiya).                                                                                                                         |

**Overall**: ~**7.7/10** — KAJAL ke apne opening shape ke barabar, ab tak ki kisi bhi pattern-bearing EYE finish ka sabse highest, kyunki isko koi nayi rendering primitives bilkul nahi chahiye thi. Next step (jab ready ho): poore EYE category ke across real-device Live + Upload QA, ek baar HAIR/NAIL/SKIN bhi exist kar lein (is session ke apne standing deferred-QA convention ke hisaab se) - ya [README.md](./README.md) ke apne suggested build order ke hisaab se agli Try-On category pe move on karna (HAIR next).

---

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md) · [← Build plan](./EYE-PLAN.md)
