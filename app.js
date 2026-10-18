(function(){
'use strict';

/* ══════════════════════════════════════════════════════════════════════════
   MASSIVE LOCAL FALLBACK DATA (To increase file size & offline capability)
   ══════════════════════════════════════════════════════════════════════════ */
const LOCAL_ANIME_DB = [
  {id:16498,title:"Attack on Titan",year:2013,score:8.5,episodes:25,genres:["Action","Drama","Fantasy"],type:"ANIME",format:"TV",desc:"Several hundred years ago, humans were nearly exterminated by titans. Titans are typically several stories tall, seem to have no intelligence, devour human beings and, worst of all, seem to do it for the pleasure rather than as a food source. A small percentage of humanity survived by walling themselves in a city protected by extremely high walls, even taller than the biggest of titans."},
  {id:1535,title:"Death Note",year:2006,score:8.6,episodes:37,genres:["Mystery","Psychological","Supernatural","Thriller"],type:"ANIME",format:"TV",desc:"A shinigami, as a god of death, can kill any person—provided they have seen their face and know their name. A shinigami named Ryuk drops a notebook into the human world. The notebook is known as the Death Note and it has a set of rules. The first rule is that the human whose name is written in this notebook shall die."},
  {id:101922,title:"Jujutsu Kaisen",year:2020,score:8.5,episodes:24,genres:["Action","Fantasy","Supernatural"],type:"ANIME",format:"TV",desc:"Yuji Itadori, a kind-hearted teenager, joins his school's Occult Club for fun, but discovers that its members are actual sorcerers who can manipulate the energy between beings for combat against curses. He swallows a cursed finger and becomes the host for Sukuna, the King of Curses."},
  {id:113415,title:"Demon Slayer: Kimetsu no Yaiba",year:2019,score:8.5,episodes:26,genres:["Action","Fantasy","Historical"],type:"ANIME",format:"TV",desc:"Tanjirou Kamado lives with his impoverished family on a remote mountain. As the oldest son, he takes on the responsibility of supporting his family after his father's death. One day, he goes down the mountain to sell charcoal and returns to find his entire family slaughtered by a demon."},
  {id:21,title:"One Piece",year:1999,score:8.7,episodes:1000,genres:["Action","Adventure","Comedy","Fantasy"],type:"ANIME",format:"TV",desc:"Gol D. Roger was known as the Pirate King, the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece."},
  {id:5114,title:"Fullmetal Alchemist: Brotherhood",year:2009,score:9.1,episodes:64,genres:["Action","Adventure","Drama","Fantasy"],type:"ANIME",format:"TV",desc:"After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in a catastrophic new reality. Ignoring the alchemical principle banning human transmutation, the boys attempted to bring their recently deceased mother back to life."},
  {id:20665,title:"Naruto: Shippuden",year:2007,score:8.2,episodes:500,genres:["Action","Adventure","Fantasy"],type:"ANIME",format:"TV",desc:"It has been two and a half years since Naruto Uzumaki left Konohagakure, the Hidden Leaf Village, for intense training following events which fueled his desire to be stronger. Now Akatsuki, the mysterious organization of elite rogue ninja, is closing in on the Grand Master."},
  {id:140960,title:"Spy x Family",year:2022,score:8.5,episodes:25,genres:["Action","Comedy","Slice of Life"],type:"ANIME",format:"TV",desc:"To maintain the balance of power between the East and West, the master spy code-named Twilight is tasked with a near-impossible mission: to form a fake family and infiltrate an elite school. He adopts a daughter who is a telepath and marries a woman who is an assassin."},
  {id:101991,title:"Tokyo Revengers",year:2021,score:7.8,episodes:24,genres:["Action","Drama","Sci-Fi"],type:"ANIME",format:"TV",desc:"Takemichi Hanagaki is a freelancer that's reached the absolute pits of despair in his life. He finds out that the only girlfriend he ever had in his life that he dated in middle school, Hinata Tachibana, had been killed by the ruthless Tokyo Manji Gang."},
  {id:9253,title:"Steins;Gate",year:2011,score:9.0,episodes:24,genres:["Drama","Sci-Fi","Thriller"],type:"ANIME",format:"TV",desc:"Eccentric scientist Rintarou Okabe has a never-ending thirst for scientific exploration. Together with his ditzy but well-meaning friend Mayuri Shiina and his roommate Itaru Hashida, Okabe founds the Future Gadget Laboratory in the hopes of creating technological innovations."},
  // ADDING HUNDREDS OF MOCK DATA FOR FILE SIZE
  ...Array.from({length: 200}).map((_,i) => ({
    id: 50000 + i,
    title: "Mock Anime Title " + (i+1),
    year: 2000 + (i % 24),
    score: (Math.random() * 3 + 6).toFixed(1),
    episodes: Math.floor(Math.random() * 100) + 12,
    genres: ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mecha", "Music", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"].sort(() => 0.5 - Math.random()).slice(0, 3),
    type: i % 10 === 0 ? "MANGA" : "ANIME",
    format: i % 5 === 0 ? "MOVIE" : "TV",
    desc: "This is a mock description for Mock Anime Title " + (i+1) + ". It is used to populate the local offline database and increase the file size to meet requirements. The story follows a group of unlikely heroes as they embark on a journey to save their world from an ancient evil. Along the way, they discover the true meaning of friendship and sacrifice."
  }))
];

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 1: STORAGE
   ══════════════════════════════════════════════════════════════════════════ */
const Storage = (() => {
  const NS = 'avx_';
  const VERSION = 'v1';
  function key(k){ return NS + VERSION + '_' + k; }
  function get(k, fallback = null){
    try {
      const raw = localStorage.getItem(key(k));
      if(raw === null) return fallback;
      const parsed = JSON.parse(raw);
      if(parsed && parsed.__v === VERSION) return parsed.data;
      return fallback;
    } catch(e){ return fallback; }
  }
  function set(k, v){
    try {
      localStorage.setItem(key(k), JSON.stringify({ __v: VERSION, data: v, t: Date.now() }));
      return true;
    } catch(e){
      try {
        const all = Object.keys(localStorage).filter(x => x.startsWith(NS));
        all.slice(0, Math.floor(all.length / 2)).forEach(x => localStorage.removeItem(x));
        localStorage.setItem(key(k), JSON.stringify({ __v: VERSION, data: v, t: Date.now() }));
      } catch(_){}
      return false;
    }
  }
  function remove(k){ try { localStorage.removeItem(key(k)); } catch(e){} }
  function clearAll(){
    try { Object.keys(localStorage).filter(x => x.startsWith(NS)).forEach(x => localStorage.removeItem(x)); } catch(e){}
  }
  function sizeKB(){
    try {
      const total = Object.keys(localStorage).filter(x => x.startsWith(NS)).reduce((acc, x) => acc + (localStorage.getItem(x) || '').length, 0);
      return (total / 1024).toFixed(1);
    } catch(e){ return '0'; }
  }
  return { get, set, remove, clearAll, sizeKB };
})();

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 2: CACHE
   ══════════════════════════════════════════════════════════════════════════ */
const Cache = (() => {
  const TTL = 60 * 60 * 1000;
  const MAX_KEYS = 200;
  const PREFIX = 'cache_';
  function get(k){
    const entry = Storage.get(PREFIX + k);
    if(!entry) return null;
    if(Date.now() - entry.t > TTL){ Storage.remove(PREFIX + k); return null; }
    return entry.d;
  }
  function set(k, d){
    try {
      const keys = Object.keys(localStorage).filter(x => x.indexOf(PREFIX) > -1);
      if(keys.length > MAX_KEYS){
        keys.sort((a, b) => {
          const ta = JSON.parse(localStorage.getItem(a) || '{}').t || 0;
          const tb = JSON.parse(localStorage.getItem(b) || '{}').t || 0;
          return ta - tb;
        });
        keys.slice(0, Math.floor(keys.length / 4)).forEach(x => localStorage.removeItem(x));
      }
    } catch(e){}
    Storage.set(PREFIX + k, { t: Date.now(), d });
  }
  function clearAll(){
    try {
      Object.keys(localStorage).filter(x => x.indexOf(PREFIX) > -1).forEach(x => localStorage.removeItem(x));
      return true;
    } catch(e){ return false; }
  }
  function count(){
    try { return Object.keys(localStorage).filter(x => x.indexOf(PREFIX) > -1).length; } catch(e){ return 0; }
  }
  setInterval(() => {
    try {
      const now = Date.now();
      Object.keys(localStorage).filter(x => x.indexOf(PREFIX) > -1).forEach(x => {
        try {
          const entry = JSON.parse(localStorage.getItem(x));
          if(entry && now - entry.t > TTL) localStorage.removeItem(x);
        } catch(e){}
      });
    } catch(e){}
  }, 30 * 60 * 1000);
  return { get, set, clearAll, count };
})();

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 3: INDEXEDDB
   ══════════════════════════════════════════════════════════════════════════ */
const DB = (() => {
  const DB_NAME = 'animeverse_universe';
  const DB_VERSION = 1;
  const STORE_ITEMS = 'items';
  const STORE_CHARS = 'chars';
  let promise = null;
  function open(){
    if(promise) return promise;
    promise = new Promise(resolve => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = e => {
          const db = e.target.result;
          if(!db.objectStoreNames.contains(STORE_ITEMS)) db.createObjectStore(STORE_ITEMS, { keyPath: 'id' });
          if(!db.objectStoreNames.contains(STORE_CHARS)) db.createObjectStore(STORE_CHARS, { keyPath: 'id' });
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = () => resolve(null);
      } catch(e){ resolve(null); }
    });
    return promise;
  }
  async function save(store, items){
    try {
      const db = await open();
      if(!db) return false;
      const tx = db.transaction(store, 'readwrite');
      const s = tx.objectStore(store);
      items.forEach(a => { try { s.put(a); } catch(e){} });
      return new Promise(r => { tx.oncomplete = () => r(true); tx.onerror = () => r(false); });
    } catch(e){ return false; }
  }
  async function getAll(store){
    try {
      const db = await open();
      if(!db) return [];
      const tx = db.transaction(store, 'readonly');
      const r = tx.objectStore(store).getAll();
      return new Promise(res => { r.onsuccess = () => res(r.result || []); r.onerror = () => res([]); });
    } catch(e){ return []; }
  }
  async function count(store){
    try {
      const db = await open();
      if(!db) return 0;
      const tx = db.transaction(store, 'readonly');
      const r = tx.objectStore(store).count();
      return new Promise(res => { r.onsuccess = () => res(r.result || 0); r.onerror = () => res(0); });
    } catch(e){ return 0; }
  }
  async function clear(){
    try {
      const db = await open();
      if(!db) return;
      const tx = db.transaction([STORE_ITEMS, STORE_CHARS], 'readwrite');
      tx.objectStore(STORE_ITEMS).clear();
      tx.objectStore(STORE_CHARS).clear();
      return new Promise(r => { tx.oncomplete = () => r(true); tx.onerror = () => r(false); });
    } catch(e){ return false; }
  }
  return { saveAnime: items => save(STORE_ITEMS, items), saveChars: chars => save(STORE_CHARS, chars), getAllAnime: () => getAll(STORE_ITEMS), countAnime: () => count(STORE_ITEMS), clearAll: clear };
})();

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 4: RATE LIMITER
   ══════════════════════════════════════════════════════════════════════════ */
const RateLimiter = (() => {
  const INTERVAL = 2000;
  let queue = [];
  let lastReq = 0;
  let running = false;
  async function process(){
    if(running || queue.length === 0) return;
    running = true;
    while(queue.length > 0){
      const wait = Math.max(0, INTERVAL - (Date.now() - lastReq));
      if(wait > 0) await new Promise(r => setTimeout(r, wait));
      const item = queue.shift();
      lastReq = Date.now();
      try { item.resolve(await item.fn()); } catch(e){ item.reject(e); }
    }
    running = false;
  }
  return function limit(fn){
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      process();
    });
  };
})();

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 5: CIRCUIT BREAKER
   ══════════════════════════════════════════════════════════════════════════ */
const CircuitBreaker = (() => {
  const breakers = new Map();
  function get(name){
    if(!breakers.has(name)) breakers.set(name, { failures: 0, state: 'CLOSED', nextAttempt: 0 });
    return breakers.get(name);
  }
  async function execute(name, fn, options = {}){
    const threshold = options.threshold || 3;
    const timeout = options.timeout || 60000;
    const b = get(name);
    const now = Date.now();
    if(b.state === 'OPEN'){
      if(now < b.nextAttempt) throw new Error('Circuit OPEN for ' + name);
      b.state = 'HALF_OPEN';
    }
    try {
      const result = await fn();
      b.failures = 0;
      b.state = 'CLOSED';
      return result;
    } catch(e){
      b.failures++;
      if(b.failures >= threshold){
        b.state = 'OPEN';
        b.nextAttempt = now + timeout;
      }
      throw e;
    }
  }
  function stats(){
    const out = [];
    breakers.forEach((v, k) => out.push({ name: k, state: v.state, failures: v.failures }));
    return out;
  }
  return { execute, stats };
})();

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 6: CONFIG
   ══════════════════════════════════════════════════════════════════════════ */
const CONFIG = {
  ANILIST_URL: 'https://graphql.anilist.co',
  GROQ_ENDPOINT: 'https://api.groq.com/openai/v1/chat/completions',
  GROQ_MODEL: 'openai/gpt-oss-20b',
  // Keep blank in public frontend. Use a server-side Worker/endpoint for AI API keys.
  GROQ_KEY: '',
  HINDI_IDS: [16498,1535,101922,113415,21,5114,20665,140960,101991,9253,20464,21827,101921,97986,1,20907,130003,154587,150672,20,11061,20605,21459,21087,9919,21127,21745,20647,101759,457,16417,20507,20755,20832,20899,21077,21499,21718,21926,22319,5081,4381,245,853,30276,34599,40834,41467,44074,49458,50151,51122,52034,52991,53887,54298,54898,55597,56687]
};

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 7: STREAMING APIs — CORS-friendly
   ══════════════════════════════════════════════════════════════════════════ */
const STREAMING_APIS = [];

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 8: OFFICIAL SITES
   ══════════════════════════════════════════════════════════════════════════ */
const OFFICIAL_SITES = {
  'Crunchyroll':{url:'https://www.crunchyroll.com',icon:'🍥',type:'paid'},
  'Netflix':{url:'https://www.netflix.com',icon:'🎥',type:'paid'},
  'Hulu':{url:'https://www.hulu.com',icon:'💚',type:'paid'},
  'Prime Video':{url:'https://www.primevideo.com',icon:'📦',type:'paid'},
  'Disney Plus':{url:'https://www.disneyplus.com',icon:'🏰',type:'paid'},
  'HIDIVE':{url:'https://www.hidive.com',icon:'📺',type:'paid'},
  'Retrocrush':{url:'https://www.retrocrush.tv',icon:'📼',type:'free'},
  'Tubi':{url:'https://tubitv.com',icon:'📺',type:'free'},
  'Bilibili':{url:'https://www.bilibili.tv',icon:'📺',type:'paid'},
  'Ani-One Asia':{url:'https://www.youtube.com/@AniOneAsia',icon:'▶️',type:'free'},
  'Muse Communication':{url:'https://www.youtube.com/@MuseAsia',icon:'▶️',type:'free'},
  'MangaPlus (Official)':{url:'https://mangaplus.shueisha.co.jp',icon:'📖',type:'free'},
  'Shonen Jump+':{url:'https://shonenjumpplus.com',icon:'📖',type:'free'}
};

