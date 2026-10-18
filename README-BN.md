# Anime Universe — GitHub Pages Project (Bangla)

## ফোল্ডার/ফাইল
- `index.html` — ওয়েবসাইটের মূল কাঠামো
- `assets/css/style.css` — ডিজাইন ও responsive styles
- `assets/js/app.js` — AniList, UI, local data, search, reader/player behavior
- `.nojekyll` — GitHub Pages-এর জন্য optional marker

## গুরুত্বপূর্ণ নিরাপত্তা পরিবর্তন
- মূল আপলোড করা HTML-এ একটি hard-coded Groq API key ছিল। প্রকাশযোগ্য কপি থেকে সেটি সরানো হয়েছে। মূল key-টি Groq dashboard-এ revoke/rotate করুন।
- AI/Groq API key কখনো public HTML/JavaScript-এ রাখবেন না। AI feature নিরাপদ করতে server-side Worker/Backend প্রয়োজন।
- স্বয়ংক্রিয় third-party streaming scraper এবং স্বয়ংক্রিয় তৃতীয়-পক্ষ সার্চ fallback বন্ধ করা হয়েছে। ভিডিও পেজের Custom Embed control-এ শুধু নিজের/অনুমোদিত provider-এর embed URL বা direct media URL দিন।
- AniList শুধু metadata দেয়; ভিডিও বা manga content নয়।

## Redmi Android থেকে GitHub Pages প্রকাশ
1. ZIP extract করুন। `index.html` এবং `assets` ফোল্ডার একই project root-এ থাকবে।
2. https://github.com/new খুলুন এবং `anime-universe` নামে Public repository তৈরি করুন।
3. Repository → `Add file` → `Upload files` খুলুন।
4. `index.html`, `.nojekyll`, এবং `assets` ফোল্ডারের ভেতরের `css/style.css` ও `js/app.js` আপলোড করুন। ফোল্ডার আপলোড সমর্থিত না হলে প্রথমে `assets/css` ও `assets/js` ফোল্ডার তৈরি করে তাদের ফাইল আলাদাভাবে আপলোড করুন।
5. `Commit changes` চাপুন।
6. Repository → `Settings` → `Pages` → `Deploy from a branch` নির্বাচন করুন।
7. Branch `main`, folder `/(root)` নির্বাচন করে `Save` চাপুন।
8. কয়েক মিনিট পর `Visit site` খুলুন। URL হবে `https://YOUR-USERNAME.github.io/anime-universe/`।

## মোবাইল আপলোডে সবচেয়ে সহজ বিকল্প
GitHub-এর Upload files page-এ যদি ZIP extract করে folder upload করা অসুবিধা হয়, আগে `index.html` আপলোড করুন; এরপর `assets/css/style.css` এবং `assets/js/app.js`-এর জন্য repository-তে সঠিক path তৈরি করে ফাইল যোগ করুন। path-এর বানান ও uppercase/lowercase হুবহু মিলতে হবে।

## পরীক্ষা
- Live site-এ home/search/characters/details পরীক্ষা করুন।
- AniList metadata লোড হতে internet প্রয়োজন। API rate limits বা availability বদলাতে পারে।
- Video: শুধু অনুমোদিত embed/direct URL ব্যবহার করুন। হোস্ট embed বন্ধ করলে বা CORS/DRM/format বাধা থাকলে প্লে নাও হতে পারে।
- GitHub Pages static hosting; Node/Python server চালায় না। Proxy/AI key endpoint-এর জন্য আলাদা Worker/backend প্রয়োজন।

## Worker সম্পর্কে
সাধারণ AniList metadata query সরাসরি frontend থেকে আগে পরীক্ষা করুন। CORS proxy কেবল নিজের/অনুমোদিত upstream-এর জন্য এবং নির্দিষ্ট allowlist-সহ তৈরি করুন; open proxy বানাবেন না।
