const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    logger(`Server is running on port ${port}...`, "[ Starting ]");
}).on("error", err => {
    logger(`Server error: ${err.message}`, "[ Error ]");
});

let restarting = false;
let restartDelay = 10000;
let child = null;

function startBot() {
    if (restarting) return;

    restarting = true;

    logger("Starting Tum Dum...", "[ Bot ]");

    child = spawn(
        process.execPath,
        ["--trace-warnings", "--async-stack-traces", "Main.js"],
        {
            cwd: __dirname,
            stdio: "inherit",
            shell: false,
            env: process.env
        }
    );

    child.on("spawn", () => {
        restarting = false;
        restartDelay = 10000;
        logger("Tum Dum process started.", "[ Success ]");
    });

    child.on("error", err => {
        logger(`Bot process error: ${err.message}`, "[ Error ]");
    });

    child.on("close", code => {
        child = null;
        restarting = false;

        logger(
            `Bot process stopped with code ${code}.`,
            "[ Warning ]"
        );

        setTimeout(() => {
            startBot();
        }, restartDelay);

        restartDelay = Math.min(restartDelay * 2, 60000);
    });
}

process.on("uncaughtException", err => {
    logger(`Sahu error: ${err.stack || err}`, "[ Error ]");
});

process.on("unhandledRejection", err => {
    logger(`Unhandled rejection: ${err?.stack || err}`, "[ Error ]");
});

axios
    .get("https://raw.githubusercontent.com/eramhasan275-ui/Tum-dum-chatt-bot/main/package.json", {
        timeout: 15000
    })
    .then(res => {
        logger(res.data?.name || "Tum Dum", "[ NAME ]");
        logger(`Version: ${res.data?.version || "2.0.1"}`, "[ VERSION ]");
    })
    .catch(() => {
        logger("Update information unavailable.", "[ Info ]");
    });

startBot();