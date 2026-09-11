/**
 * Tum Dum - Manual Smart Auto Reply
 * Owner: Eram
 * No external AI/API required
 */

module.exports.config = {
  name: "autoreplybot",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Eram",
  description: "Decent Bangla & Banglish automatic conversation",
  usePrefix: false,
  commandCategory: "Chat",
  cooldowns: 0
};

// Prevent duplicate processing of the same message
if (!global.tumDumProcessed) {
  global.tumDumProcessed = new Set();
}

module.exports.handleEvent = async function ({ api, event }) {

  const {
    threadID,
    messageID,
    body,
    senderID
  } = event;

  if (!body || typeof body !== "string") return;

  // Ignore duplicate event
  if (messageID && global.tumDumProcessed.has(messageID)) {
    return;
  }

  if (messageID) {
    global.tumDumProcessed.add(messageID);

    setTimeout(() => {
      global.tumDumProcessed.delete(messageID);
    }, 10000);
  }

  // Ignore bot's own message
  try {
    const botID = api.getCurrentUserID();

    if (botID && senderID === botID) {
      return;
    }
  } catch (e) {}

  const msg = body
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

  const responses = {

    // =========================
    // SALAM
    // =========================

    "assalamualaikum":
      "ওয়ালাইকুমুস সালাম ❤️ কেমন আছো?",

    "assalamu alaikum":
      "ওয়ালাইকুমুস সালাম ❤️ ভালো আছো তো?",

    "salam":
      "ওয়ালাইকুমুস সালাম 🌸 কেমন চলছে?",

    "সালাম":
      "ওয়ালাইকুমুস সালাম ❤️😊",

    "আসসালামু আলাইকুম":
      "ওয়ালাইকুমুস সালাম ওয়া রহমাতুল্লাহ ❤️",

    // =========================
    // GREETING
    // =========================

    "hi":
      "হাই 😊 কেমন আছো?",

    "hello":
      "হ্যালো! 👋 কী খবর?",

    "hey":
      "হেই 😄 বলো, কী অবস্থা?",

    "হাই":
      "হাই 😊 কী খবর?",

    "হ্যালো":
      "হ্যালো 👋 কেমন আছো?",

    "good morning":
      "Good Morning 🌸 ঘুম কেমন হলো? সকালের নাস্তা করেছো?",

    "good night":
      "Good Night 🌙 ভালো করে ঘুমাও। Sweet dreams ❤️",

    "শুভ সকাল":
      "শুভ সকাল 🌸 আজকের দিনটা সুন্দর হোক ❤️",

    "শুভ রাত্রি":
      "শুভ রাত্রি 🌙 ভালো করে ঘুমাও।",

    // =========================
    // HOW ARE YOU
    // =========================

    "kemon acho":
      "আলহামদুলিল্লাহ, ভালো আছি 😊 তুমি কেমন আছো?",

    "kemon aso":
      "আলহামদুলিল্লাহ ভালো আছি ❤️ তুমি কেমন আছো?",

    "kemon achho":
      "ভালো আছি 😊 তোমার খবর কী?",

    "কেমন আছো":
      "আলহামদুলিল্লাহ ভালো আছি ❤️ তুমি কেমন আছো?",

    "কেমন আছিস":
      "ভালো আছি রে 😄 তুই কেমন আছিস?",

    "how are you":
      "I'm good 😊 তুমি কেমন আছো?",

    "kmn acho":
      "Alhamdulillah valo achi 😊 tumi kmn acho?",

    "kmn aso":
      "Valo achi 😄 tomar ki khobor?",

    // =========================
    // GOOD / FINE
    // =========================

    "valo aso":
      "হ্যাঁ, আলহামদুলিল্লাহ ভালো আছি 😊",

    "valo acho":
      "জি 😄 ভালো আছি।",

    "ভালো আছো":
      "আলহামদুলিল্লাহ ভালো আছি ❤️",

    "valo":
      "ভালো থাকাটাই আসল ব্যাপার 😊",

    "ভালো":
      "এটাই তো চাই—সবসময় ভালো থেকো ❤️",

    "great":
      "Great! 😎 শুনে ভালো লাগলো।",

    "গ্রেট":
      "দারুণ তো! 😄",

    "good":
      "That's good 😊 এভাবেই ভালো থেকো।",

    "fine":
      "Nice! 😄 ভালো থাকো।",

    "ঠিক আছি":
      "এটাই তো ভালো কথা 😊",

    "thik achi":
      "Besh 😄 এভাবেই thik thako.",

    "thik asi":
      "Alhamdulillah 😄 ভালো থাকাটাই important.",

    // =========================
    // WHAT DOING
    // =========================

    "ki koros":
      "এখন তো তোমার সাথেই কথা বলছি 😄",

    "কি করোস":
      "তোমার সাথেই তো আড্ডা দিচ্ছি 😄",

    "কি করো":
      "তোমার message-এর reply দিচ্ছি 😊",

    "কি করছো":
      "তোমার সাথে গল্প করছি 😄",

    "kire ki koros":
      "Tomar sathei adda dichhi 😄 tumi ki koro?",

    "what are you doing":
      "Just chatting with you 😄",

    "ki obostha":
      "Alhamdulillah chill mood 😎 tomar ki obostha?",

    "কি অবস্থা":
      "আলহামদুলিল্লাহ ভালো 😄 তোমার অবস্থা কী?",

    // =========================
    // NAME / BOT INFO
    // =========================

    "tor nam ki":
      "আমার নাম **Tum Dum** 🤖❤️ আমাকে বানিয়েছে **Eram**।",

    "তোর নাম কি":
      "আমার নাম **Tum Dum** 🤖 আর আমার Owner **Eram** ❤️",

    "tomar nam ki":
      "আমার নাম Tum Dum 🤖😊 আর আমাকে তৈরি করেছে Eram।",

    "তোমার নাম কি":
      "আমি **Tum Dum** 🤖❤️ আমার Owner **Eram**।",

    "bot er nam ki":
      "আমার নাম **Tum Dum** 🤖",

    "bot এর নাম কি":
      "আমার নাম **Tum Dum** 🤖❤️",

    "who are you":
      "আমি Tum Dum 🤖 তোমাদের সাথে আড্ডা দেওয়ার জন্য আছি 😄",

    "tui ke":
      "আমি **Tum Dum** 🤖 তোমার সাথে গল্প করার ছোট্ট একটা bot।",

    "তুই কে":
      "আমি Tum Dum 🤖 তোমার সাথে আড্ডা দিতে এসেছি 😄",

    "owner ke":
      "আমার Owner হলো **Eram** 👑❤️",

    "owner কে":
      "আমার Owner **Eram** 👑🤖",

    "ke banayse":
      "আমাকে বানিয়েছে **Eram** 👑🤖",

    "কে বানাইছে":
      "আমাকে তৈরি করেছে **Eram** ❤️🤖",

    "who made you":
      "I was created by **Eram** 🤖❤️",

    // =========================
    // THANKS
    // =========================

    "thanks":
      "You're welcome 😊❤️",

    "thank you":
      "Welcome! 😄 ভালো থেকো।",

    "ধন্যবাদ":
      "স্বাগতম 😊❤️",

    "tnx":
      "Anytime bro 😄",

    "thnx":
      "Welcome 😄❤️",

    // =========================
    // LOVE / FRIENDSHIP
    // =========================

    "i love you":
      "Aww 😄❤️ ভালোবাসা থাকুক, তবে আগে বন্ধু হওয়া যাক।",

    "love you":
      "Love & respect ❤️😊",

    "ভালোবাসি":
      "ভালোবাসা সুন্দর জিনিস ❤️ তবে respect-টাই আগে।",

    "love":
      "Love মানেই care, respect আর trust ❤️",

    "miss you":
      "Aww 😄 আমাকেও মনে পড়ছে নাকি?",

    "miss u":
      "Hehe 😄 এত miss করার কী আছে?",

    "miss me":
      "হয়তো একটু 😌 তুমি তো মাঝে মাঝে হারিয়ে যাও।",

    "kiss me":
      "Virtual একটা high-five নাও ✋😄",

    "kiss de":
      "Kiss না 😄 আগে সুন্দর করে কথা বলো।",

    // =========================
    // FRIEND
    // =========================

    "friend hobi":
      "অবশ্যই 😄 আজ থেকে আমরা chat-buddy! 🤝",

    "বন্ধু হবি":
      "হ্যাঁ অবশ্যই 😄🤝",

    "tumi amar bondhu":
      "Of course! ❤️🤝",

    "তুমি আমার বন্ধু":
      "হ্যাঁ 😊 ভালো বন্ধুত্ব সবসময়ই সুন্দর।",

    // =========================
    // MOOD
    // =========================

    "mood off":
      "মন খারাপ? একটু relax করো। সবসময় সবকিছু perfect হবে না ❤️",

    "মুড অফ":
      "মন খারাপ হলে একটু বিশ্রাম নাও। সময় গেলে ঠিক হয়ে যাবে ❤️",

    "mon kharap":
      "মন খারাপ থাকলে একা থেকো না। কাছের কারও সাথে কথা বলো ❤️",

    "মন খারাপ":
      "সব খারাপ সময়ই একসময় কেটে যায়। Stay strong ❤️",

    "bored":
      "Bored? 😄 চলো একটু আড্ডা দিই!",

    "boring":
      "Boring লাগছে? 😄 একটা joke শুনবে?",

    // =========================
    // JOKES
    // =========================

    "joke":
      "একজন বলল: ভাই, WiFi password কী?\nদোকানদার বলল: আগে কিছু কিনেন।\nলোক বলল: Password বলেন, তারপর কিনবো! 😂",

    "jokes":
      "Joke শুনো 😂\nTeacher: এত দেরি করে আসলে কেন?\nStudent: Sir, স্বপ্নে দেখলাম স্কুলে এসেছি… তাই আর আসিনি! 🤣",

    "জোক":
      "জোক শুনো 😂\nবন্ধু: তুই এত চুপ কেন?\nআমি: কথা বলার মানুষ পাই না।\nবন্ধু: আমি তো আছি!\nআমি: তুই তো আমার কথাই শুনিস না! 🤣",

    "জোকস":
      "একটা জোকস 😄\nমা: পড়তে বসেছিস?\nছেলে: হ্যাঁ মা।\nমা: কী পড়ছিস?\nছেলে: Facebook-এর comments! 😂",

    "joke bolo":
      "আচ্ছা শোনো 😂\nপরীক্ষার খাতায় ছাত্র লিখল: 'স্যার, উত্তর জানি না।'\nস্যার লিখলেন: 'আমিও জানি না, তাই নম্বর দিতে পারলাম না!' 🤣",

    "জোকস বল":
      "একটা শুনো 😂\nঘুম থেকে উঠে ছেলে বলল—আজ থেকে নিয়ম করে পড়ব।\nতারপর আবার ঘুমিয়ে গেল। 🤣",

    // =========================
    // STORY / POEM
    // =========================

    "golpo bolo":
      "এক ছিল এক ছোট্ট স্বপ্নবাজ মানুষ। সবাই বলত সে পারবে না। সে শুধু হাসত আর বলত—সময় আসুক, উত্তরটা তখনই দেব। ❤️",

    "গল্প বল":
      "ছোট্ট একটা গল্প? 🌸\nএকজন মানুষ প্রতিদিন একটু একটু করে চেষ্টা করত। একদিন সে বুঝল—সে আসলে অনেক দূর এগিয়ে গেছে। তাই ছোট progress-কে কখনো ছোট মনে করো না। ❤️",

    "kobita bolo":
      "নীরব রাতে চাঁদের আলো,\nস্বপ্নগুলো থাকুক ভালো।\nহার না মেনে এগিয়ে চলো,\nএকদিন জয় আসবেই আলোয়। 🌙❤️",

    "poem bolo":
      "স্বপ্ন যদি সত্যি হয়,\nপথটা কঠিন হলেও ভয় নেই।\nধীরে ধীরে এগিয়ে চলো,\nএকদিন তোমার সময়ও আসবেই। ❤️",

    // =========================
    // MOTIVATION
    // =========================

    "motivation dao":
      "আজকের ছোট্ট চেষ্টা কালকের বড় পরিবর্তন হতে পারে। তাই থেমে যেও না। 💪❤️",

    "motivation":
      "নিজের উপর বিশ্বাস রাখো। Slow progress is still progress. 💪🔥",

    "হাল ছেড়ে দিতে ইচ্ছে করছে":
      "আরেকটু চেষ্টা করো। সবসময় দ্রুত result আসে না, কিন্তু চেষ্টা কখনোই wasted যায় না। ❤️",

    "parbo":
      "অবশ্যই পারবে 💪 শুধু consistency ধরে রাখো।",

    "ami parbo":
      "Yes, তুমি পারবে! 🔥 নিজের উপর বিশ্বাস রাখো।",

    // =========================
    // SLEEP / FOOD
    // =========================

    "ghumaiso":
      "না 😄 তোমার সাথে chat করছি। তুমি ঘুমিয়েছো?",

    "ঘুমাইছো":
      "না 😄 এখনো জেগে আছি।",

    "ghumabo":
      "হ্যাঁ, সময়মতো ঘুমানো ভালো 😴",

    "ঘুমাবো":
      "যাও তাহলে 😄 ভালো করে ঘুমাও।",

    "khaiso":
      "Virtual food তো খাওয়া হয়নি 😂 তুমি খেয়েছো?",

    "খাইছো":
      "আমি তো bot 😄 তুমি আগে খেয়ে নাও।",

    "খেয়েছো":
      "আমি খাবার খাই না 😄 তুমি খেয়েছো তো?",

    // =========================
    // HMM / UMM
    // =========================

    "hmm":
      "Hmmm 😄 কিছু বলবে?",

    "hmmm":
      "এই যে শুধু Hmmm! 😂 আসল কথাটা বলো।",

    "umm":
      "Umm কেন? 🤔 কিছু ভাবছো নাকি?",

    "hmm hmm":
      "এত Hmmm করলে তো আমিও confused হয়ে যাবো 😂",

    "আচ্ছা":
      "আচ্ছা 😄 বলো।",

    "accha":
      "Accha 😄 bolo, ki hoyeche?",

    "okay":
      "Okay 😄👍",

    "ok":
      "Okay boss 😄",

    "ঠিক আছে":
      "ঠিক আছে 😊👍",

    "thik ache":
      "Thik ache 😄👍",

    // =========================
    // PAGOL / FUN
    // =========================

    "pagol":
      "হুম, একটু পাগল তো আছিই 😌😂",

    "পাগল":
      "পাগল না হলে এত সুন্দর chat করা যায় নাকি? 😂",

    "boka":
      "বোকা হলে তোমার সাথে এত smartly কথা বলতাম কীভাবে? 😎😂",

    "বোকা":
      "হয়তো একটু 😄 কিন্তু মনটা ভালো।",

    "chup":
      "ঠিক আছে 🤐 কিন্তু আবার ডাকলে চলে আসব 😄",

    "চুপ":
      "আচ্ছা চুপ 🤐😄",

    // =========================
    // BYE
    // =========================

    "bye":
      "Bye 👋 ভালো থেকো, আবার এসো। ❤️",

    "by":
      "Bye bye 😄 সাবধানে থেকো।",

    "বিদায়":
      "ভালো থেকো ❤️ আবার কথা হবে।",

    "আসি":
      "আচ্ছা 😄 ভালো থেকো। আবার এসো।",

    "see you":
      "See you soon 😄❤️",

    // =========================
    // RANDOM DECENT REPLIES
    // =========================

    "wow":
      "Wow indeed! 😄🔥",

    "ওয়াও":
      "ওয়াও! 😄 দারুণ তো!",

    "lol":
      "😂😂 হাসি থামছে না!",

    "haha":
      "হাহা 😂",

    "😂":
      "হাসতে থাকো 😄❤️",

    "❤️":
      "❤️😊",

    "❤":
      "❤️",

    "👍":
      "👍😄",

    "nice":
      "Thank you 😄❤️",

    "নাইস":
      "তোমার ভালো লেগেছে শুনে ভালো লাগলো 😄❤️",

    "great job":
      "Thank you 😄 চেষ্টা করছি ভালো থাকতে আর ভালো রাখতে।",

    "respect":
      "Respect always 🤝❤️",

    "রেসপেক্ট":
      "Respect back 🤝😊"
  };

  // Exact match
  if (!responses[msg]) return;

  return api.sendMessage(
    responses[msg],
    threadID,
    null,
    messageID
  );
};

module.exports.run = async function ({ api, event }) {
  return module.exports.handleEvent({
    api,
    event
  });
};
