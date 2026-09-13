/**
 * =========================================================
 * TUM DUM - BABY CHATBOT v7
 * Owner: ইরাম
 * =========================================================
 *
 * NOTE:
 * AutoReply.js-এর existing trigger/reply এখানে রাখা হয়নি।
 * Baby.js-এ আলাদা নতুন replies, jokes এবং reply-to-bot chat আছে।
 * =========================================================
 */

const axios = require("axios");

const apiList =
  "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";

const BOT_NAME = "Tum Dum";
const OWNER_NAME = "ইরাম";

let cachedAPI = null;

async function getMainAPI() {
  if (cachedAPI) return cachedAPI;

  try {
    const res = await axios.get(apiList, {
      timeout: 8000
    });

    if (res.data && res.data.simsimi) {
      cachedAPI = res.data.simsimi;
      return cachedAPI;
    }

    return null;
  } catch {
    return null;
  }
}

/* =========================================================
   DUPLICATE PROTECTION
========================================================= */

const recentReplies = new Map();

function duplicate(threadID, text) {
  const key =
    `${threadID}:${String(text).trim().toLowerCase()}`;

  if (recentReplies.has(key)) return true;

  recentReplies.set(key, Date.now());

  setTimeout(() => {
    recentReplies.delete(key);
  }, 12000);

  return false;
}

/* =========================================================
   NEW BABY REPLIES
   AutoReply.js-এর replies এখানে রাখা হয়নি
========================================================= */

const babyReplies = [
  "হুমম 😼 বলো, কী খবর?",
  "এই যে, আমি শুনছি 👀",
  "আচ্ছা তারপর কী হলো? 😆",
  "ওহ! ব্যাপারটা interesting 👀",
  "হুম বুঝলাম 😌",
  "তোমার কথাটা খারাপ না কিন্তু 😼",
  "আরে বাহ 😂",
  "এই বিষয়ে আমার সন্দেহ আছে কিন্তু! 🤨😂",
  "তুমি আজকে অনেক কথা বলতেছো দেখি 😆",
  "হুম... continue করো 👀",
  "বুঝলাম বস 😎",
  "আমি কিন্তু মন দিয়ে শুনছি 😌",
  "এই কথার পরেও তুমি বেঁচে আছো? 😂",
  "ওহ আচ্ছা! নতুন কিছু শিখলাম 😆",
  "তোমার কথায় logic আছে... একটু হলেও 😂",
  "হুম, দেখি কী করা যায় 😼",
  "এইটা নিয়ে পরে বসে আলোচনা করা যাবে 😎",
  "তোমার গল্পের next episode কোথায়? 🍿😂",
  "আমি তো এখন curious হয়ে গেলাম 👀",
  "আচ্ছা, আরেকটু বিস্তারিত বলো 😌",
  "তোমার মাথায় আজকে অনেক idea দেখি 😂",
  "হুমম... বিষয়টা সন্দেহজনক 😼",
  "ঠিক আছে, আমি আছি তোমার সাথে 😌",
  "এইটা শুনে আমার processor একটু গরম হয়ে গেল 😂",
  "বুঝলাম, কিন্তু ব্যাপারটা মজার 😆",
  "আচ্ছা ঠিক আছে 😎",
  "হুম, কথাটা মাথায় রাখলাম 😼",
  "এত serious হওয়ার দরকার নেই 😂",
  "আমি কিন্তু judge করছি না... এখনো 😌😂",
  "তোমার কথা শুনলে আমারও আড্ডা দিতে ইচ্ছা করে 😆"
];

/* =========================================================
   NEW CALLING REPLIES
========================================================= */

