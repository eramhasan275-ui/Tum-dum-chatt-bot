/**
 * =========================================================
 * TUM DUM - SMART BABY v6
 * Owner: ইরাম
 * No External API / No AI
 * =========================================================
 *
 * Features:
 * - Bangla + Banglish
 * - Flexible spelling detection
 * - Context/topic matching
 * - Direct bot calling
 * - Conversation memory
 * - Duplicate reply protection
 * - No external API
 * =========================================================
 */

const BOT_NAME = "Tum Dum";
const OWNER_NAME = "ইরাম";

module.exports.config = {
  name: "baby",
  version: "6.0.0",
  hasPermssion: 0,
  credits: "ইরাম",
  description: "Smart manual conversational chat",
  commandCategory: "Chat",
  usages: "[message]",
  cooldowns: 2,
  prefix: true
};


// =========================================================
// MEMORY
// =========================================================

const memory = new Map();

function getMemory(threadID, senderID) {

  const key = `${threadID}_${senderID}`;

  if (!memory.has(key)) {

    memory.set(key, {
      messages: 0,
      lastUserText: "",
      lastReply: "",
      lastTopic: "",
      mood: "normal"
    });

  }

  return memory.get(key);
}


function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


// =========================================================
// TEXT NORMALIZATION
// =========================================================

