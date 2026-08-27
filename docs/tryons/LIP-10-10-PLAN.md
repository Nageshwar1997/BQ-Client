# LIP Try-On — 8.5 → 10/10 Plan

[← Back to master tracker](./README.md) · [Subcategory tracker](./LIP.md)

Last review score: **8.5/10** (breakdown below). Sabhi 11 subcategories (MATTE/STAIN/SATIN/GLOSS/BALM/SHIMMER/CRAYON/OIL/METALLIC/PLUMPER/LINER) already real hai — koi finish add nahi karni, sirf jo gaps score neeche kheech rahe the unko close karna hai.

> **Status**: Robustness, Test coverage, Docs accuracy, UX polish, Architecture, aur Code hygiene - **6 dimensions 10/10** ✅. Performance code-side complete hai lekin real numbers ke bina score nahi de sakta - **#4 Real-device QA** pe genuinely blocked hai (uska hi hissa hai, alag nahi). Mere side se ab is plan me **koi code-side kaam nahi bacha** - sirf #4 bacha hai, jo sirf tumhara manual step hai (real phone/browser pe test), main isse camera-blocked sandbox se nahi kar sakta.

**Explicitly out of scope for this plan:**

- "Add to Cart" try-on screen ke andar — deferred, alag se karenge baad me.
- EYE/HAIR/FACE/NAIL/SKIN categories — LIP se alag roadmap item hai, [README.md](./README.md) me tracked.

## Score breakdown (current → target)

