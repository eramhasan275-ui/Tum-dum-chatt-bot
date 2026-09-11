const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "help",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Eram",
    description: "Shows all commands with details",
    commandCategory: "system",
    usages: "[command name/page number]",
    cooldowns: 5,

    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    en: {

        moduleInfo: `╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━━━━━━┫
┃ 🔖 Name: %1
┃ 📄 Usage: %2
┃ 📜 Description: %3
┃ 🔑 Permission: %4
┃ 👨‍💻 Credit: %5
┃ 📂 Category: %6
┃ ⏳ Cooldown: %7s
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: %8
┃ 🤖 Bot Name: Tum Dum
┃ 👑 Owner: Eram
╰━━━━━━━━━━━━━━━━╯`,

        helpList:
            "[ There are %1 commands. Use: \"%2help commandName\" to view more. ]",

        user: "User",
        adminGroup: "Admin Group",
        adminBot: "Admin Bot"
    }
};


// ==========================================
// HELP IMAGES
// ==========================================

const helpImages = [
    "https://i.imgur.com/gokzyKd.jpeg",
    "https://i.imgur.com/g3hlQ0Z.jpeg",
    "https://i.imgur.com/L7txp4M.jpeg",
    "https://i.imgur.com/5dG8PS5.jpeg"
];


// ==========================================
// DOWNLOAD RANDOM IMAGE
// ==========================================

function downloadImages(callback) {

    const randomUrl =
        helpImages[
            Math.floor(Math.random() * helpImages.length)
        ];

    const cacheDir =
        path.join(__dirname, "cache");

    const filePath =
        path.join(cacheDir, "help_random.jpg");

    fs.ensureDirSync(cacheDir);

    request(randomUrl)
        .pipe(fs.createWriteStream(filePath))
        .on("close", () => callback([filePath]));
}


// ==========================================
// HANDLE EVENT
// ==========================================

module.exports.handleEvent = function ({
    api,
    event,
    getText
}) {

    const { commands } = global.client;
    const {
        threadID,
        messageID,
        body
    } = event;

    if (
        !body ||
        typeof body !== "string" ||
        !body.toLowerCase().startsWith("help")
    ) {
        return;
    }

    const splitBody =
        body
            .slice(body.indexOf("help"))
            .trim()
            .split(/\s+/);

    if (
        splitBody.length < 2 ||
        !commands.has(splitBody[1].toLowerCase())
    ) {
        return;
    }

    const threadSetting =
        global.data.threadData.get(
            parseInt(threadID)
        ) || {};

    const command =
        commands.get(
            splitBody[1].toLowerCase()
        );

    const prefix =
        threadSetting.PREFIX ||
        global.config.PREFIX;

    const detail =
        getText(
            "moduleInfo",

            command.config.name,

            command.config.usages ||
                "Not Provided",

            command.config.description ||
                "Not Provided",

            command.config.hasPermssion,

            command.config.credits ||
                "Unknown",

            command.config.commandCategory ||
                "Unknown",

            command.config.cooldowns ||
                0,

            prefix
        );

    downloadImages(files => {

        const attachments =
            files.map(file =>
                fs.createReadStream(file)
            );

        api.sendMessage(
            {
                body: detail,
                attachment: attachments
            },
            threadID,
            () => {

                files.forEach(file => {

                    if (fs.existsSync(file)) {
                        fs.unlinkSync(file);
                    }

                });

            },
            messageID
        );
    });
};


// ==========================================
// MAIN HELP COMMAND
// ==========================================

module.exports.run = function ({
    api,
    event,
    args,
    getText
}) {

    const { commands } = global.client;

    const {
        threadID,
        messageID
    } = event;

    const threadSetting =
        global.data.threadData.get(
            parseInt(threadID)
        ) || {};

    const prefix =
        threadSetting.PREFIX ||
        global.config.PREFIX;


    // ======================================
    // COMMAND DETAILS
    // ======================================

    if (
        args[0] &&
        commands.has(
            args[0].toLowerCase()
        )
    ) {

        const command =
            commands.get(
                args[0].toLowerCase()
            );

        const detailText =
            getText(
                "moduleInfo",

                command.config.name,

                command.config.usages ||
                    "Not Provided",

                command.config.description ||
                    "Not Provided",

                command.config.hasPermssion,

                command.config.credits ||
                    "Unknown",

                command.config.commandCategory ||
                    "Unknown",

                command.config.cooldowns ||
                    0,

                prefix
            );

        downloadImages(files => {

            const attachments =
                files.map(file =>
                    fs.createReadStream(file)
                );

            api.sendMessage(
                {
                    body: detailText,
                    attachment: attachments
                },
                threadID,
                () => {

                    files.forEach(file => {

                        if (fs.existsSync(file)) {
                            fs.unlinkSync(file);
                        }

                    });

                },
                messageID
            );

        });

        return;
    }


    // ======================================
    // COMMAND LIST
    // ======================================

    const arrayInfo =
        Array.from(commands.keys())
            .filter(
                cmdName =>
                    cmdName &&
                    cmdName.trim() !== ""
            )
            .sort();


    const page =
        Math.max(
            parseInt(args[0]) || 1,
            1
        );


    const numberOfOnePage = 20;

    const totalPages =
        Math.max(
            Math.ceil(
                arrayInfo.length /
                numberOfOnePage
            ),
            1
        );


    const currentPage =
        Math.min(
            page,
            totalPages
        );


    const start =
        numberOfOnePage *
        (currentPage - 1);


    const helpView =
        arrayInfo.slice(
            start,
            start + numberOfOnePage
        );


    const msg =
        helpView.length > 0
            ? helpView
                .map(
                    cmdName =>
                        `┃ ✪ ${cmdName}`
                )
                .join("\n")
            : "┃ ❌ No commands found";


    // ======================================
    // FINAL HELP MESSAGE
    // ======================================

    const text = `
╭━━━━━━━━━━━━━━━━╮
┃ 📜 𝐓𝐔𝐌 𝐃𝐔𝐌 𝐇𝐄𝐋𝐏 📜
┣━━━━━━━━━━━━━━━━┫
┃ 📄 Page: ${currentPage}/${totalPages}
┃ 🧮 Total: ${arrayInfo.length}
┣━━━━━━━━━━━━━━━━┫
${msg}
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🤖 Bot Name: Tum Dum
┃ 👑 Owner: Eram
╰━━━━━━━━━━━━━━━━╯
`;


    // ======================================
    // SEND HELP
    // ======================================

    downloadImages(files => {

        const attachments =
            files.map(file =>
                fs.createReadStream(file)
            );

        api.sendMessage(
            {
                body: text.trim(),
                attachment: attachments
            },
            threadID,
            () => {

                files.forEach(file => {

                    if (fs.existsSync(file)) {
                        fs.unlinkSync(file);
                    }

                });

            },
            messageID
        );

    });
};