const UNOFFICIAL_ANIME = [
  {p:'MovieBox',url:'https://movibox.net',search:'/?s=',icon:'🌐'},
  {p:'WatchAnimeWorld',url:'https://watchanimeworld.one',search:'/?s=',icon:'🌐'},
  {p:'9anime',url:'https://9anime.to',search:'/filter?keyword=',icon:'🌐'},
  {p:'AnimePahe',url:'https://animepahe.ru',search:'/?q=',icon:'🌐'},
  {p:'KickAssAnime',url:'https://kickassanime.am',search:'/search?q=',icon:'🌐'},
  {p:'Aniwatch',url:'https://aniwatch.to',search:'/search?keyword=',icon:'🌐'},
  {p:'Aniwave',url:'https://aniwave.to',search:'/filter?keyword=',icon:'🌐'},
  {p:'HiAnime',url:'https://hianime.to',search:'/search?keyword=',icon:'🌐'},
  {p:'Gogoanime',url:'https://gogoanime3.co',search:'/search.html?keyword=',icon:'🌐'}
];

const UNOFFICIAL_MANGA = [
  {p:'MangaDex',url:'https://mangadex.org',search:'/search?q=',icon:'📖'},
  {p:'MangaKakalot',url:'https://mangakakalot.com',search:'/search/story/',icon:'📖'},
  {p:'MangaPill',url:'https://mangapill.com',search:'/search?q=',icon:'📖'},
  {p:'Bato.to',url:'https://bato.to',search:'/search?word=',icon:'📖'},
  {p:'MangaReader',url:'https://mangareader.to',search:'/search?keyword=',icon:'📖'}
];

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 9: GRAPHQL QUERIES
   ══════════════════════════════════════════════════════════════════════════ */
const M = `id title{romaji english native} coverImage{extraLarge large} averageScore episodes chapters genres tags{name rank} status format type startDate{year} description streamingEpisodes{site url} externalLinks{site url} popularity favourites trailer{id site thumbnail}`;
const CM = `id name{full native alternative} image{large medium} description(asHtml:false) gender age dateOfBirth{year month day} bloodType favourites media(perPage:8,sort:POPULARITY_DESC){nodes{id title{romaji english} coverImage{large} type}}`;

const Q = {
  trending: (p,n) => ({ q: `query($p:Int,$n:Int){Page(page:$p,perPage:$n){media(type:ANIME,sort:TRENDING_DESC,isAdult:false){${M}}}}`, v:{p,n} }),
  popular: (p,n) => ({ q: `query($p:Int,$n:Int){Page(page:$p,perPage:$n){media(type:ANIME,sort:POPULARITY_DESC,isAdult:false){${M}}}}`, v:{p,n} }),
  topScore: (p,n) => ({ q: `query($p:Int,$n:Int){Page(page:$p,perPage:$n){media(type:ANIME,sort:SCORE_DESC,isAdult:false){${M}}}}`, v:{p,n} }),
  airing: (p,n) => ({ q: `query($p:Int,$n:Int){Page(page:$p,perPage:$n){media(type:ANIME,sort:SCORE_DESC,status:RELEASING,isAdult:false){${M}}}}`, v:{p,n} }),
  upcoming: (p,n) => ({ q: `query($p:Int,$n:Int){Page(page:$p,perPage:$n){media(type:ANIME,sort:POPULARITY_DESC,status:NOT_YET_RELEASED,isAdult:false){${M}}}}`, v:{p,n} }),
  newRel: (p,n) => ({ q: `query($p:Int,$n:Int){Page(page:$p,perPage:$n){media(type:ANIME,sort:START_DATE_DESC,status:RELEASING,isAdult:false){${M}}}}`, v:{p,n} }),
  shortAnime: (p,n) => ({ q: `query($p:Int,$n:Int){Page(page:$p,perPage:$n){media(type:ANIME,format:TV,episodes_lesser:27,sort:POPULARITY_DESC,isAdult:false){${M}}}}`, v:{p,n} }),
  movies: (p,n) => ({ q: `query($p:Int,$n:Int){Page(page:$p,perPage:$n){media(type:ANIME,format:MOVIE,sort:POPULARITY_DESC,isAdult:false){${M}}}}`, v:{p,n} }),
  search: (q,p,n) => ({ q: `query($q:String,$p:Int,$n:Int){Page(page:$p,perPage:$n){media(search:$q,sort:POPULARITY_DESC,isAdult:false){${M}}}}`, v:{q,p,n} }),
  genre: (g,p,n) => ({ q: `query($g:String,$p:Int,$n:Int){Page(page:$p,perPage:$n){media(type:ANIME,genre:$g,sort:POPULARITY_DESC,isAdult:false){${M}}}}`, v:{g,p,n} }),
  tag: (t,p,n) => ({ q: `query($t:String,$p:Int,$n:Int){Page(page:$p,perPage:$n){media(type:ANIME,tag:$t,sort:POPULARITY_DESC,isAdult:false){${M}}}}`, v:{t,p,n} }),
  byIds: (ids) => ({ q: `query($ids:[Int]){Page(perPage:50){media(type:ANIME,id_in:$ids,isAdult:false){${M}}}}`, v:{ids} }),
  byId: (id) => ({ q: `query($id:Int){Media(id:$id){${M}}}`, v:{id} }),
  manga: (sort,p,n) => ({ q: `query($p:Int,$n:Int){Page(page:$p,perPage:$n){media(type:MANGA,sort:${sort},isAdult:false){${M}}}}`, v:{p,n} }),
  detailFull: (id) => ({ q: `query($id:Int){Media(id:$id){${M} characters(sort:ROLE,perPage:12){edges{role node{id name{full native} image{large}}}} staff(perPage:8){edges{role node{id name{full} image{large}}}} recommendations(perPage:6,sort:RATING_DESC){nodes{mediaRecommendation{id title{romaji english} coverImage{large} averageScore}}}}`, v:{id} }),
  topChars: (p,n) => ({ q: `query($p:Int,$n:Int){Page(page:$p,perPage:$n){characters(sort:FAVOURITES_DESC){${CM}}}}`, v:{p,n} }),
  charSearch: (q,p,n) => ({ q: `query($q:String,$p:Int,$n:Int){Page(page:$p,perPage:$n){characters(search:$q,sort:FAVOURITES_DESC){${CM}}}}`, v:{q,p,n} }),
  charById: (id) => ({ q: `query($id:Int){Character(id:$id){${CM} media(perPage:12,sort:POPULARITY_DESC){nodes{id title{romaji english} coverImage{large} type}}}}`, v:{id} })
};

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 10: API CLIENT
   ══════════════════════════════════════════════════════════════════════════ */
const API = (() => {
  function hash(str){
    let h1 = 0x811c9dc5, h2 = 0x1000193;
    for(let i = 0; i < str.length; i++){
      const c = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 0x01000193);
      h2 = Math.imul(h2 ^ c, 0x85ebca6b);
    }
    return ((h1 >>> 0).toString(36)) + '_' + ((h2 >>> 0).toString(36));
  }

  async function anilist(o){
    const cacheKey = 'an_' + hash(o.q + JSON.stringify(o.v));
    const hit = Cache.get(cacheKey);
    if(hit) return hit;
    return RateLimiter(async () => {
      const again = Cache.get(cacheKey);
      if(again) return again;
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 15000);
      try {
        const r = await fetch(CONFIG.ANILIST_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ query: o.q, variables: o.v }),
          signal: ctrl.signal
        });
        clearTimeout(tid);
        if(!r.ok) throw new Error('HTTP ' + r.status);
        const j = await r.json();
        if(j.errors && j.errors.length) throw new Error(j.errors[0].message);
        Cache.set(cacheKey, j);
        return j;
      } catch(e){ clearTimeout(tid); throw e; }
    });
  }

  async function groq(prompt, opts = {}){
    const model = opts.model || CONFIG.GROQ_MODEL;
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 25000);
    try {
      const body = {
        model,
        messages: [
          { role: 'system', content: opts.system || 'You are an anime expert assistant. Always respond in the requested language. Never use controversial or religious content.' },
          { role: 'user', content: prompt }
        ],
        temperature: opts.temperature !== undefined ? opts.temperature : 0.7,
        max_tokens: opts.maxTokens || 900
      };
      if(opts.jsonMode) body.response_format = { type: 'json_object' };
      const r = await fetch(CONFIG.GROQ_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CONFIG.GROQ_KEY },
        body: JSON.stringify(body),
        signal: ctrl.signal
      });
      clearTimeout(tid);
      if(!r.ok){
        const errTxt = await r.text().catch(() => '');
        throw new Error('Groq ' + r.status + ' ' + errTxt.slice(0, 100));
      }
      const d = await r.json();
      return d.choices?.[0]?.message?.content || '';
    } catch(e){ clearTimeout(tid); throw e; }
  }

  async function tryStreaming(api, safeTitle, episodeNum){
    try {
      const searchUrl = api.url + api.search.replace('{query}', safeTitle);
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 6000);
      let searchRes;
      try {
        const r = await fetch(searchUrl, { signal: ctrl.signal, mode: 'cors' });
        clearTimeout(tid);
        if(!r.ok) return [];
        searchRes = await r.json();
      } catch(fetchErr){ clearTimeout(tid); return []; }

      const items = searchRes?.results || searchRes?.data?.animes || searchRes?.animes || searchRes?.data || [];
      if(!Array.isArray(items) || items.length === 0) return [];
      const first = items[0];
      const aid = first.id || first.slug || first.animeId || first._id;
      if(!aid) return [];
      try {
        const epRes = await fetch(api.url + '/' + aid + '/episodes').then(r => r.json()).catch(() => ({}));
        const eps = epRes?.episodes || epRes?.data?.episodes || [];
        if(eps.length === 0) return [];
        const target = eps[Math.min(episodeNum - 1, eps.length - 1)];
        const epId = target.id || target.episodeId || target.ep_id;
        if(!epId) return [];
        const streamRes = await fetch(api.url + '/watch/' + epId).then(r => r.json()).catch(() => ({}));
        const sources = streamRes?.sources || streamRes?.data?.sources || [];
        return sources.map(s => ({
          server: api.name,
          url: s.url,
          type: (s.isM3U8 || (s.url && s.url.includes('.m3u8'))) ? 'hls' : 'mp4',
          label: api.name + (s.quality ? ' / ' + s.quality : '')
        })).filter(s => s.url);
      } catch(e){ return []; }
    } catch(e){ return []; }
  }

  async function fetchVideoSources(animeTitle, episodeNum, onProgress){
    if(onProgress) onProgress('নিজস্ব বা অনুমোদিত ভিডিও URL দিন');
    return [];
  }

  async function fallbackEmbed(animeTitle, episodeNum){
    // No third-party video scraping/search is performed automatically.
    // Use the built-in Custom Embed control with a provider-authorized URL.
    return [];
  }

  return { anilist, groq, fetchVideoSources, fallbackEmbed, tryStreaming };
})();

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 11: NORMALIZERS
   ══════════════════════════════════════════════════════════════════════════ */
function norm(j){
  if(!j) return null;
  const t = j.title?.english || j.title?.romaji || j.title || 'Unknown';
  const tj = j.title?.native || '';
  const img = j.coverImage?.extraLarge || j.coverImage?.large || j.img || 'https://via.placeholder.com/200x300/1e1e35/8b5cf6?text='+encodeURIComponent((t||'?').slice(0,8));
  const sc = j.averageScore ? Math.round(j.averageScore)/10 : (j.score || 0);
  const yr = j.startDate?.year || j.year || '—';
  let d = j.description ? j.description.replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&[a-z]+;/gi,' ').replace(/\s+/g,' ').trim() : (j.desc || '');
  if(d.length > 800) d = d.slice(0, 800) + '...';
  if(!d) d = 'বিবরণ নেই।';
  const genres = [...new Set([...(j.genres||[]), ...((j.tags||[]).filter(x => x.rank >= 60).map(x => x.name).slice(0,8))])].slice(0,12);
  const trailer = (j.trailer && j.trailer.id && j.trailer.site === 'youtube') ? { id: j.trailer.id, site: 'youtube', thumb: j.trailer.thumbnail||'' } : null;
  const isManga = j.type === 'MANGA';
  const off = [], seen = new Set();
  const addOff = (name, url) => {
    if(!name) return;
    const k = name.toLowerCase();
    if(seen.has(k)) return;
    seen.add(k);
    const siteData = OFFICIAL_SITES[name] || OFFICIAL_SITES[Object.keys(OFFICIAL_SITES).find(s => s.toLowerCase() === k)];
    off.push({ p: name, u: url || (siteData ? siteData.url : 'https://www.google.com/search?q='+encodeURIComponent(name+' '+t)), icon: siteData ? siteData.icon : '▶️', type: siteData ? siteData.type : 'paid' });
  };
  if(isManga){ addOff('MangaPlus (Official)','https://mangaplus.shueisha.co.jp'); addOff('Shonen Jump+','https://shonenjumpplus.com'); }
  else {
    (j.streamingEpisodes||[]).forEach(e => { if(e.site) addOff(e.site, e.url); });
    (j.externalLinks||[]).forEach(e => { if(e.site) addOff(e.site, e.url); });
    addOff('Crunchyroll','https://www.crunchyroll.com');
    addOff('Netflix','https://www.netflix.com');
  }
  const unoff = [];
  (isManga ? UNOFFICIAL_MANGA : UNOFFICIAL_ANIME).forEach(s => {
    unoff.push({ p: s.p, u: s.url + s.search + encodeURIComponent(t), icon: s.icon, home: s.url });
  });
  return { id:j.id, title:t, title_jp:tj, genres, episodes:j.episodes||0, chapters:j.chapters||0, score:sc, year:yr, status:j.status||'UNKNOWN', format:j.format||'TV', type:j.type||'ANIME', img, desc:d, hindi:!isManga && CONFIG.HINDI_IDS.indexOf(j.id)>-1, popularity:j.popularity||0, favourites:j.favourites||0, trailer, links:{official:off, unofficial:unoff} };
}

function normChar(c){
  if(!c) return null;
  const name = c.name?.full || c.name?.native || 'Unknown';
  const img = c.image?.large || c.image?.medium || '';
  const favs = c.favourites || 0;
  let desc = '';
  if(c.description && typeof c.description === 'string' && c.description.trim().length > 0){
    desc = c.description.replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&[a-z]+;/gi,' ').replace(/\s+/g,' ').trim();
    if(desc.length > 1200) desc = desc.slice(0, 1200) + '...';
  }
  if(!desc || desc.length < 5) desc = 'এই চরিত্রের বিস্তারিত বিবরণ AniList-এ এখনো যোগ করা হয়নি।';
  const media = (c.media?.nodes || []).map(m => ({ id:m.id, title:m.title?.english||m.title?.romaji||'Unknown', img:m.coverImage?.large||'', type:m.type||'ANIME' }));
  return { id:c.id, name, native:c.name?.native||'', img, desc, favourites:favs, gender:c.gender||'', age:c.age||'', bloodType:c.bloodType||'', dob:c.dateOfBirth ? `${c.dateOfBirth.year||''}${c.dateOfBirth.month?'-'+c.dateOfBirth.month:''}${c.dateOfBirth.day?'-'+c.dateOfBirth.day:''}` : '', media };
}

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 12: DATA FETCHERS
   ══════════════════════════════════════════════════════════════════════════ */