const callingReplies = [
  "হুম, কী দরকার? 😼",
  "এই যে আমি আছি 😎",
  "বলতে থাকো, শুনছি 👀",
  "কী ব্যাপার? 😆",
  "হুমম, ডাক শুনেছি 😌",
  "Tum Dum present! 🫡😂",
  "কী খবর? 😼",
  "বলো, কী নিয়ে আড্ডা হবে? 😎",
  "আমি online আছি 👀",
  "হুম, শুরু করো 😆",
  "কী হলো আবার? 😂",
  "বল বস 😎",
  "আমি শুনতে প্রস্তুত 😌",
  "হুম, বলো কী বলতে চাও?",
  "এত সুন্দর করে ডাকলে তো আসতেই হয় 😂"
];

/* =========================================================
   SALAM / BASIC NEW REPLIES
========================================================= */

const salamReplies = [
  "ওয়ালাইকুমুস সালাম 🌸❤️",
  "ওয়ালাইকুমুস সালাম ওয়া রাহমাতুল্লাহ 🌺",
  "ওয়ালাইকুমুস সালাম 😌",
  "ওয়ালাইকুমুস সালাম, ভালো আছো তো? 🌻"
];

const moodReplies = [
  "আলহামদুলিল্লাহ ভালো আছি 😌",
  "আমি একদম ঠিকঠাক আছি 😎",
  "Tum Dum ভালো আছে 😂",
  "ভালোই আছি, তোমাদের আড্ডা চলছে তো 😼"
];

const loveReplies = [
  "এই ধরনের কথা বললে আমার CPU লজ্জা পায় 🙈😂",
  "ভালোবাসা বুঝলাম, কিন্তু আগে চা খাওয়াও ☕😂",
  "এত ভালোবাসা কোথা থেকে আসে তোমার? 😆",
  "এই কথাটা dangerous level-এর মিষ্টি 😼❤️"
];

const angryReplies = [
  "রাগ কইরো না, শান্ত হও 😌",
  "আচ্ছা আচ্ছা, এত রাগ কেন? 😂",
  "রাগ করলে কিন্তু সমস্যা আরও বাড়ে 😼",
  "চলো আগে শান্তি, পরে ঝগড়া 😂"
];

/* =========================================================
   JOKES
========================================================= */

