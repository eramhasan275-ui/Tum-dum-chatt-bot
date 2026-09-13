/**
 * TUM DUM - Anti Protect
 * Owner: Eram
 * Protects Group Name & Group Photo
 *
 * Commands:
 * +antiprotect on
 * +antiprotect off
 * +antiprotect status
 */

const fs = require("fs-extra");
const axios = require("axios");

const DATA_DIR = `${__dirname}/../../cache/antiProtect/`;

module.exports.config = {
    name: "antiprotect",
    version: "3.0.0",
    credits: "Eram",
    description: "Protect group name and photo",
    commandCategory: "Admin",
    hasPermssion: 0,
    usages: "on | off | status",
    cooldowns: 3,

    eventType: [
        "log:thread-name",
        "log:thread-icon"
    ]
};


/* =========================
   FILE SYSTEM
========================= */

function getFile(threadID) {

    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, {
            recursive: true
        });
    }

    return `${DATA_DIR}${threadID}.json`;
}


function loadData(threadID) {

    const file = getFile(threadID);

    if (!fs.existsSync(file)) {
        return {};
    }

    try {
        return JSON.parse(
            fs.readFileSync(file, "utf8")
        );
    } catch (error) {
        return {};
    }
}


function saveData(threadID, data) {

    const file = getFile(threadID);

    fs.writeFileSync(
        file,
        JSON.stringify(data, null, 2),
        "utf8"
    );
}


/* =========================
   COMMAND
========================= */

module.exports.run = async function ({
    api,
    event,
    args
}) {

    try {

        const threadID = event.threadID;
        const command = String(
            args[0] || ""
        ).toLowerCase();

        let data = loadData(threadID);


        /* =====================
           STATUS
        ===================== */

        if (command === "status") {

            return api.sendMessage(
                `🛡️ TUM DUM ANTI PROTECT\n\n` +

                `Status: ${
                    data.enabled
                        ? "🟢 ON"
                        : "🔴 OFF"
                }\n\n` +

                `🔒 Protected Name:\n` +
                `${data.name || "Not Set"}\n\n` +

                `🖼️ Protected Photo: ` +
                `${data.image ? "✅ Saved" : "❌ Not Saved"}`,
                
                threadID
            );
        }


        /* =====================
           ON
        ===================== */

        if (command === "on") {

            const info =
                await api.getThreadInfo(threadID);

            const groupName =
                info.threadName || "Unnamed Group";

            const groupImage =
                info.imageSrc || null;


            data = {

                enabled: true,

                name: groupName,

                image: groupImage,

                restoringName: false,

                restoringImage: false,

                lastNameRestore: 0,

                lastImageRestore: 0,

                updatedAt: Date.now()
            };


            saveData(threadID, data);


            return api.sendMessage(

                `🛡️ ANTI PROTECT ACTIVATED\n\n` +

                `👥 Group:\n` +
                `${groupName}\n\n` +

                `🔒 Name Protection: ✅\n` +

                `🖼️ Photo Protection: ` +
                `${groupImage ? "✅" : "⚠️"}\n\n` +

                `━━━━━━━━━━━━━━\n` +

                `যে কেউ Group Name বা Photo ` +
                `change করলেও আগেরটা restore করার ` +
                `চেষ্টা করবে। 🔐`,

                threadID
            );
        }


        /* =====================
           OFF
        ===================== */

        if (command === "off") {

            data.enabled = false;

            data.restoringName = false;
            data.restoringImage = false;

            saveData(threadID, data);


            return api.sendMessage(
                `🔴 Anti Protect বন্ধ করা হয়েছে।`,
                threadID
            );
        }


        /* =====================
           HELP
        ===================== */

        return api.sendMessage(

            `🛡️ TUM DUM ANTI PROTECT\n\n` +

            `+antiprotect on\n` +
            `+antiprotect off\n` +
            `+antiprotect status\n\n` +

            `🔐 Protection:\n` +
            `• Group Name\n` +
            `• Group Photo`,

            threadID
        );

    } catch (error) {

        console.error(
            "[AntiProtect Command Error]",
            error
        );

        return api.sendMessage(
            "❌ Anti Protect চালু করতে সমস্যা হয়েছে।",
            event.threadID
        );
    }
};


