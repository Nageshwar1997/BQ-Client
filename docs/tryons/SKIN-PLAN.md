# SKIN Category — Build Plan

[← Back to master tracker](./README.md) · [← Back to SKIN category](./SKIN.md)

_Planning doc, koi bhi SKIN code likhne se pehle likha gaya - same reason [EYE-PLAN.md](./EYE-PLAN.md)/[LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md)/[FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md) apni alag doc me hain, chat log me dabi hui nahi. Ye progress tracker nahi hai (wo [SKIN.md](./SKIN.md) hai, abhi bhi saare unbuilt placeholders) - ye un **design decisions** ko capture karta hai jo koi bhi code likhne se pehle liye gaye._

## Ye doc kyun banaya

Ab tak build hui har category (LIP, FACE, EYE) ek real product **color** try karwati hai - ek shade choose karo, phir render function us shade ko kisi region pe paint kar deta hai. SKIN is assumption ko todta hai: moisturizer, serum, sunscreen waghera ki koi shade match karne wali hoti hi nahi hai - [SKIN.md](./SKIN.md) ka apna opening note pehle se hi ye flag kar chuka tha, isi wajah se SKIN build order me sabse last rakha gaya ([README.md](./README.md) ka suggested build order, item 6, dekho). Ye doc us open question ko koi bhi code likhne se pehle resolve karta hai: SKIN ka "try-on" actually dikhata kya hai, is app ke landmark-only constraint ko dekhte hue (koi ML segmentation kahin nahi hai - existing har FACE finish ke against confirm kiya, neeche Research section dekho), 8 me se kaunse subcategories ka apna distinct visual banana worth hai, aur state/architecture kaisa hona chahiye.

**Ek stale fact bhi yahi fix kiya**: [SKIN.md](./SKIN.md) ki apni tracking-model line abhi kehti hai "face segmentation (skin region only, no fine landmarks needed)" - ye directly actual codebase (`src/utils/tryon-utils/face.ts`) ke against check kiya aur ye galat hai. Is app me kahin bhi segmentation hai hi nahi, FACE bhi nahi - har full-face finish (FOUNDATION/BRONZER/BBCREAM/COMPACTPOWDER) wahi 478-point MediaPipe landmark mesh pe kaam karta hai jo EYE/LIP use karte hain, `FACE_OVAL_INDICES` (standard face-oval landmark ring) pe clip karke, eyes/eyebrows/mouth ko holes ki tarah punch out karke. SKIN ko bhi exact yahi chahiye hoga, real segmentation nahi - [SKIN.md](./SKIN.md) me bhi isi ke saath correct kar diya.

## Research: "glow" banane ke liye actually kya available hai

Skin-quality simulate karne ke sabse kareeb jo bhi FACE finish hai, unko directly check kiya - guess nahi kiya, ek real technique dhoondi jispe build kar saken:

- **`fillFaceOvalRegion`** (`utils/tryon-utils/face.ts`) - shared full-face-wash primitive jo FOUNDATION/BRONZER/BBCREAM/COMPACTPOWDER sab already use karte hain: face oval pe clip karo (forehead-extended via `applyForeheadExtension`, kyunki raw oval ka apna top edge hairline pe hota hai, forehead ke beech me nahi), flat color/alpha pe fill karo, eyes/eyebrows/mouth ko holes ki tarah punch out karo, ek baar composite karo. Har full-face SKIN effect ke liye yehi obvious region primitive hai.
- **HIGHLIGHTER** (`applyHighlighterFace`) - "glow" jaisi jo cheez aaj exist karti hai usme sabse kareeb, aur ye ek **fake** hai: har cheekbone pe ek tight `drawFeatheredBlob` (radial gradient, center solid, transparent tak fade), color ko `mixTowardWhite` se white ki taraf push kiya hua. Koi blur nahi, koi blend mode nahi, koi lighting simulation nahi - "glow" yahan sirf "face ke ek high point pe, soft-edged blob me, ek lighter color" hai.
- **BBCREAM** - FOUNDATION jaisa hi `fillFaceOvalRegion` wash, bas alpha kam (0.35 vs 0.6). "Sheer/natural" bas ek alpha value hai, aur kuch nahi.
- **COMPACTPOWDER** (matte) - same wash se pehle `desaturateTowardGray` (luma-matched per-channel desaturation) apply hota hai. "Matte" yahan "kam saturated" hai, kyunki specular/shine data hai hi nahi jo actually dampen kiya ja sake.
- **Aur kuch exist nahi karta** - is poore codebase me kahin bhi blur-based texture smoothing, shimmer/specular technique, ya pore-level koi bhi cheez nahi hai.

