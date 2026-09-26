# HENNA (HAIR) Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to HAIR category](./HAIR.md) · [← Build plan](./HAIR-PLAN.md)

_Tracking model: pixel segmentation (MediaPipe `ImageSegmenter`, hair-confidence mask) - COLOR ka exact wahi engine/rendering stack reuse karta hai, koi naya infra nahi. Poori reasoning [HAIR-PLAN.md](./HAIR-PLAN.md#engine-architecture---shared-tryonenginebase-reuse-nahi-ho-sakta-as-is) mein hai._

> **HAIR ka doosra built finish, aur COLOR ke build order mein predicted "near-zero marginal cost" wala exactly wahi nikla**. `applyHennaHair` (`utils/tryon-utils/hair.ts`) `applyColorHair` ka **direct alias** hai - koi separate color-math transform nahi likhna pada. Real henna products apni distinct shades (Natural/Red/Burgundy/Black henna waghera) ke saath aate hain, jaisa koi bhi doosra HAIR product - isliye "reddish-brown" character us real, user-picked shade se aata hai, kisi hardcoded hue se nahi. HIGHLIGHTS/OMBRE abhi bhi COLOR ke hi fallback pe render hote hain (`UNSUPPORTED_HAIR_FINISHES`, [HairEngineBase.ts](../../src/classes/tryon/categories/hair/HairEngineBase.ts)).

## Summary

| Mode    | Done  | Total | %                              |
| ------- | ----- | ----- | ------------------------------ |
| Live    | 0     | 4     | 0%                             |
| Upload  | 4     | 4     | 100%                           |
| **All** | **4** | **8** | **50% — [detail](./HENNA.md)** |

## Checklist

**Live**

- [ ] Camera capture + full hair-segmentation mask wired - COLOR ka hi `HairLiveEngine`/`withLiveCameraSegmentation`, koi finish-specific difference nahi hai is layer pe. [COLOR.md](./COLOR.md)'s apna identical point jaisa hi untested hai (real camera hardware is environment mein available nahi tha).
- [ ] Full-strand recolor overlay real-time me render ho - `applyHennaHair` (= `applyColorHair`) `HairEngineBase.applyEffect`'s switch se wired - Live-specific execution abhi untested (upar wale point jaisi hi wajah).
- [ ] Variant/intensity picker functional - engine-level `setMakeupState({color:'#9a3324', range})` script se verified (neeche Design notes dekho) - real product page ke through abhi exercise nahi hua.
- [ ] Performance & cross-device QA - shuru nahi hua (standing convention - dekho [tryon-qa-deferred-until-all-built memory], sabhi categories ban jaane tak deferred).

**Upload**

- [x] Photo upload + full hair-segmentation mask static image pe - COLOR ka hi already-verified pipeline, HENNA-specific koi naya path nahi hai is layer pe.
- [x] Full-strand recolor overlay image pe apply ho - ek real henna-jaisa shade (`#9a3324`, deep auburn/copper) ke saath screenshot-verified - mask hair ke boundary ko precisely follow karta hai, skin/background bilkul untouched rehte hain, aur `'color'` composite blend ki wajah se recolored hair ke andar bhi natural shading/highlights visible rehte hain.
- [x] Shade/variant picker functional - `applyHennaHair` `applyColorHair` ka direct alias hai, isliye COLOR ka already-verified shade/range handling automatically HENNA ke liye bhi sahi hai (ek smoke test se explicitly pin bhi kiya - dono function identical hain).
- [x] Output preview/download QA - COLOR ka hi already-verified `takeSnapshot()` path, HENNA-specific koi difference nahi.

## Design notes

- **Zero naya render code - literal alias, wrapper bhi nahi**: `export const applyHennaHair = applyColorHair;` (`utils/tryon-utils/hair.ts`) - `applyBrowgelEye` (EYEBROW ka fill primitive reuse karta hai, EYE) jaisa "apna naam wala thin wrapper" bhi nahi, seedha same function reference. Wajah: HENNA aur COLOR ka rendering **bilkul identical** hai - dono full-strand recolor via confidence-mask + `'color'` blend - farak sirf itna hai ki HENNA ka product catalog listing apni khud ki henna-themed shades offer karega (Natural/Red/Burgundy/Black henna), COLOR ka apna general-purpose shade range.
- **Fixed hue nahi, real shade-driven**: [HAIR-PLAN.md](./HAIR-PLAN.md)'s original subcategory table ne "fixed warm reddish-brown target hue" plan kiya tha - build karte waqt reconsider kiya: is app ka har doosra finish (`BRONZER`/`CONTOUR`/`HIGHLIGHTER` waghera) apna color-math transform bhi `state.color` (real product shade) pe hi apply karta hai, kabhi ignore nahi karta - aur real henna products market mein genuinely alag-alag shades mein bikte hain. Isliye "state.color ignore karke hardcoded hue lagao" is app ke apne established pattern se inconsistent hota - real shade-driven approach zyada correct aur consistent hai.
- **`UNSUPPORTED_HAIR_FINISHES` se hata diya**: `HairEngineBase.ts` mein `HENNA` ab `applyHennaHair` pe directly wire hai, COLOR ke fallback pe nahi girta.
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (115/115, `hair.smoke.test.ts` mein ek naya "applyHennaHair === applyColorHair" identity-check test + ek render smoke test samet) sab clean/pass hoti hain. Real dev-server browser verification: `HairUploadEngine` ko `type: 'HENNA'` ke saath instantiate karke, ek real model photo (`North-Indian.webp`) pe ek real henna-jaisa deep auburn/copper shade (`#9a3324`) try kiya, screenshot se confirm kiya ki recolor genuinely visible hai, natural strand shading preserve hoti hai, aur skin/background ko touch nahi karta.
- **Abhi kya baaki hai**: Live camera mode bilkul untested (COLOR jaisa hi starting point). Real product page ka poora flow bhi untested - dev DB mein koi HAIR product configure nahi tha, sirf engine-level script test hua. HIGHLIGHTS/OMBRE abhi COLOR ke fallback pe render hote hain.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), aur har FACE/EYE/COLOR finish ka apna tracker.

