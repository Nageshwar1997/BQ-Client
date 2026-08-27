# LIP Try-On — 8.5 → 10/10 Plan

[← Back to master tracker](./README.md) · [Subcategory tracker](./LIP.md)

Last review score: **8.5/10** (breakdown below). Sabhi 11 subcategories (MATTE/STAIN/SATIN/GLOSS/BALM/SHIMMER/CRAYON/OIL/METALLIC/PLUMPER/LINER) already real hai — koi finish add nahi karni, sirf jo gaps score neeche kheech rahe the unko close karna hai.

**Explicitly out of scope for this plan:**
- "Add to Cart" try-on screen ke andar — deferred, alag se karenge baad me.
- EYE/HAIR/FACE/NAIL/SKIN categories — LIP se alag roadmap item hai, [README.md](./README.md) me tracked.

## Score breakdown (current → target)

| # | Dimension | Current | Target | Items |
|---|---|---|---|---|
| 1 | Robustness | 7/10 | 10/10 | 3 (2 core + 1 stretch) |
| 2 | Test coverage | 5/10 | 10/10 | 7 (6 core + 1 stretch) |
| 3 | Docs accuracy | — | 10/10 | 3 |
| 4 | Real-device QA | — (never actually run) | 10/10 | 4 |
| 5 | UX polish | 9/10 | 10/10 | 2 |
| — | Architecture | 9.5/10 | *(already effectively 10 — no action item)* | — |
| — | Feature completeness | 10/10 | *(already done)* | — |
| — | Performance | 9/10 | *(folds into #4 — the missing point is unverified real-device numbers, not a code change)* | — |
| — | Code hygiene | 9/10 | *(folds into #1-3 — stays clean as a byproduct, no separate task)* | — |

---

## 1. Robustness → 10/10

- [ ] Fix `TryOnEngineBase.startTryOn()`'s catch block ([TryOnEngineBase.ts:211-215](../../src/classes/tryon/TryOnEngineBase.ts#L211)) — abhi landmarker/texture-asset load fail hone pe sirf `console.error` + silent reset karta hai, `setError` kabhi nahi bulata. User "Waiting.../Processing..." overlay pe hamesha ke liye atak jata hai, koi explanation nahi, modal band karne ke alawa koi rasta nahi. Fix: catch me `this.updateState.setError(...)` call karo ek clear message ke saath (e.g. "Couldn't set up the try-on. Check your connection and try again.").
- [ ] **(Naya mila, review turn me nahi tha)** `withLiveCamera.ts`'s RAF `loop()` ([withLiveCamera.ts:164-181](../../src/classes/tryon/withLiveCamera.ts#L164)) `detectForVideo`/`renderFrame` ko try/catch me nahi leta — agar MediaPipe kisi frame pe throw kare (rare, lekin kuch devices/inputs pe possible), to recursive `requestAnimationFrame` call kabhi nahi chalega aur poora loop silently freeze ho jayega, koi error nahi dikhega, controls bhi enabled hi rahenge ek frozen frame ke upar. Fix: loop body ko try/catch me wrap karo, catch me error surface karo (`setError`) aur loop ko cleanly stop karo (silently freeze hone ke bajay).
- [ ] *(stretch)* Error overlay pe ek "Retry" action add karo (abhi sirf message dikhta hai) — taaki ek transient failure (flaky network, browser hiccup) ke liye poora modal band-khol na karna pade.

## 2. Test coverage → 10/10

Repo me abhi koi test runner nahi hai (`package.json` check kiya) — **Vitest** natural fit hai (Vite hi use ho raha hai already, near-zero extra config, Jest-compatible API).

- [ ] Vitest setup + `npm run test` script add karo
- [ ] Unit tests — `getFaceDetectionStatus` ([tryon.util.ts](../../src/utils/tryon.util.ts)): undefined/empty face, edge-touching (har 4 side), size-threshold boundary (14%/16%), sab already-verified cases ko permanent regression test bana do
- [ ] Unit tests — `getObjectFitScale`/`getObjectFitContentRect`: cover/contain/fill/none/scale-down, zero-dimension guard
- [ ] Unit tests — `hexToRGBA`: 3-char aur 6-char hex, default alpha
- [ ] Unit tests — `TEXTURED_FINISH_TUNING` (tryon-lip.util.ts) data-integrity: jo bhi finish texture use karta hai uski tuning entry zaroor ho, koi missing key na ho
- [ ] Unit tests — `LIP_OUTER_CONTOUR_INDICES` derivation (tryon-lip.constants.ts): sahi length, koi duplicate index nahi, upper+reversed-lower shape match kare
- [ ] *(stretch)* Smoke test — har `applyXLips` function ko ek offscreen canvas + fixture landmarks ke against run karo, assert karo throw nahi karta aur kam se kam ek non-transparent pixel touch karta hai

Ye sab pure functions hai — koi browser/camera mock nahi chahiye, fast aur reliable rahenge.

## 3. Docs accuracy → 10/10

- [ ] [LIP.md](./LIP.md) update — LINER/METALLIC/PLUMPER abhi "0%, falls back to MATTE" dikha raha hai, jabki teeno ki dedicated rendering ban chuki hai. Sahi status daalo.
- [ ] [README.md](./README.md)'s LIP row + overall % update karo (abhi stale "55% (48/88)" hai)
- [ ] "Performance & cross-device QA" / "Output preview/download QA" checkboxes **unchecked hi rakho** jab tak #4 ka real QA actually ho na jaye — sirf doc edit karke checkbox tick karna dishonest hoga

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
