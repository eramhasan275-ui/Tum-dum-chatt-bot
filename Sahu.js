const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");

///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////

const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

app.get("/", function (req, res) {
res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(port, () => {
logger("Server is running on port ${port}...", "[ Starting ]");
}).on("error", (err) => {
logger("Server error: ${err.message}", "[ Error ]");
});

/////////////////////////////////////////////////////////
//========= Create start bot and make it loop =========//
/////////////////////////////////////////////////////////

function startBot(message) {
if (message) {
logger(message, "[ Starting ]");
}

const child = spawn(
    "node",
    ["--trace-warnings", "--async-stack-traces", "Main.js"],
    {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    }
);

child.on("close", (codeExit) => {
    logger(
        `Bot exited with code ${codeExit}. Restarting in 5 seconds...`,
        "[ Restarting ]"
    );

    setTimeout(() => {
        startBot();
    }, 5000);
});

child.on("error", (error) => {
    logger(
        `An error occurred: ${error.message}`,
        "[ Error ]"
    );
});

}

////////////////////////////////////////////////
//========= Check update from Github =========//
////////////////////////////////////////////////

axios
.get(
"https://raw.githubusercontent.com/eramhasan275-ui/Tum-dum-chatt-bot/main/package.json"
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
logger(
"Failed to fetch update info: ${err.message}",
"[ Update Error ]"
);
});

////////////////////////////////////////////////
//================ Start Bot =================//
////////////////////////////////////////////////

startBot();