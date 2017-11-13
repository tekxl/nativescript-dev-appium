"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const utils = require("./utils");
const parser = require("./parser");
function resolveCapabilities(capsLocation, runType, projectDir, verbose = false) {
    let caps;
    let customCapabilitiesConfigs;
    if (utils.fileExists(capsLocation)) {
        customCapabilitiesConfigs = setCustomCapabilities(capsLocation, verbose);
    }
    else {
        customCapabilitiesConfigs = searchCustomCapabilities(capsLocation, projectDir);
    }
    if (customCapabilitiesConfigs) {
        const customCapabilities = JSON.parse(customCapabilitiesConfigs);
        utils.log(customCapabilities, verbose);
        caps = customCapabilities[runType];
        if (!caps) {
        }
    }
    else {
        throw new Error("No capabilities found!!!");
    }
    return caps;
}
exports.resolveCapabilities = resolveCapabilities;
function searchCustomCapabilities(capabilitiesLocation, projectDir, verbose = false) {
    // resolve capabilites if exist
    if (utils.fileExists(capabilitiesLocation) && utils.isFile(capabilitiesLocation)) {
        return setCustomCapabilities(capabilitiesLocation, verbose);
    }
    // search for default capabilites
    let customCapabilitiesLocation = utils.searchFiles(projectDir, parser.capabilitiesName, false)[0];
    if (utils.fileExists(customCapabilitiesLocation)) {
        return setCustomCapabilities(customCapabilitiesLocation, verbose);
    }
    // search in parent folder for capabilities
    const appParentFolder = path_1.dirname(projectDir);
    customCapabilitiesLocation = utils.searchFiles(appParentFolder, parser.capabilitiesName, true)[0];
    if (utils.fileExists(customCapabilitiesLocation)) {
        return setCustomCapabilities(customCapabilitiesLocation, verbose);
    }
    else {
        // search for capabilities recursive 
        let cap = utils.searchFiles(appParentFolder, parser.capabilitiesName, verbose)[0];
        if (cap) {
            setCustomCapabilities(cap, verbose);
        }
    }
    throw Error("No capabilities found!!!");
}
exports.searchCustomCapabilities = searchCustomCapabilities;
function setCustomCapabilities(appiumCapabilitiesLocation, verbose = false) {
    const file = fs_1.readFileSync(appiumCapabilitiesLocation);
    process.env.APPIUM_CAPABILITIES = file;
    utils.log("Custom capabilities found at: " + appiumCapabilitiesLocation, verbose);
    return file;
}
//# sourceMappingURL=capabilities-helper.js.map