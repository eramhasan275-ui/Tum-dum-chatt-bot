/**
 * =========================================================
 *                 TUM DUM - HELP SYSTEM
 * =========================================================
 * Bot Name   : Tum Dum
 * Owner      : ইরাম
 * WhatsApp   : 01922361823
 * Version    : 3.0.0
 * Description: Professional Command & Bot Information System
 * =========================================================
 */

module.exports.config = {
    name: "help",
    version: "3.0.0",
    hasPermssion: 0,
    credits: "ইরাম",
    description: "Professional command list and detailed command information",
    commandCategory: "System",
    usages: "[command name/page number]",
    cooldowns: 5,

    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};


/**
 * =========================================================
 *                     LANGUAGE
 * =========================================================
 */

module.exports.languages = {
    en: {

        moduleInfo: `╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃      ✨ 𝐓𝐔𝐌 𝐃𝐔𝐌 ✨
┃    𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍
┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 🔖 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 : %1
┃ 📝 𝐔𝐬𝐚𝐠𝐞    : %2
┃ 📖 𝐀𝐛𝐨𝐮𝐭    : %3
┃ 🔐 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: %4
┃ 📂 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲 : %6
┃ ⏳ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰  : %7s
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ⚙️ 𝐏𝐫𝐞𝐟𝐢𝐱   : %8
┃ 🤖 𝐁𝐨𝐭      : %9
┃ 👑 𝐎𝐰𝐧𝐞𝐫    : ইরাম
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 💬 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩
┃ 📱 01922361823
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`,

        helpList: "[ Total %1 commands ] Use \"%2help <command>\" for detailed information.",

        user: "User",
        adminGroup: "Group Admin",
        adminBot: "Bot Admin"
    }
};


/**
 * =========================================================
 *                  GET PERMISSION NAME
 * =========================================================
 */

function getPermission(permission) {

    if (permission === 0)
        return "User";

    if (permission === 1)
        return "Group Admin";

    if (permission === 2)
        return "Bot Admin";

    return "Unknown";
}


/**
 * =========================================================
 *                    EVENT HANDLER
 * =========================================================
 */

module.exports.handleEvent = function ({ api, event, getText }) {

    try {

        const { commands } = global.client;
        const { threadID, messageID, body } = event;

        if (!body || typeof body !== "string")
            return;

        const text = body.trim();

        /**
         * Allows:
         * help command
         * help commandName
         */

        if (!/^help\b/i.test(text))
            return;

        const splitBody = text.split(/\s+/);

        if (splitBody.length < 2)
            return;

        const commandName = splitBody[1].toLowerCase();

        if (!commands.has(commandName))
            return;

        const threadSetting =
            global.data.threadData.get(parseInt(threadID)) || {};

        const command = commands.get(commandName);

        const prefix =
            threadSetting.PREFIX ||
            global.config.PREFIX ||
            "+";

        const detail = getText(
            "moduleInfo",

            command.config.name,

            command.config.usages ||
            "Not Provided",

            command.config.description ||
            "Professional command",

            getPermission(command.config.hasPermssion),

            command.config.credits ||
            "ইরাম",

            command.config.commandCategory ||
            "System",

            command.config.cooldowns ||
            0,

            prefix,

            global.config.BOTNAME ||
            "Tum Dum"
        );

        api.sendMessage(
            detail,
            threadID,
            messageID
        );

    } catch (error) {

        console.error(
            "[TUM DUM HELP ERROR]",
            error
        );

    }
};


/**
 * =========================================================
 *                       MAIN HELP
 * =========================================================
 */

module.exports.run = function ({
    api,
    event,
    args,
    getText
}) {

    try {

        const { commands } = global.client;
        const { threadID, messageID } = event;

        const threadSetting =
            global.data.threadData.get(parseInt(threadID)) || {};

        const prefix =
            threadSetting.PREFIX ||
            global.config.PREFIX ||
            "+";


        /**
         * =================================================
         *              SINGLE COMMAND INFORMATION
         * =================================================
         */

        if (
            args[0] &&
            commands.has(args[0].toLowerCase())
        ) {

            const command =
                commands.get(args[0].toLowerCase());

            const detailText = getText(
                "moduleInfo",

                command.config.name,

                command.config.usages ||
                "Not Provided",

                command.config.description ||
                "Professional command",

                getPermission(
                    command.config.hasPermssion
                ),

                command.config.credits ||
                "ইরাম",

                command.config.commandCategory ||
                "System",

                command.config.cooldowns ||
                0,

                prefix,

                global.config.BOTNAME ||
                "Tum Dum"
            );

            return api.sendMessage(
                detailText,
                threadID,
                messageID
            );
        }


        /**
         * =================================================
         *                  COMMAND LIST
         * =================================================
         */

        const arrayInfo = Array
            .from(commands.keys())

            .filter(cmdName =>
                cmdName &&
                cmdName.trim() !== ""
            )

            .sort();


        /**
         * =================================================
         *                     PAGE
         * =================================================
         */

        let page =
            parseInt(args[0]);

        if (
            isNaN(page) ||
            page < 1
        ) {
            page = 1;
        }


        const numberOfOnePage = 20;

        const totalPages =
            Math.max(
                Math.ceil(
                    arrayInfo.length /
                    numberOfOnePage
                ),
                1
            );


        /**
         * Prevent invalid page
         */

        if (page > totalPages) {
            page = totalPages;
        }


        const start =
            numberOfOnePage *
            (page - 1);


        const helpView =
            arrayInfo.slice(
                start,
                start + numberOfOnePage
            );


        /**
         * =================================================
         *                COMMAND FORMAT
         * =================================================
         */

        let msg = "";

        helpView.forEach(
            (cmdName, index) => {

                msg +=
                    `┃ ${String(index + 1).padStart(2, "0")} │ ${cmdName}\n`;

            }
        );


        /**
         * =================================================
         *                PROFESSIONAL HELP
         * =================================================
         */

        const text = `╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃       ✨ 𝐓𝐔𝐌 𝐃𝐔𝐌 ✨
┃    𝐒𝐌𝐀𝐑𝐓 𝐌𝐄𝐒𝐒𝐄𝐍𝐆𝐄𝐑 𝐁𝐎𝐓
┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃
┃ 👑 𝐎𝐰𝐧𝐞𝐫 : ইরাম
┃ 🤖 𝐁𝐨𝐭   : ${global.config.BOTNAME || "Tum Dum"}
┃ ⚙️  𝐏𝐫𝐞𝐟𝐢𝐱: ${prefix}
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃       📚 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓
┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📄 𝐏𝐚𝐠𝐞  : ${page}/${totalPages}
┃ 🧮 𝐓𝐨𝐭𝐚𝐥 : ${arrayInfo.length}
┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫
${msg}┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 💡 𝐇𝐨𝐰 𝐭𝐨 𝐔𝐬𝐞
┃ ${prefix}help <command>
┃
┃ Example:
┃ ${prefix}help menu
┃ ${prefix}help admin
┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📱 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 : 01922361823
┃ 👨‍💻 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 : Eram hasan
┃
┃ ✨ Thanks for using Tum Dum
┃ ❤️ Made with dedication by ইরাম
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;


        /**
         * =================================================
         *                     SEND
         * =================================================
         */

        api.sendMessage(
            text,
            threadID,
            messageID
        );


    } catch (error) {

        console.error(
            "[TUM DUM HELP ERROR]",
            error
        );

        api.sendMessage(
            "❌ An error occurred while loading the help menu.",
            event.threadID,
            event.messageID
        );

    }
};