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

╭⭓ ⪩ 𝗔𝗖𝗧𝗜𝗩𝐈𝐓𝐈𝐄𝐒 ⪨
│
├─ ⏳ 𝗔𝗰𝘁𝗶𝘃𝗲 𝗧𝗶𝗺𝗲 : ${hours}h ${minutes}m ${seconds}s
├─ 📣 𝗚𝗿𝗼𝘂𝗽𝘀 : ${totalThreads}
├─ 🧿 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀 : ${totalUsers}
╰───────⭓

❤️ 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴
🤖 𝐓𝐮𝐦 𝐃𝐮𝐦 𝐁𝐨𝐭 🌺
`;

  // ==============================
  // SEND MESSAGE
  // ==============================

  return api.sendMessage(
    msg.trim(),
    threadID,
    event.messageID
  );
};