module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "2.0.0",
  credits: "Eram",
  description: "Group leave notification",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function({
  api,
  event,
  Users,
  Threads
}) {
  try {
    // Bot নিজে group থেকে বের হলে কোনো message পাঠাবে না
    if (
      event.logMessageData.leftParticipantFbId ===
      api.getCurrentUserID()
    ) {
      return;
    }

    const {
      createReadStream,
      existsSync,
      mkdirSync
    } = global.nodemodule["fs-extra"];

    const { join } = global.nodemodule["path"];

    const { threadID } = event;

    const data =
      global.data.threadData.get(parseInt(threadID)) ||
      (await Threads.getData(threadID)).data;

    const userID =
      event.logMessageData.leftParticipantFbId;

    const name =
      global.data.userName.get(userID) ||
      await Users.getNameUser(userID);

    // নিজে নিজে leave করলে
    const type =
      event.author === userID
        ? "নিজেই গ্রুপ থেকে বের হয়ে গেছেন।"
        : "গ্রুপ থেকে সরিয়ে দেওয়া হয়েছে।";

    const cachePath =
      join(__dirname, "cache", "leaveGif");

    const gifPath =
      join(cachePath, "leave1.gif");

    if (!existsSync(cachePath)) {
      mkdirSync(cachePath, {
        recursive: true
      });
    }

    let msg =
      typeof data.customLeave === "undefined"
        ? `╭───────────────╮
   🌿 𝐋𝐄𝐅𝐓 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍
╰───────────────╯

👤 ${name}

${type}

🤍 ভালো থাকবেন।
আবার দেখা হবে।

───────────────
🤖 Tum Dum
👑 Owner: Eram
───────────────`
        : data.customLeave;

    msg = msg
      .replace(/\{name}/g, name)
      .replace(/\{type}/g, type);

    const formPush =
      existsSync(gifPath)
        ? {
            body: msg,
            attachment: createReadStream(gifPath)
          }
        : {
            body: msg
          };

    return api.sendMessage(
      formPush,
      threadID
    );

  } catch (error) {
    console.error(
      "[Tum Dum Leave] " +
      error.message
    );
  }
};
