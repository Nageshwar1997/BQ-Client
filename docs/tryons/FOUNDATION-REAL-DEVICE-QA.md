# FOUNDATION Try-On — Real-Device QA Checklist

[← Back to FOUNDATION tracker](./FOUNDATION.md)

Ye guide **FOUNDATION.md ke Quality score #4 (Real-device QA)** ke liye hai — is poore build ke session me jo bhi fix hua (forehead coverage, rounded edges, mouth-open, hair-exclusion instructions, turned-head overlay), unme se har ek ko real phone pe check karo. Sandboxed browser pane me camera access nahi hai, isliye Live mode ka koi bhi real behavior abhi tak sirf pixel-diff/screenshot se hi verify hua hai, kabhi actual camera se nahi. Har item ke saath **"kya dekhna hai"** likha hai, taaki pass/fail clear ho.

## Setup — phone se dev server tak pahunchna

Same as LIP's own checklist - [LIP-REAL-DEVICE-QA.md](./LIP-REAL-DEVICE-QA.md)'s setup section, dobara nahi likh raha. `npm run dev` chalao, terminal ka `Network:` URL phone ke browser me kholo, product/try-on modal tak pahuncho, FOUNDATION select karo.

---

## A. Live mode — Android Chrome

- [ ] **Camera permission + mirror check** — LIP ke checklist jaisa hi (permission prompt sahi, apna left haath uthao to screen pe left side hi dikhe)
- [ ] **Forehead coverage** — apna asli hairline dekho, foundation forehead ke top tak sahi se pahunchta hai ya raw landmark ke hisaab se kahi neeche ruk jata hai
- [ ] **Rounded edges** — face-oval aur eyebrows ke around tint ka boundary naturally curved dikhna chahiye, koi sharp/angular polygon corner nahi
- [ ] **Mouth open karke dekho** — muh khol ke muskurao/bolo, teeth/mouth-interior pe koi tint nahi lagni chahiye, sirf skin pe
- [ ] **Hair/beard/mustache** — agar beard/mustache hai, ya lambe hair forehead pe aa rahe hai, unpe tint **nahi** lagna chahiye ideal case mein (poori tarah guarantee nahi hai - landmark-only approach hai, "Hair pulled back" instruction dikhi thi wo follow karke best result milega)
- [ ] **Sideways turn karo (thoda)** — halka sa side me dekho, foundation still sahi render hona chahiye
- [ ] **Zyada turn karo (jaan-boojh kar)** — poora side profile ke kareeb ja jao → **"Face turned too much"** overlay dikhna chahiye, aur foundation render **poori tarah ruk jana chahiye** (dim overlay ke peeche koi bulging/broken shape dikhni nahi chahiye, sirf plain camera feed dimmed)
- [ ] **Turn se wapas seedhe aao** → overlay turant clear ho jana chahiye, foundation phir se normally render ho
- [ ] **Natural skin-shading dikhe** — foundation ek flat/mask jaisa nahi lagna chahiye, apni khud ki natural highlight/shadow variation (nose bridge, cheek) tint ke through dikhni chahiye
- [ ] **Kam se kam 2-3 shades try karo** — sab sahi tint dikhna chahiye
- [ ] **Intensity slider** — kam se zyada karke dekho, visibly badalna chahiye
- [ ] **FPS/smoothness + 2-3 minute continuous use** — LIP ke checklist jaisa hi
- [ ] **Compare slider + download snapshot** — LIP ke checklist jaisa hi

## B. Upload mode — Android Chrome

- [ ] **Apni real selfie/photo** upload karo (preset AI model se alag - apna asli chehra) - forehead, hair, aur agar ho to beard/mustache real photo pe check karne ke liye
- [ ] Upar A wale forehead/rounded-edges/mouth-open/hair/turned-angle sab items isi real photo pe bhi try karo
- [ ] Ek turned-angle photo bhi try karo (agar available ho) - "Face turned too much" overlay upload mode mein bhi sahi kaam karna chahiye

## C. iOS Safari

A aur B ke important items dobara, Safari pe:

- [ ] Camera permission flow
- [ ] Forehead coverage + mouth-open + turned-angle overlay
- [ ] Compare slider + download

## D. Bonus (agar time ho)

- [ ] Alag lighting conditions mein try karo (bright vs dim) - forehead extension/rounded-edges quality lighting se affect to nahi hoti
- [ ] Device rotate karo - layout hold kare

---

## Result kaise report karo

Har section ke items pe simply bolo: **"sab sahi tha"** ya **"ye wala item me ye problem dikhi: ..."** (jitna specific ho sake). Us hisaab se:

1. Agar koi real bug mile — usse fix karunga
2. Agar sab sahi mila — [FOUNDATION.md](./FOUNDATION.md) ke unchecked checkboxes ("Performance & cross-device QA", "Output preview/download QA") tick kar dunga, Real-device QA aur Performance dono ka score update karunga