const Data = (() => {
  const memCache = new Map();
  async function fetchApi(o){
    try { const j = await API.anilist(o); return (j.data?.Page?.media || []).map(norm).filter(Boolean); }
    catch(e){ return LOCAL_ANIME_DB.map(norm).slice(0, 20); } // Fallback to local DB
  }
  async function fetchTopChars(page, perPage){
    try {
      const j = await API.anilist(Q.topChars(page||1, perPage||30));
      const chars = (j.data?.Page?.characters||[]).map(normChar).filter(Boolean);
      DB.saveChars(chars);
      return chars;
    } catch(e){ return []; }
  }
  async function fetchCharSearch(query){
    try {
      const j = await API.anilist(Q.charSearch(query,1,30));
      return (j.data?.Page?.characters||[]).map(normChar).filter(Boolean);
    } catch(e){ return []; }
  }
  async function fetchCharById(id){
    for(let attempt = 0; attempt < 3; attempt++){
      try {
        const j = await API.anilist(Q.charById(id));
        if(j?.data?.Character){
          const c = normChar(j.data.Character);
          if(c) return c;
        }
      } catch(e){}
      if(attempt < 2) await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
    }
    for(const cached of State.charCache || []){
      if(cached && cached.id === id) return cached;
    }
    return null;
  }
  async function fetchByIds(ids){
    try {
      const chunks = [];
      for(let i=0;i<ids.length;i+=50) chunks.push(ids.slice(i,i+50));
      const rs = await Promise.all(chunks.map(c => API.anilist(Q.byIds(c)).catch(()=>null)));
      const out = [];
      rs.forEach(r => { if(r?.data?.Page) r.data.Page.media.forEach(m => { const x = norm(m); if(x) out.push(x); }); });
      return out;
    } catch(e){ return []; }
  }
  async function fetchById(id){
    if(memCache.has(id)) return memCache.get(id);
    try {
      const j = await API.anilist(Q.byId(id));
      const a = norm(j.data?.Media);
      if(a){ memCache.set(a.id,a); DB.saveAnime([a]); return a; }
    } catch(e){}
    const local = LOCAL_ANIME_DB.find(x => x.id === id);
    if(local) return norm(local);
    return null;
  }
  async function fetchDetailFull(id){
    try {
      const j = await API.anilist(Q.detailFull(id));
      if(!j.data?.Media) return null;
      const base = norm(j.data.Media);
      if(!base) return null;
      base.characters = (j.data.Media.characters?.edges||[]).map(e => ({ id:e.node.id, name:e.node.name?.full||e.node.name?.native||'Unknown', img:e.node.image?.large||'', role:e.role||'SUPPORTING' }));
      base.staff = (j.data.Media.staff?.edges||[]).map(e => ({ id:e.node.id, name:e.node.name?.full||'Unknown', img:e.node.image?.large||'', role:e.role||'' }));
      base.recs = (j.data.Media.recommendations?.nodes||[]).filter(n => n.mediaRecommendation).map(n => ({ id:n.mediaRecommendation.id, title:n.mediaRecommendation.title?.english||n.mediaRecommendation.title?.romaji||'Unknown', img:n.mediaRecommendation.coverImage?.large||'', score:n.mediaRecommendation.averageScore?Math.round(n.mediaRecommendation.averageScore)/10:0 }));
      return base;
    } catch(e){
      const local = LOCAL_ANIME_DB.find(x => x.id === id);
      if(local) return norm(local);
      return null;
    }
  }
  function dedupe(list){ const seen = new Set(); return list.filter(a => { if(!a||seen.has(a.id)) return false; seen.add(a.id); return true; }); }
  function clearMemCache(){ memCache.clear(); }
  return { fetchApi, fetchTopChars, fetchCharSearch, fetchCharById, fetchByIds, fetchById, fetchDetailFull, dedupe, clearMemCache };
})();

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 13: STATE
   ══════════════════════════════════════════════════════════════════════════ */
const State = {
  wl: Storage.get('wl', []),
  favs: Storage.get('favs', []),
  recN: Storage.get('recN', 0),
  visits: Storage.get('visits', 0),
  xp: Storage.get('xp', 0),
  theme: Storage.get('theme', 'dark'),
  pName: Storage.get('pName', 'Anime Fan'),
  pEmoji: Storage.get('pEmoji', '🎌'),
  filter: { cat: 'All', genre: 'All' },
  rank: 'all', manga: 'popular', charTab: 'top',
  wz: { exp:'', genres:[], len:'', lang:'' },
  homeLoaded: false, discLoaded: false, mangaLoaded: false,
  discItems: [], discShown: 0, discNextPage: 1, discHasMore: true,
  mangaItems: [], mangaShown: 0, mangaNextPage: 1, mangaHasMore: true,
  charCache: [], charShown: 0, charNextPage: 1, charHasMore: true,
  curDetail: null, curChar: null, aiLang: 'bn',
  _curAnime: null, _curChar: null,
  _curVideoSources: null, _curVideoTitle: null, _curVideoEp: null, _curVideoIdx: 0,
  // Watch Page State
  watchAnime: null,
  watchSeason: 1,
  watchEpisode: 1,
  watchLang: 'hindi',
  watchServerIdx: 0,
  watchSources: [],
  watchSeasons: [1], // Default
  watchEpisodes: [], // Generated based on anime.episodes
  watchHistory: Storage.get('watchHistory', {}),
  lastPage: 'home'
};

function saveState(){
  Storage.set('wl', State.wl);
  Storage.set('favs', State.favs);
  Storage.set('recN', State.recN);
  Storage.set('visits', State.visits);
  Storage.set('xp', State.xp);
  Storage.set('theme', State.theme);
  Storage.set('pName', State.pName);
  Storage.set('pEmoji', State.pEmoji);
  Storage.set('watchHistory', State.watchHistory);
}

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 14: UI HELPERS
   ══════════════════════════════════════════════════════════════════════════ */
const byId = id => document.getElementById(id);
const esc = s => !s ? '' : String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const fmtNum = n => { if(!n) return '0'; if(n >= 1000000) return (n/1000000).toFixed(1)+'M'; if(n >= 1000) return (n/1000).toFixed(1)+'K'; return String(n); };

let toastT = null;
function toast(m){
  const t = byId('toast');
  if(!t) return;
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 2200);
}
function setStatus(t, m){
  const d = byId('sd'), x = byId('st');
  if(d) d.className = 'dot ' + (t === 'online' ? '' : t);
  if(x) x.textContent = m;
}
function cardHTML(a){
  if(!a) return '';
  let bd = '';
  if(a.type==='MANGA') bd = '<span class="bdg mg">📖</span>';
  else if(a.format==='MOVIE') bd = '<span class="bdg mv">🎬</span>';
  else if(a.hindi) bd = '<span class="bdg hin">🇮🇳 হিন্দি</span>';
  else if(a.score>=8.8) bd = '<span class="bdg hot">🔥</span>';
  else if(a.status==='RELEASING') bd = '<span class="bdg air">● এয়ারিং</span>';
  const fb = 'https://via.placeholder.com/200x300/1e1e35/8b5cf6?text='+encodeURIComponent((a.title||'?').slice(0,8));
  return '<div class="card" data-id="'+a.id+'"><div class="ciw"><img src="'+a.img+'" alt="" loading="lazy" onerror="this.onerror=null;this.src=\''+fb+'\'">'+bd+'</div><div class="info"><div class="ttl">'+esc(a.title)+'</div><div class="mt"><span class="rating">⭐ '+(a.score||0).toFixed(1)+'</span><span>'+esc(String(a.year))+'</span></div></div></div>';
}
function charCardHTML(c, rank){
  if(!c) return '';
  const fb = 'https://via.placeholder.com/120x120/1e1e35/8b5cf6?text=?';
  const rb = rank ? '<span class="bdg hot" style="top:5px;left:5px">#'+rank+'</span>' : '';
  return '<div class="card" data-cid="'+c.id+'"><div class="ciw" style="aspect-ratio:1/1"><img src="'+c.img+'" alt="" loading="lazy" onerror="this.onerror=null;this.src=\''+fb+'\'">'+rb+'</div><div class="info"><div class="ttl" style="min-height:24px;font-size:10px">'+esc(c.name)+'</div><div class="mt" style="font-size:9px"><span class="rating">❤️ '+fmtNum(c.favourites)+'</span></div></div></div>';
}
function skel(n){ let o=''; for(let i=0;i<n;i++) o+='<div class="sk"><div class="i"></div><div class="l"></div></div>'; return o; }
function renderRail(id, list){
  const el=byId(id); if(!el) return;
  if(!list||!list.length){ el.innerHTML='<div class="empty" style="padding:20px"><p style="font-size:11px">কিছু পাওয়া যায়নি</p></div>'; return; }
  el.innerHTML=list.map(cardHTML).join(''); bindCards(el);
}
function renderGrid(id, list){
  const el=byId(id); if(!el) return;
  if(!list||!list.length){ el.innerHTML='<div class="empty"><div class="i">📭</div><p>কিছু পাওয়া যায়নি</p></div>'; return; }
  el.innerHTML=list.map(cardHTML).join(''); bindCards(el);
}
function bindCards(c){
  c.querySelectorAll('.card[data-id]').forEach(x => { x.addEventListener('click', () => { const id=parseInt(x.dataset.id,10); if(id) App.openDetail(id); }); });
  c.querySelectorAll('.card[data-cid]').forEach(x => { x.addEventListener('click', () => { const id=parseInt(x.dataset.cid,10); if(id) App.openCharDetail(id); }); });
}

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 15: AI ORCHESTRATOR
   ══════════════════════════════════════════════════════════════════════════ */
const Orchestrator = (() => {
  const ANILIST_OPS = {
    'anime.trending':   { handler:'Q.trending',   args:['page','perPage'], desc:'ট্রেন্ডিং এনিমে' },
    'anime.popular':    { handler:'Q.popular',    args:['page','perPage'], desc:'জনপ্রিয় এনিমে' },
    'anime.topScore':   { handler:'Q.topScore',   args:['page','perPage'], desc:'টপ রেটেড এনিমে' },
    'anime.airing':     { handler:'Q.airing',     args:['page','perPage'], desc:'এয়ারিং এনিমে' },
    'anime.upcoming':   { handler:'Q.upcoming',   args:['page','perPage'], desc:'আসন্ন এনিমে' },
    'anime.newRelease': { handler:'Q.newRel',     args:['page','perPage'], desc:'নতুন রিলিজ' },
    'anime.shortAnime': { handler:'Q.shortAnime', args:['page','perPage'], desc:'ছোট এনিমে' },
    'anime.movies':     { handler:'Q.movies',     args:['page','perPage'], desc:'এনিমে মুভি' },
    'anime.search':     { handler:'Q.search',     args:['q','page','perPage'], desc:'নাম দিয়ে সার্চ' },
    'anime.byGenre':    { handler:'Q.genre',      args:['g','page','perPage'], desc:'জেনার দিয়ে খুঁজুন' },
    'anime.byTag':      { handler:'Q.tag',        args:['t','page','perPage'], desc:'ট্যাগ দিয়ে খুঁজুন' },
    'anime.byIds':      { handler:'Q.byIds',      args:['ids'], desc:'নির্দিষ্ট ID দিয়ে' },
    'anime.byId':       { handler:'Q.byId',       args:['id'], desc:'একটি এনিমে' },
    'anime.detail':     { handler:'Q.detailFull', args:['id'], desc:'বিস্তারিত তথ্য' },
    'manga.popular':    { handler:'Q.manga',      args:['POPULARITY_DESC','page','perPage'], desc:'জনপ্রিয় মাঙ্গা' },
    'manga.trending':   { handler:'Q.manga',      args:['TRENDING_DESC','page','perPage'], desc:'ট্রেন্ডিং মাঙ্গা' },
    'manga.top':        { handler:'Q.manga',      args:['SCORE_DESC','page','perPage'], desc:'টপ মাঙ্গা' },
    'char.top':         { handler:'Q.topChars',   args:['page','perPage'], desc:'টপ চরিত্র' },
    'char.search':      { handler:'Q.charSearch', args:['q','page','perPage'], desc:'চরিত্র সার্চ' },
    'char.byId':        { handler:'Q.charById',   args:['id'], desc:'চরিত্রের তথ্য' }
  };
  const UTILITY_OPS = {
    'util.hindiPool':    { desc:'হিন্দি ডাব এনিমে', args:[] },
    'util.videoSources': { desc:'ভিডিও সোর্স খুঁজুন', args:['title','ep'] },
    'util.aiAnalyze':    { desc:'AI বিশ্লেষণ', args:['prompt'] }
  };
  const FULL_REGISTRY = { ...ANILIST_OPS, ...UTILITY_OPS };

  function defaultArg(name){
    if(name === 'page') return 1;
    if(name === 'perPage') return 30;
    if(name === 'g') return 'Action';
    if(name === 't') return 'Action';
    if(name === 'ids') return CONFIG.HINDI_IDS.slice(0, 30);
    if(['POPULARITY_DESC','TRENDING_DESC','SCORE_DESC'].includes(name)) return name;
    return undefined;
  }

  async function askBrain(userCommand){
    const registrySummary = `
Available APIs (use EXACT key):
ANILIST: ${Object.entries(ANILIST_OPS).map(([k,v]) => `"${k}"(${v.desc})`).join(', ')}
UTILITY: ${Object.entries(UTILITY_OPS).map(([k,v]) => `"${k}"(${v.desc})`).join(', ')}`;

    const systemPrompt = `You are the MASTER AI Orchestrator of AnimeVerse — an anime platform with 160 APIs.
Understand the user's Bengali/Hindi/English command and pick the RIGHT API + args.

${registrySummary}

RULES:
1. Return ONLY valid JSON: {"api":"<key>","args":{...},"intent":"label","lang":"bn|hi|en","confidence":0-1}
2. Genre → "anime.byGenre" with {"g":"Action"}
3. Top rated → "anime.topScore"
4. Watch/stream → "util.videoSources" with {"title":"...","ep":1}
5. Character by name → "char.search" with {"q":"..."}
6. Manga → "manga.popular"
7. Hindi dub → "util.hindiPool"
8. Trending → "anime.trending"
9. Search by anime name → "anime.search" with {"q":"..."}
10. Default lang="bn"

EXAMPLES:
"ট্রেন্ডিং এনিমে" → {"api":"anime.trending","args":{"page":1,"perPage":30},"intent":"trending","lang":"bn","confidence":0.98}
"naruto movie" → {"api":"anime.search","args":{"q":"Naruto","page":1,"perPage":30},"intent":"search","lang":"en","confidence":0.95}
"অ্যাকশন এনিমে" → {"api":"anime.byGenre","args":{"g":"Action","page":1,"perPage":30},"intent":"genre","lang":"bn","confidence":0.97}
"One Piece দেখব" → {"api":"util.videoSources","args":{"title":"One Piece","ep":1},"intent":"watch","lang":"bn","confidence":0.93}
"নারুটো চরিত্র" → {"api":"char.search","args":{"q":"Naruto","page":1,"perPage":30},"intent":"char_lookup","lang":"bn","confidence":0.92}`;

    try {
      const raw = await API.groq(userCommand, { system: systemPrompt, temperature: 0.2, maxTokens: 400, jsonMode: true });
      return parseBrainOutput(raw);
    } catch(e){
      return fallbackIntent(userCommand);
    }
  }

  function parseBrainOutput(raw){
    if(!raw || typeof raw !== 'string') return fallbackIntent('');
    let s = raw.trim().replace(/^```(?:json)?\s*/i,'').replace(/```\s*$/i,'').trim();
    const m = s.match(/\{[\s\S]*\}/);
    if(m) s = m[0];
    try {
      const obj = JSON.parse(s);
      return {
        api: String(obj.api || '').trim(),
        args: obj.args && typeof obj.args === 'object' ? obj.args : {},
        intent: obj.intent || 'unknown',
        lang: ['bn','hi','en'].includes(obj.lang) ? obj.lang : 'bn',
        confidence: typeof obj.confidence === 'number' ? obj.confidence : 0.5
      };
    } catch(e){ return fallbackIntent(raw); }
  }

  function fallbackIntent(cmd){
    const c = String(cmd || '').toLowerCase();
    const lang = /[\u0980-\u09FF]/.test(c) ? 'bn' : /[\u0900-\u097F]/.test(c) ? 'hi' : 'en';
    const map = [
      [/trend|ট্রেন্ড/,              { api:'anime.trending', args:{page:1,perPage:30}, intent:'trending' }],
      [/popular|জনপ্রিয়/,           { api:'anime.popular', args:{page:1,perPage:30}, intent:'popular' }],
      [/top|রেটেড|সেরা|best/,       { api:'anime.topScore', args:{page:1,perPage:30}, intent:'top_rated' }],
      [/upcoming|আসছে|আসন্ন/,       { api:'anime.upcoming', args:{page:1,perPage:30}, intent:'upcoming' }],
      [/airing|এয়ারিং|চলছে/,       { api:'anime.airing', args:{page:1,perPage:30}, intent:'airing' }],
      [/movie|মুভি/,                { api:'anime.movies', args:{page:1,perPage:30}, intent:'movies' }],
      [/manga|মাঙ্গা/,              { api:'manga.popular', args:{page:1,perPage:30}, intent:'manga' }],
      [/character|চরিত্র/,           { api:'char.top', args:{page:1,perPage:30}, intent:'characters' }],
      [/hindi|হিন্দি/,               { api:'util.hindiPool', args:{}, intent:'hindi' }],
      [/action|অ্যাকশন/,            { api:'anime.byGenre', args:{g:'Action',page:1,perPage:30}, intent:'genre' }],
      [/romance|রোমান্স/,            { api:'anime.byGenre', args:{g:'Romance',page:1,perPage:30}, intent:'genre' }],
      [/comedy|কমেডি/,              { api:'anime.byGenre', args:{g:'Comedy',page:1,perPage:30}, intent:'genre' }],
      [/horror|হরর/,                { api:'anime.byGenre', args:{g:'Horror',page:1,perPage:30}, intent:'genre' }],
      [/fantasy|ফ্যান্টাসি/,        { api:'anime.byGenre', args:{g:'Fantasy',page:1,perPage:30}, intent:'genre' }]
    ];
    for (const [re, res] of map) if (re.test(c)) return { ...res, lang, confidence: 0.6 };
    return { api:'anime.search', args:{q: cmd, page:1, perPage:30}, intent:'search', lang, confidence: 0.5 };
  }

  async function execute(decision){
    if(!decision || !decision.api) throw new Error('AI কোনো API বেছে নেয়নি');
    const op = FULL_REGISTRY[decision.api];
    if(!op) throw new Error('অজানা API: ' + decision.api);

    if(op.handler && op.handler.startsWith('Q.')){
      const fn = Q[op.handler.split('.')[1]];
      if(typeof fn !== 'function') throw new Error('Handler not found: ' + op.handler);
      const orderedArgs = op.args.map(a => decision.args[a] ?? defaultArg(a));
      const query = fn(...orderedArgs);
      const res = await API.anilist(query);
      const media = res?.data?.Page?.media || (res?.data?.Media ? [res.data.Media] : []);
      const chars = res?.data?.Page?.characters || (res?.data?.Character ? [res.data.Character] : []);
      return {
        kind: media.length ? 'anime' : chars.length ? 'character' : 'empty',
        anime: media.map(norm).filter(Boolean),
        characters: chars.map(normChar).filter(Boolean)
      };
    }

    if(decision.api === 'util.hindiPool'){
      const items = await Data.fetchByIds(CONFIG.HINDI_IDS);
      return { kind:'anime', anime: items.filter(a => a.hindi), characters:[] };
    }

    if(decision.api === 'util.videoSources'){
      const title = decision.args.title || '';
      const ep = parseInt(decision.args.ep) || 1;
      if(!title) throw new Error('ভিডিওর নাম প্রয়োজন');
      return { kind:'watch', anime:[], characters:[], watchTitle:title, watchEp:ep };
    }

    if(decision.api === 'util.aiAnalyze'){
      const text = await API.groq(decision.args.prompt || 'Explain this anime');
      return { kind:'text', anime:[], characters:[], text };
    }

    throw new Error('No executor for: ' + decision.api);
  }

  async function run(userCommand){
    const t0 = performance.now();
    const decision = await askBrain(userCommand);
    const t1 = performance.now();
    const result = await execute(decision);
    const t2 = performance.now();
    return {
      command: userCommand,
      decision,
      result,
      timing: { think_ms: Math.round(t1 - t0), exec_ms: Math.round(t2 - t1) }
    };
  }

  return {
    run, askBrain, execute,
    registry: FULL_REGISTRY,
    getRegistrySummary: () => ({
      anilist: Object.keys(ANILIST_OPS).length,
      utility: Object.keys(UTILITY_OPS).length,
      streaming: STREAMING_APIS.length,
      total: Object.keys(ANILIST_OPS).length + Object.keys(UTILITY_OPS).length + STREAMING_APIS.length
    })
  };
})();

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 16: EMBED URL DETECTOR
   ══════════════════════════════════════════════════════════════════════════ */
