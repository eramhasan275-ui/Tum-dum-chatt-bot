/**
 * Tum Dum - Main.js
 * Clean Main Loader
 * Owner: Eram Hasan
 *
 * Project structure:
 * config.json
 * appstate.json
 * ./includes/database
 * ./includes/database/model
 * ./includes/listen
 * ./Script/commands
 * ./Script/events
 */

"use strict";

const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");
const { execSync } = require("child_process");

const { Sequelize, sequelize } = require("./includes/database");

// ===============================
// LOGGER
// ===============================

let logger;

try {
    logger = require("./utils/logger");
} catch (e) {
    logger = (...args) => console.log(...args);
}

const ROOT = process.cwd();

// ===============================
// GLOBAL CLIENT
// ===============================

global.client = {
    commands: new Map(),
    events: new Map(),

    cooldowns: new Map(),

    eventRegistered: [],

    handleSchedule: [],
    handleReaction: [],
    handleReply: [],

    mainPath: ROOT,
    configPath: path.join(ROOT, "config.json"),

    getTime(type) {

        const now = moment.tz("Asia/Dhaka");

        switch (type) {

            case "seconds":
            case "ss":
                return now.format("ss");

            case "minutes":
            case "mm":
                return now.format("mm");

            case "hours":
            case "HH":
                return now.format("HH");

            case "date":
            case "DD":
                return now.format("DD");

            case "month":
            case "MM":
                return now.format("MM");

            case "year":
            case "YYYY":
                return now.format("YYYY");

            case "fullTime":
                return now.format("HH:mm:ss DD/MM/YYYY");

            case "fullHour":
                return now.format("HH:mm:ss");

            default:
                return now.format("HH:mm:ss DD/MM/YYYY");
        }
    }
};

// ===============================
// GLOBAL DATA
// ===============================

global.data = {

    threadInfo: new Map(),
    threadData: new Map(),

    userName: new Map(),

    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),

    threadAllowNSFW: [],

    allUserID: [],
    allCurrenciesID: [],
    allThreadID: []
};

// ===============================
// OTHER GLOBALS
// ===============================

try {
    global.utils = require("./utils");
} catch (e) {
    global.utils = {};
}

global.nodemodule = {};
global.moduleData = {};
global.moduleThreadData = {};
global.temp = [];
global.language = {};

// ===============================
// LOGGER FUNCTIONS
// ===============================

function log(message, type = "INFO") {

    try {

        if (typeof logger === "function") {
            return logger(message, type);
        }

        if (logger && typeof logger.log === "function") {
            return logger.log(message, type);
        }

        console.log(`[${type}] ${message}`);

    } catch (e) {

        console.log(`[${type}] ${message}`);

    }
}

function fail(message, error) {

    log(message, "ERROR");

    if (error) {
        console.error(error);
    }
}

// ===============================
// LOAD CONFIG
// ===============================

function loadConfig() {

    const configPath = global.client.configPath;

    const tempPath =
        configPath.replace(/\.json$/i, ".temp");

    let config;

    try {

        delete require.cache[
            require.resolve(configPath)
        ];

        config = require(configPath);

    } catch (error) {

        if (!fs.existsSync(tempPath)) {

            throw new Error(
                `Cannot load config.json.\nPath: ${configPath}`
            );

        }

        config = JSON.parse(
            fs.readFileSync(tempPath, "utf8")
        );

        log(
            `Loaded temporary config: ${tempPath}`,
            "WARNING"
        );
    }

    if (!config || typeof config !== "object") {

        throw new Error(
            "config.json is invalid."
        );

    }

    global.config = config;

    /*
     * Do not change ADMINBOT / NDH IDs.
     * They stay inside config.json.
     */

    return config;
}

// ===============================
// LOAD LANGUAGE
// ===============================