const jokes = [
  "তোর WiFi full signal, কিন্তু brain signal weak! 😂📶",
  "তুই এত intelligent যে calculator-ও তোকে দেখে ভুল answer দেয়! 🤣",
  "তোর প্রেমের অবস্থা: Searching... তারপর No Result Found! 😂💔",
  "তুই পড়তে বসলে বই নিজেই বলে—আজকে ছুটি দে ভাই! 🤣📚",
  "তোর মাথায় idea আসে, কিন্তু execution কোথায় যায় কেউ জানে না! 😂",
  "তুই এত lazy যে ঘুম থেকেও উঠতে ঘুম লাগে! 🤣",
  "তোর attitude 100%, preparation 0%! 😂",
  "তুই যদি app হতি, মাঝে মাঝেই Force Stop করতাম! 🤣📱",
  "তোর life একটা comedy movie, শুধু director-এর নাম জানা নাই! 😂🎬",
  "তুই এমন এক মানুষ, Google-ও তোকে দেখে বলে—নিজে খুঁজে নাও ভাই! 🤣",
  "তোর brain-এর RAM কম, কিন্তু background app অনেক! 😂🧠",
  "তোর confidence দেখে মনে হয় তুই পৃথিবীর CEO, কিন্তু নিজের charger খুঁজে পাও না! 🤣",
  "তুই যদি calculator হোস, তাহলেও result ভুল দিবি! 😂",
  "তোর প্রেমের story শুনে Netflix বলছে—আরেক season লাগবে! 🤣🎬",
  "তুই এত কথা বলিস যে keyboard-এরও overtime লাগে! 😂",
  "তোর crush তোকে দেখলে airplane mode চালু করে দেয়! 🤣✈️",
  "তুই আমাকে প্রশ্ন করিস, Google এখন বেকার বসে আছে! 😂",
  "তোর life-এর password কী? 'problem123' নাকি? 🤣",
  "তুই এত special যে error message-ও তোকে দেখে ভয় পায়! 😂",
  "তোর IQ কোথায় থাকে? Google Maps-এও location পাওয়া যায় না! 🤣",
  "তুই যদি দৌড় প্রতিযোগিতায় নামিস, আগে ঘুম থেকে ওঠার race জিত! 😂",
  "তোর মাথার storage full, কিন্তু useful file নাই! 🤣💾",
  "তোর প্রেমে network আছে, connection নাই! 😂📡",
  "তুই এত innocent যে scammer-ও তোকে দেখে sympathy নেয়! 🤣",
  "তোর কথা শুনে হাসতে গেছিলাম, পরে বুঝলাম তুই serious! 😂",
  "তুই একটা notification হলে আমি তোকে mute করে রাখতাম! 🤣🔕",
  "তোর planning NASA level, কিন্তু কাজ শুরু হয় না! 😂🚀",
  "তোর ঘুমের সাথে relationship এত strong যে alarm-ও হেরে যায়! 🤣⏰",
  "তুই পড়াশোনার সাথে এমন সম্পর্ক রাখিস, দেখা হয় শুধু পরীক্ষার আগের রাতে! 😂",
  "তুই যদি problem না থাকলেও problem খুঁজে বের করিস! 🤣",
  "তোর phone-এর battery কম না, তোর patience কম! 😂",
  "তুই এত drama করিস যে TV serial তোকে দেখে inspiration নেয়! 🤣",
  "তোর মাথায় চিন্তা অনেক, কিন্তু solution সব vacation-এ! 😂",
  "তুই যদি teacher হতি, ছাত্ররা প্রতিদিন ছুটি চাইত! 🤣",
  "তোর joke শুনে হাসি আসে না, কিন্তু তুই নিজে হাসলে আসে! 😂",
  "তুই একটা full package—problem, drama আর confidence! 🤣",
  "তুই online থাকিস, কিন্তু reply দিতে offline হয়ে যাস! 😂",
  "তোর crush-এর reply আসতে আসতে তুই বুড়ো হয়ে যাবি! 🤣",
  "তুই এত confused যে Yes বললেও No মনে হয়! 😂",
  "তোর মাথায় Bluetooth আছে, কিন্তু pairing হয় না! 🤣📱",
  "তুই যদি weather app হতি, সবসময় 'unexpected problem' দেখাতি! 😂",
  "তুই নিজের ভুলের জন্যও অন্য কাউকে blame করতে পারিস—respect! 🤣",
  "তোর life-এর loading screen কখন শেষ হবে কে জানে! 😂",
  "তুই এত lucky যে unlucky-ও তোকে দেখে পালায়! 🤣",
  "তুই যদি exam question হতি, আমি skip করে দিতাম! 😂",
  "তোর brain মাঝে মাঝে update চায়, কিন্তু WiFi পায় না! 🤣",
  "তুই ঘুমাতে যাওয়ার আগে বলিস ৫ মিনিট, তারপর সকাল হয়ে যায়! 😂",
  "তুই নিজের photo edit করতে করতে আসল মুখটাই ভুলে গেছিস! 🤣",
  "তোর কথার speed 5G, কিন্তু logic 2G! 😂📶",
  "তুই এত busy যে নিজের কাজ করার সময়ই পাস না! 🤣",
  "তোর life-এর main character তুই, কিন্তু storyটা comedy! 😂"
];

/* =========================================================
   RANDOM
========================================================= */

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clean(text) {
  return String(text || "")
    .trim()
    .replace(/\s+/g, " ");
}

/* =========================================================
   LOCAL SMART RESPONSE
========================================================= */

