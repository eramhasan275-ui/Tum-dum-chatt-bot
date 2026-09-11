/**
 * Tum Dum - Owner Information
 * Owner: Eram
 */

const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "admin",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Eram",
    description: "Show Tum Dum Owner Info",
    commandCategory: "info",
    usages: "admin",
    cooldowns: 2
};

module.exports.run = async function ({ api, event }) {

    const time = moment()
        .tz("Asia/Dhaka")
        .format("DD/MM/YYYY hh:mm:ss A");

    const cacheDir = __dirname + "/cache";
    const imgPath = cacheDir + "/owner.jpg";

    // Create cache folder if it doesn't exist
    fs.ensureDirSync(cacheDir);

    const message = `
┌───────────────⭓
│ 𝗢𝗪𝗡𝗘𝗥 𝗗𝗘𝗧𝗔𝗜𝗟𝗦
├───────────────
│ 👤 𝐍𝐚𝐦𝐞 : 𝐄𝐫𝐚𝐦
│ 🎓 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : HSC (2026)
│ 🏠 𝐋𝐨𝐜𝐚𝐭𝐢𝐨𝐧 : Dhaka, Bangladesh
└───────────────⭓

┌───────────────⭓
│ 𝗖𝗢𝗡𝗧𝗔𝗖𝗧
├───────────────
│ 📱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 :
│ wa.me/8801922361823
└───────────────⭓

┌───────────────⭓
│ 🤖 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢
├───────────────
│ 🤖 𝐁𝐨𝐭 : 𝐓𝐮𝐦 𝐃𝐮𝐦
│ 👑 𝐎𝐰𝐧𝐞𝐫 : 𝐄𝐫𝐚𝐦
│ 🟢 𝐒𝐭𝐚𝐭𝐮𝐬 : Online
└───────────────⭓

┌───────────────⭓
│ 🕒 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗧𝗶𝗺𝗲
├───────────────
│ ${time}
└───────────────⭓

❤️ 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴
🤖 𝐓𝐮𝐦 𝐃𝐮𝐦 𝐁𝐨𝐭 🌺
`;

    // Image used by the command
    const imageURL = "https://i.imgur.com/g3hlQ0Z.jpeg";

    const callback = () => {

        if (!fs.existsSync(imgPath)) {
            return api.sendMessage(
                message.trim(),
                event.threadID,
                event.messageID
            );
        }

        return api.sendMessage(
            {
                body: message.trim(),
                attachment: fs.createReadStream(imgPath)
            },
            event.threadID,
            () => {
                if (fs.existsSync(imgPath)) {
                    fs.unlinkSync(imgPath);
                }
            },
            event.messageID
        );
    };

    return request(encodeURI(imageURL))
        .pipe(fs.createWriteStream(imgPath))
        .on("close", callback);
};
