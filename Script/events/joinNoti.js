/**
 * Tum Dum - Group Welcome
 * Owner: Eram
 */

module.exports.config = {
    name: "joinnoti",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Eram",
    description: "Welcomes new members when they join the group",
    commandCategory: "Events",
    usages: "",
    cooldowns: 0,
    eventType: ["log:subscribe"]
};

module.exports.run = async function ({ api, event }) {
    try {
        const {
            threadID,
            logMessageData
        } = event;

        if (!logMessageData) return;

        const addedParticipants =
            logMessageData.addedParticipants || [];

        if (addedParticipants.length === 0) return;

        let groupName = "এই গ্রুপ";

        try {
            const threadInfo =
                await api.getThreadInfo(threadID);

            if (threadInfo && threadInfo.threadName) {
                groupName = threadInfo.threadName;
            }
        } catch (error) {
            // Group name পাওয়া না গেলে default name ব্যবহার হবে
        }

        for (const user of addedParticipants) {

            const name =
                user.fullName || "নতুন সদস্য";

            const message =
`╭───────────────╮
   🌿 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 🌿
╰───────────────╯

স্বাগতম, ${name} 🤍

আপনাকে ${groupName}-এ
আন্তরিকভাবে স্বাগতম।

🌱 গ্রুপের সকল নিয়ম মেনে চলবেন।

───────────────
🤖 Tum Dum
👑 Owner: Eram
───────────────`;

            await api.sendMessage(
                message,
                threadID
            );
        }

    } catch (error) {
        console.error(
            "[Tum Dum Welcome] " +
            error.message
        );
    }
};
