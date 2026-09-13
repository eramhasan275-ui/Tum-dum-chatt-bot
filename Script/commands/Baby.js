const axios = require("axios");

const BOT_NAME = "Tum Dum";
const OWNER_NAME = "ইরাম";

const API_LIST =
  "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";

let API_URL = null;
const processed = new Set();

const jokes = [
  "তোর WiFi full signal, কিন্তু brain signal weak! 😂",
  "তুই এত intelligent যে calculator-ও তোকে দেখে ভুল answer দেয়! 🤣",
  "তোর প্রেমের অবস্থা: Searching... No Result Found! 😂💔",
  "তুই পড়তে বসলে বই নিজেই বন্ধ হয়ে যায়! 🤣📚",
  "তোর মাথায় idea আসে, কিন্তু execution আসে না! 😂",
  "তুই এত lazy যে ঘুম থেকেও উঠতে ঘুম লাগে! 🤣",
  "তোর attitude 100%, preparation 0%! 😂",
  "তুই যদি app হতি, মাঝে মাঝে Force Stop করতাম! 🤣📱",
  "তোর life একটা comedy movie! 😂🎬",
  "Google-ও তোকে দেখে বলে—নিজে খুঁজে নাও ভাই! 🤣",
  "তোর brain-এর RAM কম, background app অনেক! 😂",
  "তোর confidence CEO level, কিন্তু charger কোথায় জানিস না! 🤣",
  "তুই calculator হলেও result ভুল দিবি! 😂",
  "তোর প্রেমের story শুনে Netflix আরেক season চাইছে! 🤣",
  "তুই এত কথা বলিস যে keyboard-এর overtime লাগে! 😂",
  "তোর crush তোকে দেখলে airplane mode চালু করে দেয়! 🤣✈️",
  "তুই আমাকে প্রশ্ন করিস, Google এখন বেকার! 😂",
  "তোর মাথার storage full, useful file নাই! 🤣",
  "তোর প্রেমে network আছে, connection নাই! 😂📡",
  "তুই এত innocent যে scammer-ও sympathy নেয়! 🤣",
  "তোর joke শুনে হাসতে গেছিলাম, পরে দেখি joke-টাই তুই! 😂",
  "তুই notification হলে আমি তোকে mute করে রাখতাম! 🤣",
  "তোর planning NASA level, কাজ শুরু হয় না! 😂🚀",
  "তোর ঘুমের সাথে relationship এত strong যে alarm হেরে যায়! 🤣⏰",
  "তুই পরীক্ষার আগের রাতেই বইয়ের সাথে relationship করিস! 😂",
  "তুই problem না থাকলেও problem খুঁজে বের করিস! 🤣",
  "তোর phone-এর battery কম না, patience কম! 😂",
  "তুই এত drama করিস যে TV serial তোকে দেখে শেখে! 🤣",
  "তোর মাথায় চিন্তা অনেক, solution সব vacation-এ! 😂",
  "তুই online থাকিস, reply দিতে offline হয়ে যাস! 😂",
  "তোর crush-এর reply আসতে আসতে তুই বুড়ো হয়ে যাবি! 🤣",
  "তুই এত confused যে Yes বললেও No মনে হয়! 😂",
  "তোর মাথায় Bluetooth আছে, pairing হয় না! 🤣",
  "তোর life-এর loading screen কখন শেষ হবে কে জানে! 😂",
  "তুই নিজের ভুলের জন্যও অন্য কাউকে blame করতে পারিস—respect! 🤣",
  "তোর brain update চায়, কিন্তু WiFi পায় না! 😂",
  "তুই ঘুমাতে যাওয়ার আগে বলিস ৫ মিনিট, তারপর সকাল হয়ে যায়! 🤣",
  "তোর কথার speed 5G, logic 2G! 😂",
  "তুই যদি exam question হতি, আমি skip করে দিতাম! 🤣",
  "তোর life-এর main character তুই, storyটা comedy! 😂",
  "তোর planning অনেক, কাজ শুরু করার date এখনো আসেনি! 🤣",
  "তুই প্রেমে পড়লে কবি, rejection খেলে philosopher! 😂",
  "তোর মাথার চিন্তা unlimited, battery limited! 🤣",
  "তুই এত serious কেন? Tax দিতে হবে নাকি? 😂",
  "তুই যদি weather app হতি, সবসময় unexpected problem দেখাতি! 🤣",
  "আমাকে ডাকতে ডাকতে যদি টাকা পেতিস, কোটিপতি হয়ে যেতি! 😂💸",
  "তোর IQ কোথায় থাকে Google Maps-ও জানে না! 🤣",
  "তোর মেসেজ দেখে মনে হয় WiFi আছে, বুদ্ধির নেটওয়ার্ক নাই! 😂",
  "জীবনে শান্তি চাইলে আমাকে ডাকিস না, আমি নিজেই শান্তিতে নাই! 🤣"
];

