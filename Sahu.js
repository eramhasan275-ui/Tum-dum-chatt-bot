/**
 * Tum Dum Bot - Main Startup
 * Owner: Eram
 */

const { spawn } = require("child_process");
const logger = require("./utils/log");

// =====================================================
// =============== Dashboard / Uptime Server ============
// =====================================================

const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Serve index.html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start web server
app.listen(port, () => {
    logger(
        `Tum Dum server is running on port ${port}...`,
        "[ Starting ]"
    );
}).on("error", (err) => {

    if (err.code === "EACCES") {
        logger(
            `Permission denied. Cannot bind to port ${port}.`,
            "[ Error ]"
        );
    } else {
        logger(
            `Server error: ${err.message}`,
            "[ Error ]"
        );
    }

});

// =====================================================
// ================= Bot Start System ==================
// =====================================================

// Restart counter
global.countRestart = global.countRestart || 0;

function startBot(message) {

    if (message) {
        logger(message, "[ Starting ]");
    }

    logger(
        "Starting Tum Dum Bot...",
        "[ Bot ]"
    );

    const child = spawn(
        "node",
        [
            "--trace-warnings",
            "--async-stack-traces",
            "Main.js"
        ],
        {
            cwd: __dirname,
            stdio: "inherit",
            shell: true
        }
    );

    // Bot closed
    child.on("close", (codeExit) => {

        if (codeExit !== 0 && global.countRestart < 5) {

            global.countRestart++;

            logger(
                `Tum Dum stopped with code ${codeExit}. ` +
                `Restarting... (${global.countRestart}/5)`,
                "[ Restarting ]"
            );

            setTimeout(() => {
                startBot();
            }, 3000);

        } else {

            logger(
                `Tum Dum stopped. Total restarts: ${global.countRestart}`,
                "[ Stopped ]"
            );

        }

    });

    // Spawn error
    child.on("error", (error) => {

        logger(
            `Bot startup error: ${error.message}`,
            "[ Error ]"
        );

    });

}

// =====================================================
// ===================== Start Bot =====================
// =====================================================

startBot(
    "Tum Dum Bot is starting... Owner: Eram"
);
