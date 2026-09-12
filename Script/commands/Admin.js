/**
 * Tum Dum - Owner Information
 * Owner: Eram
 */

const moment = require("moment-timezone");

module.exports.config = {
    name: "admin",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Eram",
    description: "Show Owner Information",
    commandCategory: "Info",
    usages: "admin",
    cooldowns: 2
};

module.exports.run = async function ({ api, event }) {

    const time = moment()
        .tz("Asia/Dhaka")
        .format("DD/MM/YYYY hh:mm:ss A");

    const message = `
╭━━━━━━━━━━━━━━━━━━━━╮
┃
┃       👑 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎
┃
╰━━━━━━━━━━━━━━━━━━━━╯

╭──────── 𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋 ────────╮
│
│ 👤 Name       : Eram
│ 🚹 Gender     : Male
│ 🎂 Age        : 20+
│ 🎓 Education  : HSC
│
╰───────────────────────────╯

╭──────── 𝐂𝐎𝐍𝐓𝐀𝐂𝐓 ─────────╮
│
│ 💬 WhatsApp  : 01922361823
│
╰───────────────────────────╯

╭───────── 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 ────────╮
│
│ 🤖 Bot       : Tum Dum
│ 👑 Owner     : Eram
│ 🟢 Status    : Online
│
╰───────────────────────────╯

╭──────── 𝐔𝐏𝐃𝐀𝐓𝐄 ─────────╮
│
│ 🕒 ${time}
│
╰───────────────────────────╯

        ✦ 𝐓𝐔𝐌 𝐃𝐔𝐌 ✦
`;

    return api.sendMessage(
        message.trim(),
        event.threadID,
        event.messageID
    );
};