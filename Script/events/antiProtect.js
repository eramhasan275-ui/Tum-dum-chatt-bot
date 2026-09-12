/**
 * TUM DUM - Anti Protect
 * Owner: Eram
 * Protects Group Name & Group Photo
 *
 * Commands:
 * +antiprotect on
 * +antiprotect off
 * +antiprotect status
 */

const fs = require("fs-extra");
const axios = require("axios");

const DATA_DIR = `${__dirname}/../../cache/antiProtect/`;

module.exports.config = {
  name: "antiprotect",
  version: "2.0.0",
  credits: "Eram",
  description: "Protect group name and photo",
  commandCategory: "Admin",
  hasPermssion: 1,
  usages: "on | off | status",
  cooldowns: 3,

  // Event support
  eventType: [
    "log:thread-name",
    "log:thread-icon"
  ]
};

function getFile(threadID) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  return `${DATA_DIR}${threadID}.json`;
}

async function getAdmins(api, threadID) {
  const info = await api.getThreadInfo(threadID);
  return (info.adminIDs || []).map(x => String(x.id));
}

/* =========================
   COMMAND
========================= */

module.exports.run = async function ({ api, event, args }) {
  try {
    const threadID = event.threadID;
    const senderID = String(event.senderID);
    const command = (args[0] || "").toLowerCase();

    const admins = await getAdmins(api, threadID);
    const botID = String(api.getCurrentUserID());

    if (!admins.includes(senderID)) {
      return api.sendMessage(
        "❌ শুধু Group Admin এই command ব্যবহার করতে পারবে।",
        threadID
      );
    }

    const file = getFile(threadID);
    let data = {};

    if (fs.existsSync(file)) {
      try {
        data = JSON.parse(fs.readFileSync(file, "utf8"));
      } catch {
        data = {};
      }
    }

    /* STATUS */

    if (command === "status") {
      return api.sendMessage(
        `🛡️ TUM DUM Anti Protect\n\n` +
        `Status: ${data.enabled ? "🟢 ON" : "🔴 OFF"}\n` +
        `Protected Name: ${data.name || "Not set"}\n` +
        `Photo: ${data.image ? "✅ Saved" : "❌ Not saved"}`,
        threadID
      );
    }

    /* ON */

    if (command === "on") {
      const info = await api.getThreadInfo(threadID);

      data = {
        enabled: true,
        name: info.threadName || "",
        image: info.imageSrc || null,
        updatedAt: Date.now()
      };

      fs.writeFileSync(file, JSON.stringify(data, null, 2));

      return api.sendMessage(
        `🛡️ Anti Protect চালু হয়েছে!\n\n` +
        `👥 Group: ${info.threadName || "Unnamed"}\n` +
        `📝 Name Protection: ✅\n` +
        `🖼️ Photo Protection: ${data.image ? "✅" : "⚠️"}\n\n` +
        `এখন থেকে অন্য কেউ Group Name বা Photo পরিবর্তন করলে আগেরটা restore করার চেষ্টা করবে।`,
        threadID
      );
    }

    /* OFF */

    if (command === "off") {
      data.enabled = false;
      fs.writeFileSync(file, JSON.stringify(data, null, 2));

      return api.sendMessage(
        "🔴 Anti Protect বন্ধ করা হয়েছে।",
        threadID
      );
    }

    return api.sendMessage(
      `🛡️ Anti Protect\n\n` +
      `+antiprotect on\n` +
      `+antiprotect off\n` +
      `+antiprotect status`,
      threadID
    );

  } catch (error) {
    console.log("AntiProtect Command Error:", error);
    return api.sendMessage(
      "❌ Anti Protect চালু করতে সমস্যা হয়েছে।",
      event.threadID
    );
  }
};


/* =========================
   EVENT PROTECTION
========================= */

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const threadID = event.threadID;
    const file = getFile(threadID);

    if (!fs.existsSync(file)) return;

    let data;

    try {
      data = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      return;
    }

    if (!data.enabled) return;

    const senderID = String(event.author || event.senderID);
    const botID = String(api.getCurrentUserID());

    const admins = await getAdmins(api, threadID);

    // Admin বা Bot পরিবর্তন করলে নতুন অবস্থাকে save করবে
    if (admins.includes(senderID) || senderID === botID) {
      const info = await api.getThreadInfo(threadID);

      data.name = info.threadName || data.name;
      data.image = info.imageSrc || data.image;
      data.updatedAt = Date.now();

      fs.writeFileSync(file, JSON.stringify(data, null, 2));
      return;
    }

    /* GROUP NAME */

    if (event.logMessageType === "log:thread-name") {
      if (data.name) {
        await api.setTitle(data.name, threadID).catch(() => {});
      }

      return api.sendMessage(
        `🚫 Group Name Change Blocked!\n\n` +
        `👤 User ID: ${senderID}\n` +
        `🔒 Protected Name: ${data.name}`,
        threadID
      );
    }

    /* GROUP PHOTO */

    if (event.logMessageType === "log:thread-icon") {
      if (data.image) {
        try {
          const response = await axios.get(data.image, {
            responseType: "arraybuffer",
            timeout: 15000
          });

          const buffer = Buffer.from(response.data);

          await api.changeGroupImage(buffer, threadID);
        } catch (err) {
          console.log("Photo restore error:", err.message);
        }
      }

      return api.sendMessage(
        `🚫 Group Photo Change Blocked!\n\n` +
        `👤 User ID: ${senderID}\n` +
        `🖼️ Old photo restore করা হয়েছে।`,
        threadID
      );
    }

  } catch (error) {
    console.log("AntiProtect Event Error:", error);
  }
};


/* =========================
   COMPATIBILITY
========================= */

module.exports.onStart = module.exports.run;

module.exports.onEvent = module.exports.handleEvent;