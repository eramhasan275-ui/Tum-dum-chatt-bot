const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");
const logger = require("./utils/log");

const APPSTATE_PATH = path.resolve(
    __dirname,
    global.config?.APPSTATEPATH || "appstate.json"
);

let api = null;
let reconnecting = false;
let reconnectTimer = null;
let reconnectDelay = 10000;

function loadConfig() {
    const configPath = path.join(__dirname, "config.json");

    if (!fs.existsSync(configPath)) {
        throw new Error("config.json not found.");
    }

    global.config = JSON.parse(
        fs.readFileSync(configPath, "utf8")
    );

    return global.config;
}

function loadAppState() {
    if (!fs.existsSync(APPSTATE_PATH)) {
        throw new Error("appstate.json not found.");
    }

    const state = JSON.parse(
        fs.readFileSync(APPSTATE_PATH, "utf8")
    );

    if (!Array.isArray(state) || state.length === 0) {
        throw new Error("Invalid appstate.json.");
    }

    return state;
}

function saveAppState(newState) {
    if (!Array.isArray(newState) || newState.length === 0) {
        return;
    }

    const tempPath = `${APPSTATE_PATH}.tmp`;
    const backupPath = `${APPSTATE_PATH}.backup`;

    try {
        if (fs.existsSync(APPSTATE_PATH)) {
            fs.copyFileSync(APPSTATE_PATH, backupPath);
        }

        fs.writeFileSync(
            tempPath,
            JSON.stringify(newState, null, 2),
            "utf8"
        );

        fs.renameSync(tempPath, APPSTATE_PATH);

        logger("Appstate updated successfully.", "[ Session ]");
    } catch (err) {
        logger(
            `Could not save appstate: ${err.message}`,
            "[ Session ]"
        );
    }
}

function scheduleReconnect(reason) {
    if (reconnecting) return;

    reconnecting = true;

    logger(
        `Connection lost: ${reason || "Unknown reason"}`,
        "[ Reconnect ]"
    );

    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
    }

    reconnectTimer = setTimeout(() => {
        reconnecting = false;
        startLogin();
    }, reconnectDelay);

    reconnectDelay = Math.min(reconnectDelay * 2, 60000);
}

function startLogin() {
    if (reconnecting) return;

    let login;

    try {
        login = require("sahu-fca");
    } catch (err) {
        logger(
            `sahu-fca load failed: ${err.message}`,
            "[ Error ]"
        );

        scheduleReconnect("sahu-fca unavailable");
        return;
    }

    let appState;

    try {
        appState = loadAppState();
    } catch (err) {
        logger(
            `Appstate error: ${err.message}`,
            "[ Login ]"
        );
        return;
    }

    const options = {
        selfListen: false,
        listenEvents: true,
        listenTyping: false,
        updatePresence: false,
        forceLogin: false,
        autoMarkDelivery: false,
        autoMarkRead: false,
        autoReconnect: true,
        logRecordSize: 100,
        online: false,
        emitReady: false,
        userAgent: "Mozilla/5.0"
    };

    logger("Connecting to Facebook...", "[ Login ]");

    login(
        {
            appState,
            ...options
        },
        async (err, loggedApi) => {
            if (err) {
                logger(
                    `Facebook login failed: ${err.error || err.message || JSON.stringify(err)}`,
                    "[ Login Error ]"
                );

                scheduleReconnect("Facebook login failed");
                return;
            }

            api = loggedApi;
            reconnectDelay = 10000;

            global.client = global.client || {};
            global.client.api = api;

            try {
                if (typeof api.getAppState === "function") {
                    const newState = api.getAppState();
                    saveAppState(newState);
                }
            } catch (e) {
                logger(
                    `Appstate refresh failed: ${e.message}`,
                    "[ Session ]"
                );
            }

            logger(
                `Tum Dum connected successfully — ${moment()
                    .tz("Asia/Dhaka")
                    .format("DD/MM/YYYY HH:mm:ss")}`,
                "[ Success ]"
            );

            try {
                const listener = require("./includes/listen");

                if (typeof listener !== "function") {
                    throw new Error("includes/listen.js is invalid.");
                }

                api.listenMqtt((listenErr, event) => {
                    if (listenErr) {
                        logger(
                            `Messenger connection error: ${listenErr.message || JSON.stringify(listenErr)}`,
                            "[ Connection ]"
                        );

                        scheduleReconnect("Messenger listener error");
                        return;
                    }

                    try {
                        listener({
                            api,
                            event,
                            models: global.models || {}
                        });
                    } catch (eventErr) {
                        logger(
                            `Event handler error: ${eventErr.stack || eventErr}`,
                            "[ Event ]"
                        );
                    }
                });
            } catch (err) {
                logger(
                    `Listener failed: ${err.stack || err}`,
                    "[ Listener ]"
                );

                scheduleReconnect("Listener failed");
            }
        }
    );
}

process.on("uncaughtException", err => {
    logger(
        `Main error: ${err.stack || err}`,
        "[ Error ]"
    );

    scheduleReconnect("Main process error");
});

process.on("unhandledRejection", err => {
    logger(
        `Unhandled rejection: ${err?.stack || err}`,
        "[ Error ]"
    );

    scheduleReconnect("Unhandled rejection");
});

try {
    loadConfig();
} catch (err) {
    logger(
        `Configuration error: ${err.message}`,
        "[ Fatal ]"
    );

    process.exit(1);
}

startLogin();