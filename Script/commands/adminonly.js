const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "onlyadmin",
  version: "3.0.0",
  hasPermssion: 2,
  credits: "ইরাম",
  description: "Bot Admin Only Mode",
  commandCategory: "Admin",
  usages: "onlyadmin",
  cooldowns: 5
};

module.exports.onLoad = () => {
  const dir = path.join(__dirname, "cache");
  const file = path.join(dir, "data.json");

  if (!fs.existsSync(dir)) {
    fs.ensureDirSync(dir);
  }

  let data = {};

  if (fs.existsSync(file)) {
    try {
      data = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
      data = {};
    }
  }

  if (!data.adminbox) {
    data.adminbox = {};
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

module.exports.run = async ({ api, event }) => {
  const file = path.join(__dirname, "cache", "data.json");

  let data = {};

  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    data = {};
  }

  if (!data.adminbox) {
    data.adminbox = {};
  }

  const threadID = event.threadID;

  data.adminbox[threadID] = !data.adminbox[threadID];

  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  return api.sendMessage(
    data.adminbox[threadID]
      ? "✅ Admin Only Mode ON\n\nশুধুমাত্র Bot Admin এখন command ব্যবহার করতে পারবে।"
      : "✅ Admin Only Mode OFF\n\nসবাই এখন command ব্যবহার করতে পারবে।",
    threadID,
    event.messageID
  );
};