> **Status**: HAIR ka doosra build, aur is poore feature ka sabse kam-risk finish ab tak - koi naya rendering code hi nahi, sirf ek naya `switch` case aur ek alias export. COLOR ka already-verified pipeline yahan directly credit milta hai. Full formal real-device QA - is session ke apne standing convention ke hisaab se - deliberately deferred hai jab tak har planned HAIR/NAIL subcategory exist na kar le.

| #   | Dimension            | Score    | Kyun                                                                                                                                 |
| --- | -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Robustness           | 8/10     | Koi naya code path hi nahi - COLOR ka hi already-verified pipeline directly reuse karta hai, sirf ek alias.                          |
| 2   | Test coverage        | 7/10     | 2 smoke tests (identity-check + render) - Live-mode ka path COLOR jaisa hi untested hai.                                             |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                           |
| 4   | Real-device QA       | 1/10     | Live camera mode bilkul test nahi hua; Upload mode ko engine-level ek real photo/browser verification mili is session mein.          |
| 5   | UX polish            | 6/10     | Shared shade picker/intensity slider reuse karta hai, real product-page flow abhi kabhi exercise nahi hua.                           |
| 6   | Architecture         | 10/10 ✅ | Sabse cleanest possible reuse - literal alias, zero duplicate logic, zero drift-risk (ek hi function dono finishes serve karta hai). |
| 7   | Feature completeness | 5/10     | 4 mein se 2 HAIR finish ka apna dedicated rendering hai, baaki 2 (HIGHLIGHTS/OMBRE) fallback pe hain.                                |
| 8   | Performance          | 6/10     | COLOR jaisa hi (same code path), koi real FPS/profiling measurement is session mein nahi hui.                                        |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                              |

**Overall**: ~**7/10** — COLOR se thoda behtar (Robustness/Architecture dono high hain, kyunki koi naya risk hi nahi liya), lekin Live-mode/real-device coverage abhi bhi genuinely bacha hai. Next step: OMBRE (root-to-tip gradient-alpha step, COLOR ka mask-compositing math reuse karta hai), phir HIGHLIGHTS - [HAIR-PLAN.md](./HAIR-PLAN.md#suggested-build-order)'s build order ke hisaab se.

---

[← Back to master tracker](./README.md) · [← Back to HAIR category](./HAIR.md) · [← Build plan](./HAIR-PLAN.md)