function getLocalReply(text) {
  const q = clean(text).toLowerCase();

  if (!q) {
    return random(callingReplies);
  }

  /* SALAM */
  if (
    q.includes("assalamu alaikum") ||
    q.includes("আসসালামু আলাইকুম") ||
    q === "salam"
  ) {
    return random(salamReplies);
  }

  /* HOW ARE YOU */
  if (
    q.includes("কেমন আছো") ||
    q.includes("কেমন আছেন") ||
    q.includes("kmn acho") ||
    q.includes("kemon acho") ||
    q.includes("kemon aso")
  ) {
    return random(moodReplies);
  }

  /* LOVE */
  if (
    q.includes("ভালোবাসি") ||
    q.includes("ভালবাসি") ||
    q.includes("love you") ||
    q.includes("i love")
  ) {
    return random(loveReplies);
  }

  /* ANGRY */
  if (
    q.includes("রাগ") ||
    q.includes("angry") ||
    q.includes("মাথা গরম")
  ) {
    return random(angryReplies);
  }

  /* JOKE */
  if (
    q.includes("জোক") ||
    q.includes("জোকস") ||
    q.includes("jokes") ||
    q.includes("joke") ||
    q.includes("কৌতুক")
  ) {
    return random(jokes);
  }

  /* OWNER */
  if (
    q === "eram" ||
    q === "ইরাম" ||
    q.includes("owner কে") ||
    q.includes("owner ke")
  ) {
    return random([
      "আমার owner ইরাম 😎🔥",
      "বসের নাম ইরাম 😼",
      "ইরাম হলো আমার বস 😎",
      "Owner: ইরাম ❤️"
    ]);
  }

  /* BOT IDENTITY */
  if (
    q === "তুমি কে" ||
    q === "কে তুমি" ||
    q === "tumi ke" ||
    q === "who are you"
  ) {
    return random([
      `আমি ${BOT_NAME} 😎`,
      `আমার নাম ${BOT_NAME} 😼`,
      `আমি Tum Dum, তোমাদের আড্ডার bot 😂`
    ]);
  }

  /* THANKS */
  if (
    q === "thanks" ||
    q === "thank you" ||
    q === "ধন্যবাদ"
  ) {
    return random([
      "Welcome 😌❤️",
      "আরে ধন্যবাদ দেওয়ার কী আছে! 😆",
      "Anytime 😎",
      "No problem বস 😼"
    ]);
  }

  /* SORRY */
  if (
    q === "sorry" ||
    q.includes("দুঃখিত")
  ) {
    return random([
      "ঠিক আছে, মাফ করে দিলাম 😌",
      "আচ্ছা ঠিক আছে 😂",
      "No problem 😎",
      "এবার ভালো হয়ে যাও 😼"
    ]);
  }

  /* RANDOM JOKE CHANCE */
  if (Math.random() < 0.15) {
    return random(jokes);
  }

  return random(babyReplies);
}

/* =========================================================
   API RESPONSE
========================================================= */

async function getAPIReply(text, senderName) {
  try {
    const base = await getMainAPI();

    if (!base) return null;

    const url =
      `${base}/simsimi?text=${encodeURIComponent(text)}` +
      `&senderName=${encodeURIComponent(senderName || "User")}`;

    const res = await axios.get(url, {
      timeout: 10000
    });

    if (!res.data) return null;

    let reply = res.data.response;

    if (Array.isArray(reply)) {
      reply = reply[0];
    }

    if (
      !reply ||
      typeof reply !== "string"
    ) {
      return null;
    }

    reply = clean(reply);

    if (!reply) return null;

    return reply;

  } catch {
    return null;
  }
}

/* =========================================================
   SEND REPLY
========================================================= */

function sendReply(api, event, text) {
  return new Promise(resolve => {

    text = clean(text);

    if (!text) {
      return resolve();
    }

    if (
      duplicate(
        event.threadID,
        text
      )
    ) {
      return resolve();
    }

    if (!global.client.handleReply) {
      global.client.handleReply = [];
    }

    api.sendMessage(
      text,
      event.threadID,
      (err, info) => {

        if (!err && info) {

          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "baby"
          });

        }

        resolve();
      },
      event.messageID
    );

  });
}

/* =========================================================
   CONFIG
========================================================= */

