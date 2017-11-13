"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const locators_1 = require("./locators");
class ElementHelper {
    constructor(_platform, _platformVersion) {
        this._platform = _platform;
        this._platformVersion = _platformVersion;
        this.isAndroid = this._platform === "android";
        this.locators = new locators_1.Locator(this._platform, this._platformVersion);
    }
    getXPathElement(name) {
        const tempName = name.toLowerCase().replace(/\-/g, "");
        this.locators.getElementByName(name);
    }
    ;
    getXPathByText(text, exactMatch) {
        return this.findByTextLocator("*", text, exactMatch);
    }
    getXPathWithExactText(text) {
        return this.getXPathByText(text, true);
    }
    getXPathContainingText(text) {
        return this.getXPathByText(text, false);
    }
    findByTextLocator(controlType, value, exactMatch) {
        let artbutes = ["label", "value", "hint"];
        if (this.isAndroid) {
            artbutes = ["content-desc", "resource-id", "text"];
        }
        let searchedString = "";
        if (exactMatch) {
            if (this.isAndroid) {
                artbutes.forEach((atr) => { searchedString += "translate(@" + atr + ",'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='" + value.toLowerCase() + "'" + " or "; });
            }
            else {
                artbutes.forEach((atr) => { searchedString += "@" + atr + "='" + value + "'" + " or "; });
            }
        }
        else {
            if (this.isAndroid) {
                artbutes.forEach((atr) => { searchedString += "contains(translate(@" + atr + ",'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'" + value.toLowerCase() + "')" + " or "; });
            }
            else {
                artbutes.forEach((atr) => { searchedString += "contains(@" + atr + ",'" + value + "')" + " or "; });
            }
        }
        searchedString = searchedString.substring(0, searchedString.lastIndexOf(" or "));
        const result = "//" + controlType + "[" + searchedString + "]";
        utils_1.log("Xpath: " + result, false);
        return result;
    }
}
exports.ElementHelper = ElementHelper;
//# sourceMappingURL=element-helper.js.map