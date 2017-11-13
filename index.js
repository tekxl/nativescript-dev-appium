"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const portastic = require("portastic");
const appium_server_1 = require("./lib/appium-server");
const appium_driver_1 = require("./lib/appium-driver");
const ns_capabilities_1 = require("./lib/ns-capabilities");
const utils_1 = require("./lib/utils");
var appium_driver_2 = require("./lib/appium-driver");
exports.AppiumDriver = appium_driver_2.AppiumDriver;
var element_helper_1 = require("./lib/element-helper");
exports.ElementHelper = element_helper_1.ElementHelper;
var ui_element_1 = require("./lib/ui-element");
exports.UIElement = ui_element_1.UIElement;
var point_1 = require("./lib/point");
exports.Point = point_1.Point;
var locators_1 = require("./lib/locators");
exports.Locator = locators_1.Locator;
var device_controller_1 = require("./lib/device-controller");
exports.DeviceController = device_controller_1.DeviceController;
const nsCapabilities = new ns_capabilities_1.NsCapabilities();
const appiumServer = new appium_server_1.AppiumServer(nsCapabilities);
let appiumDriver = null;
function startServer(port) {
    return __awaiter(this, void 0, void 0, function* () {
        appiumServer.port = port || nsCapabilities.port;
        let retry = false;
        if (!appiumServer.port) {
            appiumServer.port = (yield portastic.find({ min: 8600, max: 9080 }))[0];
            retry = true;
        }
        let hasStarted = yield appiumServer.start();
        let retryCount = 0;
        while (retry && !hasStarted && retryCount < 10) {
            let tempPort = appiumServer.port + 10;
            tempPort = (yield portastic.find({ min: tempPort, max: 9180 }))[0];
            console.log("Trying to use port: ", tempPort);
            appiumServer.port = tempPort;
            hasStarted = yield appiumServer.start();
            retryCount++;
        }
        if (!hasStarted) {
            throw new Error("Appium driver failed to start!!! Run with --verbose option for more info!");
        }
        appiumServer.hasStarted = hasStarted;
        process.on("uncaughtException", () => utils_1.shutdown(appiumServer.server, nsCapabilities.verbose));
        process.on("exit", () => utils_1.shutdown(appiumServer.server, nsCapabilities.verbose));
        process.on("SIGINT", () => utils_1.shutdown(appiumServer.server, nsCapabilities.verbose));
    });
}
exports.startServer = startServer;
;
function stopServer() {
    return __awaiter(this, void 0, void 0, function* () {
        if (appiumDriver !== null && appiumDriver.isAlive) {
            yield appiumDriver.quit();
        }
        if (appiumServer !== null && appiumServer.hasStarted) {
            yield appiumServer.stop();
        }
    });
}
exports.stopServer = stopServer;
;
function createDriver() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!appiumServer.hasStarted) {
            throw new Error("Server is not available!");
        }
        if (!nsCapabilities.appiumCapsLocation) {
            throw new Error("Provided path to appium capabilities is not correct!");
        }
        if (!nsCapabilities.runType) {
            throw new Error("--runType is missing! Make sure it is provided correctly! It is used to parse the configuration for appium driver!");
        }
        if (appiumDriver !== null && appiumDriver.isAlive) {
            return appiumDriver;
        }
        else if (appiumDriver === null) {
            appiumDriver = yield appium_driver_1.AppiumDriver.createAppiumDriver(appiumServer.port, nsCapabilities);
        }
        else if (appiumDriver !== null && !appiumDriver.isAlive) {
            yield appiumDriver.init();
        }
        return appiumDriver;
    });
}
exports.createDriver = createDriver;
//# sourceMappingURL=index.js.map