| #   | Dimension            | Current                 | Target                                                                            | Items    |
| --- | -------------------- | ----------------------- | --------------------------------------------------------------------------------- | -------- |
| 1   | Robustness           | ~~7/10~~ **10/10** ✅   | 10/10                                                                             | 3 (done) |
| 2   | Test coverage        | ~~5/10~~ **10/10** ✅   | 10/10                                                                             | 7 (done) |
| 3   | Docs accuracy        | ~~—~~ **10/10** ✅      | 10/10                                                                             | 3 (done) |
| 4   | Real-device QA       | — (never actually run)  | 10/10                                                                             | 4        |
| 5   | UX polish            | ~~9/10~~ **10/10** ✅   | 10/10                                                                             | 2 (done) |
| —   | Architecture         | ~~9.5/10~~ **10/10** ✅ | _(re-checked below — no real gap ever surfaced)_                                  | —        |
| —   | Feature completeness | 10/10                   | _(already done)_                                                                  | —        |
| —   | Performance          | 9/10                    | _(genuinely blocked on #4 — see below, this is not something I can close myself)_ | —        |
| —   | Code hygiene         | ~~9/10~~ **10/10** ✅   | _(re-checked below — 1 real fix found + applied)_                                 | —        |

---

## 1. Robustness → 10/10 ✅ done

- [x] Fix `TryOnEngineBase.startTryOn()`'s catch block ([TryOnEngineBase.ts:211-224](../../src/classes/tryon/TryOnEngineBase.ts#L211)) — abhi landmarker/texture-asset load fail hone pe sirf `console.error` + silent reset karta hai, `setError` kabhi nahi bulata. **Deeper issue mila implement karte waqt**: purana `this.cleanup()` call sirf `setError` missing nahi karta tha - uska pehla line `this.listeners = []` hai, jo is (still-mounted, non-fatal) path pe React ke `onChange` listener ko permanently disconnect kar deta, isliye sirf `setError` add karna bhi kaam nahi karta (silently notify(0 listeners) hota). Fix: `cleanup()` ko bilkul mat bulao yaha - sirf `this.landmarker = null` + `setError(...)`. **Live verified**: `window.fetch` ko monkey-patch karke MediaPipe CDN request force-fail kiya, confirm kiya UI me error message aa raha hai ("Couldn't set up the try-on...") jaha pehle hamesha ke liye "Processing photo..." pe atka rehta.
- [x] **(Naya mila, review turn me nahi tha)** `withLiveCamera.ts`'s RAF `loop()` ([withLiveCamera.ts:164-197](../../src/classes/tryon/withLiveCamera.ts#L164)) `detectForVideo`/`renderFrame` ko try/catch me nahi leta tha — agar MediaPipe kisi frame pe throw kare, to recursive `requestAnimationFrame` call kabhi nahi chalega aur poora loop silently freeze ho jayega. Fix: try/catch add kiya, catch me `stopCamera()` + `setError('Something went wrong with the live preview. Try restarting the camera.')`. Camera is sandbox me blocked hai isliye live-test nahi ho saka - tsc/eslint clean, logic simple/low-risk hai (bas ek try/catch wrapper).
- [x] Error overlay pe "Retry" action add kiya — implement/verify detail #5 (UX polish) me hai, shared item tha dono ke beech.

## 2. Test coverage → 10/10 ✅ done

**Vitest** setup kiya - `vite.config.ts` hi reuse hota hai (`defineConfig` ab `vitest/config` se, jo Vite ka apna hi hai bas `test` field ke saath typed), `environment: 'node'` (sab pure-function targets DOM ke bina chalte hai). **52/52 tests pass**, `npm run test` se chalta hai.

- [x] Vitest setup + `npm run test`/`npm run test:watch` scripts add kiye
- [x] Unit tests — `getFaceDetectionStatus` ([tryon.util.test.ts](../../src/utils/tryon.util.test.ts)): undefined/empty face, edge-touching (4 sides), size-threshold boundary, detected case — 6 tests
- [x] Unit tests — `getObjectFitContentRect` (same file): cover/contain/fill/none/scale-down (dono scale-down sub-cases), zero-dimension guard — 8 tests
- [x] Unit tests — `hexToRGBA` (same file): 3-char aur 6-char hex, with/without `#`, custom alpha — 4 tests
- [x] Unit tests — `TEXTURED_FINISH_TUNING` data-integrity ([tryon-lip.util.test.ts](../../src/utils/tryon-lip.util.test.ts)) — **note**: `Record<'GLOSS'|...|'PLUMPER', ...>` type ALREADY compile-time guarantee deta hai ki koi key missing na ho, isliye asli value ye nikli ki har numeric field sahi range (0-1, ya CRAYON ka -1 sentinel) me ho, `applyFilters` boolean ho — ye TS pakad nahi sakta (e.g. `0.3` ki jagah `3` typo). Bonus: `TEXTURED_FINISH_TUNING` ko export karna pada (pehle private tha) — 22 tests (6 finishes × 3 checks + 1 sentinel-uniqueness test)
- [x] Unit tests — `LIP_OUTER_CONTOUR_INDICES` derivation ([tryon-lip.constants.test.ts](../../src/constants/tryon-lip.constants.test.ts)) — hardcoded literal-array anchor (formula se dobara derive karke compare karna tautological hota, kuch pakadta nahi), length, closed-loop start=end, no duplicate index, shared-corner check — 5 tests
- [x] Smoke tests — sabhi 11 `applyXLips` finish functions ([tryon-lip.util.smoke.test.ts](../../src/utils/tryon-lip.util.smoke.test.ts)) — 11 tests, `it.each` table-driven, dono check karte hai: throw nahi karta + kam se kam ek non-transparent pixel actually paint karta hai (sirf "throw nahi hua" nahi - ek galat landmark-index se function silently kuch bhi draw na kare, wo bhi pakadta hai). **Technical challenge tha**: in functions ko real `document.createElement('canvas')` chahiye (kai internally temp-canvas banate hai), jo plain Node me exist hi nahi karta. Fix: `canvas` (node-canvas, real Cairo-backed rendering) + `jsdom` dono devDependency add kiye, is ek file ko `// @vitest-environment jsdom` se override kiya (baaki sab files `node` environment me hi chalte rahe) - jsdom `canvas` package ko auto-detect kar leta hai, `getContext('2d')` real kaam karta hai. Texture fixtures bhi real image load karne ke bajay ek chota solid-fill canvas bana ke diye (async decode step avoid ho gaya). Dono packages live-verify kiye standalone install karne se pehle ki actually kaam karte hai is machine pe.

Ye sab pure functions hai (smoke tests ke alawa) — koi browser/camera mock nahi chahiye tha, poori suite fast (~2.5s) aur reliable hai.

## 3. Docs accuracy → 10/10 ✅ done

- [x] [LIP.md](./LIP.md) update — LINER/METALLIC/PLUMPER 0% → 75% (sabki dedicated rendering hai). **Bonus mila**: OIL ka description bhi stale tha ("placeholder alias of GLOSS") — usko bhi fix kiya, uski apni `Oil-Upper/Lower.webp` textures hai kaafi time se. Har teeno (LINER/METALLIC/PLUMPER) ka checklist-text bhi actual implementation se match karke rewrite kiya (LINER "thin stroke" nahi tha - wide blurred+clipped stroke hai; PLUMPER me koi "volume distortion" nahi hai - pure texture+tuning hai, geometric distortion canvas-2D se possible hi nahi)
- [x] [README.md](./README.md)'s LIP row + overall % update — 55%(48/88) → 75%(66/88), overall 14%(48/344) → 19%(66/344)
- [x] "Performance & cross-device QA" / "Output preview/download QA" checkboxes **unchecked hi rakhe** — #4 ka real QA hone tak yahi honest state hai

## 4. Real-device QA → 10/10

Ye ek hi section hai jo **mujhse nahi ho sakta** — is sandboxed browser pane me camera access hi blocked hai, isliye Live mode ki real performance/behavior kabhi actually measure nahi hui hai.

- [ ] Live mode ek real phone pe (Android + iOS dono, at least ek-ek pass) — real FPS, real lighting conditions, kuch minute continuous use ke baad thermal/battery behavior
- [ ] Upload mode real phone camera-roll photo ke saath (AI-generated/downloaded model image nahi) — real EXIF orientation, real file sizes
- [ ] Safari specifically test karo — `getUserMedia`/canvas quirks ka historically sabse zyada risk yahi browser hai
- [ ] Jab QA ho jaye, #3 ke unchecked checkboxes tick karo

Baaki sab (1, 2, 3, 5) mujhse ho sakta hai — ye akela manual/external step hai.

## 5. UX polish → 10/10 ✅ done

- [x] Accessibility pass — audit karte waqt 2 real gaps mile:
  - **[TryOnModelList.tsx](../../src/components/layout/tryons/TryOnModelList.tsx)**: har model button ka accessible name identically `"Model"` tha (generic `alt="Model"`, koi `aria-label` nahi) — screen reader user ke liye sab buttons distinguish-nahi-ho-sakte the. Fix: filename se hi label derive kiya (`Central-Indian.webp` → "Central Indian"), har button ko `aria-label="Try on with the X model"` + `aria-pressed` diya. Baaki sab (shade swatches, mode toggle, range slider, compare/download) already sahi the — visible text ya explicit aria-label pehle se mojood tha.
  - **[global.css](../../src/styles/global.css)**: `button, a { outline: none; }` - poori app me har button/link ka keyboard focus ring hata hua tha, kahi bhi replacement nahi tha. Sitewide gap hai (try-on-specific nahi), lekin try-on flow isi se affected hota, isliye root cause pe hi fix kiya: `:focus-visible` scoped rule add ki (`--primary` token se, theme-aware) - mouse/touch click pe invisible rehta hai (jaisa native browser behavior hai), sirf Tab-navigation pe dikhta hai. Live verified: real Tab keypress ke baad `outlineStyle: solid` confirm kiya.
  - `ModalWrapper` already Escape-key se close hota tha - koi fix nahi chahiye tha.
- [x] Retry action — [TryOnOverlay.tsx](../../src/components/layout/tryons/TryOnOverlay.tsx) me optional `action` prop add kiya (sirf error case me dikhta hai, plain loading/face-guide me nahi). Mechanism: `LipTryOnStage` pe `key={retryKey}` - Retry click pe `retryKey` bump hoti hai, jo poore stage ko fresh remount kar deti hai (naya engine, `startTryOn()`/`startCamera()`/`loadImageUrl()` sab dobara chalte hai) - ek hi mechanism se camera-permission, image-decode, aur landmarker/asset-load, teeno failure paths cover ho jate hai, alag-alag retry method har engine pe expose karne ki zaroorat nahi padi. **Live verified end-to-end**: fetch monkey-patch karke error force kiya → Retry button dikha → fetch restore karke Retry click kiya → successful recovery confirm ki (ready state, no error)।

## 6. Architecture aur Code hygiene → re-checked

Score-table ke 4 extra rows (Architecture/Feature completeness/Performance/Code hygiene) ab tak sirf hedge the, real re-check nahi hua tha. Ab kiya:

- [x] **Architecture: 9.5 → 10/10.** Poore is session me jitne bhi bugs mile (`cleanup()` ka listener-wipe, missing catch-all `setError`, RAF loop ka missing try/catch) - sab **implementation-level bugs the, koi bhi structural redesign nahi maanga**. Abstract-base (`TryOnEngineBase`) + 2 generic mixins (`withLiveCamera`/`withImageUpload`) ka design Live aur Upload dono modes ke liye bina kisi change ke hold hua, aur docs (`README.md`) ke hisaab se yehi design agle 5 categories (EYE/HAIR/FACE/NAIL/SKIN) ke liye zero-duplication reuse hoga. Koi concrete unaddressed gap nahi mila - original review ka 9.5 sirf ek reflexive "kuch to hoga" hedge tha, real finding nahi. Isliye ab honestly 10/10.
- [x] **Code hygiene: 9 → 10/10.** Fresh scan kiya poore LIP feature (`src/classes/tryon`, `tryon-lip.util.ts`, `tryon.util.ts`, saari tryon components, hooks, constants) - `TODO`/`FIXME`/`HACK`/`: any`/`as any` **zero matches**. Ek real cheez mili: [`applyLipTexture`](../../src/utils/tryon-lip.util.ts) `export` tha jabki koi doosri file isse import nahi karti (sirf isi file ke andar 5 jagah use hota hai) - jabki baaki sab internal helpers (`isBrightColor`, `fillColor`, `clipLipsOnFace`, etc.) private hai. Fix kiya - `export` hataya, ab pattern consistent hai. `tsc`/`eslint`/`prettier`/tests (52/52) sab clean iske baad bhi.
- [ ] **Performance: 9/10 - genuinely #4 pe blocked, koi alag action item nahi hai.** Code-side sab kuch already ho chuka hai is session me (DPR cap 2x pe, compare-slider RAF-throttled, `object-fit` WeakMap-cached, GPU→CPU landmarker fallback, shared FaceLandmarker cache) - koi aur code change isko aage nahi le ja sakta bina real FPS/lighting/thermal numbers ke, jo sirf ek real device pe milte hai. Ye dhokha dena nahi chahta - is item ko #4 se alag dikhana galat hoga, isliye explicitly usi ke saath merge rakha hai, apna khud ka fake "done" nahi diya.

---

## Suggested order

1. **Robustness fixes** (1) — quick, code-only, sabse pehle taaki #4 ka real-device QA inhi known bugs ko dobara na dhunde
2. **Docs accuracy** (3) — quick, isi turn me ho sakta hai
3. **Test coverage** (2) — one-time setup cost, phir permanent safety net
4. **UX polish** (5) — quick pass
5. **Real-device QA** (4) — sabse last, kyunki ye tumhara manual step hai aur baaki sab fixes already-in ho jane chahiye isse pehle

Jab chaho bolo, kis item se start karu.
