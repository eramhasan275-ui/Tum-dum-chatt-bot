/**
 * ============================================
 * TUM DUM - ADVANCED BABY CHAT
 * Owner: ইরাম
 * No External API
 * ============================================
 */

const BOT_NAME = "Tum Dum";
const OWNER_NAME = "ইরাম";

module.exports.config = {
  name: "baby",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "ইরাম",
  description: "Advanced manual conversation system",
  commandCategory: "Chat",
  usages: "[message]",
  cooldowns: 1,
  prefix: true
};


// ============================================
// MEMORY
// ============================================

const conversationMemory = new Map();

function getMemory(threadID, userID) {
  const key = `${threadID}_${userID}`;

  if (!conversationMemory.has(key)) {
    conversationMemory.set(key, {
      lastMessage: "",
      lastReply: "",
      mood: "normal",
      messages: 0
    });
  }

  return conversationMemory.get(key);
}


// ============================================
// RANDOM
// ============================================

function random(array) {
  return array[Math.floor(Math.random() * array.length)];
}


// ============================================
// RESPONSE DATABASE
// ============================================

const DB = {

  salam: [
    "ওয়ালাইকুমুস সালাম ওয়া রহমাতুল্লাহ 🌸❤️",
    "ওয়ালাইকুমুস সালাম 😊 Tum Dum হাজির!",
    "ওয়ালাইকুমুস সালাম 💚 কেমন আছো?",
    "ওয়ালাইকুমুস সালাম 🌺 আল্লাহ তোমাকে ভালো রাখুন।"
  ],

  hello: [
    "হুম বলো 😌❤️",
    "জি, Tum Dum শুনছি 👀",
    "হ্যালো! 😎 কেমন আছো?",
    "আরে হাই! 🥰 কী খবর?",
    "বলো বন্ধু, কী নিয়ে আড্ডা হবে? 😌"
  ],

  howAreYou: [
    "আলহামদুলিল্লাহ ভালো আছি 😊 তুমি কেমন আছো?",
    "Tum Dum একদম ফিট 😎🔥 তোমার কী খবর?",
    "ভালো আছি ❤️ তোমার খবর বলো।",
    "আলহামদুলিল্লাহ 😌 তোমার সাথে কথা বললেই ভালো লাগে।"
  ],

  name: [
    `আমার নাম ${BOT_NAME} 🤖❤️`,
    `${BOT_NAME} — তোমাদের আড্ডার ছোট্ট বন্ধু 😎`,
    `নাম আমার ${BOT_NAME} 😌✨`
  ],

  owner: [
    `আমাকে বানিয়েছে ${OWNER_NAME} ❤️`,
    `আমার Owner হলো ${OWNER_NAME} 😎🔥`,
    `${OWNER_NAME} আমাকে তৈরি করেছে 🤖✨`
  ],

  love: [
    "আহা! এত ভালোবাসা কোথায় রাখবো আমি? 🙈❤️",
    "Tum Dum লজ্জা পেয়ে গেল 🙈😂❤️",
    "Love you too 😌❤️ তবে ইরাম জানতে পারলে কিন্তু খবর আছে 😂",
    "এভাবে বললে তো আমি সত্যিই প্রেমে পড়ে যাবো 😭❤️"
  ],

  miss: [
    "আমাকেও মিস করছিলে নাকি? 🥺❤️",
    "Tum Dum তো এখানেই ছিল 😌",
    "আহা! এত মিস কেন? 🙈",
    "আমি কিন্তু তোমাকে দেখছিলাম 👀😂"
  ],

  joke: [
    "শিক্ষক: সবচেয়ে অলস প্রাণী কোনটা?\nছাত্র: মানুষ স্যার! ঘুমানোর জন্যও অ্যালার্ম সেট করে! 😂",
    "মা: সারাদিন ফোন চালাস কেন?\nআমি: ফোনটা নিজে নিজেই চালু থাকে মা! 😭📱😂",
    "বন্ধু: তুই এত খাস কেন?\nআমি: খাবারের প্রতি আমার ভালোবাসা সত্যিকারের! 🍔😂",
    "ডাক্তার: আপনার সমস্যা কী?\nরোগী: টাকা নেই ডাক্তার!\nডাক্তার: এই রোগের চিকিৎসা আমার কাছে নেই! 😂"
  ],

  sad: [
    "মন খারাপ করো না 🥺❤️ সব ঠিক হয়ে যাবে।",
    "কী হয়েছে? চাইলে Tum Dum-এর সাথে কথা বলতে পারো 🤍",
    "খারাপ সময় চিরদিন থাকে না 🌸",
    "একটু হাসো 😊 জীবনটা এখনো অনেক সুন্দর।"
  ],

  angry: [
    "আচ্ছা আচ্ছা রাগ করো না 😭❤️",
    "শান্ত হও 😌 আগে একটা জোকস শুনো 😂",
    "এত রাগ করলে কিন্তু Tum Dum ভয় পেয়ে যাবে 🥺",
    "ঠিক আছে, আমার ভুল হলে sorry 😌❤️"
  ],

  thanks: [
    "Welcome 😌❤️",
    "আরে ধন্যবাদ দেওয়ার কী আছে! 🥰",
    "Anytime 😎❤️",
    "তোমার জন্য সবসময় হাজির 🤖"
  ],

  compliment: [
    "আহা! এত প্রশংসা করলে আমি famous হয়ে যাবো 😎😂",
    "ধন্যবাদ 🥰❤️",
    "এই কথাটা কিন্তু আমার খুব ভালো লেগেছে 😌",
    "তুমিও কম সুন্দর কথা বলো না কিন্তু 🙈"
  ],

  bye: [
    "আচ্ছা, পরে কথা হবে 👋❤️",
    "ঠিক আছে, ভালো থেকো 😌",
    "আল্লাহ হাফেজ 🌸❤️",
    "Bye bye 😎 আবার আসো!"
  ],

  unknown: [
    "হুম 🤔 একটু বুঝিয়ে বলো তো?",
    "এই কথাটার উত্তর আমার database-এ নেই 😅",
    "Interesting 👀 আরেকটু বলো।",
    "হুমম... Tum Dum ভাবছে 🤔😂",
    "এই ব্যাপারটা নিয়ে তোমার কী মত? 😌"
  ]
};


