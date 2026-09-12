/**
 * =========================================================
 * TUM DUM - SMART CONTEXT AUTO REPLY v5
 * Owner: ইরাম
 * No External API / No AI
 * =========================================================
 */

const BOT_NAME = "Tum Dum";
const OWNER_NAME = "ইরাম";

module.exports.config = {
  name: "autoreply",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "ইরাম",
  description: "Smart context based automatic group replies",
  commandCategory: "Chat",
  usages: "",
  cooldowns: 3,
  prefix: false
};


// =========================================================
// MEMORY
// =========================================================

const users = new Map();
const cooldowns = new Map();
const threadCooldowns = new Map();

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getUser(threadID, senderID) {

  const key = `${threadID}_${senderID}`;

  if (!users.has(key)) {
    users.set(key, {
      messages: 0,
      lastText: "",
      lastReply: "",
      lastCategory: "",
      mood: "normal"
    });
  }

  return users.get(key);
}


// =========================================================
// TEXT NORMALIZER
// =========================================================

function normalize(text) {

  return text
    .toLowerCase()
    .replace(/[!?.,؟,،:;'"`~@#$%^&*()[\]{}<>|\\/+=_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


// =========================================================
// COOLDOWN
// =========================================================

function canReply(threadID, senderID, category, confidence) {

  const now = Date.now();

  const userKey = `${threadID}_${senderID}`;
  const threadKey = threadID;

  const lastUser = cooldowns.get(userKey) || 0;
  const lastThread = threadCooldowns.get(threadKey) || 0;

  // Same user cannot trigger too frequently
  if (now - lastUser < 7000) {
    return false;
  }

  // Prevent group spam
  if (now - lastThread < 3500) {

    // Strong/direct messages can still pass
    if (confidence < 3) {
      return false;
    }
  }

  cooldowns.set(userKey, now);
  threadCooldowns.set(threadKey, now);

  return true;
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

  greeting: [
    "হাই 😌❤️",
    "হ্যালো! 👀",
    "আরে হাই! কী খবর? 😎",
    "ওহে! Tum Dum কিন্তু শুনছে 😌",
    "হুম বলো 😊"
  ],

  howAreYou: [
    "আলহামদুলিল্লাহ ভালো আছি ❤️ তুমি কেমন আছো?",
    "ভালো আছি 😌 তোমার কী খবর?",
    "Tum Dum একদম ফিট 😎🔥 তোমার খবর কী?",
    "আলহামদুলিল্লাহ 😊 সবাই ভালো তো?"
  ],

  good: [
    "বাহ! এভাবেই ভালো থাকো ❤️",
    "শুনে ভালো লাগলো 😌",
    "Nice! 😎🔥",
    "আলহামদুলিল্লাহ ❤️ ভালো থাকাটাই আসল।"
  ],

  sad: [
    "মন খারাপ নাকি? 🥺❤️",
    "সব ঠিক হয়ে যাবে, চিন্তা করো না 🤍",
    "কী হয়েছে? চাইলে বলতে পারো।",
    "মন খারাপ হলে একটু হাসো 😊❤️",
    "খারাপ সময় সবসময় থাকে না। একটু relax করো 🤍"
  ],

  love: [
    "ওহহ! এখানে প্রেমের গন্ধ পাচ্ছি 👀😂❤️",
    "এত ভালোবাসা! Tum Dum লজ্জা পাচ্ছে 🙈",
    "আহা! ❤️ প্রেম জমে গেছে দেখি 😂",
    "প্রেম করতে হলে আগে ইরামের অনুমতি লাগবে 😂"
  ],

  joke: [
    "একটা জোকস শুনবে? 😂\nপরীক্ষায় প্রশ্ন দেখে ছাত্র বললো: স্যার, এই প্রশ্নটা syllabus-এর কোন গ্রুপে? 😭",
    "জীবনে দুইটা জিনিসের দাম বেশি—একটা সময়, আরেকটা ফুচকা! 😂",
    "আমি এতই অলস যে ঘুমানোর আগে অ্যালার্ম দিই, তারপর অ্যালার্ম বন্ধ করে আবার ঘুমাই! 😭😂",
    "শিক্ষক: এত দেরি করে আসলে কেন?\nছাত্র: স্যার, স্বপ্নে দেখলাম স্কুলে চলে এসেছি! 😂"
  ],

  thanks: [
    "Welcome 😌❤️",
    "আরে ধন্যবাদ কেন? 🥰",
    "Anytime 😎",
    "No problem ❤️"
  ],

  insult: [
    "আস্তে ভাই 😂 আমার কিন্তু feelings আছে!",
    "এইভাবে কথা বলো না 🥺😂",
    "গালি দিলে কিন্তু আমি silent mode-এ চলে যাবো 😑",
    "আচ্ছা বাবা, শান্ত হও 😂"
  ],

  bot: [
    "হুম, Tum Dum শুনছি 👀",
    "জি বলো 😌",
    "Tum Dum হাজির 🤖❤️",
    "আমাকে ডাকলে কেন? 😏"
  ],

  owner: [
    `আমাকে তৈরি করেছে ${OWNER_NAME} ❤️`,
    `আমার Owner হলো ${OWNER_NAME} 😎🔥`,
    `${OWNER_NAME} হলো আমার creator 🤖❤️`
  ],

  weather: [
    "বৃষ্টির কথা বলছো? 🌧️ আজকে তো একদম weather mood! 😂",
    "বৃষ্টি হলে বাইরে যাওয়ার চেয়ে চা নিয়ে বসে থাকা ভালো ☕🌧️",
    "আবহাওয়া যদি এমনই থাকে তাহলে একটা ঘুম দেওয়া যায় 😴🌧️",
    "বৃষ্টি + চা = perfect combination ☕❤️"
  ],

  study: [
    "পড়াশোনার ব্যাপার মনে হচ্ছে 😭 একটু একটু করে পড়লে চাপ কমে যাবে।",
    "Exam সামনে হলে এখন থেকেই শুরু করো 😌 শেষ মুহূর্তে সব একসাথে করা কঠিন।",
    "পড়াশোনা কঠিন লাগলেও শুরু করে দাও—১০ মিনিট পরেই mood চলে আসবে 😂",
    "আগে পড়া শেষ করো, তারপর আড্ডা 😎📚"
  ],

  exam: [
    "Exam-এর চিন্তা হচ্ছে নাকি? 😭📚",
    "ভয় পেও না। যেটুকু পারো ভালোভাবে revise করো ❤️",
    "শেষ মুহূর্তের পড়াও অনেক কাজে দেয় 😌📚",
    "Exam আর আড্ডা—দুটার balance রাখতে হবে 😂"
  ],

  food: [
    "খাবারের কথা উঠলেই আমারও খিদা লাগে 🤤😂",
    "কী খেতে ইচ্ছা করছে? 👀🍔",
    "খাবার হলে Tum Dum-কে ভুলে যেও না 😂❤️",
    "বিরিয়ানি হলে কিন্তু আমাকে ডাকতেই হবে 🤤🔥"
  ],

  sleep: [
    "ঘুম পাচ্ছে নাকি? 😴 ফোনটা একটু নামিয়ে ঘুমিয়ে পড়ো 😂",
    "ঘুম ঠিকমতো হওয়া দরকার কিন্তু 😌",
    "আর কত রাত জাগবে? 😂 এবার ঘুমাও!",
    "ঘুমের সাথে কোনো compromise না 😴❤️"
  ],

  work: [
    "কাজের চাপ মনে হচ্ছে 😅 একটু break নিলে মাথা fresh হবে।",
    "কাজ থাকলে আগে কাজ শেষ করো, তারপর আড্ডা 😎",
    "Busy life! 😂 একটু নিজের জন্যও সময় রেখো।"
  ],

  money: [
    "টাকার কথা উঠলেই সবাই serious হয়ে যায় 😂💸",
    "টাকা থাকলে problem কম, কিন্তু tension একেবারে শেষ হয় না 😅",
    "আহা টাকা! জীবনের চিরন্তন topic 😂💸"
  ],

  gaming: [
    "Game খেলতে যাচ্ছো নাকি? 🎮🔥",
    "একটা match জিতে আসো তারপর আড্ডা 😎",
    "Gaming mood detected 🎮😂",
    "হারলে কিন্তু blame internet দিও না 😂"
  ],

  football: [
    "ফুটবল! ⚽🔥 এই topic-এ আড্ডা জমতে সময় লাগে না 😂",
    "Football নিয়ে তর্ক শুরু হলে আজকে group আর শান্ত থাকবে না 😂⚽",
    "কে কোন team support করে সেটা বলো দেখি 👀⚽"
  ],

  group: [
    "গ্রুপটা আজকে একটু চুপচাপ মনে হচ্ছে 👀",
    "সবাই কি ঘুমিয়ে গেছে নাকি? 😂",
    "এত নীরবতা কেন? কেউ একটা topic ধরো 😌",
    "Group এতো silent কেন ভাই 😭😂"
  ],

  boredom: [
    "বোর লাগছে নাকি? 😂 একটা জোকস শুনবে?",
    "চলো একটু আড্ডা দিই 😎",
    "বোর হলে group-এ একটা interesting topic ছুড়ে দাও 👀",
    "একঘেয়েমি কাটাতে একটা game শুরু করা যায় 😂"
  ],

  compliment: [
    "আরে বাহ 😳 এত প্রশংসা করলে কিন্তু আমি famous হয়ে যাবো 😂❤️",
    "ধন্যবাদ 😌❤️",
    "Tum Dum আজকে একটু বেশি খুশি হয়ে গেলো 😂",
    "এমন কথা শুনলে আমার reply দেওয়ার speed বেড়ে যায় 😎"
  ],

  angry: [
    "রাগ কোরো না ভাই 😅 একটু শান্ত হও।",
    "মাথা ঠান্ডা রাখো 🤍 রাগের সময় decision না নেওয়াই ভালো।",
    "কে রাগিয়েছে তোমাকে? 👀😂",
    "আচ্ছা শান্ত হও 😌 সব ঠিক হয়ে যাবে।"
  ],

  relationship: [
    "এই topic তো dangerous 👀😂",
    "প্রেমের ব্যাপার মনে হচ্ছে 😏❤️",
    "সবকিছু ঠিকঠাক থাকলে প্রেম সুন্দর, আর না হলে group-এর আড্ডা জমে 😂",
    "কার কথা মনে পড়ছে বলো দেখি 👀"
  ],

  unknown: [
    "হুম 👀 কথাটা interesting লাগলো। আরেকটু বলো তো?",
    "আচ্ছা 😌 তারপর কী হলো?",
    "হুমম... বুঝতে পারছি 😅 কিন্তু ব্যাপারটা একটু খুলে বলো।",
    "ওহ! 👀 এই বিষয়টা নিয়ে আরো শুনতে চাই।",
    "আচ্ছা 😂 তোমার কথাটা ধরলাম। তারপর?",
    "হুম 😌 তুমি আসলে কী বোঝাতে চাচ্ছো?"
  ]

};


// =========================================================
// TOPIC KEYWORDS
// =========================================================

const TOPICS = {

  weather: [
    "বৃষ্টি",
    "বৃষ্টির",
    "বৃষ্টিতে",
    "বৃষ্টি হচ্ছে",
    "rain",
    "raining",
    "weather",
    "আবহাওয়া",
    "আবহাওয়া",
    "গরম",
    "ঠান্ডা",
    "রোদ",
    "ঝড়",
    "ঝড়",
    "মেঘ"
  ],

  study: [
    "পড়াশোনা",
    "পড়াশোনা",
    "পড়তে",
    "পড়তে",
    "পড়া",
    "পড়া",
    "study",
    "studying",
    "বই",
    "খাতা",
    "হোমওয়ার্ক",
    "homework",
    "assignment",
    "class",
    "ক্লাস",
    "স্যার",
    "ম্যাডাম"
  ],

  exam: [
    "পরীক্ষা",
    "পরিক্ষা",
    "exam",
    "examination",
    "hsc",
    "ssc",
    "result",
    "রেজাল্ট",
    "পরীক্ষায়",
    "পরীক্ষায়",
    "ফেল",
    "পাস",
    "marks",
    "নম্বর"
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
    "pizza",
    "burger",
    "বার্গার",
    "ফুচকা",
    "চা",
    "কফি",
    "coffee",
    "rice",
    "ভাত",
    "মাংস",
    "চিকেন"
  ],

  sleep: [
    "ঘুম",
    "ঘুমাবো",
    "ঘুমাতে",
    "ঘুমাই",
    "ঘুম পাচ্ছে",
    "ঘুমাইতে",
    "sleep",
    "sleeping",
    "tired",
    "ক্লান্ত",
    "রাত জাগা",
    "জেগে"
  ],

  work: [
    "কাজ",
    "চাকরি",
    "অফিস",
    "job",
    "work",
    "working",
    "busy",
    "ব্যস্ত",
    "কাজ করছি",
    "ডিউটি",
    "duty"
  ],

  money: [
    "টাকা",
    "পয়সা",
    "পয়সা",
    "money",
    "cash",
    "বেতন",
    "salary",
    "দাম",
    "price",
    "খরচ",
    "ঋণ",
    "ধার"
  ],

  gaming: [
    "গেম",
    "গেমিং",
    "game",
    "gaming",
    "free fire",
    "ফ্রি ফায়ার",
    "ফ্রি ফায়ার",
    "pubg",
    "minecraft",
    "rank",
    "র‍্যাঙ্ক",
    "match",
    "ম্যাচ",
    "লবি",
    "kill",
    "headshot"
  ],

  football: [
    "ফুটবল",
    "football",
    "soccer",
    "goal",
    "গোল",
    "ম্যাচ",
    "player",
    "প্লেয়ার",
    "প্লেয়ার",
    "team",
    "টিম",
    "argentina",
    "আর্জেন্টিনা",
    "messi",
    "মেসি",
    "ronaldo",
    "রোনালদো"
  ],

  group: [
    "গ্রুপ",
    "group",
    "চুপচাপ",
    "নীরব",
    "silent",
    "কেউ কথা",
    "কথা বলছে না",
    "সবাই চুপ",
    "কেউ নেই",
    "inactive"
  ],

  boredom: [
    "বোর",
    "boring",
    "bored",
    "একঘেয়ে",
    "একঘেয়েমি",
    "বিরক্ত",
    "বিরক্ত লাগছে",
    "মজা নেই",
    "কিছু করার নেই",
    "সময় যাচ্ছে না",
    "time pass"
  ],

  relationship: [
    "প্রেম",
    "ভালোবাসা",
    "ভালবাসা",
    "ভালোবাসি",
    "ভালবাসি",
    "প্রেমিকা",
    "প্রেমিক",
    "girlfriend",
    "boyfriend",
    "crush",
    "love",
    "miss you",
    "মিস করি",
    "মনে পড়ে",
    "মনে পড়ে"
  ],

  compliment: [
    "সুন্দর",
    "সুন্দরী",
    "ভালো",
    "দারুণ",
    "চমৎকার",
    "অসাধারণ",
    "smart",
    "handsome",
    "cute",
    "nice",
    "best",
    "great",
    "awesome"
  ],

  angry: [
    "রাগ",
    "রাগছি",
    "রাগ লাগছে",
    "ক্ষিপ্ত",
    "angry",
    "mad",
    "hate",
    "ঘৃণা",
    "সহ্য হচ্ছে না"
  ],

  sad: [
    "মন খারাপ",
    "কষ্ট",
    "কষ্ট হচ্ছে",
    "দুঃখ",
    "দুঃখিত",
    "কাঁদছি",
    "কান্না",
    "একাকী",
    "একা লাগছে",
    "sad",
    "depressed",
    "lonely"
  ]

};


// =========================================================
// BASIC DETECTION
// =========================================================

function detectBasic(q) {

  if (
    q.includes("আসসালামু আলাইকুম") ||
    q.includes("assalamu alaikum") ||
    q === "সালাম" ||
    q === "salam"
  ) {
    return {
      category: "salam",
      confidence: 5
    };
  }


  if (
    q === "hi" ||
    q === "hello" ||
    q === "hey" ||
    q === "হাই" ||
    q === "হ্যালো"
  ) {
    return {
      category: "greeting",
      confidence: 5
    };
  }


  if (
    q.includes("কেমন আছো") ||
    q.includes("কেমন আছেন") ||
    q.includes("কী খবর") ||
    q.includes("কি খবর") ||
    q.includes("how are you")
  ) {
    return {
      category: "howAreYou",
      confidence: 5
    };
  }


  if (
    q.includes("좋") ||
    q.includes("ভালো আছি") ||
    q.includes("ভাল আছি") ||
    q === "good" ||
    q === "fine" ||
    q.includes("আলহামদুলিল্লাহ")
  ) {
    return {
      category: "good",
      confidence: 4
    };
  }


  if (
    q.includes("জোক") ||
    q.includes("জোকস") ||
    q.includes("joke") ||
    q.includes("মজা কর")
  ) {
    return {
      category: "joke",
      confidence: 5
    };
  }


  if (
    q.includes("ধন্যবাদ") ||
    q.includes("thanks") ||
    q.includes("thank you")
  ) {
    return {
      category: "thanks",
      confidence: 5
    };
  }


  if (
    q.includes("ভালোবাসি") ||
    q.includes("ভালবাসি") ||
    q.includes("i love you") ||
    q.includes("love you") ||
    q.includes("লাভ ইউ")
  ) {
    return {
      category: "love",
      confidence: 5
    };
  }


  if (
    q.includes("বোকা") ||
    q.includes("পাগল") ||
    q.includes("শালা") ||
    q.includes("গাধা")
  ) {
    return {
      category: "insult",
      confidence: 4
    };
  }


  if (
    q.includes("tum dum") ||
    q.includes("tumdum") ||
    q.includes("বট") ||
    q.includes("baby")
  ) {
    return {
      category: "bot",
      confidence: 5
    };
  }


  if (
    q.includes("কে বানিয়েছে") ||
    q.includes("কে বানাইছে") ||
    q.includes("তোমাকে কে বানিয়েছে") ||
    q.includes("owner কে") ||
    q.includes("তোমার মালিক কে") ||
    q.includes("who made you") ||
    q.includes("who is your owner")
  ) {
    return {
      category: "owner",
      confidence: 5
    };
  }


  return null;
}


// =========================================================
// SMART TOPIC SCORING
// =========================================================

function detectTopic(text) {

  const q = normalize(text);

  let results = [];

  for (const category of Object.keys(TOPICS)) {

    let score = 0;

    for (const keyword of TOPICS[category]) {

      const k = normalize(keyword);

      if (!k) continue;

      if (q.includes(k)) {

        // Long phrases are stronger matches
        if (k.includes(" ")) {
          score += 3;
        } else {
          score += 1;
        }
      }
    }

    if (score > 0) {

      results.push({
        category,
        score
      });

    }
  }

  results.sort((a, b) => b.score - a.score);

  if (!results.length) {
    return null;
  }

  return results[0];
}


// =========================================================
// UNKNOWN MESSAGE HANDLER
// =========================================================

function unknownReply(text) {

  const clean = text.trim();

  // Question-like message
  if (
    clean.includes("?") ||
    clean.includes("কেন") ||
    clean.includes("কীভাবে") ||
    clean.includes("কিভাবে") ||
    clean.includes("কি") ||
    clean.includes("কী")
  ) {

    return random([
      "হুম 👀 প্রশ্নটা interesting। তুমি আসলে কী জানতে চাচ্ছো একটু খুলে বলো?",
      "ভালো প্রশ্ন 😌 আরেকটু context দিলে ভালোভাবে বুঝতে পারবো।",
      "হুমম 🤔 ব্যাপারটা একটু explain করো তো।"
    ]);

  }


  // Personal statement
  if (
    clean.includes("আমি") ||
    clean.includes("আমার") ||
    clean.includes("আমাকে") ||
    clean.includes("i am") ||
    clean.includes("i'm") ||
    clean.includes("my")
  ) {

    return random([
      "হুম 😌 বুঝলাম। তারপর কী হলো?",
      "আচ্ছা 👀 তোমার কথাটা শুনছি, বলো।",
      "ওহ! 😯 আরেকটু বলো তো।",
      "বুঝতে পারছি 😌 তারপর?"
    ]);

  }


  // Group-related conversation
  if (
    clean.includes("ভাই") ||
    clean.includes("bro") ||
    clean.includes("দোস্ত") ||
    clean.includes("বন্ধু")
  ) {

    return random([
      "হুম ভাই 😎 বলো কী খবর?",
      "বলো দোস্ত 😂 কী অবস্থা?",
      "জি ভাই 😌 Tum Dum শুনছে।"
    ]);

  }


  // General fallback
  return random(R.unknown);
}


// =========================================================
// MAIN SMART DETECTOR
// =========================================================

function detect(text) {

  const q = normalize(text);

  if (!q) {
    return null;
  }


  // First priority: exact conversational intents

  const basic = detectBasic(q);

  if (basic) {

    return {
      reply: random(R[basic.category]),
      category: basic.category,
      confidence: basic.confidence
    };

  }


  // Second priority: topic detection

  const topic = detectTopic(text);

  if (topic) {

    const replies = R[topic.category];

    if (replies && replies.length) {

      return {
        reply: random(replies),
        category: topic.category,
        confidence: Math.min(topic.score + 1, 5)
      };

    }

  }


  // Third priority: unknown/contextual reply

  return {
    reply: unknownReply(text),
    category: "unknown",
    confidence: 1
  };
}


// =========================================================
// SHOULD REPLY TO UNKNOWN MESSAGE?
// =========================================================

function shouldReplyUnknown(text) {

  const q = normalize(text);

  // Direct conversational signals
  const signals = [
    "আমি",
    "আমার",
    "আমাকে",
    "কেউ",
    "ভাই",
    "দোস্ত",
    "বন্ধু",
    "আজ",
    "কাল",
    "এখন",
    "কেন",
    "কী",
    "কি",
    "হুম",
    "হাহা",
    "haha",
    "lol",
    "bro",
    "help",
    "please"
  ];

  for (const word of signals) {

    if (q.includes(word)) {
      return true;
    }

  }


  // Question mark
  if (
    text.includes("?") ||
    text.includes("؟")
  ) {
    return true;
  }


  /*
   * Unknown random messages:
   * only occasionally reply so group does not get spammed.
   */
  return Math.random() < 0.12;
}


// =========================================================
// EVENT
// =========================================================

module.exports.handleEvent = async function ({
  api,
  event
}) {

  try {

    if (!event.body) return;
    if (!event.threadID) return;
    if (!event.senderID) return;

    const text = event.body.trim();

    if (!text) return;

    // Ignore very long messages
    if (text.length > 300) return;


    // Ignore commands
    if (
      text.startsWith("+") ||
      text.startsWith("/") ||
      text.startsWith("!")
    ) {
      return;
    }


    // Ignore bot-generated style messages
    if (
      text.startsWith("Tum Dum:") ||
      text.startsWith("BOT:")
    ) {
      return;
    }


    /*
     * If directly talking to the bot,
     * baby.js can handle it.
     *
     * This prevents baby.js + autoreply.js
     * from replying twice.
     */

    const lower = text.toLowerCase();

    if (
      lower.startsWith("tum dum ") ||
      lower.startsWith("tumdum ") ||
      lower.startsWith("bot ") ||
      lower.startsWith("বট ") ||
      lower.startsWith("baby ") ||
      lower.startsWith("জান ") ||
      lower.startsWith("জানু ")
    ) {
      return;
    }


    const result = detect(text);

    if (!result) return;


    // Unknown messages need extra protection
    if (
      result.category === "unknown" &&
      !shouldReplyUnknown(text)
    ) {
      return;
    }


    if (
      !canReply(
        event.threadID,
        event.senderID,
        result.category,
        result.confidence
      )
    ) {
      return;
    }


    const user = getUser(
      event.threadID,
      event.senderID
    );


    /*
     * Prevent exact duplicate response
     */

    let finalReply = result.reply;

    if (
      user.lastReply === finalReply
    ) {

      const alternatives = R[result.category] || R.unknown;

      const different = alternatives.filter(
        x => x !== user.lastReply
      );

      if (different.length) {
        finalReply = random(different);
      }

    }


    /*
     * Save memory
     */

    user.lastText = text;
    user.lastReply = finalReply;
    user.lastCategory = result.category;
    user.messages++;


    /*
     * Human-like delay
     */

    let delay;

    if (result.confidence >= 4) {

      delay =
        Math.floor(Math.random() * 900) + 600;

    } else {

      delay =
        Math.floor(Math.random() * 1500) + 900;

    }


    setTimeout(() => {

      try {

        api.sendMessage(
          finalReply,
          event.threadID,
          event.messageID
        );

      } catch (err) {
        // Silent
      }

    }, delay);


  } catch (error) {
    // Silent error
  }

};