function loadLanguage() {

    const language =
        global.config.language || "en";

    const langPath = path.join(
        ROOT,
        "languages",
        `${language}.lang`
    );

    if (!fs.existsSync(langPath)) {

        log(
            `Language file not found: ${langPath}`,
            "WARNING"
        );

        return;
    }

    const lines = fs
        .readFileSync(langPath, "utf8")
        .split(/\r?\n|\r/)
        .filter(
            line =>
                line.trim() &&
                !line.trim().startsWith("#")
        );

    for (const line of lines) {

        const separator =
            line.indexOf("=");

        if (separator < 0) continue;

        const fullKey =
            line.slice(0, separator).trim();

        const value =
            line
                .slice(separator + 1)
                .trim()
                .replace(/\\n/gi, "\n");

        const dot =
            fullKey.indexOf(".");

        const head =
            dot >= 0
                ? fullKey.slice(0, dot)
                : fullKey;

        const key =
            dot >= 0
                ? fullKey.slice(dot + 1)
                : fullKey;

        if (!global.language[head]) {
            global.language[head] = {};
        }

        global.language[head][key] = value;
    }

    // ===============================
    // GET TEXT
    // ===============================

    global.getText = function (...args) {

        if (!args.length) {
            return "";
        }

        const head = args[0];

        if (!global.language[head]) {

            return `[Missing language key: ${args.join(".")}]`;

        }

        let text =
            global.language[head][args[1]];

        if (typeof text !== "string") {

            return `[Missing language key: ${args.join(".")}]`;

        }

        for (
            let i = args.length - 1;
            i >= 2;
            i--
        ) {

            text = text.replace(
                new RegExp(`%${i - 1}`, "g"),
                args[i]
            );

        }

        return text;
    };
}

// ===============================
// LOAD APPSTATE
// ===============================

function loadAppState() {

    const appStatePath =
        path.resolve(
            path.join(
                ROOT,
                global.config.APPSTATEPATH ||
                "appstate.json"
            )
        );

    if (!fs.existsSync(appStatePath)) {

        throw new Error(
            `appstate.json not found:\n${appStatePath}\n\n` +
            `Put your valid Messenger appstate file in the project root.`
        );

    }

    delete require.cache[
        require.resolve(appStatePath)
    ];

    return {

        path: appStatePath,

        state: require(appStatePath)

    };
}

// ===============================
// PACKAGE DEPENDENCIES
// ===============================

function packageDependencies() {

    try {

        const pkg =
            require(
                path.join(
                    ROOT,
                    "package.json"
                )
            );

        return pkg.dependencies || {};

    } catch (e) {

        return {};

    }
}

// ===============================
// BUILT-IN MODULES
// ===============================

function builtinModules() {

    try {

        return require("module")
            .builtinModules || [];

    } catch (e) {

        return [];

    }
}

// ===============================
// INSTALL DEPENDENCY
// ===============================

function installDependency(
    name,
    version
) {

    const packageSpec =
        !version || version === "*"
            ? name
            : `${name}${version}`;

    log(
        `Installing missing dependency: ${packageSpec}`,
        "WARNING"
    );

    execSync(
        `npm install ${packageSpec}`,
        {
            cwd: ROOT,
            stdio: "inherit",
            shell: true,
            env: process.env
        }
    );
}

// ===============================
// MODULE DEPENDENCIES
// ===============================

function loadModuleDependencies(mod) {

    const dependencies =
        mod?.config?.dependencies;

    if (
        !dependencies ||
        typeof dependencies !== "object"
    ) {
        return;
    }

    const installed =
        packageDependencies();

    const builtins =
        builtinModules();

    for (
        const name of Object.keys(dependencies)
    ) {

        try {

            if (global.nodemodule[name]) {
                continue;
            }

            if (
                Object.prototype.hasOwnProperty.call(
                    installed,
                    name
                ) ||
                builtins.includes(name)
            ) {

                global.nodemodule[name] =
                    require(name);

                continue;
            }

            const localPath =
                path.join(
                    ROOT,
                    "node_modules",
                    name
                );

            try {

                global.nodemodule[name] =
                    require(localPath);

            } catch (e) {

                installDependency(
                    name,
                    dependencies[name]
                );

                global.nodemodule[name] =
                    require(name);

            }

        } catch (error) {

            throw new Error(
                `Cannot load dependency "${name}" ` +
                `for module "${mod.config.name}": ` +
                error.message
            );

        }
    }
}

// ===============================
// ENV CONFIG
// ===============================

function applyEnvConfig(mod) {

    const name =
        mod?.config?.name;

    if (
        !name ||
        !mod.config.envConfig
    ) {
        return;
    }

    if (!global.configModule) {
        global.configModule = {};
    }

    if (!global.configModule[name]) {
        global.configModule[name] = {};
    }

    for (
        const key of Object.keys(
            mod.config.envConfig
        )
    ) {

        if (
            typeof global.configModule[name][key] ===
                "undefined" ||
            global.configModule[name][key] === ""
        ) {

            global.configModule[name][key] =
                mod.config.envConfig[key];

        }

    }
}

