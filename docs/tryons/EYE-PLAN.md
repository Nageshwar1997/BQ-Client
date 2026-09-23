# EYE Category — Build Plan

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md)

_Planning doc, 2026-09-04 ko likha gaya EYE build session ke liye jo 2026-09-05 ("kal") se shuru hona tha. Progress tracker nahi hai (wo [EYE.md](./EYE.md) hai, abhi bhi saare unbuilt placeholders) - ye un **design decisions** ko capture karta hai jo koi bhi code likhne se pehle liye gaye, same reason [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md)/[FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md) apni alag doc me hain, chat log me dabi hui nahi._

## Ye doc kyun banaya

LIP (11 finishes) aur FACE (8 finishes) dono **color-only** the - ek shade, ek intensity slider (`state.color` + `state.range`), koi doosra customizable dimension nahi. EYE ek genuinely nayi axis add karta hai: **pattern/style**, color ke upar - jaise EYELINER sirf "kaunsa color" nahi hai, "thin vs thick vs winged" bhi hai. Ye doc plan karta hai ki EYE ki 7 subcategories mein se kaunsi ko pattern dimension milega, per subcategory pattern options kya hain, is app ke existing landmark+Canvas2D primitives se (koi ML segmentation nahi, same constraint jo har LIP/FACE finish ne follow ki hai) har ek build karna kitna hard hai, aur ek suggested build order.

## Subcategories — pattern ya color-only

EYE ki 7 subcategories hain (`TRY_ON_MAP.EYE`): EYEBROW, EYELINER, KAJAL, EYESHADOW, MASCARA, LASHES, BROWGEL.

| Subcategory | Pattern?     | Reuses                                                                                                                    | Complexity    |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------- |
| EYELINER    | ✅            | LIP ka `applyLinerLips` stroke+blur primitive                                                                             | Easy          |
| KAJAL       | ✅            | Same stroke+blur primitive EYELINER jaisa                                                                                 | Easy          |
| EYESHADOW   | ✅            | FACE ka `drawFeatheredBlob`/gradient primitive, eyelid-shaped                                                             | Easy → Medium |
| EYEBROW     | ✅            | FACE ka flat-fill/wash primitive; texture variant LIP ka texture-asset pipeline reuse karta hai                           | Easy → Medium |
| MASCARA     | ✅            | Ek **nayi** lash-stroke primitive chahiye (abhi kisi bhi category mein exist nahi karti)                                  | Hard          |
| LASHES      | ✅            | Isko bhi ek **nayi** primitive chahiye - likely texture-asset based (LIP ka SHIMMER/GLOSS pattern), pure stroke math nahi | Hard          |
| BROWGEL     | ❌ color-only | FACE ka simple sheer-wash pattern (BBCREAM jaisa)                                                                         | Easy          |

**BROWGEL color-only hi rahega** - real product bas ek clear/tinted gel hai jo existing brow hairs ko set karta hai, iski koi distinct "shape" variants nahi hain jaisa ek liner ya eyeshadow ki hoti hai. Isme pattern dimension force karna kisi real product behavior se match nahi karta.

## Per subcategory pattern options

### EYELINER

1. **Classic Thin** - lash line ke saath ek fine single line
2. **Bold/Thick** - same line, wider
3. **Winged/Cat-eye** - outer corner ke paar ek curved flick jo upar-aur-bahar extend karti hai
4. **Double Wing (graphic)** - do flicks, sharper stylized look
5. **Smokey/Smudged** - soft blurred edge, diffused
6. **Tightline** - bahut thin, lash gaps fill karta hai, barely visible
7. **Underliner** - lower lash line pe bhi liner (placement variant, upar walon ke saath combinable)

_Build note_: 1/2/3/6 LIP ke existing stroke+blur primitive pe direct parameter changes hain (width/curve/blur). 4/7 ko multiple strokes chahiye lekin koi nayi primitive nahi.

### KAJAL

1. **Thin waterline** - subtle, waterline ke saath
2. **Tightline lower lash** - thin, lower lashes ko hugging
3. **Smudged/Smokey kajal** - thicker, diffused, kohl-like
4. **Full bold kohl** - thick, traditional, outer corner ke thoda paar extend karta hua

_Build note_: Sab 4 EYELINER jo use karta hai wahi exact stroke-width + blur-radius combinations hain - shared primitive exist karne ke baad parameter tuning ke alawa koi naya code nahi chahiye.

### EYESHADOW

1. **Single wash** - poore lid ke across ek flat color
2. **Two-tone gradient** - brow bone ke kareeb lighter, crease mein darker
3. **Smokey eye** - lash line ke kareeb concentrated dark, upar feathered/blended
4. **Cut crease** - crease pe ek sharp defined line, high-contrast
5. **Halo eye** - lid ka center light/shimmer, outer corners + crease pe dark
6. **Under-eye smudge** - lower lash line pe bhi extend karta hai (placement variant)

