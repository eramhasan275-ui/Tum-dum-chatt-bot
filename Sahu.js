const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");

const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

app.get("/", function (req, res) {
res.sendFile(path.join(__dirname, "index.html"));
});

const server = app.listen(port, () => {
logger("Server is running on port ${port}...", "[ Starting ]");
});

server.on("error", (err) => {
logger("Server error: ${err.message}", "[ Error ]");
});

let restarting = false;
let childProcess = null;

function startBot(message) {
if (message) {
logger(message, "[ Starting ]");
}

if (childProcess && !childProcess.killed) {
    return;
}

restarting = false;

childProcess = spawn(
    process.execPath,
    ["--trace-warnings", "--async-stack-traces", "Main.js"],
    {
        cwd: __dirname,
        stdio: "inherit",
        shell: false
    }
);

childProcess.on("error", (error) => {
    logger(`Bot process error: ${error.message}`, "[ Error ]");
});

childProcess.on("exit", (code, signal) => {
    childProcess = null;

    logger(
        `Bot exited. Code: ${code}, Signal: ${signal || "none"}`,
        "[ Warning ]"
    );

    if (!restarting) {
        restarting = true;

        setTimeout(() => {
            logger("Starting bot again...", "[ Restarting ]");
            startBot();
        }, 5000);
    }
});

}

process.on("uncaughtException", (error) => {
logger("Uncaught Exception: ${error.stack || error.message}", "[ Error ]");
});

process.on("unhandledRejection", (reason) => {
logger(
"Unhandled Rejection: ${ reason && reason.stack ? reason.stack : reason }",
"[ Error ]"
);
});

axios
.get(
"https://raw.githubusercontent.com/eramhasan275-ui/Tum-dum-chatt-bot/main/package.json",
{ timeout: 10000 }
)
.then((res) => {
if (res.data) {
logger(res.data.name || "Tum Dum", "[ NAME ]");
logger("Version: ${res.data.version || "2.0.1"}", "[ VERSION ]");
logger(
res.data.description || "Tum Dum Chat Bot",
"[ DESCRIPTION ]"
);
}
})
.catch((err) => {
logger("Update check skipped: ${err.message}", "[ Update ]");
});

startBot();