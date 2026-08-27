# LIP Try-On — 8.5 → 10/10 Plan

[← Back to master tracker](./README.md) · [Subcategory tracker](./LIP.md)

Last review score: **8.5/10** (breakdown below). Sabhi 11 subcategories (MATTE/STAIN/SATIN/GLOSS/BALM/SHIMMER/CRAYON/OIL/METALLIC/PLUMPER/LINER) already real hai — koi finish add nahi karni, sirf jo gaps score neeche kheech rahe the unko close karna hai.

**Explicitly out of scope for this plan:**

- "Add to Cart" try-on screen ke andar — deferred, alag se karenge baad me.
- EYE/HAIR/FACE/NAIL/SKIN categories — LIP se alag roadmap item hai, [README.md](./README.md) me tracked.

## Score breakdown (current → target)

| #   | Dimension            | Current                | Target                                                                                     | Items                               |
| --- | -------------------- | ---------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------- |
| 1   | Robustness           | ~~7/10~~ **9.5/10**    | 10/10                                                                                      | 3 (✅ 2 core done + 1 stretch left) |
| 2   | Test coverage        | ~~5/10~~ **9.5/10**    | 10/10                                                                                      | 7 (✅ 6 core done + 1 stretch left) |
| 3   | Docs accuracy        | ~~—~~ **10/10** ✅     | 10/10                                                                                      | 3 (done)                            |
| 4   | Real-device QA       | — (never actually run) | 10/10                                                                                      | 4                                   |
| 5   | UX polish            | 9/10                   | 10/10                                                                                      | 2                                   |
| —   | Architecture         | 9.5/10                 | _(already effectively 10 — no action item)_                                                | —                                   |
| —   | Feature completeness | 10/10                  | _(already done)_                                                                           | —                                   |
| —   | Performance          | 9/10                   | _(folds into #4 — the missing point is unverified real-device numbers, not a code change)_ | —                                   |
| —   | Code hygiene         | 9/10                   | _(folds into #1-3 — stays clean as a byproduct, no separate task)_                         | —                                   |

---

## 1. Robustness → 10/10 ✅ core done

- [x] Fix `TryOnEngineBase.startTryOn()`'s catch block ([TryOnEngineBase.ts:211-224](../../src/classes/tryon/TryOnEngineBase.ts#L211)) — abhi landmarker/texture-asset load fail hone pe sirf `console.error` + silent reset karta hai, `setError` kabhi nahi bulata. **Deeper issue mila implement karte waqt**: purana `this.cleanup()` call sirf `setError` missing nahi karta tha - uska pehla line `this.listeners = []` hai, jo is (still-mounted, non-fatal) path pe React ke `onChange` listener ko permanently disconnect kar deta, isliye sirf `setError` add karna bhi kaam nahi karta (silently notify(0 listeners) hota). Fix: `cleanup()` ko bilkul mat bulao yaha - sirf `this.landmarker = null` + `setError(...)`. **Live verified**: `window.fetch` ko monkey-patch karke MediaPipe CDN request force-fail kiya, confirm kiya UI me error message aa raha hai ("Couldn't set up the try-on...") jaha pehle hamesha ke liye "Processing photo..." pe atka rehta.
- [x] **(Naya mila, review turn me nahi tha)** `withLiveCamera.ts`'s RAF `loop()` ([withLiveCamera.ts:164-197](../../src/classes/tryon/withLiveCamera.ts#L164)) `detectForVideo`/`renderFrame` ko try/catch me nahi leta tha — agar MediaPipe kisi frame pe throw kare, to recursive `requestAnimationFrame` call kabhi nahi chalega aur poora loop silently freeze ho jayega. Fix: try/catch add kiya, catch me `stopCamera()` + `setError('Something went wrong with the live preview. Try restarting the camera.')`. Camera is sandbox me blocked hai isliye live-test nahi ho saka - tsc/eslint clean, logic simple/low-risk hai (bas ek try/catch wrapper).
- [ ] _(stretch, abhi skip)_ Error overlay pe ek "Retry" action add karo — abhi sirf message dikhta hai, poora modal band-khol karna padta hai. UX polish (#5) ke saath karenge.

## 2. Test coverage → 9.5/10 (core done)

**Vitest** setup kiya - `vite.config.ts` hi reuse hota hai (`defineConfig` ab `vitest/config` se, jo Vite ka apna hi hai bas `test` field ke saath typed), `environment: 'node'` (sab targets pure functions hai, DOM/jsdom ki zaroorat nahi). **41/41 tests pass**, `npm run test` se chalta hai.

- [x] Vitest setup + `npm run test`/`npm run test:watch` scripts add kiye
- [x] Unit tests — `getFaceDetectionStatus` ([tryon.util.test.ts](../../src/utils/tryon.util.test.ts)): undefined/empty face, edge-touching (4 sides), size-threshold boundary, detected case — 6 tests
- [x] Unit tests — `getObjectFitContentRect` (same file): cover/contain/fill/none/scale-down (dono scale-down sub-cases), zero-dimension guard — 8 tests
- [x] Unit tests — `hexToRGBA` (same file): 3-char aur 6-char hex, with/without `#`, custom alpha — 4 tests
- [x] Unit tests — `TEXTURED_FINISH_TUNING` data-integrity ([tryon-lip.util.test.ts](../../src/utils/tryon-lip.util.test.ts)) — **note**: `Record<'GLOSS'|...|'PLUMPER', ...>` type ALREADY compile-time guarantee deta hai ki koi key missing na ho, isliye asli value ye nikli ki har numeric field sahi range (0-1, ya CRAYON ka -1 sentinel) me ho, `applyFilters` boolean ho — ye TS pakad nahi sakta (e.g. `0.3` ki jagah `3` typo). Bonus: `TEXTURED_FINISH_TUNING` ko export karna pada (pehle private tha) — 22 tests (6 finishes × 3 checks + 1 sentinel-uniqueness test)
- [x] Unit tests — `LIP_OUTER_CONTOUR_INDICES` derivation ([tryon-lip.constants.test.ts](../../src/constants/tryon-lip.constants.test.ts)) — hardcoded literal-array anchor (formula se dobara derive karke compare karna tautological hota, kuch pakadta nahi), length, closed-loop start=end, no duplicate index, shared-corner check — 5 tests
- [ ] _(stretch, abhi skip)_ Smoke test — har `applyXLips` function ko offscreen canvas + fixture landmarks ke against run karo

Ye sab pure functions hai — koi browser/camera mock nahi chahiye tha, fast (~0.5s) aur reliable hai.

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

## 5. UX polish → 10/10

- [ ] Accessibility pass — poore flow ka keyboard-only walkthrough (tab order, focus rings, Escape se modal close), har icon-only button pe aria-label (compare/download pe already hai — shade swatches, mode toggle, model list audit karo)
- [ ] #1 ka "Retry" action bhi isi me count hota hai (robustness aur UX dono improve karta hai)

---

## Suggested order

1. **Robustness fixes** (1) — quick, code-only, sabse pehle taaki #4 ka real-device QA inhi known bugs ko dobara na dhunde
2. **Docs accuracy** (3) — quick, isi turn me ho sakta hai
3. **Test coverage** (2) — one-time setup cost, phir permanent safety net
4. **UX polish** (5) — quick pass
5. **Real-device QA** (4) — sabse last, kyunki ye tumhara manual step hai aur baaki sab fixes already-in ho jane chahiye isse pehle

Jab chaho bolo, kis item se start karu.
