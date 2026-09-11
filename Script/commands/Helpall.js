module.exports.config = {
  name: "helpall",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Eram",
  description: "Displays all available commands in one page",
  commandCategory: "System",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  try {
    const { threadID, messageID } = event;

    if (!global.client || !global.client.commands) {
      return api.sendMessage(
        "❌ Command list is currently unavailable.",
        threadID,
        messageID
      );
    }

    const commands = global.client.commands;
    const commandSet = new Set();

    // Collect unique commands
    for (const [name] of commands) {
      if (
        typeof name === "string" &&
        name.trim() !== ""
      ) {
        commandSet.add(name.trim().toLowerCase());
      }
    }

    const allCommands = [...commandSet].sort();

    // Create command list
    const commandList = allCommands.length
      ? allCommands
          .map((cmd, index) => `║ ${String(index + 1).padStart(2, "0")} ➜ ${cmd}`)
          .join("\n")
      : "║ No commands available.";

    const finalText = `╔═══❖ 🌟 𝐓𝐔𝐌 𝐃𝐔𝐌 𝐇𝐄𝐋𝐏 🌟 ❖═══╗
║
${commandList}
║
╠═══════ 🔰 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 🔰═══════╣
║ 🤖 𝐁𝐨𝐭 : 𝐓𝐮𝐦 𝐃𝐮𝐦
║ 👑 𝐎𝐰𝐧𝐞𝐫 : 𝐄𝐫𝐚𝐦
║ 📦 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 : ${allCommands.length}
║ ⚡ 𝐏𝐫𝐞𝐟𝐢𝐱 : ${global.config?.PREFIX || "+"}
║
╚══════════════════════════════╝

💡 Type the prefix before a command to use it.`;

    return api.sendMessage(
      finalText,
      threadID,
      messageID
    );

  } catch (error) {
    console.error("HELPALL MODULE ERROR:", error);

    return api.sendMessage(
      "❌ An error occurred while loading the command list.",
      event.threadID,
      event.messageID
    );
  }
};
