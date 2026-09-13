const axios = require("axios");

const apiList = "https://gitlab.com/shahadat-sahu/sahu-api/-/raw/main/API.json";

const getMainAPI = async () => (await axios.get(apiList)).data.simsimi;

module.exports.config = {
  name: "autoreplybot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Eram",
  usePrefix: false,
  commandCategory: "Chat",
  cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body, senderID } = event;
  if (!body) return;

  const msg = body.toLowerCase().trim();

  const responses = {
    "miss you": "অরেক বেডারে Miss না করে xan মেয়ে হলে আমাকে ইনবক্স করো ইরাম যেনো না জানে তাহলে কোট দিবে😶👻😘",
    "miss u too": "হুম আমি ও তোমাকে একদম মিস করি না থু😏💖",
     
  "Bot" : "dakis na to sor",
     "আমি কি জানিস" : "কিডা তুই 🙄",
      "faraz" : "বাড়ি সভার মামা",
    "kiss de": "কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
    "👍": "সর এখান থেকে লাইকার আবাল..!🐸🤣👍⛏️",
    "hi": "এত হাই-হ্যালো কর ক্যান প্রিও..!😜🫵",
    "adira": "অটো টুন সেটা আবার কি🙂🌚👊🏻",

    "sadiya" : "সাদিয়া কে ডেকো না ফুস করে দিবে",
     "sabab" : " সাবাব, বেবী কাছে আসো 🙄",

"ফারাজ" : "বদ্দা এর রক্ত চানা এর খুব পছন্দ 🫣",

    "চানা" : "its sanaaaaaaaaaaaa 😒",

    "pro": "Khud k0o KYa LeGend SmJhTi Hai 😂",
    "good morning": "GOOD MORNING দাত ব্রাশ করে খেয়ে নেও😚",
    "good night": "Sweet Dream babu… 😏💤",
    "Abal": "~ তোর নানিকে আসসালামু আলাইকুম 🤖",
    
"Bot": " তারেক কাক্কু এর মেয়ে রে alabu কারেন্ট নাই ডাকিস না.!😘",
    "owner": " উনারে দিয়ে তোমার কাজ কি",
    "admin": "He is eram তাকে সবাই চিনে😘☺️ আসলে চিনেই না 🙄 আকাইম্মা একটা",
    "babi": "এ তো হাছিনা হে মেরে দিলকি দারকান হে মেরি জান হে😍.",
    "chup": "তুই চুপ চুপ কর পাগল ছাগল",
    "tum dum": "আসসালামু আলাইকুম",
  "shut up": "তোরে টাইম নিয়ে মারুম 😒",
    "Assalamualaikum": "Walaikumassalam❤️‍🩹",
    "assalamualaikum" :"walaikum assalam",

"ওয়ালাইকুমুস সালাম": "তারপর বলো কেমন আছো",
     "kheyeso": "নাহ রাগ করেছি🙄",
    "আসসালামু আলাইকুম":"ওয়ালাইকুম আসসালাম",
    "kiss me": "তুমি পঁচা তোমাকে কিস দিবো না 🤭",
    "thanks": "Thakns না দিয়ে একটা গান  শোনাও",
    "i love you": "আমাকে এখুনি গুঁতা দিন🫢😻",
    "love you": "ভালোবাসা নামক আবলামী করতে চাইলে  ইনবক্সে গুতা দিন😘 ইরাম কে জানিয়েন না আবার কোট দিবে 🫪",
    "bye": "চিপায় যাবে নাকি..!🌚🌶️",
    "Ami ": "হ্যা বলো কেমন আছেন..?☺️",
    "bot er baccha": "আমার বাচ্চা তো তোমার গার্লফ্রেন্ডের পেটে..!!🌚⛏️",
    "tor nam ki": "MY NAME IS Tum dum 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭💖",
    "pic de": "এন থেকে সর দুরে গিয়া মর😒",
    "bot Hi": "Hello 🌚👊🏻..!🥱🌝🌚",
    "hala": "রাগ করে না সোনা পাখি 🥰",
    "vag": "এতো রাগ শরীরের জন্য ভালো না 🥰",
    "তারপর ": "sulu লুলু .!🌚🤣",
    "kire ki koros": "তোমার কথা ভাবতে ছি জানু 😚",
    "ki koros": "সুন্দরী পটাতে ব্যস্ত আছি😏💘",
    "kire bot": "হ্যাঁ সব কেমন আছেন🙈",
    "valo aso": "হ্যাঁ আলহামদুলিল্লাহ তুমি?😌💞",
    "pagol": "হুম পাগল, কিন্তু তোমারই পাগল 😏😂",
    "breakup": "ফুকাস ওন ক্যারিয়ার 😎🔥",
    "tui ke": "আমি tum dum ChatBot 😏",
    "umm": "এতো Umm কেনো জানু… কিছু বলবা? 😉",
    "hmm": "Hmmm কিসের হুমম জানু ",
    "love": "আমি তোমাকে ভালোবাসি জান😻🔥"
  };

  if (!responses[msg]) return;

  if (!global.client.handleReply) global.client.handleReply = [];

  return api.sendMessage(
    responses[msg],
    threadID,
    (err, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        type: "sahu"
      });
    },
    messageID
  );
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.senderID !== handleReply.author) return;

  try {
    const text = event.body.trim();

    const base = await getMainAPI();
    const link = `${base}/simsimi?text=${encodeURIComponent(text)}`;

    const res = await axios.get(link);

    const reply = Array.isArray(res.data.response)
      ? res.data.response[0]
      : res.data.response;

    if (!global.client.handleReply) global.client.handleReply = [];

    return api.sendMessage(
      reply,
      event.threadID,
      (err, info) => {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "sahu"
        });
      },
      event.messageID
    );

  } catch {
    return api.sendMessage("🙂 একটু পরে আবার বলো", event.threadID, event.messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  return module.exports.handleEvent({ api, event });
};