**Honest conclusion**: real segmentation ya lighting model ke bina, ye app genuine dewiness, skin-texture smoothing, ya kisi light source ko track karne wala specular highlight simulate nahi kar sakta. Har SKIN finish inhi teen ingredients se banega jo FACE already prove kar chuka hai - **kisi alpha pe full-oval wash** (`fillFaceOvalRegion`), **anatomical high points pe localized feathered-blob highlights** (`drawFeatheredBlob`, HIGHLIGHTER ke apne anchors), aur **per-channel color math** (whiten/desaturate/warm-shift, sab already likhe hue) - plus softening ke liye `ctx.filter` blur. Ye SKIN-specific limitation nahi hai; yehi ceiling har FACE finish ne already accept kiya hai. Neeche ka actual planning work ye decide karna hai ki inn teen ingredients ka kaunsa combination "moisturizer" jaisa dikhta hai vs "serum" vs "sunscreen" waghera, kyunki inme se kisi ko bhi real product-photo reference nahi milta jiski taraf render kiya jaye, jaisa lipstick shade ko milta hai.

## Scope decision - 8 me se sirf 3 build honge

Pehle draft ka build order "pipeline-fastest" ke liye optimize kiya gaya tha, "user ko visually achha lage" ke liye nahi. Directly puchne pe ki kaunsa SKIN try-on "proper aur visible" banega, dono cheezein ek saath resolve hui: order ko visual-impact-first kiya, aur jo subcategories genuinely underwhelming rehte (deliberately subtle/invisible effect, is app ke landmark-only constraint ke saath) unhe visual-tryon scope se explicitly **drop** kar diya, sirf deprioritize nahi kiya.

**Build honge (priority order mein)**: MASK, MOISTURIZER, EYECREAM.
**Drop honge (visual-tryon scope se, koi dedicated renderer nahi banega)**: SERUM, TONER, SUNSCREEN, CLEANSER, EXFOLIATOR.

Ye 5 abhi bhi real, sellable product categories hain (`TRY_ON_MAP.SKIN` unhe list karta hai, product catalog side pe koi change nahi) - bas inka apna AR/visual try-on nahi banega, jaisa EYE category ka `UNSUPPORTED_EYE_FINISHES` set unbuilt finishes ke liye "render kuch nahi" pattern establish kar chuka tha (farak itna hai: EYE ka wo set "abhi tak nahi bana" tha, ye "deliberately nahi banayenge" hai). Agar future me real segmentation ya lighting model mil jaye (jo genuine texture/glow simulate kar sake), ye decision revisit ho sakta hai.

## Subcategories — visual language, buildability, aur final decision

SKIN ki 8 subcategories hain (`TRY_ON_MAP.SKIN`, `@beautinique/shared-constants` ke against confirm kiya): MOISTURIZER, SERUM, TONER, CLEANSER, SUNSCREEN, MASK, EYECREAM, EXFOLIATOR.

| Subcategory | Decision      | Visual language                                                                                                     | Reuses                                                                                                                                                    | Complexity    |
| ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| MASK        | ✅ Build (1st) | Strongest, sabse visible effect - saturated highlight blobs high points pe + higher wash alpha, "instant glow" look | `fillFaceOvalRegion` + `drawFeatheredBlob` × 4 anchors (HIGHLIGHTER ki apni technique, zyada points pe, strong tuning)                                    | Easy → Medium |
| MOISTURIZER | ✅ Build (2nd) | Same technique, thoda subtle/natural "dewy" version - phir bhi clearly visible                                      | MASK jaise hi primitives, halki tuning                                                                                                                    | Easy → Medium |
| EYECREAM    | ✅ Build (3rd) | Brightening **sirf** aankhon ke neeche - localized lekin genuinely visible, before/after demo-worthy                | `drawFeatheredBlob` ek under-eye anchor ke saath + wide/short ellipse radii (CONCEALER ki apni technique, directly reuse) - `fillFaceOvalRegion` **nahi** | Medium        |
| SUNSCREEN   | ❌ Drop        | Matte, no-shine finish - real hai lekin subtle, "kuch hua hi nahi" jaisa lag sakta hai                              | `fillFaceOvalRegion` + `desaturateTowardGray` (COMPACTPOWDER, directly reuse)                                                                             | Easy          |
| SERUM       | ❌ Drop        | Poore face pe even, subtle brightening wash - MOISTURIZER se kam visible, aur uske jaisa hi lagta                   | `fillFaceOvalRegion` (BBCREAM ka apna low-alpha shape)                                                                                                    | Easy          |
| TONER       | ❌ Drop        | Same wash, thoda sa desaturated - SERUM se bhi subtle, near-invisible farak                                         | `fillFaceOvalRegion` + `desaturateTowardGray` (COMPACTPOWDER ka math, bahut halka touch)                                                                  | Easy          |
| CLEANSER    | ❌ Drop        | Dikhane ko genuinely kuch khaas nahi hai - [SKIN.md](./SKIN.md) ka original note bhi yehi flag kar chuka tha        | -                                                                                                                                                         | Low value     |
| EXFOLIATOR  | ❌ Drop        | "Smoothness" ke liye texture-level detail chahiye jo ye app dekh hi nahi sakta                                      | -                                                                                                                                                         | Low value     |

