const dataAdbox = require("../../Script/commands/cache/data.json");

if (
  dataAdbox.adminbox &&
  dataAdbox.adminbox[threadID] === true &&
  !ADMINBOT.includes(senderID)
) {
  return api.sendMessage(
    "❌ Admin Only Mode\n\nশুধুমাত্র Bot Admin command ব্যবহার করতে পারবে।",
    threadID,
    messageID
  );
}