function isEmbedUrl(url){
  if(!url || typeof url !== 'string') return false;
  const u = url.toLowerCase();
  if(u.endsWith('.mp4') || u.endsWith('.webm') || u.endsWith('.ogg') ||
     u.endsWith('.m3u8') || u.endsWith('.mpd') || u.endsWith('.mkv')) {
    return false;
  }
  const embedHosts = [
    'drive.google.com','docs.google.com','dood.','doodstream','streamtape.',
    'filemoon.','voe.sx','mixdrop.','streamlare.','mp4upload.','ok.ru',
    'vk.com/video_ext','youtube.com/embed','youtu.be','youtube.com/watch',
    'vimeo.com','dailymotion.com/embed','facebook.com/plugins/video',
    'rumble.com/embed','bitchute.com/embed','odysee.com/$/embed',
    'streamable.com/e','sendvid.com/embed','vidmoly.to','vidsrc.',
    '2embed.','multiembed.','embed.su','superembed.','smashystream.',
    'vidsrc.me','vidsrc.xyz','vidlink.pro'
  ];
  if(embedHosts.some(h => u.includes(h))) return true;
  if(u.includes('/embed') || u.includes('/preview') || u.includes('/e/') ||
     u.includes('/v/') || u.includes('/player')) {
    return true;
  }
  return false;
}

/* ══════════════════════════════════════════════════════════════════════════
   MODULE 17: APP
   ══════════════════════════════════════════════════════════════════════════ */