_Build note_: 1/3 easy hain (FACE ka feathered-blob/gradient primitive, eyelid ke liye reshaped). 2/5 ko ek two-color blend chahiye (related math, abhi banaya nahi hai). 4 set ka sabse hard hai - precise crease-landmark tracing chahiye aur alag eye shapes ke across zyada failure-prone read hota hai.

### EYEBROW

1. **Natural hair-stroke** - individual-hair-like texture (ek texture asset chahiye, LIP ka texture pipeline)
2. **Soft powder fill** - diffused soft fill
3. **Bold/Defined fill** - solid, sharp-edged fill (pomade/pencil look)
4. **Ombre brow** - front pe light, tail pe bold/dark (linear gradient)
5. **Feathered/Fluffy (soap-brow)** - brushed-up natural look

_Build note_: 2/3 easy hain (FACE ka flat-fill primitive). 4 medium hai (ek naya lekin simple linear - radial nahi - gradient). 1/5 ko ek texture asset chahiye, LIP ka texture-loading pattern reuse karte hue, naya infrastructure nahi.

### MASCARA

1. **Natural** - subtle length, thin coat
2. **Volumizing** - thicker, fuller lashes
3. **Dramatic/Length** - long, fanned-out lashes
4. **Curled** - tips pe extra curl

_Build note_: Ek genuinely nayi "lash-stroke" primitive chahiye - upper lash line ke saath generate hui chhoti curved strokes. Pattern = us nayi primitive pe stroke count/width/length/curl parameters. Yahan LIP/FACE se reuse karne ko kuch nahi hai.

### LASHES (false-lash styles)

1. **Natural/Everyday** - subtle, real lashes ke saath blend hota hai
2. **Wispy** - feathered, varying lengths
3. **Dramatic/Voluminous** - thick, full coverage
4. **Winged** - outer corner ki taraf longer strands
5. **Doll-eye** - center mein longer strands

_Build note_: MASCARA jaisa hi complexity tier, lekin zyada likely texture-asset based (ek image per style, LIP ka SHIMMER/GLOSS approach) pure procedural stroke math se - MASCARA se actually implement karna possibly easier, similar upfront "new primitive" cost ke bawajood, kyunki art assets naye stroke-generation math ki zaroorat ko poori tarah sidestep kar dete hain.

### BROWGEL

Koi pattern nahi - sirf color/alpha, FACE ke BBCREAM jaisa hi shape (ek single sheer wash, koi color-mix transform nahi chahiye).

## Suggested build order

1. **EYELINER + KAJAL saath mein** - same underlying primitive, ek build ki price me do subcategories.
2. **EYESHADOW** - pehle flat wash + smokey (easy tier), baad mein gradient/halo/cut-crease.
3. **EYEBROW** - pehle fill variants (powder/defined), texture-based (hair-stroke/fluffy) ek baar texture-asset pattern LIP se port ho jaye.
4. **BROWGEL** - simple, ek existing FACE finish jaisa shape.
5. **MASCARA, phir LASHES** - dono ko ek naya primitive/asset pipeline chahiye, sabse last ke liye saved, is app ki build history ke har doosre "naye infrastructure chahiye" step jaisa (jaise BRONZER `fillFaceOvalRegion`'s extraction ka wait kar raha tha).

## Pattern dimension ke liye proposed architecture

Abhi lock nahi hua - ek starting proposal jo implementation actually shuru hote hi refine hoga:

- `IEyeTryOnState` (types/tryon-types/eye.ts) `IMakeupState<TEyeFinish>` extend karta hai ek naye `pattern: string | null` field ke saath, same "jab tak pick na ho tab tak blank" shape jo `color`/`type` already use karte hain.
- `EYE_PATTERN_OPTIONS: Record<TEyeFinish, { id: string; label: string }[]>` (constants/tryon-constants/eye.ts) - per-subcategory valid pattern ids ki list, same shape jo `FACE_RANGE_BOUNDS`/`LIP_RANGE_BOUNDS` already apni per-finish config ke liye use karte hain, isliye UI ek picker directly isse drive kar sake.
- `IEyeRenderParams extends IRenderEffectBaseParams { rgb: TRGBTuple; pattern: string }` (types/tryon-types/eye.ts) - same object-param + base-type-extend convention follow karte hue jispe LIP/FACE abhi retrofit hue the (earlier session ka convention note dekho) - `EyeEngineBase.applyEffect` `state.pattern` read karta hai aur jo bhi `apply<Finish>Eye` function select hua use directly pass kar deta hai.
- Har `apply<Finish>Eye` function `pattern` pe internally switch karta hai apne stroke-width/blur/gradient parameters choose karne ke liye - same shape jo LIP ka `TEXTURED_FINISH_TUNING` record already apni per-finish tuning table ke liye use karta hai.

## Next steps

EYELINER + KAJAL se start karo (sabse kam risk, shared primitive, poore color+pattern shape ko end to end validate karta hai) - ek baar wo pipeline proven ho jaye, baaki upar wale build order ko follow karte hain. Same per-finish pipeline jo har LIP/FACE finish already use kar chuki hai: constants → render function → engine wiring → smoke test → synthetic visual check → tracker doc.

---

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md)