const normalReplies = [
  "হুম 😼 বলো, শুনছি।",
  "আচ্ছা তারপর? 👀",
  "ওহ তাই নাকি! 😂",
  "হুম, বুঝলাম 😌",
  "বাহ! কথাটা interesting 😆",
  "বুঝলাম বস 😎",
  "আরো বলো 👀",
  "আমি শুনছি 😌",
  "আচ্ছা, continue করো 😼",
  "হুমম... ব্যাপারটা interesting! 😂",
  "ঠিক আছে বস 😎",
  "আজকে তো ভালোই আড্ডা হচ্ছে 😂",
  "ওহ! এইটা নতুন শুনলাম 😆",
  "তোমার গল্পের next part কোথায়? 🍿",
  "আমি কিন্তু মন দিয়ে শুনছি 😌",
  "হুম, বলো আরো 😼",
  "বাহ বস, চালিয়ে যাও 😎",
  "এইটা নিয়ে চিন্তা করতে হবে 😂",
  "আচ্ছা বুঝলাম 😌",
  "তোমার কথায় logic আছে 😼"
];

const salamReplies = [
  "ওয়ালাইকুমুস সালাম 🌸❤️",
  "ওয়ালাইকুমুস সালাম ওয়া রাহমাতুল্লাহ 🌺",
  "ওয়ালাইকুমুস সালাম 😌",
  "ওয়ালাইকুমুস সালাম ভাই ❤️",
  "ওয়ালাইকুমুস সালাম, ভালো আছো তো? 🌻"
];

const moodReplies = [
  "আলহামদুলিল্লাহ ভালো আছি 😌 তুমি কেমন আছো?",
  "আমি ভালো আছি 😎 তোমার খবর কী?",
  "Tum Dum ভালো আছে 😂 তুমি কেমন?",
  "আলহামদুলিল্লাহ, তোমাদের সাথে আড্ডা দিচ্ছি 😌"
];