// ===============================
// DISABLED CHECK
// ===============================

function isDisabled(
    name,
    list
) {

    return (
        Array.isArray(list) &&
        list.includes(name)
    );

}

// ===============================
// LOAD COMMANDS
// ===============================

async function loadCommands(
    api,
    models
) {

    const dir =
        path.join(
            ROOT,
            "Script",
            "commands"
        );

    if (!fs.existsSync(dir)) {

        throw new Error(
            `Command directory not found:\n${dir}`
        );

    }

    const files =
        fs.readdirSync(dir)
            .filter(
                file =>
                    file.endsWith(".js") &&
                    !file.includes("example")
            );

    for (const file of files) {

        const filePath =
            path.join(dir, file);

        try {

            delete require.cache[
                require.resolve(filePath)
            ];

            const mod =
                require(filePath);

            if (
                !mod ||
                !mod.config ||
                typeof mod.run !== "function"
            ) {

                throw new Error(
                    "Invalid command module: config/run is missing."
                );

            }

            const name =
                mod.config.name;

            if (!name) {

                throw new Error(
                    "Command name is missing."
                );

            }

            if (
                global.client.commands.has(name)
            ) {

                throw new Error(
                    `Duplicate command name: ${name}`
                );

            }

            if (
                isDisabled(
                    name,
                    global.config.commandDisabled
                )
            ) {

                log(
                    `Command disabled: ${name}`,
                    "WARNING"
                );

                continue;
            }

            loadModuleDependencies(mod);

            applyEnvConfig(mod);

            if (
                typeof mod.onLoad ===
                "function"
            ) {

                await Promise.resolve(
                    mod.onLoad({
                        api,
                        models
                    })
                );

            }

            global.client.commands.set(
                name,
                mod
            );

            log(
                `Loaded command: ${name}`,
                "SUCCESS"
            );

        } catch (error) {

            fail(
                `Failed to load command: ${file}`,
                error
            );

        }

    }
}

// ===============================
// LOAD EVENTS
// ===============================

async function loadEvents(
    api,
    models
) {

    const dir =
        path.join(
            ROOT,
            "Script",
            "events"
        );

    if (!fs.existsSync(dir)) {

        throw new Error(
            `Event directory not found:\n${dir}`
        );

    }

    const files =
        fs.readdirSync(dir)
            .filter(
                file =>
                    file.endsWith(".js") &&
                    !file.includes("example")
            );

    for (const file of files) {

        const filePath =
            path.join(dir, file);

        try {

            delete require.cache[
                require.resolve(filePath)
            ];

            const mod =
                require(filePath);

            if (
                !mod ||
                !mod.config ||
                typeof mod.run !== "function"
            ) {

                throw new Error(
                    "Invalid event module: config/run is missing."
                );

            }

            const name =
                mod.config.name;

            if (!name) {

                throw new Error(
                    "Event name is missing."
                );

            }

            if (
                global.client.events.has(name)
            ) {

                throw new Error(
                    `Duplicate event name: ${name}`
                );

            }

            if (
                isDisabled(
                    name,
                    global.config.eventDisabled
                )
            ) {

                log(
                    `Event disabled: ${name}`,
                    "WARNING"
                );

                continue;
            }

            loadModuleDependencies(mod);

            applyEnvConfig(mod);

            if (
                typeof mod.onLoad ===
                "function"
            ) {

                await Promise.resolve(
                    mod.onLoad({
                        api,
                        models
                    })
                );

            }

            global.client.events.set(
                name,
                mod
            );

            log(
                `Loaded event: ${name}`,
                "SUCCESS"
            );

        } catch (error) {

            fail(
                `Failed to load event: ${file}`,
                error
            );

        }

    }
}

// ===============================
// BAN CHECK
// ===============================

async function checkBan(api) {

    if (
        typeof global.utils?.checkBan ===
        "function"
    ) {

        return global.utils.checkBan(api);

    }

    try {

        const ban =
            require("./utils/checkBan");

        if (
            typeof ban === "function"
        ) {

            return ban(api);

        }

    } catch (e) {

        // Optional module.
    }
}

