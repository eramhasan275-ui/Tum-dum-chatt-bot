const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "slap",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "ইরাম",
  description: "Send a slap GIF to a mentioned user",
  commandCategory: "Fun",
  usages: "@mention",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  try {
    const { threadID, messageID, mentions } = event;

    if (!mentions || Object.keys(mentions).length === 0) {
      return api.sendMessage(
        "Please tag someone 😅",
        threadID,
        messageID
      );
    }

    const targetID = Object.keys(mentions)[0];
    const targetName = mentions[targetID];

    const response = await axios.get(
      "https://api.waifu.pics/sfw/slap",
      {
        timeout: 15000,
        headers: {
          "User-Agent": "Tum-Dum-Bot/1.0"
        }
      }
    );

    if (!response.data || !response.data.url) {
      throw new Error("GIF URL not found");
    }

    const gifURL = response.data.url;

    const cacheDir = path.join(__dirname, "cache");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const filePath = path.join(
      cacheDir,
      `slap_${Date.now()}.gif`
    );

    const gif = await axios.get(gifURL, {
      responseType: "arraybuffer",
      timeout: 20000,
      headers: {
        "User-Agent": "Tum-Dum-Bot/1.0"
      }
    });

    fs.writeFileSync(filePath, Buffer.from(gif.data));

    return api.sendMessage(
      {
        body: `👋 ${event.senderID === targetID ? "নিজেকেই" : `${targetName}`} কে একটা থাপ্পড়! 😂`,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      () => {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch {}
      },
      messageID
    );

  } catch (error) {
    console.error("SLAP ERROR:", error);

    return api.sendMessage(
      "⚠️ Slap GIF তৈরি করা যাচ্ছে না। একটু পরে আবার চেষ্টা করো।",
      event.threadID,
      event.messageID
    );
  }
};