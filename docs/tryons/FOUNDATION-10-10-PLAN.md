# FOUNDATION Try-On — 7.5 → 10/10 Plan

[← Back to master tracker](./README.md) · [Subcategory tracker](./FOUNDATION.md)

Last review score: **~7.5/10** (breakdown in [FOUNDATION.md](./FOUNDATION.md#quality-score)). FOUNDATION khud fully built hai — koi finish add nahi karni, sirf jo gaps score neeche kheech rahe the unko close karna hai. Same shape jaisa LIP ka apna journey tha ([LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md)).

> **Status**: **7/9 dimensions ab 10/10** ✅ — Docs accuracy, Architecture, Feature completeness, Code hygiene (pehle se the), aur ab **Robustness** + **Test coverage** + **UX polish** bhi (is round mein close kiye). **2 dimensions abhi bhi baaki hain**: Real-device QA aur Performance — dono ek hi gap ka hissa hain, jaisa LIP mein bhi tha.

**Explicitly out of scope for this plan:**

- FACE ke baaki 7 subcategories (CONCEALER/HIGHLIGHTER/BLUSH/CONTOUR/BRONZER/BBCREAM/COMPACTPOWDER) — abhi unbuilt, [FACE.md](./FACE.md) me tracked, apna alag kaam hoga.
- EYE/HAIR/NAIL/SKIN categories — [README.md](./README.md) me tracked.

## Score breakdown (before → after this round)

| #   | Dimension            | Before   | After        | Notes                                                                    |
| --- | -------------------- | -------- | ------------ | ------------------------------------------------------------------------ |
| 1   | Robustness           | 8/10     | **10/10** ✅ | 1 real gap mila + fix kiya (neeche dekho)                                |
| 2   | Test coverage        | 8/10     | **10/10** ✅ | 2 naye test files (7 tests)                                              |
| 3   | Docs accuracy        | 10/10 ✅ | 10/10 ✅     | already done                                                             |
| 4   | Real-device QA       | 0/10     | 0/10         | **abhi bhi user pe depend karta hai** - checklist ban gaya, neeche dekho |
| 5   | UX polish            | 8/10     | **10/10** ✅ | 1 real a11y gap mila + fix kiya                                          |
| 6   | Architecture         | 10/10 ✅ | 10/10 ✅     | already done                                                             |
| 7   | Feature completeness | 10/10 ✅ | 10/10 ✅     | already done                                                             |
| 8   | Performance          | 6/10     | 6/10         | code-side re-confirmed, real numbers #4 pe depend karte hain             |
| 9   | Code hygiene         | 10/10 ✅ | 10/10 ✅     | fresh scan, zero matches                                                 |

---

## 1. Robustness → 10/10 ✅ done

- [x] **Real gap mila re-checking karte waqt**: `FaceEngineBase.applyEffect()` `state.faceDetection === 'turned'` hone par bhi tint render kar raha tha - turn-detection sirf overlay dikhata tha, underlying paint kabhi rukta hi nahi tha. `TryOnOverlay` ka scrim `bg-black/45` hai (semi-transparent, poora opaque nahi), isliye turned-head ka broken/bulging tint overlay ke **peeche se dikhta rehta** - jabki poori feature ka maksad hi tha ye bad-angle render kabhi na dikhe. Fix: `applyEffect` ab `state.faceDetection === 'turned'` par turant return kar deta hai, koi tint paint nahi hota jab tak face wapas frontal na ho jaye.
- [x] Baaki sab (no-face/error paths, RAF loop try/catch, `startTryOn` catch-block) LIP ke session mein hi generic/shared level pe fix ho chuke the - `TryOnEngineBase`/`withLiveCamera`/`withImageUpload` sabko equally milte hain, dobara check karne ki zaroorat nahi thi.

## 2. Test coverage → 10/10 ✅ done

**58 → 59 tests** (is session mein +7 naye, ek chhota consolidation ke saath) - `npm run test` se chalta hai.

- [x] `isFaceTurnedTooMuch` unit tests ([tryon-utils/face.test.ts](../../src/utils/tryon-utils/face.test.ts)) - frontal/symmetric, natural slight-turn (allowed), turned (dono directions), missing-landmark fail-safe, aur exact-threshold boundary - 6 tests
- [x] `applyFoundationFace` smoke test ([tryon-utils/face.smoke.test.ts](../../src/utils/tryon-utils/face.smoke.test.ts)) - LIP ke `lip.smoke.test.ts` wala hi jsdom+canvas pattern reuse kiya (throw nahi karta + kam se kam ek non-transparent pixel paint karta hai) - 1 test
- [x] Shared/agnostic tests (`getFaceDetectionStatus`, `getObjectFitContentRect`, `hexToRGBA` - [tryon-utils/index.test.ts](../../src/utils/tryon-utils/index.test.ts)) already FACE ke liye bhi equally applicable hain - LIP ke time hi likhe gaye the, dobara likhne ki zaroorat nahi

FOUNDATION LIP jitna data/logic-heavy nahi hai (koi textured-finish tuning table nahi, ek hi finish hai) - isliye proportionally chhota test count expected hai, lekin har genuinely testable pure function (turn-detection heuristic, rendering function) ab covered hai - LIP jitni hi depth, jitna FOUNDATION ke paas actually hai.

## 3. Docs accuracy → 10/10 ✅ (already done, pichle turn mein)

[FOUNDATION.md](./FOUNDATION.md) khud hi is round ke pehle bana - koi naya gap nahi.

## 4. Real-device QA → abhi bhi 0/10 (blocked on user)

Ye ek hi section hai jo **mujhse nahi ho sakti** — sandboxed browser pane me camera access blocked hai, isliye Live mode ka real behavior kabhi mujhse actually measure nahi ho sakta.

**Checklist ban gaya**: [FOUNDATION-REAL-DEVICE-QA.md](./FOUNDATION-REAL-DEVICE-QA.md) - forehead coverage, rounded edges, mouth-open, hair/beard exclusion, aur sabse important **turned-angle overlay + no-render-underneath** (abhi jo fix hua) sab specifically cover karta hai.

- [ ] End-to-end real-device test - user confirm kare
- [ ] Confirm hone ke baad [FOUNDATION.md](./FOUNDATION.md) ke unchecked checkboxes tick honge, Performance (#8) bhi usi data se unlock hoga

## 5. UX polish → 10/10 ✅ done

- [x] **Real gap mila**: [TryOnOverlay.tsx](../../src/components/layout/tryons/TryOnOverlay.tsx) ke paas koi `role`/`aria-live` nahi tha - ye canvas-driven overlay hai (koi focus change/navigation nahi), isliye screen-reader user ko iske appear hone ka koi doosra signal hi nahi milta tha. Fix: `role="alert"` jab `action` set ho (real error), warna `role="status"` (loading, ya face-guide - not-in-frame/not-clear/turned) - dono implicit `aria-live` carry karte hain. Ye shared component hai, isliye LIP ko bhi fayda hua isi fix se.
- [x] Turned-overlay ka icon differentiate kiya - pehle 'not-in-frame' wala hi scanner icon reuse ho raha tha, ab instructions-screen wala `solar:face-scan-circle-linear` use karta hai (same icon jo "facing the camera directly" tip mein hai) - visually consistent, aur apni alag situation ke liye apna icon.
- [x] Baaki (model-list aria-labels, focus-visible outline) LIP ke time hi generic components mein fix ho chuke - FACE automatically inherit karta hai.

## 6. Architecture aur Code hygiene → re-checked ✅ (already 10/10)

- [x] **Architecture**: `FaceLiveEngine`/`FaceUploadEngine` (mixin wrappers) bilkul LIP jaise hi trivial - `export class X extends withY(FaceEngineBase) {}`, koi FACE-specific override kahi nahi. Bina kisi shared-code change ke reuse hua, exactly jaisa LIP ke Architecture review ne predict kiya tha.
- [x] **Code hygiene**: Fresh scan - `TODO`/`FIXME`/`HACK`/`: any`/`as any` zero matches saari FACE-specific files (aaj ke naye edits including) mein. Dono naye exports (`isFaceTurnedTooMuch`, plus already-existing `applyFoundationFace`) genuinely consumed ho rahe hain.
- [x] **Performance**: Code-side review kiya - `applyFoundationFace`/`isFaceTurnedTooMuch` ka cost-profile LIP ke already-accepted per-frame patterns (temp-canvas creation, path tracing) jaisa hi hai, koi naya concern nahi mila. Real FPS/thermal numbers #4 pe hi depend karte hain - jaisa LIP mein bhi tha.

---

## Final status

**7/9 dimensions 10/10** ✅ — Docs accuracy, Architecture, Feature completeness, Code hygiene (already the) + Robustness, Test coverage, UX polish (is round mein close hue). **2 dimensions baaki** (#4 Real-device QA, #8 Performance) - dono ek hi cheez ka wait kar rahe hain: **real device pe end-to-end confirm**.

[FOUNDATION-REAL-DEVICE-QA.md](./FOUNDATION-REAL-DEVICE-QA.md) ready hai jab bhi test karna ho.
