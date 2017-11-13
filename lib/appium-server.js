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
const child_process = require("child_process");
const utils_1 = require("./utils");
const device_controller_1 = require("./device-controller");
class AppiumServer {
    constructor(_args) {
        this._args = _args;
        this._runType = this._args.runType;
        this._hasStarted = false;
        this.resolveAppiumDependency();
    }
    get port() {
        return this._port;
    }
    set port(port) {
        this._port = port;
    }
    set runType(runType) {
        this._runType = runType;
    }
    get runType() {
        return this._runType;
    }
    get server() {
        return this._server;
    }
    get hasStarted() {
        return this._hasStarted;
    }
    set hasStarted(hasStarted) {
        this._hasStarted = hasStarted;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const device = yield device_controller_1.DeviceController.startDevice(this._args);
            utils_1.log("Starting server...", this._args.verbose);
            this._args.device = device;
            const logLevel = this._args.verbose === true ? "debug" : "info";
            this._server = child_process.spawn(this._appium, ["-p", this.port.toString(), "--log-level", logLevel], {
                shell: true,
                detached: false
            });
            const response = yield utils_1.waitForOutput(this._server, /listener started/, /Error: listen/, 60000, this._args.verbose);
            return response;
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield device_controller_1.DeviceController.stop(this._args);
            return new Promise((resolve, reject) => {
                this._server.on("close", (code, signal) => {
                    utils_1.log(`Appium terminated due signal: ${signal} and code: ${code}`, this._args.verbose);
                    resolve();
                });
                this._server.on("exit", (code, signal) => {
                    utils_1.log(`Appium terminated due signal: ${signal} and code: ${code}`, this._args.verbose);
                    resolve();
                });
                this._server.on("error", (code, signal) => {
                    utils_1.log(`Appium terminated due signal: ${signal} and code: ${code}`, this._args.verbose);
                    resolve();
                });
                this._server.on("disconnect", (code, signal) => {
                    utils_1.log(`Appium terminated due signal: ${signal} and code: ${code}`, this._args.verbose);
                    resolve();
                });
                utils_1.log("Stopping server...", this._args.verbose);
                try {
                    if (utils_1.isWin) {
                        utils_1.shutdown(this._server, this._args.verbose);
                        this._server.kill("SIGINT");
                        this._server.kill("SIGINT");
                        this._server = null;
                    }
                    else {
                        this._server.kill("SIGINT");
                        this._server.kill("SIGINT");
                        this._server.kill("SIGKILL");
                        utils_1.shutdown(this._server, this._args.verbose);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
    }
    // Resolve appium dependency
    resolveAppiumDependency() {
        const projectDir = this._args.projectDir;
        const pluginBinary = this._args.pluginBinary;
        const projectBinary = this._args.projectBinary;
        const pluginRoot = this._args.pluginRoot;
        let appium = process.platform === "win32" ? "appium.cmd" : "appium";
        const pluginAppiumBinary = utils_1.resolve(pluginBinary, appium);
        const projectAppiumBinary = utils_1.resolve(projectBinary, appium);
        if (utils_1.fileExists(pluginAppiumBinary)) {
            utils_1.log("Using plugin-local Appium binary.", this._args.verbose);
            appium = pluginAppiumBinary;
        }
        else if (utils_1.fileExists(projectAppiumBinary)) {
            utils_1.log("Using project-local Appium binary.", this._args.verbose);
            appium = projectAppiumBinary;
        }
        else {
            const result = utils_1.executeCommand("npm list -g");
            if (result.includes("appium")) {
                utils_1.log("Using global Appium binary.", this._args.verbose);
            }
            else if (result.includes("appium")) {
                const msg = "Appium not found. Please install appium before runnig tests!";
                utils_1.log(msg, this._args.verbose);
                new Error(msg);
            }
        }
        this._appium = appium;
    }
}
exports.AppiumServer = AppiumServer;
//# sourceMappingURL=appium-server.js.map