const loveReplies = [
  "এই ধরনের কথা বললে আমার CPU লজ্জা পায় 🙈😂",
  "ভালোবাসা বুঝলাম, কিন্তু আগে চা খাওয়াও ☕😂",
  "এত ভালোবাসা কোথা থেকে আসে তোমার? 😆❤️",
  "এই কথাটা কিন্তু অনেক মিষ্টি 😼❤️",
  "আজকে দেখি প্রেমের mood 😌😂"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clean(text) {
  return String(text || "").trim().replace(/\s+/g, " ");
}

function once(event) {
  const key = `${event.threadID}:${event.messageID}`;

  if (processed.has(key)) return false;

  processed.add(key);

  setTimeout(() => processed.delete(key), 15000);

  return true;
}

async function getAPI() {
  if (API_URL) return API_URL;

  try {
    const res = await axios.get(API_LIST, {
      timeout: 8000
    });

    API_URL = res.data?.simsimi || null;
    return API_URL;
  } catch {
    return null;
  }
}

async function getAPIReply(text, name) {
  try {
    const base = await getAPI();

    if (!base) return null;

    const res = await axios.get(
      `${base}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(name || "User")}`,
      { timeout: 8000 }
    );

    let reply = res.data?.response;

    if (Array.isArray(reply)) {
      reply = reply[0];
    }

    if (typeof reply !== "string") return null;

    reply = clean(reply);

    return reply || null;
  } catch {
    return null;
  }
}

function localReply(text) {
  const q = clean(text).toLowerCase();

  if (
    q.includes("assalamu alaikum") ||
    q.includes("আসসালামু আলাইকুম") ||
    q === "salam" ||
    q === "সালাম"
  ) {
    return random(salamReplies);
  }

  if (
    q.includes("কেমন আছো") ||
    q.includes("কেমন আছেন") ||
    q.includes("kmn acho") ||
    q.includes("kemon acho") ||
    q.includes("kemon aso") ||
    q.includes("kmn aso")
  ) {
    return random(moodReplies);
  }

  if (
    q.includes("ভালোবাসি") ||
    q.includes("ভালবাসি") ||
    q.includes("love you") ||
    q.includes("i love you") ||
    q.includes("bhalobashi")
  ) {
    return random(loveReplies);
  }

  if (
    q.includes("joke") ||
    q.includes("jokes") ||
    q.includes("জোক") ||
    q.includes("জোকস") ||
    q.includes("কৌতুক")
  ) {
    return random(jokes);
  }

  if (
    q === "eram" ||
    q === "ইরাম" ||
    q.includes("owner ke") ||
    q.includes("owner কে")
  ) {
    return random([
      "আমার owner ইরাম 😎🔥",
      "বসের নাম ইরাম 😼",
      "ইরাম হলো আমার বস 😎",
      "Owner: ইরাম ❤️"
    ]);
  }

  if (
    q === "তুমি কে" ||
    q === "কে তুমি" ||
    q === "tumi ke" ||
    q === "who are you"
  ) {
    return random([
      "আমি Tum Dum 😎",
      "আমার নাম Tum Dum 😼",
      "আমি Tum Dum, তোমাদের আড্ডার bot 😂"
    ]);
  }

  if (
    q === "thanks" ||
    q === "thank you" ||
    q.includes("ধন্যবাদ")
  ) {
    return random([
      "Welcome 😌❤️",
      "আরে ধন্যবাদ দেওয়ার কী আছে! 😆",
      "Anytime বস 😎",
      "No problem 😼"
    ]);
  }

  if (Math.random() < 0.15) {
    return random(jokes);
  }

  return random(normalReplies);
}

function sendReply(api, event, text, register = true) {
  return new Promise(resolve => {
    text = clean(text);

    if (!text) return resolve();

    api.sendMessage(
      text,
      event.threadID,
      (err, info) => {
        if (!err && info && register) {
          if (!global.client.handleReply) {
            global.client.handleReply = [];
          }

          global.client.handleReply = global.client.handleReply.filter(
            item =>
              !(item.name === "baby" &&
                item.messageID === info.messageID)
          );

          global.client.handleReply.push({
            name: "baby",
            messageID: info.messageID,
            author: event.senderID,
            type: "baby"
          });
        }

        resolve();
      }
    );
  });
}

module.exports.config = {
  name: "baby",
  version: "10.0.0",
  hasPermssion: 0,
  credits: "ইরাম",
  description: "Tum Dum Smart Chatbot",
  commandCategory: "Chat",
  usages: "[message]",
  cooldowns: 0,
  prefix: true
};

module.exports.run = async function ({
  api,
  event,
  args,
  Users
}) {
  if (!once(event)) return;

  try {
    const text = clean(args.join(" "));

    if (!text) {
      return sendReply(
        api,
        event,
        random([
          "হুম, বলো 😼",
          "কী বলবে? 👀",
          "আমি শুনছি 😌",
          "বলো বস 😎"
        ])
      );
    }

    const senderName = await Users.getNameUser(
      event.senderID
    );

    const command = text.split(/\s+/)[0].toLowerCase();
    const base = await getAPI();

    if (command === "teach") {
      if (!base) {
        return sendReply(
          api,
          event,
          "API এখন available না 😭",
          false
        );
      }

      const parts = text
        .replace(/^teach\s*/i, "")
        .split(" - ");

      if (parts.length < 2) {
        return sendReply(
          api,
          event,
          "Use: +baby teach [Question] - [Reply]",
          false
        );
      }

      const res = await axios.get(
        `${base}/teach?ask=${encodeURIComponent(parts[0].trim())}&ans=${encodeURIComponent(parts.slice(1).join(" - ").trim())}&senderID=${encodeURIComponent(event.senderID)}&senderName=${encodeURIComponent(senderName)}&groupID=${encodeURIComponent(event.threadID)}`,
        { timeout: 10000 }
      );

      return sendReply(
        api,
        event,
        res.data?.message || "Learned successfully.",
        false
      );
    }

    if (command === "remove" || command === "rm") {
      if (!base) {
        return sendReply(
          api,
          event,
          "API এখন available না 😭",
          false
        );
      }

      const parts = text
        .replace(/^(remove|rm)\s*/i, "")
        .split(" - ");

      if (parts.length < 2) {
        return sendReply(
          api,
          event,
          "Use: +baby remove [Question] - [Reply]",
          false
        );
      }

      const res = await axios.get(
        `${base}/delete?ask=${encodeURIComponent(parts[0].trim())}&ans=${encodeURIComponent(parts.slice(1).join(" - ").trim())}`,
        { timeout: 10000 }
      );

      return sendReply(
        api,
        event,
        res.data?.message || "Done.",
        false
      );
    }

    if (command === "edit") {
      if (!base) {
        return sendReply(
          api,
          event,
          "API এখন available না 😭",
          false
        );
      }

      const parts = text
        .replace(/^edit\s*/i, "")
        .split(" - ");

      if (parts.length < 3) {
        return sendReply(
          api,
          event,
          "Use: +baby edit [Q] - [Old] - [New]",
          false
        );
      }

      const res = await axios.get(
        `${base}/edit?ask=${encodeURIComponent(parts[0].trim())}&old=${encodeURIComponent(parts[1].trim())}&new=${encodeURIComponent(parts.slice(2).join(" - ").trim())}`,
        { timeout: 10000 }
      );

      return sendReply(
        api,
        event,
        res.data?.message || "Done.",
        false
      );
    }

    if (command === "list") {
      if (!base) {
        return sendReply(
          api,
          event,
          "API এখন available না 😭",
          false
        );
      }

      const res = await axios.get(
        `${base}/list`,
        { timeout: 10000 }
      );

      return sendReply(
        api,
        event,
        res.data?.code === 200
          ? `Total Questions: ${res.data.totalQuestions || 0}\nTotal Replies: ${res.data.totalReplies || 0}\nDeveloper: ${OWNER_NAME}`
          : res.data?.message || "Unable to load list.",
        false
      );
    }

    let reply = localReply(text);

    const remote = await getAPIReply(
      text,
      senderName
    );

    if (remote && Math.random() > 0.5) {
      reply = remote;
    }

    return sendReply(
      api,
      event,
      reply,
      true
    );

  } catch {
    return sendReply(
      api,
      event,
      random(normalReplies),
      true
    );
  }
};

module.exports.handleReply = async function ({
  api,
  event,
  Users,
  handleReply
}) {
  if (
    !handleReply ||
    handleReply.name !== "baby"
  ) {
    return;
  }

  if (!once(event)) return;

  try {
    const text = clean(event.body);

    if (!text) return;

    const senderName =
      await Users.getNameUser(
        event.senderID
      );

    let reply = localReply(text);

    const remote =
      await getAPIReply(
        text,
        senderName
      );

    if (remote && Math.random() > 0.5) {
      reply = remote;
    }

    return sendReply(
      api,
      event,
      reply,
      true
    );

  } catch {
    return sendReply(
      api,
      event,
      random(normalReplies),
      true
    );
  }
};

module.exports.handleEvent = async function () {
  return;
};