const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
  name: "owner",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Eram",
  description: "Show Tum Dum Owner Info with styled box & random photo",
  commandCategory: "Information",
  usages: "owner",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {

  const info = `
╔═════════════════════ ✿
║ ✨ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ✨
╠═════════════════════ ✿
║ 👑 𝗡𝗮𝗺𝗲 : 𝗘𝗿𝗮𝗺
║ 🧸 𝗡𝗶𝗰𝗸 𝗡𝗮𝗺𝗲 : 𝗔𝗹𝗱𝗶𝗲
║ 🎓 𝗣𝗿𝗼𝗳𝗲𝘀𝘀𝗶𝗼𝗻 : 𝗦𝘁𝘂𝗱𝗲𝗻𝘁
║ 📚 𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻 : 𝗛𝗦𝗖
╠═════════════════════ ✿
║ 🤖 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢
╠═════════════════════ ✿
║ 🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : 𝗧𝘂𝗺 𝗗𝘂𝗺
║ 👑 𝗢𝘄𝗻𝗲𝗿 : 𝗘𝗿𝗮𝗺
╠═════════════════════ ✿
║ 🔗 𝗖𝗢𝗡𝗧𝗔𝗖𝗧
╠═════════════════════ ✿
║ 📞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 :
║ wa.me/8801922361823
╚═════════════════════ ✿

❤️ 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴
🤖 𝗧𝘂𝗺 𝗗𝘂𝗺 𝗕𝗼𝘁
`;

  cons[
    "https://gcom/gokzyKd.jpeg",
   m "https://i.imgur.com/g3hlQ0Z.jpeg",
    "hr.com/L7txp4M.jpeg",
    "https://i.eg"
 

  const randomImg =
    images[Math.floor(Math.random() * images.length)];

  const cacheDir = __dirname + "/cache";
  const imagePa

  fs.ensureDirSync(cacheDir);

  const callback = () => {
    if (!fs.existsSync(imagePath)) {
      return api.sendMessage(
        info.trim(),
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
      {
        body: info.trim(),
        attachment: fs.createReadStream(imagePath)
      },
      event.threadID,
      () => {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      },
      event.messageID
    );
  };

  return request(encodeURI(randomImg))
    .pipe(fs.createWriteStream(imagePath))
    .on("close", callback);
};