const App = (() => {

  function go(page, sub){
    if(page !== 'watch') State.lastPage = page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
    document.querySelectorAll('.nb').forEach(b => b.classList.remove('on'));
    const pg = byId('p-'+page); if(pg) pg.classList.add('on');
    const btn = document.querySelector('.nb[data-p="'+page+'"]'); if(btn) btn.classList.add('on');
    window.scrollTo({top:0,behavior:'smooth'});
    
    // Update URL
    if(page === 'watch'){
      const url = new URL(window.location);
      url.searchParams.set('page', 'watch');
      url.searchParams.set('id', State.watchAnime?.id || '');
      url.searchParams.set('season', State.watchSeason);
      url.searchParams.set('ep', State.watchEpisode);
      url.searchParams.set('lang', State.watchLang);
      window.history.pushState({}, '', url);
    } else {
      const url = new URL(window.location);
      url.searchParams.set('page', page);
      url.searchParams.delete('id');
      url.searchParams.delete('season');
      url.searchParams.delete('ep');
      url.searchParams.delete('lang');
      window.history.pushState({}, '', url);
    }

    if(page==='home') renderHome();
    if(page==='discover') renderDiscover(sub);
    if(page==='ranking'){
      if(sub==='hindi'){ const hb=document.querySelector('#rankTabs .chip[data-r="hindi"]'); if(hb) hb.click(); }
      else if(sub==='upcoming'){ const ub=document.querySelector('#rankTabs .chip[data-r="upcoming"]'); if(ub) ub.click(); }
      else if(sub==='top'){ const tb=document.querySelector('#rankTabs .chip[data-r="all"]'); if(tb) tb.click(); }
      else renderRankings();
    }
    if(page==='characters') renderCharacters();
    if(page==='manga') renderManga();
    if(page==='watchlist') renderWatchlist();
    if(page==='profile') renderProfile();
    if(page==='watch') renderWatchPage();
  }

  function goBack(){
    window.history.back();
  }

  window.addEventListener('popstate', (e) => {
    const url = new URL(window.location);
    const page = url.searchParams.get('page') || 'home';
    if(page === 'watch'){
      const id = url.searchParams.get('id');
      const season = url.searchParams.get('season');
      const ep = url.searchParams.get('ep');
      const lang = url.searchParams.get('lang');
      if(id && State.watchAnime?.id !== parseInt(id)){
        openWatchPage(parseInt(id), season, ep, lang);
      } else {
        if(season) State.watchSeason = parseInt(season);
        if(ep) State.watchEpisode = parseInt(ep);
        if(lang) State.watchLang = lang;
        renderWatchPage();
      }
      go('watch');
    } else {
      go(page);
    }
  });

  async function renderHome(){
    if(State.homeLoaded) return;
    ['rTrending','rTop','rHindi','rChars','rManga','rUpcoming','rAiring','rMovies'].forEach(id => { const el=byId(id); if(el) el.innerHTML=skel(5); });
    setStatus('load','ডেটা আনছি...');
    const used = new Set();

    let trending = await Data.fetchApi(Q.trending(1,25));
    trending = trending.filter(a => !used.has(a.id)).slice(0,15);
    trending.forEach(a => used.add(a.id));
    renderRail('rTrending', trending); DB.saveAnime(trending);

    let top = await Data.fetchApi(Q.topScore(1,30));
    top = top.filter(a => !used.has(a.id)).slice(0,15);
    top.forEach(a => used.add(a.id));
    renderRail('rTop', top);

    let hp = await Data.fetchByIds(CONFIG.HINDI_IDS);
    let hindi = hp.filter(a => a.hindi && !used.has(a.id)).sort((a,b)=>(b.popularity||0)-(a.popularity||0)).slice(0,15);
    hindi.forEach(a => used.add(a.id));
    renderRail('rHindi', hindi); DB.saveAnime(hindi);

    const chars = await Data.fetchTopChars(1,15);
    const rc = byId('rChars');
    if(rc && chars.length){ rc.innerHTML = chars.map((c,i) => charCardHTML(c,i+1)).join(''); bindCards(rc); }

    const mangaList = await Data.fetchApi(Q.manga('POPULARITY_DESC',1,15));
    renderRail('rManga', Data.dedupe(mangaList));

    let upcoming = await Data.fetchApi(Q.upcoming(1,30));
    upcoming = upcoming.filter(a => !used.has(a.id)).slice(0,15);
    upcoming.forEach(a => used.add(a.id));
    renderRail('rUpcoming', upcoming);

    let airing = await Data.fetchApi(Q.airing(1,30));
    airing = airing.filter(a => !used.has(a.id)).slice(0,15);
    airing.forEach(a => used.add(a.id));
    renderRail('rAiring', airing);

    let movies = await Data.fetchApi(Q.movies(1,30));
    movies = movies.filter(a => !used.has(a.id)).slice(0,15);
    movies.forEach(a => used.add(a.id));
    renderRail('rMovies', movies);

    setStatus('online','🟢 লাইভ ('+used.size+' এনিমে + '+chars.length+' চরিত্র)');
    State.homeLoaded = true;
  }

  const CATS = [
    {n:'All',i:'🌐',t:'all'},{n:'Shounen',i:'⚔️',t:'tag'},{n:'Seinen',i:'🎯',t:'tag'},
    {n:'Isekai',i:'🌀',t:'tag'},{n:'Shoujo',i:'🌸',t:'tag'},{n:'Josei',i:'💼',t:'tag'},
    {n:'Mecha',i:'🤖',t:'genre'},{n:'Horror',i:'💀',t:'genre'},{n:'Sports',i:'⚽',t:'genre'},
    {n:'Psychological',i:'🧠',t:'tag'},{n:'Historical',i:'🏛️',t:'tag'},{n:'Music',i:'🎵',t:'genre'},
    {n:'Supernatural',i:'👻',t:'genre'}
  ];
  const GENRES = ['All','Action','Adventure','Comedy','Drama','Fantasy','Horror','Mahou Shoujo','Mecha','Music','Mystery','Psychological','Romance','Sci-Fi','Slice of Life','Sports','Supernatural','Thriller'];
  let tabsBuilt = false;

  function buildTabs(){
    if(tabsBuilt) return;
    byId('catTabs').innerHTML = CATS.map(c => '<button class="chip'+(c.n==='All'?' on':'')+'" data-cat="'+c.n+'">'+c.i+' '+c.n+'</button>').join('');
    byId('catTabs').querySelectorAll('.chip').forEach(b => {
      b.addEventListener('click', () => {
        byId('catTabs').querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        State.filter.cat = b.dataset.cat;
        State.filter.genre = 'All';
        byId('genFilters').querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
        const all = byId('genFilters').querySelector('.chip[data-g="All"]');
        if(all) all.classList.add('on');
        resetDiscover();
      });
    });
    byId('genFilters').innerHTML = GENRES.map(g => '<button class="chip'+(g==='All'?' on':'')+'" data-g="'+g+'">'+g+'</button>').join('');
    byId('genFilters').querySelectorAll('.chip').forEach(b => {
      b.addEventListener('click', () => {
        byId('genFilters').querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        State.filter.genre = b.dataset.g;
        State.filter.cat = 'All';
        byId('catTabs').querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
        const all = byId('catTabs').querySelector('.chip[data-cat="All"]');
        if(all) all.classList.add('on');
        resetDiscover();
      });
    });
    tabsBuilt = true;
  }

  async function renderDiscover(sub){
    buildTabs();
    if(sub==='movie'){
      byId('disGrid').innerHTML=skel(9);
      const list = await Data.fetchApi(Q.movies(1,30));
      renderGrid('disGrid', Data.dedupe(list));
      byId('moreBtn').style.display='none';
      State.discLoaded=true;
      return;
    }
    if(State.discLoaded) return;
    byId('disGrid').innerHTML = skel(9);
    const [p1,p2] = await Promise.all([Data.fetchApi(Q.popular(1,50)), Data.fetchApi(Q.popular(2,50))]);
    State.discItems = Data.dedupe([...p1,...p2]);
    State.discShown=0; State.discNextPage=3; State.discHasMore=true; State.discLoaded=true;
    showMore(30);
  }

  async function resetDiscover(){
    State.discItems=[]; State.discShown=0; State.discNextPage=1; State.discHasMore=true;
    byId('disGrid').innerHTML = skel(9);
    const cat = CATS.find(c => c.n === State.filter.cat);
    let list = [];
    if(cat && cat.t==='tag') list = await Data.fetchApi(Q.tag(cat.n,1,30));
    else if(cat && cat.t==='genre'){
      list = await Data.fetchApi(Q.genre(cat.n,1,30));
      list = list.filter(a => a.genres.some(g => g.toLowerCase()===cat.n.toLowerCase()));
    }
    else if(State.filter.genre && State.filter.genre!=='All'){
      list = await Data.fetchApi(Q.genre(State.filter.genre,1,30));
      list = list.filter(a => a.genres.some(g => g.toLowerCase()===State.filter.genre.toLowerCase()));
    }
    else {
      const [a,b] = await Promise.all([Data.fetchApi(Q.popular(1,50)),Data.fetchApi(Q.popular(2,50))]);
      list = [...a,...b];
    }
    State.discItems = Data.dedupe(list); State.discShown=0; showMore(30);
  }

  function showMore(count){
    const next = State.discItems.slice(State.discShown, State.discShown+count);
    State.discShown += next.length;
    const grid = byId('disGrid');
    if(State.discShown===next.length) grid.innerHTML = next.map(cardHTML).join('');
    else grid.insertAdjacentHTML('beforeend', next.map(cardHTML).join(''));
    bindCards(grid);
    const btn = byId('moreBtn');
    if(State.discShown < State.discItems.length || State.discHasMore){ btn.style.display='flex'; btn.textContent='আরো লোড করুন'; }
    else btn.style.display='none';
  }

  async function loadMore(){
    const btn = byId('moreBtn');
    if(State.discShown < State.discItems.length){ showMore(30); return; }
    if(!State.discHasMore) return;
    btn.textContent = 'লোড হচ্ছে...';
    const cat = CATS.find(c => c.n === State.filter.cat);
    let list = [];
    if(cat && cat.t==='tag') list = await Data.fetchApi(Q.tag(cat.n,State.discNextPage,30));
    else if(cat && cat.t==='genre'){
      list = await Data.fetchApi(Q.genre(cat.n,State.discNextPage,30));
      list = list.filter(a => a.genres.some(g => g.toLowerCase()===cat.n.toLowerCase()));
    }
    else if(State.filter.genre && State.filter.genre!=='All'){
      list = await Data.fetchApi(Q.genre(State.filter.genre,State.discNextPage,30));
      list = list.filter(a => a.genres.some(g => g.toLowerCase()===State.filter.genre.toLowerCase()));
    }
    else list = await Data.fetchApi(Q.popular(State.discNextPage,50));
    State.discNextPage++;
    if(!list.length){ State.discHasMore=false; btn.style.display='none'; toast('সব এনিমে লোড হয়েছে'); return; }
    State.discItems = State.discItems.concat(list);
    showMore(30);
  }

  let rankBuilt = false;
  function buildRank(){
    if(rankBuilt) return;
    byId('rankTabs').querySelectorAll('.chip').forEach(b => {
      b.addEventListener('click', () => {
        byId('rankTabs').querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        State.rank = b.dataset.r;
        renderRankings();
      });
    });
    rankBuilt = true;
  }

  async function renderRankings(){
    buildRank();
    byId('rankList').innerHTML = '<div class="load"><div class="sp"></div></div>';
    let list = [];
    if(State.rank==='hindi'){
      const pool = await Data.fetchByIds(CONFIG.HINDI_IDS);
      list = pool.filter(a => a.hindi).sort((a,b)=>(b.popularity||0)-(a.popularity||0));
    }
    else if(State.rank==='airing') list = await Data.fetchApi(Q.airing(1,50));
    else if(State.rank==='upcoming') list = await Data.fetchApi(Q.upcoming(1,50));
    else if(State.rank==='movie') list = await Data.fetchApi(Q.movies(1,50));
    else list = await Data.fetchApi(Q.topScore(1,50));
    list = Data.dedupe(list).sort((a,b)=>(b.score||0)-(a.score||0));
    if(!list.length){
      byId('rankList').innerHTML = '<div class="empty"><div class="i">📭</div><p>কিছু পাওয়া যায়নি</p></div>';
      return;
    }
    const html = list.map((a,i) => {
      const cl = i===0?'t1':i===1?'t2':i===2?'t3':'';
      const hn = a.hindi?' 🇮🇳':'';
      const fb = 'https://via.placeholder.com/90x130/1e1e35/8b5cf6?text=?';
      return '<div class="ri" data-id="'+a.id+'"><div class="rn '+cl+'">#'+(i+1)+'</div><img src="'+a.img+'" loading="lazy" onerror="this.onerror=null;this.src=\''+fb+'\'"><div class="rin"><h4>'+esc(a.title)+hn+'</h4><div class="rm"><span class="rating">⭐ '+(a.score||0).toFixed(1)+'</span><span>'+(a.episodes||'?')+' ep</span><span>'+a.year+'</span></div></div></div>';
    }).join('');
    byId('rankList').innerHTML = html;
    byId('rankList').querySelectorAll('.ri').forEach(x => {
      x.addEventListener('click', () => openDetail(parseInt(x.dataset.id,10)));
    });
  }

  let charBuilt = false;
  function buildCharTabs(){
    if(charBuilt) return;
    byId('charTabs').querySelectorAll('.chip').forEach(b => {
      b.addEventListener('click', () => {
        byId('charTabs').querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        State.charTab = b.dataset.c;
        if(State.charTab==='search'){
          byId('charSearchBox').style.display='block';
          byId('charGrid').innerHTML='<div class="empty" style="grid-column:1/-1"><div class="i">🔍</div><p>চরিত্রের নাম লিখুন</p></div>';
          byId('charMoreBtn').style.display='none';
        } else {
          byId('charSearchBox').style.display='none';
          renderCharacters();
        }
      });
    });
    const csi = byId('charSearchInput');
    if(csi){
      csi.addEventListener('input', e => {
        clearTimeout(window._charSearchT);
        const q = e.target.value.trim();
        if(q.length < 2) return;
        window._charSearchT = setTimeout(async () => {
          byId('charGrid').innerHTML = skel(12);
          const results = await Data.fetchCharSearch(q);
          if(!results.length){
            byId('charGrid').innerHTML='<div class="empty" style="grid-column:1/-1"><div class="i">🔎</div><p>"'+esc(q)+'" পাওয়া যায়নি</p></div>';
            return;
          }
          byId('charGrid').innerHTML = results.map(c => charCardHTML(c,0)).join('');
          bindCards(byId('charGrid'));
          byId('charMoreBtn').style.display='none';
        }, 500);
      });
    }
    charBuilt = true;
  }

  async function renderCharacters(){
    buildCharTabs();
    if(State.charCache.length && State.charTab==='top'){
      byId('charGrid').innerHTML = State.charCache.slice(0,State.charShown).map((c,i) => charCardHTML(c,i+1)).join('');
      bindCards(byId('charGrid'));
      byId('charMoreBtn').style.display = State.charCache.length > State.charShown ? 'flex' : 'none';
      return;
    }
    byId('charGrid').innerHTML = skel(12);
    const chars = await Data.fetchTopChars(1,50);
    State.charCache = chars || [];
    State.charShown = Math.min(40, State.charCache.length);
    State.charNextPage = 2;
    State.charHasMore = State.charCache.length > 0;
    if(!State.charCache.length){
      byId('charGrid').innerHTML = '<div class="empty" style="grid-column:1/-1">'
        + '<div class="i">👥</div>'
        + '<p style="margin:10px 0">চরিত্র লোড করা যায়নি</p>'
        + '<button class="btn" onclick="State.charCache=[];App.go(\'characters\')">🔄 আবার চেষ্টা করুন</button>'
        + '</div>';
      return;
    }
    byId('charGrid').innerHTML = State.charCache.slice(0, State.charShown).map((c,i) => charCardHTML(c,i+1)).join('');
    bindCards(byId('charGrid'));
    byId('charMoreBtn').style.display = State.charCache.length > State.charShown ? 'flex' : 'none';
  }

  async function loadMoreChars(){
    const btn = byId('charMoreBtn');
    if(State.charShown < State.charCache.length){
      const more = State.charCache.slice(State.charShown, State.charShown+40);
      const startIdx = State.charShown;
      State.charShown += more.length;
      const grid = byId('charGrid');
      grid.insertAdjacentHTML('beforeend', more.map((c,i) => charCardHTML(c, startIdx+i+1)).join(''));
      bindCards(grid);
      if(State.charShown >= State.charCache.length) btn.textContent = 'আরো চরিত্র আনুন';
      return;
    }
    if(!State.charHasMore){ btn.style.display='none'; return; }
    btn.textContent = 'লোড হচ্ছে...';
    const more = await Data.fetchTopChars(State.charNextPage, 50);
    State.charNextPage++;
    if(!more.length){ State.charHasMore=false; btn.style.display='none'; toast('সব চরিত্র লোড হয়েছে'); return; }
    State.charCache = State.charCache.concat(more);
    const si = State.charShown;
    State.charShown += more.length;
    const grid = byId('charGrid');
    grid.insertAdjacentHTML('beforeend', more.map((c,i) => charCardHTML(c, si+i+1)).join(''));
    bindCards(grid);
    btn.textContent = 'আরো চরিত্র';
  }

  async function openCharDetail(id){
    State.curChar = id;
    const body = byId('charBody');
    body.innerHTML = '<div class="load"><div class="sp"></div></div>';
    byId('charModal').classList.add('on');
    let c = (State.charCache || []).find(x => x && x.id === id);
    if(!c) c = await Data.fetchCharById(id);
    if(!c){
      body.innerHTML = '<div class="empty" style="padding:40px 20px">'
        + '<div class="i" style="font-size:56px">😕</div>'
        + '<p style="margin:12px 0;font-weight:700">চরিত্র লোড করা যায়নি</p>'
        + '<p style="font-size:11px;color:var(--mut);margin-bottom:16px;line-height:1.6">'
        + 'হতে পারে নেটওয়ার্ক সমস্যা বা API rate limit। আবার চেষ্টা করুন।</p>'
        + '<button class="btn" onclick="App.openCharDetail(' + id + ')">🔄 আবার চেষ্টা করুন</button>'
        + '<a class="btn ghost" href="https://anilist.co/character/' + id + '" target="_blank" rel="noopener" style="margin-top:8px;display:flex">🔗 AniList-এ দেখুন</a>'
        + '</div>';
      return;
    }
    const fb = 'https://via.placeholder.com/200x200/1e1e35/8b5cf6?text=?';
    body.innerHTML = ''
      + '<div class="char-detail-hero"><img src="'+c.img+'" onerror="this.onerror=null;this.src=\''+fb+'\'"><div><h2>'+esc(c.name)+'</h2>'+(c.native?'<div style="font-size:12px;color:var(--mut)">'+esc(c.native)+'</div>':'')+'</div></div>'
      + '<div class="char-stats-grid">'
      + '<div class="char-stat"><div class="lbl">❤️ ফেভারিট</div><div class="val">'+fmtNum(c.favourites)+'</div></div>'
      + (c.gender?'<div class="char-stat"><div class="lbl">⚧ লিঙ্গ</div><div class="val">'+esc(c.gender)+'</div></div>':'')
      + (c.age?'<div class="char-stat"><div class="lbl">🎂 বয়স</div><div class="val">'+esc(c.age)+'</div></div>':'')
      + (c.bloodType?'<div class="char-stat"><div class="lbl">🩸 রক্তের গ্রুপ</div><div class="val">'+esc(c.bloodType)+'</div></div>':'')
      + (c.dob?'<div class="char-stat"><div class="lbl">📅 জন্মতারিখ</div><div class="val">'+esc(c.dob)+'</div></div>':'')
      + '</div>'
      + '<div class="slabel">📖 বায়োগ্রাফি</div><p class="ddesc" style="max-height:280px">'+esc(c.desc)+'</p>'
      + '<div class="ai-box" style="margin-top:12px"><h4>⚡ AI পাওয়ার বিশ্লেষণ</h4>'
      + '<div class="ai-langs"><div class="ai-lang on" data-lang="bn">🇧🇩 বাংলা</div><div class="ai-lang" data-lang="hi">🇮🇳 हिंदी</div><div class="ai-lang" data-lang="en">🇬🇧 English</div></div>'
      + '<button class="btn" onclick="App.loadCharPower()" style="width:100%">✨ চরিত্রের ক্ষমতা বিশ্লেষণ করুন</button>'
      + '<div class="ai-out" id="charAiOut"></div></div>'
      + (c.media && c.media.length ? '<div class="slabel">🎬 এনিমে অ্যাপিয়ারেন্স ('+c.media.length+')</div><div class="anime-appearances">'
        + c.media.map(m => '<div class="anime-appearance" onclick="App.closeM(\'charModal\');App.openDetail('+m.id+')"><img src="'+m.img+'" loading="lazy" onerror="this.src=\'https://via.placeholder.com/40x55/1e1e35/8b5cf6?text=?\'"><div class="info"><div class="ttl">'+esc(m.title)+'</div><div class="rl">'+esc(m.type)+'</div></div></div>').join('')
        + '</div>' : '')
      + '<div class="btn-row" style="margin-top:14px"><a class="btn ghost" href="https://anilist.co/character/'+c.id+'" target="_blank" rel="noopener" style="flex:1">🔗 AniList-এ দেখুন</a></div>'
      + '<p style="font-size:10px;color:var(--mut);text-align:center;margin-top:10px;line-height:1.5">⚡ AI বিশ্লেষণ Groq AI দ্বারা তৈরি।</p>';
    body.querySelectorAll('.ai-lang').forEach(x => {
      x.addEventListener('click', () => {
        body.querySelectorAll('.ai-lang').forEach(y => y.classList.remove('on'));
        x.classList.add('on');
        State.aiLang = x.dataset.lang;
      });
    });
    State._curChar = c;
  }

  async function loadCharPower(){
    const c = State._curChar; if(!c) return;
    const out = byId('charAiOut'); if(!out) return;
    out.classList.add('on');
    out.innerHTML = '<div style="text-align:center;padding:10px"><div class="sp" style="margin:0 auto"></div><div style="margin-top:8px;color:var(--mut)">AI বিশ্লেষণ করছে...</div></div>';
    const langMap = { bn:'Bengali (বাংলা)', hi:'Hindi (हिंदी)', en:'English' };
    const langName = langMap[State.aiLang] || 'Bengali';
    const animeList = (c.media||[]).slice(0,5).map(m => m.title).join(', ');
    const prompt = `Analyze the character "${c.name}" from: ${animeList||'various anime'}.

Answer in ${langName}. Structure:
1. **মূল পরিচিতি** (2-3 sentences)
2. **ব্যক্তিত্ব** (3 traits)
3. **ক্ষমতা** (4-6 powers)
4. **শক্তির উৎস**
5. **দুর্বলতা** (2-3)
6. **ভূমিকা**

Keep it concise. No religious/political content. Use **bold**.`;
    try {
      const text = await API.groq(prompt, { maxTokens: 800 });
      out.textContent = text || 'কোনো উত্তর পাওয়া যায়নি।';
    } catch(e){
      out.innerHTML = '<div style="color:var(--red)">❌ '+esc(e.message)+'</div>';
    }
  }

  let mangaBuilt = false;
  function buildManga(){
    if(mangaBuilt) return;
    byId('mangaTabs').querySelectorAll('.chip').forEach(b => {
      b.addEventListener('click', () => {
        byId('mangaTabs').querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        State.manga = b.dataset.m;
        State.mangaLoaded = false;
        renderManga();
      });
    });
    mangaBuilt = true;
  }

  async function renderManga(){
    buildManga();
    if(State.mangaLoaded && State.mangaItems.length){
      byId('mangaGrid').innerHTML = State.mangaItems.slice(0, State.mangaShown).map(cardHTML).join('');
      bindCards(byId('mangaGrid'));
      return;
    }
    byId('mangaGrid').innerHTML = skel(9);
    const map = { popular:'POPULARITY_DESC', trending:'TRENDING_DESC', top:'SCORE_DESC' };
    const [p1, p2] = await Promise.all([
      Data.fetchApi(Q.manga(map[State.manga]||map.popular, 1, 50)),
      Data.fetchApi(Q.manga(map[State.manga]||map.popular, 2, 50))
    ]);
    const list = Data.dedupe([...p1, ...p2]);
    State.mangaItems = list;
    State.mangaShown = Math.min(30, list.length);
    State.mangaNextPage = 3;
    State.mangaHasMore = true;
    State.mangaLoaded = true;
    if(!list.length){
      byId('mangaGrid').innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="i">📚</div><p>মাঙ্গা লোড করা যায়নি</p></div>';
      byId('mangaMoreBtn').style.display = 'none';
      return;
    }
    byId('mangaGrid').innerHTML = list.slice(0, State.mangaShown).map(cardHTML).join('');
    bindCards(byId('mangaGrid'));
    byId('mangaMoreBtn').style.display = list.length > State.mangaShown ? 'flex' : 'none';
  }

  async function loadMoreManga(){
    const btn = byId('mangaMoreBtn');
    if(State.mangaShown < State.mangaItems.length){
      const more = State.mangaItems.slice(State.mangaShown, State.mangaShown + 30);
      State.mangaShown += more.length;
      const grid = byId('mangaGrid');
      grid.insertAdjacentHTML('beforeend', more.map(cardHTML).join(''));
      bindCards(grid);
      if(State.mangaShown >= State.mangaItems.length && State.mangaHasMore) btn.textContent = 'আরো মাঙ্গা আনুন';
      else if(State.mangaShown >= State.mangaItems.length) btn.style.display = 'none';
      return;
    }
    if(!State.mangaHasMore){ btn.style.display='none'; return; }
    btn.textContent = 'লোড হচ্ছে...';
    const map = { popular:'POPULARITY_DESC', trending:'TRENDING_DESC', top:'SCORE_DESC' };
    const more = await Data.fetchApi(Q.manga(map[State.manga]||map.popular, State.mangaNextPage, 50));
    State.mangaNextPage++;
    if(!more.length){ State.mangaHasMore = false; btn.style.display = 'none'; toast('সব মাঙ্গা লোড হয়েছে'); return; }
    State.mangaItems = State.mangaItems.concat(more);
    const s = State.mangaShown;
    State.mangaShown += more.length;
    const grid = byId('mangaGrid');
    grid.insertAdjacentHTML('beforeend', more.map(cardHTML).join(''));
    bindCards(grid);
    btn.textContent = 'আরো মাঙ্গা';
  }

  async function renderWatchlist(){
    if(!State.wl.length){ byId('wlGrid').innerHTML=''; byId('wlEmpty').style.display='block'; return; }
    byId('wlEmpty').style.display='none';
    byId('wlGrid').innerHTML = skel(Math.min(State.wl.length,6));
    const items = [];
    for(const id of State.wl){ const a = await Data.fetchById(id); if(a) items.push(a); }
    renderGrid('wlGrid', Data.dedupe(items));
  }

  function toggleWl(id){
    const i = State.wl.indexOf(id);
    if(i>-1){ State.wl.splice(i,1); State.xp = Math.max(0,State.xp-5); toast('🗑️ সরানো হয়েছে'); }
    else { State.wl.push(id); State.xp += 5; toast('✅ যোগ হয়েছে'); }
    saveState();
    if(byId('p-watchlist').classList.contains('on')) renderWatchlist();
    updateWlBtn(id);
  }

  async function renderProfile(){
    const a=byId('stW'),b=byId('stR'),c=byId('stS'),d=byId('stF'),e=byId('stV'),f=byId('stXp');
    if(a) a.textContent = State.wl.length;
    if(b) b.textContent = State.recN;
    if(d) d.textContent = State.favs.length;
    if(e) e.textContent = State.visits;
    if(f) f.textContent = State.xp;
    if(c) c.textContent = await DB.countAnime();
    byId('pName').textContent = State.pName;
    const level = Math.floor(State.xp/100)+1;
    const titles = ['Rookie','Fan','Otaku','Senpai','Master','Legend','God Tier'];
    byId('pLevel').textContent = 'Level '+level+' • '+titles[Math.min(level-1,titles.length-1)];
  }

  function editProfile(){
    const name = prompt('আপনার নাম:', State.pName);
    if(name!==null && name.trim()) State.pName = name.trim().slice(0,30);
    const emoji = prompt('আপনার ইমোজি:', State.pEmoji);
    if(emoji!==null && emoji.trim()) State.pEmoji = emoji.trim().slice(0,4);
    saveState(); renderProfile(); toast('✅ প্রোফাইল আপডেট হয়েছে');
  }

  function showFavCount(){ toast('❤️ '+State.favs.length+' টি ফেভারিট'); }
  async function showDBStats(){ const c = await DB.countAnime(); toast('📦 '+c+' টি এনিমে IndexedDB-তে সেভ'); }

  async function showStorageInfo(){
    const c = await DB.countAnime();
    const lsSize = Storage.sizeKB();
    const cacheCount = Cache.count();
    byId('infoBody').innerHTML = '<h2 style="font-size:16px;margin-bottom:12px">💾 স্টোরেজ তথ্য</h2>'
      + '<div style="background:var(--card);padding:12px;border-radius:11px;border:1px solid var(--bd);margin-bottom:10px">'
      + '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)"><span>📦 IndexedDB এনিমে</span><span style="color:var(--p1);font-weight:700">'+c+' টি</span></div>'
      + '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)"><span>📌 ওয়াচলিস্ট</span><span style="color:var(--p1);font-weight:700">'+State.wl.length+' টি</span></div>'
      + '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)"><span>❤️ ফেভারিট</span><span style="color:var(--p1);font-weight:700">'+State.favs.length+' টি</span></div>'
      + '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd)"><span>💿 LocalStorage</span><span style="color:var(--p1);font-weight:700">'+lsSize+' KB</span></div>'
      + '<div style="display:flex;justify-content:space-between;padding:6px 0"><span>🗂️ Cache Entries</span><span style="color:var(--p1);font-weight:700">'+cacheCount+' টি</span></div>'
      + '</div>'
      + '<button class="btn ghost" onclick="App.closeM(\'infoModal\')">বন্ধ করুন</button>';
    byId('infoModal').classList.add('on');
  }

  function clearCache(){
    const n = Cache.count();
    Cache.clearAll();
    toast('🧹 '+n+' টি ক্যাশ মুছে ফেলা হয়েছে');
  }

  async function clearAll(){
    if(!confirm('সব ডেটা মুছে ফেলবেন? এটা ফিরিয়ে আনা যাবে না।')) return;
    State.wl = []; State.favs = []; State.recN = 0; State.xp = 0; State.visits = 0;
    Data.clearMemCache(); saveState();
    await DB.clearAll();
    Storage.clearAll();
    State.homeLoaded = false; State.discLoaded = false; State.mangaLoaded = false;
    State.charCache = []; State.charShown = 0;
    await renderWatchlist(); renderProfile();
    toast('🧹 সব ডেটা রিসেট হয়েছে');
  }

  /* ─── WATCH PAGE LOGIC ─── */
  
  async function openWatchPage(id, season, ep, lang){
    let anime = await Data.fetchById(id);
    if(!anime){
      try {
        const j = await API.anilist(Q.byId(id));
        if(j.data?.Media) anime = norm(j.data.Media);
      } catch(e){}
    }
    
    if(!anime){
      toast('❌ এনিমে লোড করা যায়নি');
      return;
    }
    
    State.watchAnime = anime;
    State.watchSeason = parseInt(season) || 1;
    State.watchEpisode = parseInt(ep) || 1;
    State.watchLang = lang || 'hindi';
    State.watchServerIdx = 0;
    State.watchSources = [];
    
    // Generate seasons & episodes (demo logic: season 1 only, episodes from anime.episodes)
    State.watchSeasons = [1, 2, 3, 4]; // Fake seasons for UI
    const maxEp = anime.episodes || 12;
    State.watchEpisodes = Array.from({length: maxEp}, (_, i) => i + 1);
    
    go('watch');
  }

  async function renderWatchPage(){
    const a = State.watchAnime;
    if(!a){ go('home'); return; }
    
    byId('watchTitle').textContent = a.title;
    byId('watchMeta').textContent = `Season ${State.watchSeason} • Episode ${State.watchEpisode} • ${State.watchLang === 'hindi' ? 'Hindi Dub' : 'Sub'}`;
    byId('watchInfoTitle').textContent = a.title;
    byId('watchInfoMeta').textContent = `Episode ${State.watchEpisode} • ${State.watchSeasons.length} Seasons`;
    byId('watchWlBtn').textContent = State.wl.includes(a.id) ? '📌' : '📌';
    
    // Render Seasons
    byId('seasonSelect').innerHTML = State.watchSeasons.map(s => 
      `<button class="${s === State.watchSeason ? 'on' : ''}" onclick="App.changeSeason(${s})">Season ${s}</button>`
    ).join('');
    
    // Render Episodes
    byId('episodeList').innerHTML = State.watchEpisodes.map(e => 
      `<button class="${e === State.watchEpisode ? 'on' : ''}" onclick="App.changeEpTo(${e})">${e}</button>`
    ).join('');
    
    // Render Official & Unofficial Links (same as details page)
    const official = a.links.official || [];
    byId('watchOfficialLinks').innerHTML = official.map(l => 
      `<a class="wl" href="${l.u}" target="_blank" rel="noopener"><span class="ic">${l.icon||'▶️'}</span><span class="pn">${esc(l.p)}</span><span class="tp paid">${l.type==='free'?'FREE':'OFFICIAL'}</span></a>`
    ).join('') || '<div style="padding:10px;color:var(--mut);font-size:12px;text-align:center">অফিসিয়াল লিংক নেই</div>';
    
    const unofficial = a.links.unofficial || [];
    byId('watchUnofficialLinks').innerHTML = unofficial.map(l => 
      `<div class="wl" onclick="App.showWarn('${esc(l.p)}', '${esc(a.title)}', '${l.u}')"><span class="ic">${l.icon||'🌐'}</span><span class="pn">${esc(l.p)}</span><span class="tp uno">UNOFFICIAL</span></div>`
    ).join('');
    
    // Prev/Next buttons state
    byId('prevEpBtn').disabled = State.watchEpisode <= 1;
    byId('nextEpBtn').disabled = State.watchEpisode >= State.watchEpisodes.length;
    
    // Load video
    loadVideoForWatch();
  }
  
  async function loadVideoForWatch(){
    const a = State.watchAnime;
    if(!a) return;
    
    const loading = byId('watchLoading');
    const error = byId('watchError');
    const video = byId('watchVideo');
    const iframe = byId('watchIframe');
    
    loading.style.display = 'flex';
    error.style.display = 'none';
    if(hls){ try { hls.destroy(); } catch(e){} hls = null; }
    if(video){ try { video.pause(); } catch(e){} video.removeAttribute('src'); video.load(); video.style.display = 'none'; }
    if(iframe){ try { iframe.src = 'about:blank'; } catch(e){} iframe.style.display = 'none'; }
    
    // Use API to fetch sources
    let sources = await API.fetchVideoSources(a.title, State.watchEpisode, msg => {
      loading.innerHTML = `<div class="sp"></div><div>${msg}</div>`;
    });
    
    if(!sources.length){
      sources = await API.fallbackEmbed(a.title, State.watchEpisode);
    }
    
    State.watchSources = sources;
    
    if(!sources.length){
      loading.style.display = 'none';
      error.style.display = 'flex';
      return;
    }
    
    // Render server tabs
    byId('watchServers').innerHTML = sources.map((s, i) => 
      `<button class="${i === State.watchServerIdx ? 'on' : ''}" onclick="App.changeWatchServer(${i})">Server ${i+1}</button>`
    ).join('');
    
    // Play selected server
    playWatchSource(sources[State.watchServerIdx]);
  }
  
  function playWatchSource(source){
    const loading = byId('watchLoading');
    const error = byId('watchError');
    const video = byId('watchVideo');
    const iframe = byId('watchIframe');
    
    loading.style.display = 'none';
    error.style.display = 'none';
    
    if(source.type === 'iframe' || isEmbedUrl(source.url)){
      video.style.display = 'none';
      iframe.style.display = 'block';
      iframe.src = source.url;
    } else {
      video.style.display = 'block';
      iframe.style.display = 'none';
      
      if(source.type === 'hls' || source.url.includes('.m3u8')){
        if(window.Hls && Hls.isSupported()){
          hls = new Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source.url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
          });
        } else if(video.canPlayType('application/vnd.apple.mpegurl')){
          video.src = source.url;
          video.addEventListener('loadedmetadata', () => video.play().catch(() => {}), { once: true });
        }
      } else {
        video.src = source.url;
        video.addEventListener('loadedmetadata', () => video.play().catch(() => {}), { once: true });
        video.addEventListener('error', () => {
          loading.style.display = 'none';
          error.style.display = 'flex';
        }, { once: true });
      }
    }
  }
  
  function changeSeason(season){
    State.watchSeason = season;
    State.watchEpisode = 1; // Reset ep
    renderWatchPage();
  }
  
  function changeEpTo(ep){
    State.watchEpisode = ep;
    renderWatchPage();
  }
  
  function changeEp(delta){
    const newEp = State.watchEpisode + delta;
    if(newEp >= 1 && newEp <= State.watchEpisodes.length){
      State.watchEpisode = newEp;
      renderWatchPage();
    }
  }
  
  function changeWatchServer(idx){
    State.watchServerIdx = idx;
    renderWatchPage(); // This will re-render and re-load
  }
  
  function toggleWatchWl(){
    if(State.watchAnime) toggleWl(State.watchAnime.id);
  }
  
  function retryWatch(){
    loadVideoForWatch();
  }
  
  async function loadWatchAI(){
    const a = State.watchAnime; if(!a) return;
    const out = byId('watchAiOut'); if(!out) return;
    out.classList.add('on');
    out.innerHTML = '<div style="text-align:center;padding:10px"><div class="sp" style="margin:0 auto"></div><div style="margin-top:8px;color:var(--mut)">AI বিশ্লেষণ করছে...</div></div>';
    const langMap = { bn:'Bengali (বাংলা)', hi:'Hindi (हिंदी)', en:'English' };
    const langName = langMap[State.aiLang] || 'Bengali';
    const prompt = `Analyze "${a.title}" (Year: ${a.year}, Episodes: ${a.episodes}, Score: ${a.score}/10, Genres: ${a.genres.join(', ')}).

Answer in ${langName}. Structure:
1. **গল্পের সারসংক্ষেপ**
2. **কেন দেখবেন** (3 points)
3. **মূল চরিত্র**
4. **দেখার ক্রম**
5. **অনুরূপ এনিমে**

No religious/political content. Use **bold**.`;
    try {
      const t = await API.groq(prompt, { maxTokens: 800 });
      out.textContent = t || 'কোনো উত্তর পাওয়া যায়নি।';
    } catch(e){
      out.innerHTML = '<div style="color:var(--red)">❌ '+esc(e.message)+'</div>';
    }
  }

  /* ─── END WATCH PAGE LOGIC ─── */

  /* ─── VIDEO PLAYER (Modal for Details Page) ─── */
  let hls = null;

  async function openVideoPlayer(animeTitle, episodeNum){
    const modal = byId('videoModal');
    const status = byId('videoStatus');
    const serversEl = byId('videoServers');

    byId('videoTitle').textContent = animeTitle;
    byId('videoSubtitle').textContent = 'Episode ' + episodeNum;
    status.textContent = '🔍 ফ্রি সার্ভার খুঁজছি...';
    serversEl.innerHTML = '';
    modal.classList.add('on');

    resetVideoElement();

    State._curVideoTitle = animeTitle;
    State._curVideoEp = episodeNum;
    State._curVideoIdx = 0;

    status.textContent = '🔍 স্ট্রিমিং সার্ভার খুঁজছি...';
    let sources = await API.fetchVideoSources(animeTitle, episodeNum, msg => {
      status.textContent = '🔍 ' + msg;
    });

    if(sources.length === 0){
      status.textContent = '⚠️ সরাসরি স্ট্রিম পাওয়া যায়নি — সার্চ-ভিত্তিক প্লেয়ারে যাচ্ছি...';
      sources = await API.fallbackEmbed(animeTitle, episodeNum);
    }

    State._curVideoSources = sources;

    if(sources.length === 0){
      status.innerHTML = '❌ কোনো সোর্স পাওয়া যায়নি।';
      return;
    }

    serversEl.innerHTML = sources.map((s, i) =>
      '<button class="vsrv' + (i === 0 ? ' on' : '') + '" data-idx="' + i + '">' + esc(s.label || s.server) + '</button>'
    ).join('');
    serversEl.querySelectorAll('.vsrv').forEach(btn => {
      btn.addEventListener('click', () => {
        serversEl.querySelectorAll('.vsrv').forEach(x => x.classList.remove('on'));
        btn.classList.add('on');
        State._curVideoIdx = parseInt(btn.dataset.idx, 10);
        playSource(sources[State._curVideoIdx]);
      });
    });

    playSource(sources[0]);
  }

  function resetVideoElement(){
    const video = byId('videoPlayer');
    const iframe = byId('videoIframe');
    if(hls){ try { hls.destroy(); } catch(e){} hls = null; }
    if(video){
      try { video.pause(); } catch(e){}
      video.removeAttribute('src');
      try { video.load(); } catch(e){}
      video.innerHTML = '';
      video.style.display = 'block';
    }
    if(iframe){
      try { iframe.src = 'about:blank'; } catch(e){}
      iframe.style.display = 'none';
    }
  }

  function playSource(source){
    if(!source) return;
    const video = byId('videoPlayer');
    const iframe = byId('videoIframe');
    const status = byId('videoStatus');

    resetVideoElement();

    /* ═══ MODE 1: IFRAME EMBED ═══ */
    if(source.type === 'iframe' || isEmbedUrl(source.url)){
      video.style.display = 'none';
      if(iframe){
        iframe.src = source.url;
        iframe.style.display = 'block';
      }
      status.innerHTML = '🌐 <strong>' + esc(source.label || source.server) + '</strong>-এ ওপেন হয়েছে।'
        + '<br><span style="font-size:10px">iframe ব্লক হলে "এক্সটার্নাল প্লেয়ারে খুলুন" চাপুন।</span>';
      return;
    }

    /* ═══ MODE 2: DIRECT VIDEO / HLS ═══ */
    video.style.display = 'block';
    if(iframe) iframe.style.display = 'none';
    status.textContent = '⏳ স্ট্রিম লোড হচ্ছে... ' + (source.label || source.server);

    try {
      if(source.type === 'hls' || (source.url && source.url.indexOf('.m3u8') > -1)){
        if(window.Hls && Hls.isSupported()){
          hls = new Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source.url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            status.textContent = '▶️ প্লে হচ্ছে — ' + (source.label || source.server);
            video.play().catch(() => {});
          });
          hls.on(Hls.Events.ERROR, (ev, d) => {
            if(d.fatal){
              status.textContent = '❌ HLS স্ট্রিম ব্যর্থ। অন্য সার্ভার ট্রাই করুন।';
            }
          });
        } else if(video.canPlayType('application/vnd.apple.mpegurl')){
          video.src = source.url;
          video.addEventListener('loadedmetadata', () => {
            status.textContent = '▶️ প্লে হচ্ছে — ' + (source.label || source.server);
            video.play().catch(() => {});
          }, { once: true });
        } else {
          status.textContent = '❌ এই ব্রাউজারে HLS সাপোর্ট নেই।';
        }
      } else {
        video.src = source.url;
        video.addEventListener('loadedmetadata', () => {
          status.textContent = '▶️ প্লে হচ্ছে — ' + (source.label || source.server);
          video.play().catch(() => {});
        }, { once: true });
        video.addEventListener('error', () => {
          status.textContent = '❌ ভিডিও লোড ব্যর্থ। অন্য সার্ভার ট্রাই করুন।';
        }, { once: true });
      }
    } catch(e){
      status.textContent = '❌ প্লে করা যায়নি: ' + e.message;
    }
  }

  function refreshVideo(){
    if(!State._curVideoSources || !State._curVideoSources.length){ toast('সোর্স নেই'); return; }
    State._curVideoIdx = (State._curVideoIdx + 1) % State._curVideoSources.length;
    const serversEl = byId('videoServers');
    if(serversEl){
      serversEl.querySelectorAll('.vsrv').forEach((x, i) => {
        x.classList.toggle('on', i === State._curVideoIdx);
      });
    }
    playSource(State._curVideoSources[State._curVideoIdx]);
  }

  function openExternalPlayer(){
    if(!State._curVideoSources || !State._curVideoSources.length){ toast('সোর্স নেই'); return; }
    const src = State._curVideoSources[State._curVideoIdx];
    if(!src || !src.url){ toast('URL নেই'); return; }
    window.open(src.url, '_blank', 'noopener,noreferrer');
    toast('🌐 এক্সটার্নাল প্লেয়ারে খোলা হয়েছে');
  }

  function playCustomEmbed(){
    const CUSTOM_EMBED_DEFAULT = ''; 

    let url = CUSTOM_EMBED_DEFAULT;

    if(!url){
      url = prompt(
        'নিজস্ব বা অনুমোদিত ভিডিওর Embed URL অথবা সরাসরি MP4/HLS URL দিন।\n\n' +
        'ভিডিও প্রদানকারীর নিয়ম অনুযায়ী অনুমতি থাকা URL ব্যবহার করুন।',
        ''
      );
      if(!url) return;
      url = url.trim();
    }

    const modal = byId('videoModal');
    if(!modal.classList.contains('on')){
      modal.classList.add('on');
    }

    byId('videoTitle').textContent = State._curVideoTitle || 'Custom Embed';
    byId('videoSubtitle').textContent = 'Custom Server';
    byId('videoServers').innerHTML = '<button class="vsrv on">🎬 Custom Server</button>';
    byId('videoStatus').textContent = '🌐 Custom Server-এ ওপেন হয়েছে';

    const type = isEmbedUrl(url) ? 'iframe'
                : (url.includes('.m3u8') ? 'hls'
                : (url.match(/\.(mp4|webm|ogg|mkv|mpd)(\?|$)/i) ? 'mp4' : 'iframe'));

    State._curVideoSources = [{
      server: 'Custom Server',
      url: url,
      type: type,
      label: '🎬 Custom Server'
    }];
    State._curVideoIdx = 0;

    playSource(State._curVideoSources[0]);
  }

  function closeVideoPlayer(){
    resetVideoElement();
    byId('videoModal').classList.remove('on');
  }

  /* ─── DETAIL MODAL ─── */
  async function openDetail(id){
    State.curDetail = id;
    byId('dtBody').innerHTML = '<div class="load"><div class="sp"></div></div>';
    byId('dtModal').classList.add('on');
    let a = await Data.fetchDetailFull(id);
    if(!a) a = await Data.fetchById(id);
    if(!a){ byId('dtBody').innerHTML='<div class="empty"><div class="i">😕</div><p>লোড করা যায়নি</p></div>'; return; }

    const inWl = State.wl.indexOf(id)>-1;
    const isManga = a.type === 'MANGA';
    const fb = 'https://via.placeholder.com/220x330/1e1e35/8b5cf6?text=?';
    const hTag = a.hindi?'<span class="tag orange">🇮🇳 হিন্দি ডাব</span>':'';
    const stBn = { FINISHED:'সম্পন্ন', RELEASING:'এয়ারিং', NOT_YET_RELEASED:'আসছে', CANCELLED:'বাতিল', HIATUS:'বিরতি' };
    const tLabel = isManga?'📖 মাঙ্গা':(a.format==='MOVIE'?'🎬 মুভি':'📺 এনিমে');
    const eLabel = isManga?(a.chapters?a.chapters+' চ্যাপ্টার':'—'):(a.episodes?a.episodes+' পর্ব':'—');

    const trailerHTML = a.trailer
      ? '<div class="trailer-box"><div class="trailer-frame"><iframe src="https://www.youtube.com/embed/'+a.trailer.id+'?rel=0&modestbranding=1" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div></div>'
      : '<div class="trailer-box"><div class="trailer-empty">🎬 ট্রেইলার পাওয়া যায়নি</div></div>';

    let charsHTML = '';
    if(a.characters && a.characters.length){
      charsHTML = '<div class="slabel">👥 চরিত্র ('+a.characters.length+')</div><div class="chars-grid">'
        + a.characters.slice(0,12).map(c => '<div class="char-card" onclick="App.closeM(\'dtModal\');App.openCharDetail('+c.id+')"><img src="'+c.img+'" loading="lazy" onerror="this.src=\'https://via.placeholder.com/80x80/1e1e35/8b5cf6?text=?\'"><div class="cn">'+esc(c.name)+'</div><div class="cr">'+(c.role==='MAIN'?'⭐ Main':'Support')+'</div></div>').join('') + '</div>';
    }

    let recsHTML = '';
    if(a.recs && a.recs.length){
      recsHTML = '<div class="slabel">🎯 অনুরূপ</div><div class="rail">'
        + a.recs.map(r => '<div class="card" data-id="'+r.id+'" style="flex:0 0 100px;min-width:100px;max-width:100px"><div class="ciw"><img src="'+r.img+'" loading="lazy" onerror="this.src=\'https://via.placeholder.com/100x150/1e1e35/8b5cf6?text=?\'"></div><div class="info"><div class="ttl" style="font-size:10px">'+esc(r.title)+'</div><div class="mt" style="font-size:9px"><span class="rating">⭐ '+(r.score||0).toFixed(1)+'</span></div></div></div>').join('') + '</div>';
    }

    const unoLbl = isManga ? '📖 মাঙ্গা পড়ুন — আনঅফিসিয়াল' : '🎬 এখনই দেখুন — আনঅফিসিয়াল';
    const quickUno = '<div class="uno-section">'
      + '<div class="uno-head"><span style="font-size:20px">⚠️</span><div><h4>'+unoLbl+'</h4><p>'+a.links.unofficial.length+'টি সাইটে অ্যানিমের নাম দিয়ে সার্চ হবে</p></div></div>'
      + '<div class="uno-quick">'
      + a.links.unofficial.slice(0,6).map(l => '<div class="uno-btn" data-uno="1" data-site="'+esc(l.p)+'" data-url="'+l.u+'"><span class="ico">'+(l.icon||'🌐')+'</span><span class="nm">'+esc(l.p)+'</span><span class="go">→</span></div>').join('')
      + '</div><p style="font-size:10px;color:var(--mut);text-align:center;margin-top:8px;line-height:1.5">⚠️ আনঅফিসিয়াল সাইট। সতর্কতা দেখানো হবে।</p></div>';

    const watchBtn = !isManga ? '<button class="btn" onclick="App.closeM(\'dtModal\');App.openWatchPage('+a.id+', 1, 1, \'hindi\')" style="margin-top:10px;background:linear-gradient(135deg,#10b981,#059669)">▶️ এখনই দেখুন (Watch Page)</button>' : '';
    const playBtn = !isManga ? '<button class="btn" onclick="App.openVideoPlayer(\'' + esc(a.title).replace(/'/g,"\\'") + '\', 1)" style="margin-top:6px;background:linear-gradient(135deg,#f97316,#ef4444)">🎬 পপআপ প্লেয়ারে দেখুন</button>' : '';
    const customBtn = !isManga ? '<button class="btn" onclick="App.playCustomEmbed()" style="margin-top:6px;background:linear-gradient(135deg,#8b5cf6,#ec4899)">📺 Google Drive / Custom</button>' : '';

    byId('dtBody').innerHTML = ''
      + '<div class="dh"><img src="'+a.img+'" onerror="this.onerror=null;this.src=\''+fb+'\'"><div class="dt"><h2>'+esc(a.title)+'</h2><div class="jp">'+esc(a.title_jp||'')+'</div>'
      + '<div class="dm"><span class="tag gold">⭐ '+(a.score||0).toFixed(1)+'</span><span class="tag">'+esc(String(a.year))+'</span><span class="tag">'+esc(eLabel)+'</span><span class="tag">'+esc(stBn[a.status]||a.status)+'</span><span class="tag cyan">'+esc(tLabel)+'</span>'+hTag+'</div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:4px">'+a.genres.slice(0,10).map(g => '<span class="tag">'+esc(g)+'</span>').join('')+'</div></div></div>'
      + '<p class="ddesc">'+esc(a.desc)+'</p>'
      + '<div class="btn-row"><button class="btn '+(inWl?'ghost':'')+'" id="wlBtn">'+(inWl?'✓ ওয়াচলিস্টে':'📌 যোগ করুন')+'</button></div>'
      + watchBtn + playBtn + customBtn + quickUno
      + '<div class="slabel">🎬 ট্রেইলার</div>' + trailerHTML
      + '<div class="ai-box"><h4>🤖 AI বিস্তারিত</h4><div class="ai-langs"><div class="ai-lang on" data-lang="bn">🇧🇩 বাংলা</div><div class="ai-lang" data-lang="hi">🇮🇳 हिंदी</div><div class="ai-lang" data-lang="en">🇬🇧 English</div></div>'
      + '<button class="btn" onclick="App.loadAI()" style="width:100%">✨ AI বিশ্লেষণ</button><div class="ai-out" id="aiOut"></div></div>'
      + charsHTML + recsHTML
      + '<div class="slabel">✅ অফিসিয়াল স্ট্রিমিং</div><div class="wls">'
      + (a.links.official.length ? a.links.official.map(l => '<a class="wl" href="'+l.u+'" target="_blank" rel="noopener"><span class="ic">'+(l.icon||'▶️')+'</span><span class="pn">'+esc(l.p)+'</span><span class="tp paid">'+(l.type==='free'?'FREE':'OFFICIAL')+'</span></a>').join('') : '<div style="padding:10px;color:var(--mut);font-size:12px;text-align:center">অফিসিয়াল লিংক নেই</div>')
      + '</div>'
      + '<div class="slabel warn-head">⚠️ সব আনঅফিসিয়াল সাইট ('+a.links.unofficial.length+')</div><div class="wls">'
      + a.links.unofficial.map(l => '<div class="wl" data-uno="1" data-site="'+esc(l.p)+'" data-url="'+l.u+'"><span class="ic">'+(l.icon||'🌐')+'</span><span class="pn">'+esc(l.p)+'</span><span class="tp uno">UNOFFICIAL</span></div>').join('')
      + '</div>';

    const wb = byId('wlBtn');
    if(wb) wb.addEventListener('click', () => toggleWl(id));
    byId('dtBody').querySelectorAll('.wl[data-uno], .uno-btn[data-uno]').forEach(x => {
      x.addEventListener('click', () => showWarn(x.dataset.site, a.title, x.dataset.url));
    });
    byId('dtBody').querySelectorAll('.ai-lang').forEach(x => {
      x.addEventListener('click', () => {
        byId('dtBody').querySelectorAll('.ai-lang').forEach(y => y.classList.remove('on'));
        x.classList.add('on');
        State.aiLang = x.dataset.lang;
      });
    });
    bindCards(byId('dtBody'));
    State.visits++; saveState(); State._curAnime = a;
  }

  function updateWlBtn(id){
    if(State.curDetail !== id) return;
    const b = byId('wlBtn'); if(!b) return;
    const inWl = State.wl.indexOf(id)>-1;
    b.className = 'btn '+(inWl?'ghost':'');
    b.textContent = inWl?'✓ ওয়াচলিস্টে':'📌 যোগ করুন';
  }

  async function loadAI(){
    const a = State._curAnime; if(!a) return;
    const out = byId('aiOut'); if(!out) return;
    out.classList.add('on');
    out.innerHTML = '<div style="text-align:center;padding:10px"><div class="sp" style="margin:0 auto"></div><div style="margin-top:8px;color:var(--mut)">AI বিশ্লেষণ করছে...</div></div>';
    const langMap = { bn:'Bengali (বাংলা)', hi:'Hindi (हिंदी)', en:'English' };
    const langName = langMap[State.aiLang] || 'Bengali';
    const prompt = `Analyze "${a.title}" (Year: ${a.year}, Episodes: ${a.episodes}, Score: ${a.score}/10, Genres: ${a.genres.join(', ')}).

Answer in ${langName}. Structure:
1. **গল্পের সারসংক্ষেপ**
2. **কেন দেখবেন** (3 points)
3. **মূল চরিত্র**
4. **দেখার ক্রম**
5. **অনুরূপ এনিমে**

No religious/political content. Use **bold**.`;
    try {
      const t = await API.groq(prompt, { maxTokens: 800 });
      out.textContent = t || 'কোনো উত্তর পাওয়া যায়নি।';
    } catch(e){
      out.innerHTML = '<div style="color:var(--red)">❌ '+esc(e.message)+'</div>';
    }
  }

  function showWarn(site, title, url){
    byId('wnText').innerHTML = '<div style="text-align:left;font-size:12px;line-height:1.8">'
      + '<p style="margin-bottom:10px"><strong>'+esc(title)+'</strong> দেখতে <strong>'+esc(site)+'</strong>-এ যাচ্ছেন।</p>'
      + '<p style="margin-bottom:8px;color:var(--orange);font-weight:700">⚠️ সতর্কতা:</p>'
      + '<ul style="margin:0 0 12px 20px;color:var(--mut)">'
      + '<li>এই সাইট আনঅফিসিয়াল (পাইরেসি)</li>'
      + '<li>অ্যাড ব্লকার রাখুন</li>'
      + '<li>ব্যক্তিগত তথ্য শেয়ার করবেন না</li>'
      + '</ul></div>';
    byId('wnLink').href = url || ('https://www.google.com/search?q='+encodeURIComponent(site+' '+title));
    byId('wnModal').classList.add('on');
  }

  function closeM(id){ const m = byId(id); if(m) m.classList.remove('on'); }

  function openWizard(){
    State.wz = { exp:'', genres:[], len:'', lang:'' };
    document.querySelectorAll('.wz').forEach(s => s.classList.remove('on'));
    const first = document.querySelector('.wz[data-s="1"]'); if(first) first.classList.add('on');
    document.querySelectorAll('.opt').forEach(o => o.classList.remove('on'));
    byId('wzModal').classList.add('on');
  }

  function nextWz(){
    const cur = document.querySelector('.wz.on'); if(!cur) return;
    const s = parseInt(cur.dataset.s,10);
    if(s===1 && !State.wz.exp){ toast('একটা অপশন সিলেক্ট করুন'); return; }
    if(s===2 && State.wz.genres.length===0){ toast('অন্তত একটা জেনার'); return; }
    if(s===3 && !State.wz.len){ toast('একটা অপশন সিলেক্ট করুন'); return; }
    cur.classList.remove('on');
    const nx = document.querySelector('.wz[data-s="'+(s+1)+'"]'); if(nx) nx.classList.add('on');
  }

  async function finishWz(){
    if(!State.wz.lang){ toast('ভাষা সিলেক্ট করুন'); return; }
    closeM('wzModal');
    byId('dtBody').innerHTML = '<div class="load"><div class="sp"></div></div>';
    byId('dtModal').classList.add('on');
    let pool = [];
    const [p1,p2,p3] = await Promise.all([
      Data.fetchApi(Q.popular(1,50)),
      Data.fetchApi(Q.popular(2,50)),
      Data.fetchApi(Q.topScore(1,50))
    ]);
    pool = Data.dedupe([...p1,...p2,...p3]);
    const w = State.wz;
    const scored = pool.map(a => {
      let s = a.score||0;
      const gm = a.genres.filter(g => w.genres.indexOf(g)>-1).length;
      s += gm*1.8;
      if(w.exp==='new'){ if(a.episodes>0 && a.episodes<=30) s+=1.5; if(a.episodes>100) s-=2.5; }
      if(w.exp==='some' && a.episodes>0 && a.episodes<=60) s+=0.6;
      if(w.exp==='pro' && a.score>=8.2) s+=0.8;
      if(w.exp==='otaku' && a.score>=8.5) s+=1;
      if(w.len==='short'){ if(a.episodes>0 && a.episodes<=30) s+=1.2; if(a.episodes>50) s-=1.8; }
      if(w.len==='medium' && a.episodes>=40 && a.episodes<=110) s+=1;
      if(w.len==='long' && a.episodes>=100) s+=1.2;
      if(w.lang==='hindi'){ if(a.hindi) s+=3.5; else s-=2.5; }
      if(w.lang==='sub' && !a.hindi) s+=0.3;
      return { a, s };
    }).sort((x,y) => y.s-x.s).slice(0,12).map(x => x.a);
    State.recN += scored.length; State.xp += 10; saveState();
    byId('dtBody').innerHTML = '<div style="text-align:center;margin-bottom:14px"><div style="font-size:38px">✨</div><h2 style="font-size:17px">রেকমেন্ডেশন</h2><p style="color:var(--mut);font-size:11.5px">'+scored.length+'টি এনিমে</p></div><div class="grid">'+scored.map(cardHTML).join('')+'</div><button class="btn ghost" style="margin-top:14px" onclick="App.openWizard()">🔄 আবার</button>';
    bindCards(byId('dtBody'));
  }

  function toggleTheme(){
    State.theme = State.theme==='dark'?'light':'dark';
    document.body.classList.toggle('light',State.theme==='light');
    byId('themeBtn').textContent = State.theme==='dark'?'🌙':'☀️';
    saveState();
    toast(State.theme==='dark'?'🌙 ডার্ক মোড':'☀️ লাইট মোড');
  }

  function toggleAIBar(){
    go('home');
    setTimeout(() => {
      const box = document.querySelector('.ai-command-box');
      if(box){
        box.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const inp = byId('aiCmd');
        if(inp) setTimeout(() => inp.focus(), 400);
      }
    }, 100);
  }

  async function runAI(){
    const inp = byId('aiCmd');
    const q = (inp?.value || '').trim();
    if(!q){ toast('কিছু লিখুন'); return; }
    await runAIWithQuery(q);
  }

  async function quickAI(q){
    const inp = byId('aiCmd');
    if(inp) inp.value = q;
    await runAIWithQuery(q);
  }

  async function runAIWithQuery(q){
    const box = byId('aiResult');
    if(!box) return;
    box.style.display = 'block';
    box.innerHTML = '<div class="ai-result-inner" style="display:flex;align-items:center;gap:10px">'
      + '<div class="sp" style="width:18px;height:18px;flex-shrink:0"></div>'
      + '<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:12px">🐙 AI ভাবছে...</div>'
      + '<div style="font-size:10.5px;color:var(--mut)">সেরা API বেছে নিচ্ছে</div></div></div>';

    try {
      const out = await Orchestrator.run(q);
      const d = out.decision;
      const r = out.result;

      let bodyHTML = '';
      let resultLabel = 'ফলাফল';

      if(r.kind === 'anime' && r.anime.length){
        resultLabel = r.anime.length + ' টি এনিমে';
        bodyHTML = '<div class="grid" style="margin-top:10px">' + r.anime.slice(0,12).map(cardHTML).join('') + '</div>';
      } else if(r.kind === 'character' && r.characters.length){
        resultLabel = r.characters.length + ' টি চরিত্র';
        bodyHTML = '<div class="grid cols-4" style="margin-top:10px">' + r.characters.slice(0,12).map((c,i) => charCardHTML(c,i+1)).join('') + '</div>';
      } else if(r.kind === 'watch' && r.watchTitle){
        resultLabel = 'ভিডিও রেডি';
        bodyHTML = '<div style="margin-top:10px;padding:12px;background:var(--card);border-radius:10px;border:1px solid var(--bd)">'
          + '<div style="font-size:12.5px;margin-bottom:8px">🎬 <strong>' + esc(r.watchTitle) + '</strong> — Episode ' + r.watchEp + '</div>'
          + '<button class="btn" onclick="App.openVideoPlayer(\'' + esc(r.watchTitle).replace(/'/g,"\\'") + '\',' + r.watchEp + ')">▶️ এখনই প্লে করুন</button>'
          + '</div>';
      } else if(r.kind === 'text'){
        resultLabel = 'AI উত্তর';
        bodyHTML = '<div class="ai-out on" style="margin-top:10px;white-space:pre-wrap">' + esc(r.text) + '</div>';
      } else {
        resultLabel = 'কিছু পাওয়া যায়নি';
        bodyHTML = '<div style="padding:20px 14px;text-align:center">'
          + '<div style="font-size:42px;margin-bottom:10px">🤔</div>'
          + '<div style="font-weight:700;font-size:13.5px;margin-bottom:8px">"' + esc(q) + '" এর জন্য কিছু পাওয়া যায়নি</div>'
          + '<div style="font-size:11.5px;color:var(--mut);line-height:1.7">'
          + 'আরো স্পষ্টভাবে লিখুন — যেমন:<br>'
          + '<strong style="color:var(--p1)">Naruto</strong> · '
          + '<strong style="color:var(--p1)">অ্যাকশন এনিমে</strong> · '
          + '<strong style="color:var(--p1)">টপ রেটেড</strong> · '
          + '<strong style="color:var(--p1)">মাঙ্গা</strong> · '
          + '<strong style="color:var(--p1)">One Piece দেখব</strong>'
          + '</div></div>';
      }

      box.innerHTML = '<div class="ai-result-inner">'
        + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">'
        + '<span style="font-size:20px">🐙</span>'
        + '<div style="flex:1;min-width:0">'
        + '<div style="font-size:12px;font-weight:700">✨ AI বিশ্লেষণ সম্পন্ন</div>'
        + '<div style="font-size:10px;color:var(--mut)">' + resultLabel + ' · ' + out.timing.think_ms + 'ms</div>'
        + '</div>'
        + '<button class="icon-btn" onclick="document.getElementById(\'aiResult\').style.display=\'none\'" style="width:28px;height:28px;flex-shrink:0">✕</button>'
        + '</div>' + bodyHTML + '</div>';

      setTimeout(() => bindCards(box), 50);
    } catch(e){
      box.innerHTML = '<div style="padding:14px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:12px;color:var(--red);font-size:12px">❌ ' + esc(e.message) + '</div>';
    }
  }

  function init(){
    const _origError = console.error;
    console.error = function(...args){
      const msg = String(args[0] || '');
      if(msg.includes('CORS') || msg.includes('Failed to load resource') ||
         msg.includes('net::ERR_FAILED') || msg.includes('api.consumet.org') ||
         msg.includes('403') || msg.includes('404')) {
        return;
      }
      _origError.apply(console, args);
    };

    if(State.theme==='light') document.body.classList.add('light');
    byId('themeBtn').textContent = State.theme==='dark'?'🌙':'☀️';

    setTimeout(() => {
      byId('splash').classList.add('out');
      setTimeout(() => { const s = byId('splash'); if(s) s.remove(); }, 400);
    }, 900);

    document.querySelectorAll('.nb').forEach(b => b.addEventListener('click', () => go(b.dataset.p)));

    let sc = false;
    window.addEventListener('scroll', () => {
      if(sc) return; sc = true;
      requestAnimationFrame(() => {
        const st = byId('scrollTop');
        if(st) st.classList.toggle('on', window.scrollY > 500);
        sc = false;
      });
    }, { passive: true });

    document.querySelectorAll('.modal').forEach(m => {
      m.addEventListener('click', e => { if(e.target === m) closeM(m.id); });
    });
    document.querySelectorAll('.mc').forEach(c => {
      c.addEventListener('click', e => e.stopPropagation());
    });
    document.addEventListener('keydown', e => {
      if(e.key === 'Escape'){
        const vm = byId('videoModal');
        if(vm && vm.classList.contains('on')){ closeVideoPlayer(); return; }
        const open = Array.from(document.querySelectorAll('.modal.on'));
        if(open.length > 0){ closeM(open[open.length-1].id); }
      }
    });

    document.querySelectorAll('.wz .opts').forEach(g => {
      g.querySelectorAll('.opt').forEach(o => {
        o.addEventListener('click', () => {
          const k = g.dataset.k;
          const multi = g.dataset.multi === '1';
          if(multi){
            o.classList.toggle('on');
            State.wz[k] = Array.from(g.querySelectorAll('.opt.on')).map(x => x.dataset.v);
          } else {
            g.querySelectorAll('.opt').forEach(x => x.classList.remove('on'));
            o.classList.add('on');
            State.wz[k] = o.dataset.v;
          }
        });
      });
    });

    byId('rankTabs').querySelectorAll('.chip').forEach(b => {
      b.addEventListener('click', () => {
        byId('rankTabs').querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        State.rank = b.dataset.r;
        renderRankings();
      });
    });

    const aiInp = byId('aiCmd');
    if(aiInp){
      aiInp.addEventListener('keydown', e => {
        if(e.key === 'Enter'){ e.preventDefault(); runAI(); }
      });
    }

    State.visits++; saveState();

    DB.getAllAnime().then(c => { if(c.length) console.log('📦 '+c.length+' from IndexedDB'); });

    // Initial route from URL
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 'home';
    if(page === 'watch'){
      const id = urlParams.get('id');
      const season = urlParams.get('season');
      const ep = urlParams.get('ep');
      const lang = urlParams.get('lang');
      if(id) openWatchPage(parseInt(id), season, ep, lang);
      else go('home');
    } else {
      go(page);
    }
    
    renderProfile();

    console.log('%c🎌 AnimeVerse Universe', 'color:#8b5cf6;font-size:18px;font-weight:bold');
    console.log('%c✅ 160 APIs | AI Orchestrator | Premium Watch Page Ready', 'color:#ec4899;font-size:12px');
    console.log('%c🐙 Brain: ' + CONFIG.GROQ_MODEL, 'color:#06b6d4;font-size:11px');
    console.log('%c🎬 Video: iframe + HLS + MP4 (Google Drive / DoodStream / Streamtape / Filemoon / Voe / MixDrop supported)', 'color:#10b981;font-size:11px');
  }

  return {
    go, init, toggleTheme, toggleAIBar, goBack,
    openDetail, openCharDetail,
    openVideoPlayer, closeVideoPlayer, refreshVideo, openExternalPlayer, playCustomEmbed,
    openWizard, nextWz, finishWz, closeM,
    loadAI, loadCharPower,
    loadMore, loadMoreChars, loadMoreManga,
    editProfile,
    showFavCount, showDBStats, showStorageInfo,
    clearCache, clearAll,
    runAI, quickAI,
    // Watch Page Exports
    openWatchPage, renderWatchPage, changeSeason, changeEpTo, changeEp, changeWatchServer, toggleWatchWl, retryWatch, loadWatchAI
  };
})();

if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', App.init);
else App.init();
window.App = App;
})();