function normalize(text) {

  return String(text || "")
    .toLowerCase()

    // Common Banglish variations
    .replace(/aa/g, "a")
    .replace(/ee/g, "i")
    .replace(/oo/g, "u")

    // punctuation
    .replace(/[!?.,؟,،:;'"`~@#$%^&*()[\]{}<>|\\/+=_-]/g, " ")

    // extra spaces
    .replace(/\s+/g, " ")

    .trim();
}


// =========================================================
// COMPACT TEXT
// =========================================================

function compact(text) {

  return normalize(text)
    .replace(/\s+/g, "");
}


// =========================================================
// RESPONSE DATABASE
// =========================================================

const R = {

  salam: [
    "ওয়ালাইকুমুস সালাম ওয়া রহমাতুল্লাহ 🌸❤️",
    "ওয়ালাইকুমুস সালাম 😊❤️",
    "ওয়ালাইকুমুস সালাম 💚 Tum Dum হাজির!",
    "ওয়ালাইকুমুস সালাম 🌺 আল্লাহ তোমাকে ভালো রাখুন।"
  ],


  hello: [
    "হাই 😌❤️ কী খবর?",
    "হ্যালো! 👀 বলো কী খবর?",
    "আরে হাই! 😎 Tum Dum শুনছে।",
    "হুম বলো 😊",
    "হ্যালো ভাই 😌❤️"
  ],


  howAreYou: [
    "আলহামদুলিল্লাহ ভালো আছি ❤️ তুমি কেমন আছো?",
    "ভালো আছি 😌 তোমার কী খবর?",
    "Tum Dum একদম ফিট 😎🔥 তোমার খবর কী?",
    "আলহামদুলিল্লাহ ভালো। তুমি কেমন আছো?"
  ],


  good: [
    "বাহ! এভাবেই ভালো থাকো ❤️",
    "শুনে ভালো লাগলো 😌",
    "Nice! 😎🔥",
    "আলহামদুলিল্লাহ ❤️ ভালো থাকো।"
  ],


  name: [
    `আমার নাম ${BOT_NAME} 😎❤️`,
    `আমি ${BOT_NAME} 🤖❤️`,
    `${BOT_NAME} নামেই সবাই চেনে আমাকে 😌`,
    `আমার নাম Tum Dum 😎`
  ],


  owner: [
    `আমাকে তৈরি করেছে ${OWNER_NAME} ❤️`,
    `আমার Owner হলো ${OWNER_NAME} 😎🔥`,
    `${OWNER_NAME} হলো আমার creator 🤖❤️`,
    `আমার creator ${OWNER_NAME} ❤️`
  ],


  joke: [
    "একটা জোকস শুনবে? 😂\nপরীক্ষায় প্রশ্ন দেখে ছাত্র বললো: স্যার, এই প্রশ্নটা syllabus-এর কোন গ্রুপে? 😭",
    "জীবনে দুইটা জিনিসের দাম বেশি—একটা সময়, আরেকটা ফুচকা! 😂",
    "আমি এত অলস যে ঘুমানোর আগে অ্যালার্ম দিই, তারপর অ্যালার্ম বন্ধ করে আবার ঘুমাই! 😭😂",
    "শিক্ষক: এত দেরি করে আসলে কেন?\nছাত্র: স্যার, স্বপ্নে দেখলাম স্কুলে চলে এসেছি! 😂",
    "বন্ধু: তুই এত চুপ কেন?\nআমি: WiFi নেই, কথা download হচ্ছে না! 😂"
  ],


  love: [
    "ওহহ! প্রেমের গন্ধ পাচ্ছি 👀😂❤️",
    "আহা! এত ভালোবাসা কেন? 🙈❤️",
    "প্রেমের ব্যাপার নাকি? 😏❤️",
    "Tum Dum কিন্তু প্রেমের ব্যাপারে expert না 😂",
    "কার প্রেমে পড়ছো বলো দেখি 👀😂"
  ],


  miss: [
    "কাকে miss করছো? 👀❤️",
    "আহা, কাউকে খুব মনে পড়ছে বুঝি? 🥺",
    "যাকে miss করছো তাকে একটা message দাও 😌❤️",
    "মনে পড়ছে যখন, কথা বলে ফেলো না কেন? ❤️"
  ],


  sad: [
    "মন খারাপ নাকি? 🥺❤️",
    "কী হয়েছে? চাইলে আমাকে বলতে পারো।",
    "সব ঠিক হয়ে যাবে 🤍 চিন্তা করো না।",
    "মন খারাপ হলে একটু কথা বলো, একা থেকো না ❤️",
    "খারাপ সময় সবসময় থাকে না। একটু ধৈর্য ধরো 🤍"
  ],


  angry: [
    "রাগ কোরো না 😅 একটু শান্ত হও।",
    "কে রাগিয়েছে তোমাকে? 👀",
    "মাথা ঠান্ডা রাখো 😌 সব ঠিক হয়ে যাবে।",
    "রাগের সময় বেশি কিছু বলে ফেলো না ভাই 😅"
  ],


  compliment: [
    "আরে বাহ 😳 এত প্রশংসা করলে তো আমি famous হয়ে যাবো 😂❤️",
    "ধন্যবাদ 😌❤️",
    "Tum Dum আজকে অনেক খুশি 😂",
    "এমন কথা শুনলে আমার mood ভালো হয়ে যায় 😎"
  ],


  thanks: [
    "Welcome 😌❤️",
    "আরে ধন্যবাদ কেন? 🥰",
    "Anytime 😎",
    "No problem ❤️"
  ],


  bye: [
    "আচ্ছা, পরে কথা হবে 😌❤️",
    "Bye bye 👋 ভালো থেকো!",
    "ঠিক আছে 😴 পরে আবার এসো।",
    "আল্লাহ হাফেজ ❤️"
  ],


  food: [
    "খাবারের কথা শুনলেই আমারও খিদা লাগে 🤤😂",
    "কী খেতে ইচ্ছা করছে? 👀🍔",
    "বিরিয়ানি হলে আমাকে ডাকতে ভুলবে না 😂🔥",
    "খাবার আগে Tum Dum-এর কথা মনে পড়লো নাকি? 😂"
  ],


  study: [
    "পড়াশোনার ব্যাপার মনে হচ্ছে 📚😌 একটু একটু করে পড়ো।",
    "আগে পড়া শেষ করো, তারপর আড্ডা 😎",
    "পড়তে বসো ভাই 😂 শেষ মুহূর্তে চাপ নিও না।",
    "১০ মিনিট হলেও এখন পড়া শুরু করে দাও 📚"
  ],


  exam: [
    "Exam-এর চিন্তা হচ্ছে নাকি? 😭📚",
    "যেটুকু পারো revise করো। সব একসাথে পড়তে যেও না 😌",
    "Exam ভয় পাওয়ার কিছু না—নিজের best দাও ❤️",
    "শেষ মুহূর্তের পড়াও কাজে দেয় 😂📚"
  ],


  gaming: [
    "Game খেলতে যাচ্ছো? 🎮🔥",
    "একটা match জিতে আসো তারপর কথা হবে 😎",
    "Gaming mood detected 🎮😂",
    "হারলে কিন্তু internet-কে দোষ দিও না 😂",
    "Headshot দিতে পারো নাকি শুধু কথা? 😂🔥"
  ],


  football: [
    "Football! ⚽🔥 এই topic-এ আড্ডা জমবেই।",
    "কে কোন team support করে বলো দেখি 👀⚽",
    "Football নিয়ে তর্ক শুরু হলে আজকে ঘুম নেই 😂⚽",
    "Goal! ⚽🔥"
  ],


  weather: [
    "বৃষ্টির mood নাকি? 🌧️😂",
    "বৃষ্টি হলে চা নিয়ে বসে থাকাই best ☕🌧️",
    "আবহাওয়া নিয়ে আড্ডাও কম না 😌",
    "এই weather-এ ঘুম দিতে ইচ্ছা করে 😴🌧️"
  ],


  sleep: [
    "ঘুম পাচ্ছে নাকি? 😴",
    "আর কত রাত জাগবে? 😂 ঘুমাও!",
    "ঘুম ঠিকমতো হওয়া দরকার কিন্তু 😌",
    "ফোনটা নামিয়ে একটু ঘুমিয়ে নাও 😴❤️"
  ],


  money: [
    "টাকার কথা উঠলেই সবাই serious হয়ে যায় 😂💸",
    "টাকা থাকলে অনেক problem কমে যায় 😅",
    "আহা টাকা! সবার প্রিয় topic 😂💸"
  ],


  group: [
    "গ্রুপে কী অবস্থা? 👀",
    "আজকে আড্ডা জমবে তো? 😂",
    "সবাই কেমন আছে? 😌",
    "Tum Dum তো আড্ডার জন্য ready 😎"
  ],


  bored: [
    "বোর লাগছে? 😂 চলো একটা জোকস বলি।",
    "চলো একটু আড্ডা দিই 😎",
    "একটা interesting topic ধরো 👀",
    "বোর হলে আমাকে ডাকলেই হবে 😂"
  ],


  insult: [
    "আস্তে ভাই 😂 আমার কিন্তু feelings আছে!",
    "এইভাবে কথা বলো না 🥺😂",
    "আচ্ছা বাবা, শান্ত হও 😂",
    "গালি দিলে কিন্তু Tum Dum silent mode-এ চলে যাবে 😑"
  ],


  unknown: [
    "হুম 👀 তারপর কী হলো?",
    "আচ্ছা 😌 আরেকটু বলো তো।",
    "Interesting 🤔 ব্যাপারটা একটু খুলে বলো।",
    "হুমম... Tum Dum শুনছে 👀",
    "বুঝলাম 😌 তারপর?",
    "ওহ! 😯 এই ব্যাপারে আরো বলো।"
  ]

};


// =========================================================
// KEYWORD DATABASE
// =========================================================

const KEYWORDS = {

  salam: [
    "সালাম",
    "সালামু আলাইকুম",
    "আসসালামু আলাইকুম",
    "আসসালামুআলাইকুম",

    "salam",
    "salam alaikum",
    "salaam",
    "salaam alaikum",

    "assalamu alaikum",
    "assalamualaikum",
    "assalamualaikum",
    "assalamu-alaikum",

    "aslamualaikum",
    "asalamualaikum",
    "asslamualaikum"
  ],


  hello: [
    "হাই",
    "হ্যালো",
    "হেলো",
    "হেই",
    "হাইরে",

    "hi",
    "hello",
    "helo",
    "hey",
    "heyy",
    "hii",
    "hiii"
  ],


  howAreYou: [
    "কেমন আছো",
    "কেমন আছ",
    "কেমন আছেন",
    "কী খবর",
    "কি খবর",
    "কেমন চলছে",
    "কেমন আছিস",

    "kemon acho",
    "kemon aso",
    "kemon accho",
    "kemon achho",
    "kmn acho",
    "kmn aso",
    "kmn accho",

    "ki khobor",
    "kikhobor",
    "ki obostha",
    "ki obosta",
    "obostha ki",
    "how are you"
  ],


  good: [
    "ভালো আছি",
    "ভাল আছি",
    "আমি ভালো",
    "আমি ভাল",
    "আলহামদুলিল্লাহ",
    "ভালোই আছি",

    "valo achi",
    "bhalo achi",
    "valoi achi",
    "ami valo",
    "alhamdulillah",
    "fine",
    "good"
  ],


  name: [
    "তোমার নাম",
    "তোর নাম",
    "আপনার নাম",
    "নাম কি",
    "নাম কী",
    "তুমি কে",
    "তুই কে",
    "who are you",
    "what is your name",
    "your name",

    "tomar nam",
    "tor nam",
    "nam ki",
    "nam kii",
    "tumi ke",
    "tui ke",
    "tor nam ki",
    "tomar nam ki"
  ],


  owner: [
    "কে বানিয়েছে",
    "কে বানাইছে",
    "কে বানিয়েছে তোমাকে",
    "তোমাকে কে বানিয়েছে",
    "তোমাকে কে বানাইছে",
    "কে তৈরি করেছে",
    "কে তৈরি করছে",
    "তোমার মালিক",
    "owner কে",
    "তোমার owner",
    "creator কে",
    "who made you",
    "who is your owner",

    "ke banayse",
    "ke banayche",
    "ke banayse tomake",
    "ke toiri korse",
    "ke banaise",
    "ke banaise tomake",
    "tomake ke banaise",
    "tomar owner ke",
    "owner ke"
  ],


  joke: [
    "জোক",
    "জোকস",
    "জোক বল",
    "জোকস বল",
    "জোকস শোনাও",
    "মজা বল",
    "মজার কথা",

    "joke",
    "jokes",
    "joke bolo",
    "jokes bolo",
    "jokes sunao",
    "moja bolo",
    "funny bolo"
  ],


  love: [
    "ভালোবাসি",
    "ভালবাসি",
    "ভালোবাসা",
    "ভালবাসা",
    "প্রেম",
    "প্রেমিকা",
    "প্রেমিক",
    "crush",
    "love",
    "i love you",
    "love you",

    "bhalobashi",
    "valobashi",
    "bhalobasha",
    "valobasha",
    "prem",
    "premika",
    "premik"
  ],


  miss: [
    "মিস করি",
    "মিস করছি",
    "মনে পড়ে",
    "মনে পড়ে",
    "মনে পড়ছে",
    "মনে পড়ছে",

    "miss you",
    "miss kori",
    "miss kortesi",
    "mone pore",
    "mone porse"
  ],


  sad: [
    "মন খারাপ",
    "কষ্ট হচ্ছে",
    "কষ্ট",
    "দুঃখ",
    "দুঃখিত",
    "কাঁদছি",
    "একা লাগছে",
    "একাকী",

    "mon kharap",
    "mon kharaf",
    "kosto hocche",
    "kosto",
    "dukho",
    "dukhi",
    "sad",
    "lonely"
  ],


  angry: [
    "রাগ",
    "রাগ করছি",
    "রাগ লাগছে",
    "রাগ উঠছে",
    "angry",
    "mad",
    "hate",

    "rag",
    "rag kortesi",
    "rag lagtese"
  ],


  thanks: [
    "ধন্যবাদ",
    "অনেক ধন্যবাদ",
    "থ্যাংকস",
    "thanks",
    "thank you",
    "thank",
    "tnx",
    "thnx",

    "dhonnobad",
    "thanks bro"
  ],


  bye: [
    "বিদায়",
    "বিদায়",
    "আল্লাহ হাফেজ",
    "পরে কথা হবে",
    "যাই",
    "bye",
    "goodbye",
    "allah hafez",

    "biday",
    "pore kotha hobe",
    "jai"
  ],


  food: [
    "খাবার",
    "খেতে",
    "খাবো",
    "খাই",
    "খিদা",
    "ক্ষুধা",
    "বিরিয়ানি",
    "বিরিয়ানি",
    "পিজ্জা",
    "বার্গার",
    "ফুচকা",
    "চা",
    "কফি",
    "মাংস",
    "চিকেন",

    "khabar",
    "khete",
    "khabo",
    "khida",
    "biriyani",
    "biryani",
    "pizza",
    "burger",
    "fuchka",
    "cha",
    "coffee"
  ],


  study: [
    "পড়াশোনা",
    "পড়াশোনা",
    "পড়তে",
    "পড়তে",
    "পড়া",
    "পড়া",
    "বই",
    "ক্লাস",
    "হোমওয়ার্ক",
    "অ্যাসাইনমেন্ট",

    "porashona",
    "porashuna",
    "porte",
    "pora",
    "boi",
    "class",
    "homework",
    "assignment",
    "study"
  ],


  exam: [
    "পরীক্ষা",
    "পরিক্ষা",
    "exam",
    "পরীক্ষায়",
    "পরীক্ষায়",
    "রেজাল্ট",
    "ফেল",
    "পাস",
    "নম্বর",
    "marks",
    "hsc",
    "ssc",

    "porikkha",
    "porikha",
    "exam",
    "result",
    "mark"
  ],


  gaming: [
    "গেম",
    "গেমিং",
    "ফ্রি ফায়ার",
    "ফ্রি ফায়ার",
    "free fire",
    "pubg",
    "minecraft",
    "গেম খেল",
    "ম্যাচ",
    "লবি",
    "হেডশট",
    "headshot",
    "rank",

    "game",
    "gaming",
    "freefire",
    "ff",
    "pubg",
    "match",
    "lobby"
  ],


  football: [
    "ফুটবল",
    "football",
    "soccer",
    "গোল",
    "goal",
    "ম্যাচ",
    "player",
    "প্লেয়ার",
    "প্লেয়ার",
    "team",
    "টিম",
    "আর্জেন্টিনা",
    "argentina",
    "মেসি",
    "messi",
    "রোনালদো",
    "ronaldo"
  ],


  weather: [
    "বৃষ্টি",
    "বৃষ্টির",
    "বৃষ্টিতে",
    "বৃষ্টি হচ্ছে",
    "আবহাওয়া",
    "আবহাওয়া",
    "গরম",
    "ঠান্ডা",
    "রোদ",
    "ঝড়",
    "ঝড়",
    "মেঘ",

    "bristi",
    "brishti",
    "rain",
    "raining",
    "weather",
    "gorom",
    "thanda"
  ],


  sleep: [
    "ঘুম",
    "ঘুমাবো",
    "ঘুমাতে",
    "ঘুম পাচ্ছে",
    "রাত জাগা",
    "জেগে আছি",
    "ক্লান্ত",

    "ghum",
    "ghumabo",
    "ghumate",
    "ghum pacche",
    "rat jaga",
    "tired",
    "sleep"
  ],


  money: [
    "টাকা",
    "পয়সা",
    "পয়সা",
    "বেতন",
    "টাকার",
    "দাম",
    "খরচ",
    "ধার",
    "ঋণ",

    "taka",
    "poisa",
    "money",
    "salary",
    "price",
    "khoroch"
  ],


  group: [
    "গ্রুপ",
    "group",
    "চুপচাপ",
    "নীরব",
    "সবাই চুপ",
    "কেউ কথা বলছে না",
    "silent",
    "inactive",

    "group chup",
    "sobai chup",
    "keu kotha bolena"
  ],


  bored: [
    "বোর",
    "বিরক্ত",
    "বিরক্ত লাগছে",
    "একঘেয়ে",
    "একঘেয়েমি",
    "মজা নেই",
    "কিছু করার নেই",

    "boring",
    "bored",
    "bor lagche",
    "boring lagche",
    "time pass"
  ],


  compliment: [
    "সুন্দর",
    "দারুণ",
    "চমৎকার",
    "অসাধারণ",
    "স্মার্ট",
    "handsome",
    "cute",
    "nice",
    "best",
    "great",
    "awesome",

    "sundor",
    "darun",
    "smart",
    "nice"
  ],


  insult: [
    "বোকা",
    "পাগল",
    "গাধা",
    "শালা",
    "বদমাশ",

    "boka",
    "pagol",
    "gadha",
    "shala"
  ]

};


// =========================================================
// EXACT / FLEXIBLE INTENT MATCH
// =========================================================

function detectIntent(text) {

  const q = normalize(text);
  const c = compact(text);

  let best = null;
  let bestScore = 0;


  for (const category of Object.keys(KEYWORDS)) {

    for (const keyword of KEYWORDS[category]) {

      const k = normalize(keyword);
      const kc = compact(keyword);

      if (!k) continue;


      // Exact phrase
      if (q === k) {

        if (5 > bestScore) {

          best = category;
          bestScore = 5;

        }

        continue;
      }


      // Phrase inside sentence
      if (q.includes(k) && k.length >= 4) {

        let score = 3;

        // Longer phrase = stronger
        if (k.length >= 10) score = 4;

        if (score > bestScore) {

          best = category;
          bestScore = score;

        }

      }


      // Compact Banglish matching
      if (
        kc.length >= 5 &&
        c.includes(kc)
      ) {

        let score = 3;

        if (kc.length >= 10) score = 4;

        if (score > bestScore) {

          best = category;
          bestScore = score;

        }

      }

    }

  }


  if (!best) {
    return null;
  }


  return {
    category: best,
    score: bestScore
  };
}


// =========================================================
// SPECIAL FUZZY MATCH
// =========================================================

function fuzzyIntent(text) {

  const q = normalize(text);


  // -----------------------------------------
  // SALAM
  // -----------------------------------------

  if (
    q.includes("salam") ||
    q.includes("assalam") ||
    q.includes("asalam") ||
    q.includes("aslam") ||
    q.includes("সালাম")
  ) {

    return {
      category: "salam",
      score: 5
    };

  }


  // -----------------------------------------
  // HOW ARE YOU
  // -----------------------------------------

  if (
    q.includes("kmn") ||
    q.includes("kemon") ||
    q.includes("khobor") ||
    q.includes("obostha")
  ) {

    return {
      category: "howAreYou",
      score: 4
    };

  }


  // -----------------------------------------
  // NAME
  // -----------------------------------------

  if (
    q.includes("tomar nam") ||
    q.includes("tor nam") ||
    q.includes("nam ki") ||
    q.includes("নাম কি") ||
    q.includes("নাম কী")
  ) {

    return {
      category: "name",
      score: 4
    };

  }


  // -----------------------------------------
  // OWNER
  // -----------------------------------------

  if (
    q.includes("ke ban") ||
    q.includes("ke bana") ||
    q.includes("ke toiri") ||
    q.includes("owner") ||
    q.includes("creator")
  ) {

    return {
      category: "owner",
      score: 4
    };

  }


  // -----------------------------------------
  // JOKE
  // -----------------------------------------

  if (
    q.includes("jok") ||
    q.includes("joke") ||
    q.includes("জোক")
  ) {

    return {
      category: "joke",
      score: 4
    };

  }


  // -----------------------------------------
  // LOVE
  // -----------------------------------------

  if (
    q.includes("valob") ||
    q.includes("bhalob") ||
    q.includes("prem") ||
    q.includes("love") ||
    q.includes("crush")
  ) {

    return {
      category: "love",
      score: 3
    };

  }


  return null;
}


// =========================================================
// SMART RESPONSE
// =========================================================

function getResponse(text, user) {

  let result = detectIntent(text);


  // If normal detector fails,
  // use fuzzy Banglish detector.

  if (!result) {

    result = fuzzyIntent(text);

  }


  if (result) {

    return {
      reply: random(R[result.category]),
      topic: result.category,
      score: result.score
    };

  }


  // =======================================================
  // CONTEXTUAL UNKNOWN
  // =======================================================

  const q = normalize(text);


  // Question
  if (
    text.includes("?") ||
    q.includes("কেন") ||
    q.includes("কীভাবে") ||
    q.includes("কিভাবে") ||
    q.includes("ken") ||
    q.includes("kivabe")
  ) {

    return {
      reply: random([
        "হুম 🤔 প্রশ্নটা interesting। আরেকটু context দাও।",
        "ভালো প্রশ্ন 😌 ব্যাপারটা একটু খুলে বলো।",
        "হুম 👀 তুমি আসলে কী জানতে চাচ্ছো?",
        "একটু বিস্তারিত বলো তো, বুঝতে চাই 😌"
      ]),
      topic: "unknown",
      score: 1
    };

  }


  // Personal statement
  if (
    q.includes("আমি") ||
    q.includes("আমার") ||
    q.includes("আমাকে") ||
    q.includes("ami") ||
    q.includes("amar") ||
    q.includes("amake") ||
    q.includes("i am") ||
    q.includes("i'm")
  ) {

    return {
      reply: random([
        "হুম 😌 বুঝলাম। তারপর কী হলো?",
        "আচ্ছা 👀 তোমার কথাটা শুনছি, বলো।",
        "ওহ! 😯 আরেকটু বলো তো।",
        "বুঝতে পারছি 😌 তারপর?"
      ]),
      topic: "unknown",
      score: 1
    };

  }


  // General
  return {
    reply: random(R.unknown),
    topic: "unknown",
    score: 1
  };

}


// =========================================================
// DIFFERENT REPLY
// =========================================================

function differentReply(reply, topic, previous) {

  if (reply !== previous) {
    return reply;
  }


  const list = R[topic] || R.unknown;

  const alternatives = list.filter(
    x => x !== previous
  );


  if (alternatives.length) {
    return random(alternatives);
  }


  return reply;
}


// =========================================================
// COMMAND: +baby
// =========================================================

module.exports.run = async function ({
  api,
  event,
  args
}) {

  try {

    const text = args.join(" ").trim();


    if (!text) {

      return api.sendMessage(
        "হুম 😌 কিছু বলো, Tum Dum শুনছে 👀❤️",
        event.threadID,
        event.messageID
      );

    }


    const user = getMemory(
      event.threadID,
      event.senderID
    );


    const result = getResponse(
      text,
      user
    );


    const reply = differentReply(
      result.reply,
      result.topic,
      user.lastReply
    );


    user.lastUserText = text;
    user.lastReply = reply;
    user.lastTopic = result.topic;
    user.messages++;


    return api.sendMessage(
      reply,
      event.threadID,
      event.messageID
    );


  } catch (error) {

    console.log(
      "[TUM DUM BABY COMMAND ERROR]",
      error
    );

  }

};


// =========================================================
// HANDLE REPLY
// =========================================================

module.exports.handleReply = async function ({
  api,
  event
}) {

  try {

    if (!event.body) return;


    const text = event.body.trim();

    if (!text) return;


    const user = getMemory(
      event.threadID,
      event.senderID
    );


    const result = getResponse(
      text,
      user
    );


    const reply = differentReply(
      result.reply,
      result.topic,
      user.lastReply
    );


    user.lastUserText = text;
    user.lastReply = reply;
    user.lastTopic = result.topic;
    user.messages++;


    api.sendMessage(
      reply,
      event.threadID,
      event.messageID
    );


  } catch (error) {

    console.log(
      "[TUM DUM BABY REPLY ERROR]",
      error
    );

  }

};


// =========================================================
// DIRECT BOT CALL
// =========================================================

module.exports.handleEvent = async function ({
  api,
  event
}) {

  try {

    if (!event.body) return;


    const original = event.body.trim();

    if (!original) return;


    const text = normalize(original);


    /*
     * Direct-call words.
     *
     * Examples:
     * Tum Dum কেমন আছো
     * Bot assalamualaikum
     * বট জোকস বল
     * baby তোমার নাম কী
     */

    const prefixes = [
      "tum dum",
      "tumdum",
      "bot",
      "বট",
      "baby",
      "বেবি",
      "জান",
      "জানু"
    ];


    let question = null;


    for (const prefix of prefixes) {

      if (text === prefix) {

        question = "";

        break;

      }


      if (text.startsWith(prefix + " ")) {

        question = original
          .slice(prefix.length)
          .trim();

        break;

      }

    }


    // Not talking directly to bot
    if (question === null) {
      return;
    }


    // Just calling bot
    if (!question) {

      return api.sendMessage(
        random([
          "জি 😌 Tum Dum শুনছি 👀",
          "হুম বলো ❤️",
          "Tum Dum হাজির 😎",
          "জি ভাই, বলো কী হয়েছে? 👀"
        ]),
        event.threadID,
        event.messageID
      );

    }


    const user = getMemory(
      event.threadID,
      event.senderID
    );


    const result = getResponse(
      question,
      user
    );


    const reply = differentReply(
      result.reply,
      result.topic,
      user.lastReply
    );


    user.lastUserText = question;
    user.lastReply = reply;
    user.lastTopic = result.topic;
    user.messages++;


    /*
     * Human-like small delay
     */

    const delay =
      Math.floor(Math.random() * 900) + 500;


    setTimeout(() => {

      try {

        api.sendMessage(
          reply,
          event.threadID,
          event.messageID
        );

      } catch (err) {

        console.log(
          "[TUM DUM SEND ERROR]",
          err
        );

      }

    }, delay);


  } catch (error) {

    console.log(
      "[TUM DUM BABY EVENT ERROR]",
      error
    );

  }

};
