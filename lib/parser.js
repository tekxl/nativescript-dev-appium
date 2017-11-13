"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const path_1 = require("path");
const utils_1 = require("./utils");
exports.capabilitiesName = "appium.capabilities.json";
const config = (() => {
    const options = yargs
        .option("runType", { describe: "Path to excute command.", type: "string", default: null })
        .option("testFolder", { describe: "e2e test folder name", default: "e2e", type: "string" })
        .option("appiumCapsLocation", { describe: "Capabilities", type: "string" })
        .option("sauceLab", { describe: "SauceLab", default: false, type: "boolean" })
        .option("port", { alias: "p", describe: "Execution port", type: "string" })
        .option("verbose", { alias: "v", describe: "Log actions", type: "boolean" })
        .option("path", { describe: "path", default: process.cwd(), type: "string" })
        .option("appPath", { describe: "application path", type: "string" })
        .option("storage", { describe: "Storage for images folder.", type: "string" })
        .option("testReports", { describe: "Test reporting folder", type: "string" })
        .option("reuseDevice", { describe: "Reusing device if available.", type: "boolean", defualt: false })
        .option("ignoreDeviceController", { describe: "Use default appium options for running emulatos/ simulators.", type: "boolean", defualt: false })
        .help()
        .argv;
    let appRootPath = options.path;
    if (appRootPath.includes("nativescript-dev-appium") || appRootPath.includes("mocha")) {
        appRootPath = require('app-root-path').toString();
    }
    const projectDir = appRootPath;
    const projectBinary = utils_1.resolve(projectDir, "node_modules", ".bin");
    const pluginRoot = utils_1.resolve(projectDir, "node_modules", "nativescript-dev-appium");
    const pluginBinary = utils_1.resolve(pluginRoot, "node_modules", ".bin");
    const config = {
        projectDir: projectDir,
        projectBinary: projectBinary,
        pluginRoot: pluginRoot,
        pluginBinary: pluginBinary,
        port: options.port || process.env.npm_config_port,
        testFolder: options.testFolder || process.env.npm_config_testFolder || "e2e",
        runType: options.runType || process.env.npm_config_runType,
        appiumCapsLocation: options.appiumCapsLocation || path_1.join(projectDir, options.testFolder, "config", exports.capabilitiesName),
        isSauceLab: options.sauceLab || process.env.npm_config_sauceLab,
        verbose: options.verbose || process.env.npm_config_loglevel === "verbose",
        appPath: options.appPath || process.env.npm_config_appPath,
        storage: options.storage || process.env.npm_config_STORAGE || process.env.STORAGE,
        testReports: options.testReports || process.env.npm_config_TEST_REPORTS || process.env.TEST_REPORTS,
        reuseDevice: options.reuseDevice || process.env.npm_config_REUSE_DEVICE || process.env.REUSE_DEVICE,
        ignoreDeviceController: options.ignoreDeviceController,
    };
    return config;
})();
exports.projectDir = config.projectDir, exports.projectBinary = config.projectBinary, exports.pluginRoot = config.pluginRoot, exports.pluginBinary = config.pluginBinary, exports.port = config.port, exports.verbose = config.verbose, exports.appiumCapsLocation = config.appiumCapsLocation, exports.testFolder = config.testFolder, exports.runType = config.runType, exports.isSauceLab = config.isSauceLab, exports.appPath = config.appPath, exports.storage = config.storage, exports.testReports = config.testReports, exports.reuseDevice = config.reuseDevice, exports.ignoreDeviceController = config.ignoreDeviceController;
//# sourceMappingURL=parser.js.map