_Build note_: MASK/MOISTURIZER ko HIGHLIGHTER ki blob technique hi chahiye, bas zyada anchor points pe repeat ki hui (naye landmark anchors - forehead center, nose bridge, chin - naya rendering math nahi). EYECREAM akeli build-honi-wali subcategory hai jo poora full-face wash skip karti hai aur apna alag region chahti hai, lekin wo region already CONCEALER ke apne under-eye ellipse blob ki tarah exist karta hai - koi nayi geometry nahi. SUNSCREEN/SERUM/TONER technically SAME jitne easy the (sab `fillFaceOvalRegion` pe FACE se already likhe color-math variants) - drop hone ki wajah buildability nahi, visual impact thi.

## Open questions - build karte waqt decision chahiye

1. **`state.color` (shade picker) ka matlab kya hai jab product ki koi shade hi nahi hai?** Real skincare listings me lipstick jaisa color swatch nahi hota, lekin is app ka shared architecture (`IMakeupState.color`, `TryOnModal` ka `shades` prop) assume karta hai ki har category ki ek hoti hai. **Recommendation**: existing shape hi rakho (koi naya state type nahi chahiye - neeche Architecture dekho) aur `color` ko literal applied shade ki jagah _glow ka apna tint anchor_ maano - jaise "Golden Glow" vs "Pearl Glow" vs "Natural" pick ek warm-white / cool-white / neutral-white `mixTowardWhite` target pe map ho, waise hi jaise real skincare marketing apne finish tones ko naam deti hai. Shade-picker UI copy likhne se pehle iske liye product-catalog side se confirmation chahiye (kya MASK/MOISTURIZER/EYECREAM products actually named finish-tone variants ke saath aate hain?), lekin render code ko ye block nahi karta - render function bas jo bhi `rgb` mile wahi use karta hai, har category jaisa.
2. **MASK vs MOISTURIZER visual overlap**: jaisa upar tune kiya hai, ye dono ek hi do primitives hain, bas alag strength pe - dono ban jaayein to ek real side-by-side check zaroori hai confirm karne ke liye ki ye genuinely alag products jaise dikhte hain, sirf "moisturizer but more" nahi.

## Suggested build order

1. **MASK** - sabse zyada visible/dramatic, aur MOISTURIZER ke exact same primitives (full-oval wash + multi-point highlight blobs) pe bana hai, bas strong tuning ke saath - dono ek saath build karna natural hai.
2. **MOISTURIZER** - MASK ke turant baad, taaki dono ko side by side compare kiya ja sake (Open question 2) aur strength-tuning dono ke liye ek saath decide ho.
3. **EYECREAM** - localized region, CONCEALER ki under-eye blob technique port karni hai.

## Proposed architecture

EYE se simpler hai, kyunki SKIN ko `pattern` jaisa doosra customization axis nahi chahiye (yahan kisi bhi subcategory me EYELINER ke winged vs thin jaisa real "style variant" nahi hai - har ek ek hi visual effect hai, ek tunable intensity pe):

- `ISkinTryOnState = IMakeupState<TSkinFinish>` - **koi extension bilkul nahi chahiye**, existing shape (`type`/`color`/`range`) ka seedha reuse, FACE ke apne state se exactly match karta hai, EYE ke extended wale se nahi.
- `ISkinRenderParams extends IRenderEffectBaseParams { rgb: TRGBTuple }` (types/tryon-types/skin.ts) - `IFaceRenderParams` jaisa hi identical shape, koi extra field nahi (koi `pattern` carry nahi karna).
- `SkinEngineBase` (classes/tryon/categories/skin/SkinEngineBase.ts) + `SkinLiveEngine`/`SkinUploadEngine` - `FaceEngineBase` ka apna structure directly clone karo (same `withLiveCamera`/`withImageUpload` mixins jo har category already reuse karti hai), EYE ka nahi - FACE hi yahan closer architectural sibling hai kyunki dono me pattern dimension nahi hai.
- Render functions ek naye `utils/tryon-utils/skin.ts` me rahenge, isi file ke apne established "self-contained per category, shared landmark constants cross-import karne ki bajaye duplicate karo" convention ko follow karte hue - `FACE_OVAL_INDICES` aur exclusion-hole indices apni SKIN-local copies paayenge, jaisa EYE ne FACE ke eyebrow indices duplicate kiye the.
- Har `apply<Finish>Skin` function ek thin wrapper hai jo decide karta hai ki `fillFaceOvalRegion`-equivalent wash + `drawFeatheredBlob`-equivalent highlight anchors + color-math transform ka kaunsa combination apply karna hai - yahan actual "building" mostly teen already-proven FACE techniques ko ek nayi file me port karna hai, naya canvas math invent karna nahi.

## Next steps

MASK se start karo (sabse zyada visible, MOISTURIZER ke exact same primitives) - ye poore SKIN engine/state pipeline ko end-to-end validate bhi kar dega, kisi kam-visible subcategory se start karne ki zaroorat nahi. Same per-finish pipeline jo har LIP/FACE/EYE finish already use kar chuki hai: constants → render function → engine wiring → smoke test → synthetic visual check → tracker doc. Shade-picker UI copy specifically likhne se pehle, Open question 1 (shadeless product ke liye `color` ka matlab kya hai) ko SKIN product catalog owner ke saath resolve karo.

---

[← Back to master tracker](./README.md) · [← Back to SKIN category](./SKIN.md)
