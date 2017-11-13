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
const path = require("path");
const fs = require("fs");
const childProcess = require("child_process");
const glob = require("glob");
require('colors');
const point_1 = require("./point");
function resolve(mainPath, ...args) {
    if (!path.isAbsolute(mainPath)) {
        if (mainPath.startsWith('~')) {
            mainPath = path.join(process.env.HOME, mainPath.slice(1));
        }
        else {
            mainPath = path.resolve(mainPath);
        }
    }
    let fullPath = mainPath;
    args.forEach(p => {
        fullPath = path.resolve(fullPath, p);
    });
    return fullPath;
}
exports.resolve = resolve;
function fileExists(p) {
    try {
        if (fs.existsSync(p)) {
            return true;
        }
        return false;
    }
    catch (e) {
        if (e.code == 'ENOENT') {
            logErr("File does not exist. " + p, true);
            return false;
        }
        logErr("Exception fs.statSync (" + path + "): " + e, true);
        throw e;
    }
}
exports.fileExists = fileExists;
function isDirectory(fullName) {
    try {
        if (fileExists(fullName) && fs.statSync(fullName).isDirectory()) {
            return true;
        }
    }
    catch (e) {
        console.log(e.message);
        return false;
    }
    return false;
}
function isFile(fullName) {
    try {
        if (fileExists(fullName) && fs.statSync(fullName).isFile()) {
            return true;
        }
    }
    catch (e) {
        logErr(e.message, true);
        return false;
    }
    return false;
}
exports.isFile = isFile;
function copy(src, dest, verbose) {
    if (!fileExists(src)) {
        return Error("Cannot copy: " + src + ". Source doesn't exist: " + dest);
    }
    if (fileExists(src) && isFile(src) && isDirectory(dest)) {
        dest = path.join(dest, path.basename(src));
    }
    if (isDirectory(src)) {
        if (!fileExists(dest)) {
            console.info("CREATE Directory: " + dest);
            fs.mkdirSync(dest);
        }
        const files = getAllFileNames(src);
        const destination = dest;
        files.forEach(file => {
            const destt = path.resolve(destination, file);
            copy(path.join(src, file), destt, verbose);
        });
    }
    else {
        fs.writeFileSync(dest, fs.readFileSync(src));
    }
    if (verbose) {
        console.info("File " + src + " is coppied to " + dest);
    }
    return dest;
}
exports.copy = copy;
function getAllFileNames(folder) {
    let files = new Array();
    fs.readdirSync(resolve(folder)).forEach(file => {
        files.push(file);
    });
    return files;
}
/// ^nativ\w*(.+).gz$ native*.gz
/// \w*nativ\w*(.+)\.gz$ is like *native*.gz
/// \w*nativ\w*(.+)\.gz\w*(.+)$ is like *native*.gz*
function createRegexPattern(text) {
    let finalRex = "";
    text.split(",").forEach(word => {
        word = word.trim();
        let searchRegex = word;
        if (word !== "" && word !== " ") {
            searchRegex = searchRegex.replace(".", "\\.");
            searchRegex = searchRegex.replace("*", "\\w*(.+)?");
            if (!word.startsWith("*")) {
                searchRegex = "^" + searchRegex;
            }
            if (!word.endsWith("*")) {
                searchRegex += "$";
            }
            if (!contains(finalRex, searchRegex)) {
                finalRex += searchRegex + "|";
            }
        }
    });
    finalRex = finalRex.substring(0, finalRex.length - 1);
    const regex = new RegExp(finalRex, "gi");
    return regex;
}
function contains(source, check) {
    return source.indexOf(check) >= 0;
}
exports.contains = contains;
// Search for files and folders. If should not match, than the filter will skip this words. Could be use with wildcards
function searchFiles(folder, words, recursive = true, files = new Array()) {
    const rootFiles = getAllFileNames(folder);
    const regex = createRegexPattern(words);
    rootFiles.filter(f => {
        const fileFullName = resolve(folder, f);
        let m = regex.test(f);
        if (m) {
            files.push(fileFullName);
        }
        else if (isDirectory(fileFullName) && recursive) {
            searchFiles(fileFullName, words, recursive, files);
        }
    });
    return files;
}
exports.searchFiles = searchFiles;
function log(message, verbose) {
    if (verbose) {
        console.log(message);
    }
}
exports.log = log;
function loglogOut(line, verbose) {
    if (verbose) {
        process.stdout.write(line);
    }
}
exports.loglogOut = loglogOut;
function logErr(line, verbose) {
    if (verbose) {
        process.stderr.write(line);
    }
}
exports.logErr = logErr;
function shutdown(processToKill, verbose) {
    try {
        if (processToKill && processToKill !== null) {
            if (process.platform === "win32") {
                killPid(processToKill.pid, verbose);
            }
            else {
                processToKill.kill();
            }
            processToKill.killed = true;
            processToKill = null;
            console.log("Shut down!!!");
        }
    }
    catch (error) {
        logErr(error, verbose);
    }
}
exports.shutdown = shutdown;
function killPid(pid, verbose) {
    let output = childProcess.execSync('taskkill /PID ' + pid + ' /T /F');
    log(output, verbose);
}
exports.killPid = killPid;
function waitForOutput(process, matcher, errorMatcher, timeout, verbose) {
    return new Promise(function (resolve, reject) {
        const abortWatch = setTimeout(function () {
            process.kill();
            console.log("Timeout expired, output not detected for: " + matcher);
            resolve(false);
        }, timeout);
        process.stdout.on("data", function (data) {
            let line = "" + data;
            log(line, verbose);
            if (errorMatcher.test(line)) {
                clearTimeout(abortWatch);
                resolve(false);
            }
            if (matcher.test(line)) {
                clearTimeout(abortWatch);
                resolve(true);
            }
        });
    });
}
exports.waitForOutput = waitForOutput;
function executeCommand(args, cwd = process.cwd()) {
    const commands = args.split(" ");
    const baseCommand = commands.shift();
    const output = childProcess.spawnSync(baseCommand, commands, {
        shell: true,
        cwd: cwd,
        encoding: "UTF8"
    });
    return output.output[1].toString();
}
exports.executeCommand = executeCommand;
function isWin() {
    return /^win/.test(process.platform);
}
exports.isWin = isWin;
function getStorage(args) {
    let storage = args.storage;
    if (!storage) {
        storage = createStorageFolder(resolve(args.projectDir, args.testFolder), "resources");
        storage = createStorageFolder(storage, "images");
    }
    const appName = getAppName(args);
    storage = createStorageFolder(storage, appName);
    storage = createStorageFolder(storage, args.appiumCaps.deviceName);
    return storage;
}
exports.getStorage = getStorage;
function getReportPath(args) {
    let report = args.testReports;
    if (!report) {
        report = createStorageFolder(resolve(args.projectDir, args.testFolder), "reports");
    }
    const appName = getAppName(args);
    report = createStorageFolder(report, appName);
    report = createStorageFolder(report, args.appiumCaps.deviceName);
    return report;
}
exports.getReportPath = getReportPath;
function getAppName(args) {
    const appName = args.appiumCaps.app
        .substring(args.appiumCaps.app.lastIndexOf("/") + 1, args.appiumCaps.app.lastIndexOf("."))
        .replace("-release", "").replace("-debug", "");
    return appName;
}
function getAppPath(platform, runType) {
    if (platform.includes("android")) {
        const apks = glob.sync("platforms/android/build/outputs/apk/*.apk").filter(function (file) { return file.indexOf("unaligned") < 0; });
        return apks[0];
    }
    else if (platform.includes("ios")) {
        if (runType.includes("sim")) {
            const simulatorApps = glob.sync("platforms/ios/build/emulator/**/*.app");
            return simulatorApps[0];
        }
        else if (runType.includes("device")) {
            const deviceApps = glob.sync("platforms/ios/build/device/**/*.ipa");
            return deviceApps[0];
        }
    }
    else {
        throw new Error("No 'app' capability provided and incorrect 'runType' convention used: " + runType +
            ". In order to automatically search and locate app package please use 'android','device','sim' in your 'runType' option. E.g --runType android25, --runType sim.iPhone7.iOS110");
    }
}
exports.getAppPath = getAppPath;
function calculateOffset(direction, y, yOffset, x, xOffset, isIOS, verbose) {
    let speed = 10;
    let yEnd = Math.abs(yOffset);
    let xEnd = Math.abs(xOffset);
    let duration = Math.abs(yEnd) * speed;
    if (isIOS) {
        speed = 100;
        if (direction === 0 /* down */) {
            direction = -1;
            yEnd = direction * yEnd;
        }
        if (direction === 3 /* right */) {
            direction = -1;
            xEnd = direction * xEnd;
        }
    }
    else {
        if (direction === 0 /* down */) {
            yEnd = Math.abs(yOffset - y);
        }
        if (direction === 1 /* up */) {
            yEnd = direction * Math.abs((Math.abs(yOffset) + y));
        }
        duration = Math.abs(yOffset) * speed;
        if (direction === 3 /* right */) {
            xEnd = Math.abs(xOffset - x);
        }
        if (direction === 2 /* left */) {
            xEnd = Math.abs(xOffset + x);
        }
        if (yOffset < xOffset && x) {
            duration = Math.abs(xOffset) * speed;
        }
    }
    log({ point: new point_1.Point(xEnd, yEnd), duration: duration }, verbose);
    return { point: new point_1.Point(xEnd, yEnd), duration: duration };
}
exports.calculateOffset = calculateOffset;
/**
 * Scrolls from point to other point with minimum inertia
 * @param y
 * @param x
 * @param yOffset
 * @param xOffset
 */
function scroll(wd, driver, direction, isIOS, y, x, yOffset, xOffset, verbose) {
    return __awaiter(this, void 0, void 0, function* () {
        if (x === 0) {
            x = 20;
        }
        if (y === 0) {
            y = 20;
        }
        const endPoint = calculateOffset(direction, y, yOffset, x, xOffset, isIOS, verbose);
        const action = new wd.TouchAction(driver);
        action
            .press({ x: x, y: y })
            .wait(endPoint.duration)
            .moveTo({ x: endPoint.point.x, y: endPoint.point.y })
            .release();
        yield action.perform();
        yield driver.sleep(150);
    });
}
exports.scroll = scroll;
function createStorageFolder(storage, direcotry) {
    storage = resolve(storage, direcotry);
    if (!fileExists(storage)) {
        fs.mkdirSync(storage);
    }
    return storage;
}
//# sourceMappingURL=utils.js.map