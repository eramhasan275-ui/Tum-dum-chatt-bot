/**
 * Tum Dum - Bot Information
 * Owner: Eram
 */

module.exports.config = {
  name: "info",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Eram",
  description: "Tum Dum Bot information command",
  commandCategory: "For users",
  hide: true,
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({
  api,
  event,
  args,
  Users,
  Threads
}) {

  const { threadID } = event;

  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const moment = require("moment-timezone");

  // ==============================
  // CONFIG
  // ==============================

  const { configPath } = global.client;

  delete require.cache[require.resolve(configPath)];

  const config = require(configPath);

  const { commands } = global.client;

  // ==============================
  // THREAD PREFIX
  // ==============================

  const threadData =
    await Threads.getData(String(threadID));

  const threadSetting =
    threadData.data || {};

  const prefix =
    threadSetting.hasOwnProperty("PREFIX")
      ? threadSetting.PREFIX
      : config.PREFIX;

  // ==============================
  // BOT UPTIME
  // ==============================

  const uptime = process.uptime();

  const hours =
    Math.floor(uptime / 3600);

  const minutes =
    Math.floor((uptime % 3600) / 60);

  const seconds =
    Math.floor(uptime % 60);

  // ==============================
  // SYSTEM DATA
  // ==============================

  const totalUsers =
    global.data.allUserID.length;

  const totalThreads =
    global.data.allThreadID.length;

  const totalCommands =
    commands.size;

  const ping =
    Date.now() - event.timestamp;

  // ==============================
  // BOT INFORMATION
  // ==============================

  const msg = `
╭⭓ ⪩ 𝐓𝐔𝐌 𝐃𝐔𝐌 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 ⪨
│
├─ 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : 𝐓𝐮𝐦 𝐃𝐮𝐦
├─ 👑 𝗢𝘄𝗻𝗲𝗿 : 𝐄𝐫𝐚𝐦
├─ ☢️ 𝗣𝗿𝗲𝗳𝗶𝘅 : ${config.PREFIX}
├─ ♻️ 𝗣𝗿𝗲𝗳𝗶𝘅 𝗕𝗼𝘅 : ${prefix}
├─ 🔶 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 : ${totalCommands}
├─ 🔰 𝗣𝗶𝗻𝗴 : ${ping}ms
│
╰───────⭓

╭⭓ ⪩ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ⪨
│
├─ 👑 𝗡𝗮𝗺𝗲 : 𝐄𝐫𝐚𝐦
├─ 📞 𝗪𝗵𝗮𝘁𝘀𝐀𝐩𝐩 :
│ wa.me/8801922361823
│
╰───────⭓

╭⭓ ⪩ 𝗔𝗖𝗧𝗜𝗩𝗜𝗧𝗜𝗄𝗄𝗦 ⪨
│
├─ ⏳ 𝗔𝗰𝘁𝗶𝘃𝗲 𝗧𝗶𝗺𝗲 : ${hours}h ${minutes}m ${seconds}s
├─ 📣 𝗚𝗿𝗼𝘂𝗽𝘀 : ${totalThreads}
├─ 🧿 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀 : ${totalUsers}
╰───────⭓

❤️ 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴
🤖 𝐓𝐮𝐦 𝐃𝐮𝐦 𝐁𝐨𝐭 🌺
`;

  // ==============================
  // RANDOM BACKGROUND
  // ==============================

  const imgLinks = [
    "https://i.imgur.com/gokzyKd.jpeg",
    "https://i.imgur.com/g3hlQ0Z.jpeg",
    "https://i.imgur.com/L7txp4M.jpeg",
    "https://i.imgur.com/5dG8PS5.jpeg"
  ];

  const imgLink =
    imgLinks[
      Math.floor(Math.random() * imgLinks.length)
    ];

  // ==============================
  // CACHE
  // ==============================

  const cacheDir =
    __dirname + "/cache";

  const imgPath =
    cacheDir + "/info.jpg";

  fs.ensureDirSync(cacheDir);

  // ==============================
  // SEND MESSAGE
  // ==============================

  const callback = () => {

    if (!fs.existsSync(imgPath)) {
      return api.sendMessage(
        msg.trim(),
        threadID,
        event.messageID
      );
    }

    return api.sendMessage(
      {
        body: msg.trim(),
        attachment:
          fs.createReadStream(imgPath)
      },
      threadID,
      () => {
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      },
      event.messageID
    );
  };

  return request(encodeURI(imgLink))
    .pipe(
      fs.createWriteStream(imgPath)
    )
    .on("close", callback);
};
