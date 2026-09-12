/**
 * ============================================
 * TUM DUM - SMART AUTO REPLY
 * Owner: ইরাম
 * No External API
 * ============================================
 */

const BOT_NAME = "Tum Dum";
const OWNER_NAME = "ইরাম";

module.exports.config = {
  name: "autoreply",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "ইরাম",
  description: "Smart human-like automatic group replies",
  commandCategory: "Chat",
  usages: "",
  cooldowns: 3,
  prefix: false
};


// ============================================
// MEMORY + COOLDOWN
// ============================================

const users = new Map();
const cooldowns = new Map();

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
      mood: "normal"
    });

  }

  return users.get(key);
}


function canReply(threadID, senderID) {

  const key = `${threadID}_${senderID}`;
  const now = Date.now();

  const last = cooldowns.get(key) || 0;

  // 7 seconds per user
  if (now - last < 7000) {
    return false;
  }

  cooldowns.set(key, now);

  return true;
}


// ============================================
// REPLY DATABASE
// ============================================

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
    "আলহামদুলিল্লাহ ভালো আছি ❤️ তুমি?",
    "ভালো আছি 😌 তোমার কী খবর?",
    "Tum Dum একদম ফিট 😎🔥",
    "আলহামদুলিল্লাহ 😊 সবাই ভালো তো?"
  ],


  good: [
    "বাহ! এভাবেই ভালো থাকো ❤️",
    "শুনে ভালো লাগলো 😌",
    "Nice! 😎🔥",
    "আলহামদুলিল্লাহ ❤️"
  ],


  sad: [
    "মন খারাপ নাকি? 🥺❤️",
    "সব ঠিক হয়ে যাবে, চিন্তা করো না 🤍",
    "কী হয়েছে? চাইলে বলতে পারো।",
    "মন খারাপ হলে একটু হাসো 😊❤️"
  ],


  love: [
    "ওহহ! এখানে প্রেমের গন্ধ পাচ্ছি 👀😂❤️",
    "এত ভালোবাসা! Tum Dum লজ্জা পাচ্ছে 🙈",
    "প্রেম করতে হলে আগে ইরামের অনুমতি লাগবে 😂",
    "আহা ❤️"
  ],


  joke: [
    "একটা জোকস শুনবে? 😂\nপরীক্ষায় প্রশ্ন দেখে ছাত্র বললো: স্যার, এই প্রশ্নটা syllabus-এর কোন গ্রুপে? 😭",
    "জীবনে দুইটা জিনিসের দাম বেশি—একটা সময়, আরেকটা ফুচকা! 😂",
    "আমি এতই অলস যে ঘুমানোর আগে অ্যালার্ম দিই, তারপর অ্যালার্ম বন্ধ করে আবার ঘুমাই! 😭😂"
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
    `${OWNER_NAME} হলো আমার creator 🤖`
  ]

};


// ============================================
// SMART MATCH
// ============================================

function detect(text) {

  const q = text
    .toLowerCase()
    .replace(/[!?.,؟]/g, "")
    .trim();


  // SALAM
  if (
    q.includes("আসসালামু আলাইকুম") ||
    q.includes("assalamu alaikum") ||
    q === "সালাম" ||
    q === "salam"
  ) {
    return random(R.salam);
  }


  // GREETING
  if (
    q === "hi" ||
    q === "hello" ||
    q === "hey" ||
    q === "হাই" ||
    q === "হ্যালো" ||
    q === "হাই সবাই"
  ) {
    return random(R.greeting);
  }


  // HOW ARE YOU
  if (
    q.includes("কেমন আছো") ||
    q.includes("কেমন আছেন") ||
    q.includes("how are you") ||
    q.includes("কী খবর") ||
    q.includes("কি খবর")
  ) {
    return random(R.howAreYou);
  }


  // GOOD
  if (
    q.includes("ভালো আছি") ||
    q.includes("ভাল আছি") ||
    q === "good" ||
    q === "fine" ||
    q.includes("আলহামদুলিল্লাহ")
  ) {
    return random(R.good);
  }


  // SAD
  if (
    q.includes("মন খারাপ") ||
    q.includes("খারাপ লাগছে") ||
    q.includes("কষ্ট হচ্ছে") ||
    q.includes("দুঃখ") ||
    q.includes("sad")
  ) {
    return random(R.sad);
  }


  // LOVE
  if (
    q.includes("ভালোবাসি") ||
    q.includes("ভালবাসি") ||
    q.includes("i love you") ||
    q.includes("love you") ||
    q.includes("লাভ ইউ")
  ) {
    return random(R.love);
  }


  // JOKE
  if (
    q.includes("জোক") ||
    q.includes("জোকস") ||
    q.includes("joke") ||
    q.includes("মজা কর")
  ) {
    return random(R.joke);
  }


  // THANKS
  if (
    q.includes("ধন্যবাদ") ||
    q.includes("thanks") ||
    q.includes("thank you")
  ) {
    return random(R.thanks);
  }


  // INSULT
  if (
    q.includes("বোকা") ||
    q.includes("পাগল") ||
    q.includes("শালা") ||
    q.includes("গাধা")
  ) {
    return random(R.insult);
  }


  // BOT NAME
  if (
    q.includes("tum dum") ||
    q.includes("tumdum") ||
    q.includes("বট") ||
    q.includes("baby")
  ) {
    return random(R.bot);
  }


  // OWNER
  if (
    q.includes("কে বানিয়েছে") ||
    q.includes("কে বানাইছে") ||
    q.includes("তোমাকে কে বানিয়েছে") ||
    q.includes("owner কে") ||
    q.includes("তোমার মালিক কে")
  ) {
    return random(R.owner);
  }


  return null;
}


// ============================================
// EVENT
// ============================================

module.exports.handleEvent = async function ({
  api,
  event
}) {

  try {

    if (!event.body) return;

    const text = event.body.trim();

    if (!text) return;


    // Ignore very long messages
    if (text.length > 180) return;


    // Ignore commands
    if (
      text.startsWith("+") ||
      text.startsWith("/") ||
      text.startsWith("!")
    ) {
      return;
    }


    // Ignore bot's own common output patterns
    if (
      text.startsWith("Tum Dum:") ||
      text.startsWith("BOT:")
    ) {
      return;
    }


    const reply = detect(text);

    if (!reply) return;


    // Anti-spam
    if (
      !canReply(
        event.threadID,
        event.senderID
      )
    ) {
      return;
    }


    const user = getUser(
      event.threadID,
      event.senderID
    );


    // Don't repeat exact same reply
    if (user.lastReply === reply) {

      const alternatives = [
        ...R.greeting,
        ...R.bot,
        ...R.good
      ];

      const different = alternatives.filter(
        x => x !== user.lastReply
      );

      if (different.length) {
        user.lastReply = random(different);
      }

    } else {

      user.lastReply = reply;

    }


    user.lastText = text;
    user.messages++;


    // Small human-like delay
    const delay =
      Math.floor(Math.random() * 1200) + 700;


    setTimeout(() => {

      api.sendMessage(
        user.lastReply,
        event.threadID,
        event.messageID
      );

    }, delay);


  } catch (error) {
    // Silent error
  }
};