// ============================================
// SMART RESPONSE ENGINE
// ============================================

function getResponse(text, memory) {

  const q = text
    .toLowerCase()
    .replace(/[!?.,؟]/g, "")
    .trim();


  // SALAM
  if (
    q.includes("আসসালামু আলাইকুম") ||
    q.includes("assalamu alaikum") ||
    q === "salam" ||
    q === "সালাম"
  ) {
    memory.mood = "happy";
    return random(DB.salam);
  }


  // GREETING
  if (
    q === "hi" ||
    q === "hello" ||
    q === "hey" ||
    q === "হাই" ||
    q === "হ্যালো" ||
    q.includes("কেমন চলছে")
  ) {
    return random(DB.hello);
  }


  // HOW ARE YOU
  if (
    q.includes("কেমন আছো") ||
    q.includes("কেমন আছেন") ||
    q.includes("কেমন আছিস") ||
    q.includes("how are you") ||
    q.includes("how r u") ||
    q.includes("কি খবর") ||
    q.includes("কী খবর")
  ) {
    return random(DB.howAreYou);
  }


  // NAME
  if (
    q.includes("তোমার নাম") ||
    q.includes("তুই কে") ||
    q.includes("তুমি কে") ||
    q.includes("who are you") ||
    q.includes("your name") ||
    q.includes("নাম কি")
  ) {
    return random(DB.name);
  }


  // OWNER
  if (
    q.includes("কে বানিয়েছে") ||
    q.includes("কে বানাইছে") ||
    q.includes("কে বানিয়েছে") ||
    q.includes("তোমাকে কে বানিয়েছে") ||
    q.includes("তোমাকে কে বানাইছে") ||
    q.includes("who made you") ||
    q.includes("who created you") ||
    q.includes("owner কে") ||
    q.includes("তোমার মালিক")
  ) {
    return random(DB.owner);
  }


  // LOVE
  if (
    q.includes("ভালোবাসি") ||
    q.includes("ভালবাসি") ||
    q.includes("i love you") ||
    q.includes("love you") ||
    q.includes("লাভ ইউ")
  ) {
    memory.mood = "love";
    return random(DB.love);
  }


  // MISS
  if (
    q.includes("মিস করছি") ||
    q.includes("মিস করি") ||
    q.includes("miss you") ||
    q.includes("miss u")
  ) {
    return random(DB.miss);
  }


  // JOKE
  if (
    q.includes("জোক") ||
    q.includes("জোকস") ||
    q.includes("joke") ||
    q.includes("jokes") ||
    q.includes("কৌতুক") ||
    q.includes("মজার কথা")
  ) {
    return random(DB.joke);
  }


  // SAD
  if (
    q.includes("মন খারাপ") ||
    q.includes("খারাপ লাগছে") ||
    q.includes("দুঃখ") ||
    q.includes("কষ্ট") ||
    q.includes("sad")
  ) {
    memory.mood = "sad";
    return random(DB.sad);
  }


  // ANGRY
  if (
    q.includes("রাগ") ||
    q.includes("angry") ||
    q.includes("গালি")
  ) {
    memory.mood = "angry";
    return random(DB.angry);
  }


  // THANKS
  if (
    q.includes("ধন্যবাদ") ||
    q.includes("thanks") ||
    q.includes("thank you") ||
    q === "tnx"
  ) {
    return random(DB.thanks);
  }


  // COMPLIMENT
  if (
    q.includes("সুন্দর") ||
    q.includes("স্মার্ট") ||
    q.includes("best bot") ||
    q.includes("সেরা bot") ||
    q.includes("ভালো bot")
  ) {
    return random(DB.compliment);
  }


  // BYE
  if (
    q === "bye" ||
    q.includes("বিদায়") ||
    q.includes("বিদায়") ||
    q.includes("আল্লাহ হাফেজ")
  ) {
    return random(DB.bye);
  }


  return random(DB.unknown);
}