module.exports.config = {
  name: "baby",
  version: "7.0.0",
  hasPermssion: 0,
  credits: "ইরাম",
  description:
    "Tum Dum Baby Chatbot with new replies, jokes and reply-to-bot chat",
  commandCategory: "Chat",
  usages: "[message/query]",
  cooldowns: 0,
  prefix: true
};

/* =========================================================
   COMMAND
========================================================= */

module.exports.run = async function ({
  api,
  event,
  args,
  Users
}) {

  try {

    const uid = event.senderID;

    const senderName =
      await Users.getNameUser(uid);

    const rawQuery =
      clean(args.join(" "));

    if (!rawQuery) {
      return sendReply(
        api,
        event,
        random(callingReplies)
      );
    }

    const command =
      rawQuery
        .split(/\s+/)[0]
        .toLowerCase();

    /* =====================================================
       REMOVE
    ===================================================== */

    if (
      command === "remove" ||
      command === "rm"
    ) {

      const simsim =
        await getMainAPI();

      if (!simsim) {
        return sendReply(
          api,
          event,
          "API এখন available না 😭"
        );
      }

      const parts =
        rawQuery
          .replace(/^(remove|rm)\s*/i, "")
          .split(" - ");

      if (parts.length < 2) {
        return sendReply(
          api,
          event,
          "Use: remove [Question] - [Reply]"
        );
      }

      const ask = parts[0].trim();
      const ans = parts[1].trim();

      const res =
        await axios.get(
          `${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`,
          { timeout: 10000 }
        );

      return sendReply(
        api,
        event,
        res.data?.message ||
        "Done."
      );
    }

    /* =====================================================
       LIST
    ===================================================== */

    if (command === "list") {

      const simsim =
        await getMainAPI();

      if (!simsim) {
        return sendReply(
          api,
          event,
          "API এখন available না 😭"
        );
      }

      const res =
        await axios.get(
          `${simsim}/list`,
          { timeout: 10000 }
        );

      if (res.data?.code === 200) {

        return sendReply(
          api,
          event,
          `♾ Total Questions Learned: ${res.data.totalQuestions || 0}
★ Total Replies Stored: ${res.data.totalReplies || 0}
Developer: ${res.data.author || BOT_NAME}`
        );

      }

      return sendReply(
        api,
        event,
        res.data?.message ||
        "Unable to load list."
      );
    }

    /* =====================================================
       EDIT
    ===================================================== */

    if (command === "edit") {

      const simsim =
        await getMainAPI();

      if (!simsim) {
        return sendReply(
          api,
          event,
          "API এখন available না 😭"
        );
      }

      const parts =
        rawQuery
          .replace(/^edit\s*/i, "")
          .split(" - ");

      if (parts.length < 3) {
        return sendReply(
          api,
          event,
          "Use: edit [Q] - [Old] - [New]"
        );
      }

      const ask = parts[0].trim();
      const oldReply = parts[1].trim();
      const newReply = parts[2].trim();

      const res =
        await axios.get(
          `${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`,
          { timeout: 10000 }
        );

      return sendReply(
        api,
        event,
        res.data?.message ||
        "Done."
      );
    }

    /* =====================================================
       TEACH
    ===================================================== */

    if (command === "teach") {

      const simsim =
        await getMainAPI();

      if (!simsim) {
        return sendReply(
          api,
          event,
          "API এখন available না 😭"
        );
      }

      const parts =
        rawQuery
          .replace(/^teach\s*/i, "")
          .split(" - ");

      if (parts.length < 2) {
        return sendReply(
          api,
          event,
          "Use: teach [Question] - [Reply]"
        );
      }

      const ask = parts[0].trim();
      const ans = parts[1].trim();

      const groupID =
        event.threadID;

      let groupName =
        event.threadName || "";

      try {

        if (
          !groupName &&
          groupID !== uid
        ) {

          const info =
            await api.getThreadInfo(
              groupID
            );

          if (info?.threadName) {
            groupName =
              info.threadName;
          }
        }

      } catch {}

      let teachURL =
        `${simsim}/teach` +
        `?ask=${encodeURIComponent(ask)}` +
        `&ans=${encodeURIComponent(ans)}` +
        `&senderID=${encodeURIComponent(uid)}` +
        `&senderName=${encodeURIComponent(senderName)}` +
        `&groupID=${encodeURIComponent(groupID)}`;

      if (groupName) {
        teachURL +=
          `&groupName=${encodeURIComponent(groupName)}`;
      }

      const res =
        await axios.get(
          teachURL,
          { timeout: 10000 }
        );

      return sendReply(
        api,
        event,
        res.data?.message ||
        "Learned successfully."
      );
    }

    /* =====================================================
       NORMAL BABY QUERY
    ===================================================== */

    let reply =
      getLocalReply(rawQuery);

    /*
     * API শুধু কিছু normal query-তে ব্যবহার হবে।
     * Local নতুন reply সবসময় fallback হিসেবে থাকবে।
     */

    const apiReply =
      await getAPIReply(
        rawQuery,
        senderName
      );

    if (
      apiReply &&
      Math.random() > 0.35
    ) {
      reply = apiReply;
    }

    return sendReply(
      api,
      event,
      reply
    );

  } catch {

    return sendReply(
      api,
      event,
      random(babyReplies)
    );
  }
};

