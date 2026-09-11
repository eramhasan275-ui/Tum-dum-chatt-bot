module.exports.config = {
  name: "prefix",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Eram",
  description: "Display Tum Dum bot prefix and owner information",
  commandCategory: "Information",
  usages: "",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  try {
    const { threadID, body } = event;

    if (!body || !threadID) return;

    const lowerBody = body
      .toLowerCase()
      .trim()
      .replace(/[!?.,]+$/g, "");

    const triggerWords = [
      "prefix",
      "mprefix",
      "mpre",
      "bot prefix",
      "what is the prefix",
      "what is bot prefix",
      "what prefix",
      "what prefix bot",
      "where prefix",
      "freefix",
      "prefx",
      "prfix",
      "perfix",

      "bot name",
      "what is bot",
      "how to use bot",
      "how use bot",

      "bot not working",
      "bot is offline",
      "bot not talking",
      "where is bot",
      "bot dead",
      "bots dead",
      "where are the bots",

      "daulenh",
      "dấu lệnh"
    ];

    if (!triggerWords.includes(lowerBody)) return;

    // Get thread data safely
    let dataThread = {};

    try {
      dataThread = await Threads.getData(threadID);
    } catch (e) {
      dataThread = {};
    }

    const data = dataThread?.data || {};

    // Get current group prefix
    const threadSetting =
      global.data?.threadData?.get(parseInt(threadID)) || {};

    const prefix =
      threadSetting.PREFIX ||
      global.config?.PREFIX ||
      "+";

    // Get group name safely
    const groupName =
      dataThread?.threadInfo?.threadName ||
      data?.threadName ||
      "Unnamed Group";

    const message = `
🌟━━━━━━━━━━━━━━━━━🌟
     『 𝐓𝐔𝐌 𝐃𝐔𝐌 𝐈𝐍𝐅𝐎 』
🌟━━━━━━━━━━━━━━━━━🌟

『 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 』

➤ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲   : 𝐓𝐮𝐦 𝐃𝐮𝐦
➤ 𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅 : [ ${prefix} ]
➤ 𝗕𝗼𝘁 𝗢𝘄𝗻𝗲𝗿 : 𝐄𝐫𝐚𝐦

『 𝐁𝐎𝐗 𝐈𝐍𝐅𝐎 』

➤ 𝗕𝗼𝘅 𝗡𝗮𝗺𝗲 : ${groupName}
➤ 𝗕𝗼𝘅 𝗣𝗿𝗲𝗳𝗶𝘅 : ${prefix}
➤ 𝗕𝗼𝘅 𝗓𝗜𝗗 : ${threadID}

『 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 』

➤ 𝗢𝘄𝗻𝗲𝗿 : 𝐄𝐫𝐚𝐦
➤ 𝗦𝘁𝗮𝘁𝘂𝘀 : 𝐀𝐜𝐭𝐢𝐯𝐞

🌟━━━━━━━━━━━━━━━━━🌟
      𝗧𝘂𝗺 𝗗𝘂𝗺 𝗶𝘀 𝗿𝗲𝗮𝗱𝘆! 🤖
🌟━━━━━━━━━━━━━━━━━🌟
`;

    return api.sendMessage(message, threadID);

  } catch (error) {
    console.error("PREFIX MODULE ERROR:", error);
  }
};

module.exports.run = async ({ event, api }) => {
  return api.sendMessage(
    `🤖 Tum Dum

➤ Prefix: ${global.config?.PREFIX || "+"}
➤ Owner: Eram

Type "prefix" anytime to see bot information.`,
    event.threadID
  );
};