// ============================================
// COMMAND
// ============================================

module.exports.run = async function ({
  api,
  event,
  args,
  Users
}) {

  try {

    const query = args.join(" ").trim();

    const memory = getMemory(
      event.threadID,
      event.senderID
    );

    memory.messages++;
    memory.lastMessage = query;


    if (!query) {

      return api.sendMessage(
        random(DB.hello),
        event.threadID,
        event.messageID
      );

    }


    const answer = getResponse(query, memory);

    memory.lastReply = answer;

    return api.sendMessage(
      answer,
      event.threadID,
      event.messageID
    );

  } catch (error) {

    return api.sendMessage(
      "একটু সমস্যা হয়েছে 😅 আবার বলো।",
      event.threadID,
      event.messageID
    );

  }
};


// ============================================
// REPLY HANDLER
// ============================================

module.exports.handleReply = async function ({
  api,
  event,
  handleReply
}) {

  try {

    if (!event.body) return;

    const text = event.body.trim();

    if (!text) return;


    const memory = getMemory(
      event.threadID,
      event.senderID
    );

    memory.lastMessage = text;
    memory.messages++;


    const answer = getResponse(
      text,
      memory
    );

    memory.lastReply = answer;


    return api.sendMessage(
      answer,
      event.threadID,
      event.messageID
    );

  } catch (error) {
    // silent
  }
};


// ============================================
// HANDLE EVENT
// ============================================

module.exports.handleEvent = async function ({
  api,
  event
}) {

  try {

    if (!event.body) return;

    const raw = event.body.trim();

    if (!raw) return;


    const lower = raw.toLowerCase();


    const names = [
      "baby",
      "bby",
      "bot",
      "বট",
      "বেবি",
      "জান",
      "জানু",
      "tum dum",
      "tumdum"
    ];


    // ONLY BOT NAME
    if (names.includes(lower)) {

      return api.sendMessage(
        random(DB.hello),
        event.threadID,
        event.messageID
      );

    }


    // BOT + MESSAGE
    const prefixRegex =
      /^(baby|bby|bot|বট|বেবি|জান|জানু|tum dum|tumdum)\s+/i;


    if (prefixRegex.test(raw)) {

      const query = raw
        .replace(prefixRegex, "")
        .trim();


      if (!query) return;


      const memory = getMemory(
        event.threadID,
        event.senderID
      );


      const answer = getResponse(
        query,
        memory
      );


      memory.lastMessage = query;
      memory.lastReply = answer;
      memory.messages++;


      return api.sendMessage(
        answer,
        event.threadID,
        event.messageID
      );

    }

  } catch (error) {
    // silent
  }
};
