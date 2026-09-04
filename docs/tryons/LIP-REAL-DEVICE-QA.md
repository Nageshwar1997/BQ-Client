# LIP Try-On — Real-Device QA Checklist

[← Back to 10/10 plan](./LIP-10-10-PLAN.md)

Ye guide **#4 Real-device QA** ke liye hai — is poore session me jo bhi fix/feature bana, unme se har ek ko real phone pe specifically check karo, taaki agar koi cheez sandboxed browser me kabhi test hi nahi ho payi thi (jaise poora Live/camera mode), usme koi issue ho to pata chale. Har item ke saath likha hai **"kya dekhna hai"** aur **"problem kaisa dikhega"** — taaki pass/fail clear ho.

## Setup — phone se dev server tak pahunchna

1. Phone aur computer **same WiFi** pe hone chahiye.
2. Terminal me:
   ```bash
   npm run dev
   ```
3. Terminal me do URLs print honge — ek `Local:` (sirf computer pe kaam karega), ek `Network:` jaisa `http://192.168.x.x:3001/` (`vite --host` isliye hi likha hai package.json me — sab network interfaces pe bind karta hai). **Yehi Network wala URL phone ke browser me kholo.**
4. Agar phone-computer alag network pe hai (WiFi nahi, sirf mobile data), to ye kaam nahi karega — same WiFi zaroori hai.
5. Product/tryon modal tak pahuncho jaise normally pahunchte ho.

---

## A. Live mode — Android Chrome

- [ ] **Camera permission** — pehli baar permission maango to sahi se prompt aaye, allow karne pe camera turant start ho
- [ ] **Mirror check** (isi session me fix hua tha) — apna **left haath** uthao, screen pe wo **left side hi** dikhna chahiye (mirror-selfie jaisa, flip nahi). Ye check **do baar** karo: (1) jab tak "Waiting for camera permission..." overlay dikh raha ho (2) jaise hi tryon ready ho jaye. Dono me consistent direction honi chahiye — agar ready hone se pehle/baad me direction badal jaye, to bug hai.
- [ ] **Loading→ready transition** — koi bhi glitch/flash nahi dikhna chahiye jaise hi loading khatam ho (chhote se moment ke liye bhi koi overlay flash ho ke gayab na ho)
- [ ] **Face-guide debounce** — jaan-boojh kar frame se bahar niklo (side me ho jao) → **turant** warning nahi, ~1.5 second baad "Face not in frame" aana chahiye. Wapas frame me aao → **turant** clear ho jana chahiye (koi delay nahi)
- [ ] **Face-guide "not clear"** — camera se bahut door ya bahut paas jao → "Face not clearly visible" aana chahiye
- [ ] **Mode/model switch ke baad flicker nahi** — Live se Upload switch karo, phir wapas Live pe aao (ya koi model select karo) → face-guide overlay galti se flash nahi hona chahiye
- [ ] **Shade select + render** — koi bhi shade select karo, lips pe turant render ho, mooh hilane pe smoothly track kare
- [ ] **Kam se kam 4-5 alag finishes try karo** (MATTE, GLOSS, SHIMMER, LINER, METALLIC achhe hai — sabse zyada visually alag) — sab sahi dikhne chahiye, koi glitch/artifact nahi
- [ ] **FPS/smoothness** — feed laggy/choppy to nahi lag raha? Apna perceived-smooth/laggy note kar lo
- [ ] **2-3 minute continuous use** — phone garam to nahi ho raha, battery bahut fast to drain nahi ho raha, time ke saath slow to nahi ho raha
- [ ] **Compare slider** — compare mode on karo, slider drag karo — smooth feel hona chahiye, divider finger ke saath accurately move kare
- [ ] **Download snapshot** — snapshot lo, downloaded image check karo — mirror-correct honi chahiye (jaisa screen pe tha), makeup included ho
- [ ] **Retry flow** — camera permission ek baar deny karo (settings se) ya WiFi thodi der ke liye band karo mid-load — error message + "Retry" button dikhna chahiye, WiFi/permission wapas thik karke Retry click karo → recover ho jana chahiye

## B. Upload mode — Android Chrome

- [ ] **Real camera-roll photo** upload karo (AI-generated model image nahi) — ideally phone se hi liya hua portrait photo (EXIF orientation test ke liye)
- [ ] **Orientation sahi ho** — photo seedhi dikhni chahiye, sideways/upside-down nahi (EXIF rotation issue ka classic sign)
- [ ] **Bada file size try karo** (5-10MB+, modern phone camera photos aksar itni badi hoti hai) — "Processing photo..." atakna nahi chahiye
- [ ] **10MB se bada file** — proper error message aana chahiye, loading aur error dono saath me nahi dikhne chahiye (ye bug pehle session me fix hua tha)
- [ ] Ek preset AI model bhi try karo comparison ke liye
- [ ] Face-guide waisa hi kaam kare jaisa live mode me (static photo pe bhi)

## C. iOS Safari — sabse zyada risk wala browser

Historically `getUserMedia`/canvas quirks Safari me sabse zyada aate hai. A aur B ke **important items dobara** karo, Safari pe specifically:

- [ ] Camera permission flow (iOS ka apna stricter privacy prompt)
- [ ] Mirror check
- [ ] Face-guide debounce
- [ ] Kam se kam 2-3 finishes render
- [ ] Compare slider + download
- [ ] Upload mode + oversized-file error
- [ ] Browser console me koi Safari-specific error dikhe to note karo (agar dev tools connect kar sakte ho Mac se, warna bas app ka behavior note karo)

## D. Bonus (agar time ho)

- [ ] Device rotate karo (portrait↔landscape) — layout reasonably hold kare
- [ ] Android + iOS dono pe ek round extra karo agar pehla pass smooth gaya (confidence ke liye)

---

## Result kaise report karo

Har section ke items pe simply bolo: **"sab sahi tha"** ya **"ye wala item me ye problem dikhi: ..."** (jitna specific ho sake — konsa device/browser, kya expect kiya tha, kya hua). Main us hisaab se:

1. Agar koi real bug mile — usse fix karunga
2. Agar sab sahi mila — [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md) aur [LIP.md](./LIP.md) ke unchecked checkboxes ("Performance & cross-device QA", "Output preview/download QA") tick kar dunga, aur Performance ka score 9→10 update karunga

Isi checklist ko baar-baar reuse kar sakte ho — jab bhi LIP me koi naya change ho jo Live/camera-dependent ho, isi list se ek quick re-pass kar lena kaafi hoga.