/* =========================
   EVENT HANDLER
========================= */

module.exports.handleEvent = async function ({
    api,
    event
}) {

    try {

        const threadID = event.threadID;

        if (!threadID) return;


        const data = loadData(threadID);

        if (!data.enabled) return;


        /* =====================
           GROUP NAME CHANGE
        ===================== */

        if (
            event.logMessageType ===
            "log:thread-name"
        ) {

            if (!data.name) return;


            /*
             * Bot নিজে restore করার পর
             * আবার event এলে সেটা ignore করবে।
             */

            if (data.restoringName) {

                data.restoringName = false;

                saveData(threadID, data);

                return;
            }


            /*
             * 3 second protection lock
             */

            const now = Date.now();

            if (
                data.lastNameRestore &&
                now - data.lastNameRestore < 3000
            ) {
                return;
            }


            data.lastNameRestore = now;
            data.restoringName = true;

            saveData(threadID, data);


            try {

                if (
                    typeof api.setTitle !==
                    "function"
                ) {

                    throw new Error(
                        "api.setTitle() unavailable"
                    );
                }


                await api.setTitle(
                    data.name,
                    threadID
                );


                return api.sendMessage(

                    `🛡️ ANTI PROTECT\n\n` +

                    `🚫 Group Name Change Detected!\n\n` +

                    `🔒 Protected Name:\n` +
                    `${data.name}\n\n` +

                    `✅ আগের Group Name restore করা হয়েছে।`,

                    threadID
                );

            } catch (error) {

                console.error(
                    "[AntiProtect Name Error]",
                    error
                );

                data.restoringName = false;

                saveData(threadID, data);


                return api.sendMessage(

                    `❌ Group Name restore করা যায়নি।\n\n` +
                    `🔒 Protected Name:\n` +
                    `${data.name}`,

                    threadID
                );
            }
        }


        /* =====================
           GROUP PHOTO CHANGE
        ===================== */

        if (
            event.logMessageType ===
            "log:thread-icon"
        ) {

            if (!data.image) {

                return api.sendMessage(
                    "⚠️ Protected Group Photo পাওয়া যায়নি।",
                    threadID
                );
            }


            /*
             * Bot নিজে photo restore করলে
             * সেই event ignore করবে।
             */

            if (data.restoringImage) {

                data.restoringImage = false;

                saveData(threadID, data);

                return;
            }


            const now = Date.now();

            if (
                data.lastImageRestore &&
                now - data.lastImageRestore < 3000
            ) {
                return;
            }


            data.lastImageRestore = now;
            data.restoringImage = true;

            saveData(threadID, data);


            try {

                if (
                    typeof api.changeGroupImage !==
                    "function"
                ) {

                    throw new Error(
                        "api.changeGroupImage() unavailable"
                    );
                }


                const response =
                    await axios.get(
                        data.image,
                        {
                            responseType:
                                "arraybuffer",

                            timeout: 15000
                        }
                    );


                const buffer =
                    Buffer.from(
                        response.data
                    );


                await api.changeGroupImage(
                    buffer,
                    threadID
                );


                return api.sendMessage(

                    `🛡️ ANTI PROTECT\n\n` +

                    `🚫 Group Photo Change Detected!\n\n` +

                    `🖼️ আগের Group Photo restore করা হয়েছে। ✅`,

                    threadID
                );

            } catch (error) {

                console.error(
                    "[AntiProtect Photo Error]",
                    error
                );

                data.restoringImage = false;

                saveData(threadID, data);


                return api.sendMessage(

                    `❌ Group Photo restore করা যায়নি।\n\n` +
                    `সম্ভবত bot API থেকে photo change করার permission পাওয়া যাচ্ছে না।`,

                    threadID
                );
            }
        }

    } catch (error) {

        console.error(
            "[AntiProtect Event Error]",
            error
        );
    }
};


/* =========================
   COMPATIBILITY
========================= */

module.exports.onStart =
    module.exports.run;

module.exports.onEvent =
    module.exports.handleEvent;