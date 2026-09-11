/**
 * Tum Dum - Admin Mention
 * Owner: Eram
 */

module.exports.config = {
  name: "adminmention",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Eram",
  description: "Replies when someone directly mentions a bot admin",
  commandCategory: "Other",
  usages: "@",
  cooldowns: 1
};

module.exports.handleEvent = function ({ api, event }) {

  // Bot Admin IDs
  const adminIDs = [
    "100089047474463",
    "100001039692046",
    "100044713412032"
  ].map(String);

  // Admin নিজে mention করলে reply করবে না
  if (adminIDs.includes(String(event.senderID))) {
    return;
  }

  // কোনো message reply হলে কাজ করবে না
  if (event.type === "message_reply" || event.messageReply) {
    return;
  }

  // Mention না থাকলে কিছু করবে না
  if (
    !event.mentions ||
    Object.keys(event.mentions).length === 0
  ) {
    return;
  }

  const mentionedIDs =
    Object.keys(event.mentions).map(String);

  // Admin-কে mention করা হয়েছে কিনা
  if (
    !adminIDs.some(id =>
      mentionedIDs.includes(id)
    )
  ) {
    return;
  }

  const replies = [

    "জি, বসকে মেনশন করেছেন। একটু অপেক্ষা করুন। 🙂",

    "বসের নজরে মেনশন পৌঁছে গেছে। 😌",

    "বস বর্তমানে ব্যস্ত আছেন। প্রয়োজনীয় কথা হলে একটু পরে বলুন।",

    "বসকে সরাসরি মেনশন করেছেন দেখছি। 👀",

    "বস এখন ব্যস্ত আছেন। আপনার কথাটা আমাকে বলতে পারেন। 🙂",

    "মেনশনটি নোট করা হয়েছে। বস সময় পেলে উত্তর দেবেন।",

    "একটু ধৈর্য ধরুন, বসকে জানিয়ে দিচ্ছি। 🤍",

    "বস এখন কাজে আছেন। পরে মেনশন করলে ভালো হবে।",

    "বসকে ডাকছেন? 😄 তিনি সময় পেলেই দেখবেন।",

    "আপনার মেসেজ বসের কাছে পৌঁছে গেছে। 🌿",

    "বস এখন available নন। একটু পরে চেষ্টা করুন।",

    "ঠিক আছে, বসকে মেনশন করা হয়েছে। 🙂"

  ];

  const reply =
    replies[
      Math.floor(
        Math.random() * replies.length
      )
    ];

  return api.sendMessage(
    reply,
    event.threadID,
    event.messageID
  );
};

module.exports.run = async function () {};