/* =========================================================
   REPLY TO BOT MESSAGE
   Bot-এর message-এ reply করলে যেকোনো text-এর উত্তর দিবে
========================================================= */

module.exports.handleReply =
async function ({
  api,
  event,
  Users
}) {

  try {

    const text =
      clean(event.body);

    if (!text) return;

    const senderName =
      await Users.getNameUser(
        event.senderID
      );

    /*
     * প্রথমে নতুন local reply
     */
    let reply =
      getLocalReply(text);

    /*
     * API response মাঝে মাঝে ব্যবহার
     */
    const apiReply =
      await getAPIReply(
        text,
        senderName
      );

    if (
      apiReply &&
      Math.random() > 0.40
    ) {
      reply = apiReply;
    }

    /*
     * Empty/API error হলে local
     */
    if (!reply) {
      reply =
        random(babyReplies);
    }

    return sendReply(
      api,
      event,
      reply
    );

  } catch {

    return sendReply(
      api,
      event,
      random(babyReplies)
    );
  }
};

/* =========================================================
   HANDLE EVENT
   Baby / Bot call + new trigger
========================================================= */

module.exports.handleEvent =
async function ({
  api,
  event,
  Users
}) {

  try {

    const raw =
      clean(event.body);

    if (!raw) return;

    const lower =
      raw.toLowerCase();

    /*
     * শুধু Baby-এর নিজস্ব নতুন calling words.
     * AutoReply.js-এর existing text triggers এখানে নেই।
     */

    const callWords = [
      "baby",
      "bby",
      "tumdum",
      "tumdum",
      "tumdum bot",
      "বেবি"
    ];

    if (
      callWords.includes(lower)
    ) {

      return sendReply(
        api,
        event,
        random(callingReplies)
      );
    }

    /*
     * Baby + question
     */

    const prefixRegex =
      /^(baby|bby|tumdum|tumdum|tumdum bot|বেবি)\s+/i;

    if (
      prefixRegex.test(raw)
    ) {

      const query =
        raw
          .replace(prefixRegex, "")
          .trim();

      if (!query) return;

      const senderName =
        await Users.getNameUser(
          event.senderID
        );

      let reply =
        getLocalReply(query);

      const apiReply =
        await getAPIReply(
          query,
          senderName
        );

      if (
        apiReply &&
        Math.random() > 0.35
      ) {
        reply = apiReply;
      }

      return sendReply(
        api,
        event,
        reply
      );
    }

  } catch {

    return;
  }
};