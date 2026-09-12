/**
 * Tum Dum - Premium Help System
 * Owner: Eram
 * Text Only • No External Images • No Old Credits/Links
 */

module.exports.config = {
    name: "help",
    version: "4.0.0",
    hasPermssion: 0,
    credits: "Eram",
    description: "Premium command help system",
    commandCategory: "System",
    usages: "[command name/page number]",
    cooldowns: 5,

    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    en: {

        moduleInfo: `╭━━━〔 𝐓𝐔𝐌 𝐃𝐔𝐌 〕━━━╮
┃
┃  ✦ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎
┃
┣━━━━━━━━━━━━━━━━━━━━┫
┃  ◈ Name      : %1
┃  ◈ Usage     : %2
┃  ◈ Description : %3
┃  ◈ Permission: %4
┃  ◈ Credit    : %5
┃  ◈ Category  : %6
┃  ◈ Cooldown  : %7s
┃
┣━━━━━━━━━━━━━━━━━━━━┫
┃  ⚙ Prefix    : %8
┃  🤖 Bot       : Tum Dum
┃  👑 Owner     : Eram
┃
╰━━━━━━━━━━━━━━━━━━━━╯`,

        helpList:
            "There are %1 commands. Use \"%2help <command>\" for details.",

        user: "User",
        adminGroup: "Admin Group",
        adminBot: "Admin Bot"
    }
};


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
            .slice(body.toLowerCase().indexOf("help"))
            .trim()
            .split(/\s+/);

    if (
        splitBody.length < 2 ||
        !commands.has(
            splitBody[1].toLowerCase()
        )
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

    return api.sendMessage(
        detail,
        threadID,
        messageID
    );
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

        return api.sendMessage(
            detailText,
            threadID,
            messageID
        );
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


    const commandsPerPage = 20;


    const totalPages =
        Math.max(
            Math.ceil(
                arrayInfo.length /
                commandsPerPage
            ),
            1
        );


    const currentPage =
        Math.min(
            page,
            totalPages
        );


    const start =
        commandsPerPage *
        (currentPage - 1);


    const helpView =
        arrayInfo.slice(
            start,
            start + commandsPerPage
        );


    const commandList =
        helpView.length > 0

            ? helpView
                .map(
                    (cmdName, index) =>
                        `┃  ${String(index + 1).padStart(2, "0")}  ›  ${cmdName}`
                )
                .join("\n")

            : "┃  — No commands found";


    // ======================================
    // PREMIUM HELP DESIGN
    // ======================================

    const text = `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃
┃       ✦ 𝐓𝐔𝐌 𝐃𝐔𝐌 ✦
┃       𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐂𝐄𝐍𝐓𝐄𝐑
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭──────── 𝐎𝐕𝐄𝐑𝐕𝐈𝐄𝐖 ────────╮
│
│  📚 Commands : ${arrayInfo.length}
│  📄 Page     : ${currentPage} / ${totalPages}
│  ⚙ Prefix    : ${prefix}
│
╰───────────────────────────╯

╭──────── 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ────────╮
${commandList}
╰───────────────────────────╯

╭────────── 𝐁𝐎𝐓 ───────────╮
│
│  🤖 Bot   : Tum Dum
│  👑 Owner : Eram
│  🟢 Status: Online
│
╰───────────────────────────╯

╭──────── 𝐔𝐒𝐀𝐆𝐄 ──────────╮
│
│  ${prefix}help <command>
│  ${prefix}help <page>
│
╰───────────────────────────╯

        ✦ 𝐓𝐔𝐌 𝐃𝐔𝐌 ✦
`;


    return api.sendMessage(
        text.trim(),
        threadID,
        messageID
    );
};