// ===============================
// START BOT
// ===============================

async function startBot(models) {

    let appStateInfo;

    try {

        appStateInfo =
            loadAppState();

    } catch (error) {

        fail(
            "Cannot load Messenger appstate.",
            error
        );

        return;
    }

    let login;

    try {

        login =
            require("sahu-fca");

    } catch (error) {

        fail(
            'Cannot load "sahu-fca". Make sure it is installed.',
            error
        );

        return;
    }

    const options =
        global.config.FCAOption || {};

    try {

        login(
            {
                appState:
                    appStateInfo.state,

                ...options

            },

            async (error, api) => {

                if (error) {

                    fail(
                        "Messenger authentication failed.",
                        error
                    );

                    return;
                }

                if (!api) {

                    fail(
                        "Login returned no API object."
                    );

                    return;
                }

                try {

                    // ===============================
                    // SAVE NEW APPSTATE
                    // ===============================

                    if (
                        typeof api.getAppState ===
                        "function"
                    ) {

                        fs.writeFileSync(

                            appStateInfo.path,

                            JSON.stringify(
                                api.getAppState(),
                                null,
                                "\t"
                            ),

                            "utf8"

                        );

                    }

                    global.client.api =
                        api;

                    global.client.timeStart =
                        Date.now();

                    // ===============================
                    // LOAD COMMANDS
                    // ===============================

                    await loadCommands(
                        api,
                        models
                    );

                    // ===============================
                    // LOAD EVENTS
                    // ===============================

                    await loadEvents(
                        api,
                        models
                    );

                    log(
                        `Tum Dum is online | Commands: ${global.client.commands.size} | Events: ${global.client.events.size}`,
                        "SUCCESS"
                    );

                    // ===============================
                    // LISTENER
                    // ===============================

                    const listenerFactory =
                        require("./includes/listen");

                    let listener;

                    if (
                        typeof listenerFactory ===
                        "function"
                    ) {

                        listener =
                            listenerFactory({
                                api,
                                models
                            });

                    } else {

                        listener =
                            listenerFactory;

                    }

                    global.handleListen =
                        listener;

                    // ===============================
                    // START MQTT
                    // ===============================

                    if (
                        typeof listener ===
                        "function"
                    ) {

                        api.listenMqtt(
                            listener
                        );

                    } else if (
                        listener &&
                        typeof listener.listen ===
                        "function"
                    ) {

                        listener.listen(api);

                    } else if (
                        typeof api.listenMqtt ===
                        "function"
                    ) {

                        api.listenMqtt(
                            listener
                        );

                    } else {

                        throw new Error(
                            "Unable to start Messenger listener."
                        );

                    }

                    // ===============================
                    // BAN CHECK
                    // ===============================

                    await checkBan(api);

                } catch (error) {

                    fail(
                        "Bot startup failed after login.",
                        error
                    );

                }

            }
        );

    } catch (error) {

        fail(
            "Unable to start Messenger login.",
            error
        );

    }
}

// ===============================
// MAIN
// ===============================

async function main() {

    try {

        // Load configuration
        loadConfig();

        // Load language
        loadLanguage();

        log(
            `Starting ${global.config.BOTNAME || "Tum Dum"}...`,
            "INFO"
        );

        log(
            `Prefix: ${global.config.PREFIX || "+"}`,
            "INFO"
        );

        // ===============================
        // DATABASE
        // ===============================

        await sequelize.authenticate();

        const modelFactory =
            require(
                "./includes/database/model"
            );

        const models =
            modelFactory({
                Sequelize,
                sequelize
            });

        global.models =
            models;

        log(
            "Database connected successfully.",
            "SUCCESS"
        );

        // ===============================
        // START BOT
        // ===============================

        await startBot(
            models
        );

    } catch (error) {

        fail(
            "Fatal startup error.",
            error
        );

        process.exitCode = 1;
    }
}

// ===============================
// ERROR HANDLERS
// ===============================

process.on(
    "unhandledRejection",
    reason => {

        fail(
            "Unhandled Promise Rejection.",
            reason
        );

    }
);

process.on(
    "uncaughtException",
    error => {

        fail(
            "Uncaught Exception.",
            error
        );

    }
);

// ===============================
// RUN
// ===============================

main();
