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
require('colors');
var chai = require("chai");
const wd = require("wd");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
exports.should = chai.should();
chaiAsPromised.transferPromiseness = wd.transferPromiseness;
const element_helper_1 = require("./element-helper");
const ui_element_1 = require("./ui-element");
const locators_1 = require("./locators");
const utils_1 = require("./utils");
const image_helper_1 = require("./image-helper");
const fs_1 = require("fs");
const webdriverio = require("webdriverio");
class AppiumDriver {
    constructor(_driver, _wd, _webio, _driverConfig, _args) {
        this._driver = _driver;
        this._wd = _wd;
        this._webio = _webio;
        this._driverConfig = _driverConfig;
        this._args = _args;
        this._defaultWaitTime = 5000;
        this._isAlive = false;
        this._elementHelper = new element_helper_1.ElementHelper(this._args.appiumCaps.platformName.toLowerCase(), this._args.appiumCaps.platformVersion.toLowerCase());
        this._imageHelper = new image_helper_1.ImageHelper(this._args);
        this._isAlive = true;
        this._locators = new locators_1.Locator(this._args.appiumCaps.platformName, this._args.appiumCaps.platformVersion);
        this._webio.requestHandler.sessionID = this._driver.sessionID;
    }
    get defaultWaitTime() {
        return this._defaultWaitTime;
    }
    set defaultWaitTime(waitTime) {
        this._defaultWaitTime = waitTime;
    }
    get capabilities() {
        return this._args.appiumCaps;
    }
    get platformName() {
        return this._args.appiumCaps.platformName;
    }
    get platformVersion() {
        return this._args.appiumCaps.platformVersion;
    }
    get elementHelper() {
        return this._elementHelper;
    }
    get locators() {
        return this._locators;
    }
    get isAlive() {
        return this._isAlive;
    }
    get driver() {
        return this._driver;
    }
    webio() {
        return this._webio;
    }
    wd() {
        return this._wd;
    }
    click(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._webio.click(args);
        });
    }
    navBack() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._driver.back();
        });
    }
    /**
     *
     * @param xPath
     * @param waitForElement
     */
    findElementByXPath(xPath, waitForElement = this.defaultWaitTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchM = "waitForElementByXPath";
            return yield new ui_element_1.UIElement(yield this._driver.waitForElementByXPath(xPath, waitForElement), this._driver, this._wd, this._webio, searchM, xPath);
        });
    }
    /**
     *
     * @param xPath
     * @param waitForElement
     */
    findElementsByXPath(xPath, waitForElement = this.defaultWaitTime) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.convertArrayToUIElements(yield this._driver.waitForElementsByXPath(xPath, waitForElement), "waitForElementsByXPath", xPath);
        });
    }
    /**
     * Search for element by given text. The seacrch is case insensitive for android
     * @param text
     * @param match
     * @param waitForElement
     */
    findElementByText(text, match = 0 /* exact */, waitForElement = this.defaultWaitTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const shouldMatch = match === 0 /* exact */ ? true : false;
            return yield this.findElementByXPath(this._elementHelper.getXPathByText(text, shouldMatch), waitForElement);
        });
    }
    /**
     * Search for elements by given text. The seacrch is case insensitive for android
     * @param text
     * @param match
     * @param waitForElement
     */
    findElementsByText(text, match = 0 /* exact */, waitForElement = this.defaultWaitTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const shouldMatch = match === 0 /* exact */ ? true : false;
            return yield this.findElementsByXPath(this._elementHelper.getXPathByText(text, shouldMatch), waitForElement);
        });
    }
    /**
     * Searches for element by element native class name like button, textView etc which will be translated to android.widgets.Button or XCUIElementTypeButton (iOS 10 and higher) or UIElementButton (iOS 9)
     * Notice this is not the same as css class
     * @param className
     * @param waitForElement
     */
    findElementByClassName(className, waitForElement = this.defaultWaitTime) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ui_element_1.UIElement(yield this._driver.waitForElementByClassName(className, waitForElement), this._driver, this._wd, this._webio, "waitForElementByClassName", className);
        });
    }
    /**
     * Searches for element by element native class name like button, textView etc which will be translated to android.widgets.Button or XCUIElementTypeButton (iOS 10 and higher) or UIElementButton (iOS 9)
     * Notice this is not the same as css class
     * @param className
     * @param waitForElement
     */
    findElementsByClassName(className, waitForElement = this.defaultWaitTime) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.convertArrayToUIElements(yield this._driver.waitForElementsByClassName(className, waitForElement), "waitForElementsByClassName", className);
        });
    }
    /**
     * Find element by automationText
     * @param id
     * @param waitForElement
     */
    findElementByAccessibilityId(id, waitForElement = this.defaultWaitTime) {
        return __awaiter(this, void 0, void 0, function* () {
            return new ui_element_1.UIElement(yield this._driver.waitForElementByAccessibilityId(id, waitForElement), this._driver, this._wd, this._webio, "waitForElementByAccessibilityId", id);
        });
    }
    /**
     * Find elements by automationText
     * @param id
     * @param waitForElement
     */
    findElementsByAccessibilityId(id, waitForElement = this.defaultWaitTime) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.convertArrayToUIElements(yield this._driver.waitForElementsByAccessibilityId(id, waitForElement), "waitForElementsByAccessibilityId", id);
        });
    }
    /**
     * Scrolls from point to other point with minimum inertia
     * @param direction
     * @param y
     * @param x
     * @param yOffset
     * @param xOffset
     */
    scroll(direction, y, x, yOffset, xOffset = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            utils_1.scroll(this._wd, this._driver, direction, this._webio.isIOS, y, x, yOffset, xOffset, this._args.verbose);
        });
    }
    /**
     *
     * @param direction
     * @param element
     * @param startPoint
     * @param yOffset
     * @param xOffset
     * @param retryCount
     */
    scrollTo(direction, element, startPoint, yOffset, xOffset = 0, retryCount = 7) {
        return __awaiter(this, void 0, void 0, function* () {
            let el = null;
            while (el === null && retryCount > 0) {
                try {
                    el = yield element();
                    if (!(yield el.isDisplayed())) {
                        yield utils_1.scroll(this._wd, this._driver, direction, this._webio.isIOS, startPoint.y, startPoint.x, yOffset, xOffset, this._args.verbose);
                    }
                }
                catch (error) {
                    yield utils_1.scroll(this._wd, this._driver, direction, this._webio.isIOS, startPoint.y, startPoint.x, yOffset, xOffset, this._args.verbose);
                }
                if (el !== null && (yield el.isDisplayed())) {
                    break;
                }
                else {
                    el = null;
                }
                retryCount--;
            }
            return el;
        });
    }
    /**
     * Swipe from point with offset and inertia according to duatio
     * @param y
     * @param x
     * @param yOffset
     * @param inertia
     * @param xOffset
     */
    swipe(y, x, yOffset, inertia = 250, xOffset = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            let direction = 1;
            if (this._webio.isIOS) {
                direction = -1;
            }
            const action = new this._wd.TouchAction(this._driver);
            action
                .press({ x: x, y: y })
                .wait(inertia)
                .moveTo({ x: xOffset, y: direction * yOffset })
                .release();
            yield action.perform();
            yield this._driver.sleep(150);
        });
    }
    source() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._webio.source();
        });
    }
    sessionId() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.driver.getSessionId();
        });
    }
    compareScreen(imageName, timeOutSeconds = 3, tollerance = 0.01) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!imageName.endsWith(AppiumDriver.pngFileExt)) {
                imageName = imageName.concat(AppiumDriver.pngFileExt);
            }
            if (!this._storage) {
                this._storage = utils_1.getStorage(this._args);
            }
            if (!this._logPath) {
                this._logPath = utils_1.getReportPath(this._args);
            }
            let expectedImage = utils_1.resolve(this._storage, imageName);
            // Firts capture of screen when the expected image is not available
            if (!utils_1.fileExists(expectedImage)) {
                yield this.takeScreenshot(utils_1.resolve(this._storage, imageName.replace(".", "_actual.")));
                console.log("Remove the 'actual' suffix to continue using the image as expected one ", expectedImage);
                let eventStartTime = Date.now().valueOf();
                let counter = 1;
                timeOutSeconds *= 1000;
                while ((Date.now().valueOf() - eventStartTime) <= timeOutSeconds) {
                    let actualImage = yield this.takeScreenshot(utils_1.resolve(this._logPath, imageName.replace(".", "_actual" + "_" + counter + ".")));
                    counter++;
                }
                return false;
            }
            let actualImage = yield this.takeScreenshot(utils_1.resolve(this._logPath, imageName.replace(".", "_actual.")));
            let diffImage = actualImage.replace("actual", "diff");
            let result = yield this._imageHelper.compareImages(actualImage, expectedImage, diffImage, tollerance);
            if (!result) {
                let eventStartTime = Date.now().valueOf();
                let counter = 1;
                timeOutSeconds *= 1000;
                while ((Date.now().valueOf() - eventStartTime) <= timeOutSeconds && !result) {
                    let actualImage = yield this.takeScreenshot(utils_1.resolve(this._logPath, imageName.replace(".", "_actual" + "_" + counter + ".")));
                    result = yield this._imageHelper.compareImages(actualImage, expectedImage, diffImage, tollerance);
                    counter++;
                }
            }
            else {
                if (utils_1.fileExists(diffImage)) {
                    fs_1.unlinkSync(diffImage);
                }
                if (utils_1.fileExists(actualImage)) {
                    fs_1.unlinkSync(actualImage);
                }
            }
            return result;
        });
    }
    takeScreenshot(fileName) {
        if (!fileName.endsWith(AppiumDriver.pngFileExt)) {
            fileName = fileName.concat(AppiumDriver.pngFileExt);
        }
        return new Promise((resolve, reject) => {
            this._driver.takeScreenshot().then(function (image, err) {
                fs_1.writeFileSync(fileName, image, 'base64');
                resolve(fileName);
            });
        });
    }
    logScreenshot(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._logPath && !utils_1.fileExists(fileName)) {
                this._logPath = utils_1.getReportPath(this._args);
            }
            if (!fileName.endsWith(AppiumDriver.pngFileExt)) {
                fileName = fileName.concat(AppiumDriver.pngFileExt);
            }
            const imgPath = yield this.takeScreenshot(utils_1.resolve(this._logPath, fileName));
            return imgPath;
        });
    }
    logPageSource(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._logPath && !utils_1.fileExists(fileName)) {
                this._logPath = utils_1.getReportPath(this._args);
            }
            if (!fileName.endsWith(".xml")) {
                fileName = fileName.concat(".xml");
            }
            const path = utils_1.resolve(this._logPath, fileName);
            const xml = yield this.source();
            fs_1.writeFileSync(path, xml.value, 'utf8');
        });
    }
    static createAppiumDriver(port, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let driverConfig = {
                host: "localhost",
                port: port
            };
            if (args.isSauceLab) {
                const sauceUser = process.env.SAUCE_USER;
                const sauceKey = process.env.SAUCE_KEY;
                if (!sauceKey || !sauceUser) {
                    throw new Error("Sauce Labs Username or Access Key is missing! Check environment variables for SAUCE_USER and SAUCE_KEY !!!");
                }
                driverConfig = "https://" + sauceUser + ":" + sauceKey + "@ondemand.saucelabs.com:443/wd/hub";
                args.appiumCaps.app = "sauce-storage:" + args.appPath;
                console.log("Using Sauce Labs. The application path is changed to: " + args.appPath);
            }
            utils_1.log("Creating driver!", args.verbose);
            const _webio = webdriverio.remote({
                baseUrl: driverConfig.host,
                port: driverConfig.port,
                logLevel: 'verbose',
                desiredCapabilities: args.appiumCaps
            });
            const driver = yield wd.promiseChainRemote(driverConfig);
            AppiumDriver.configureLogging(driver, args.verbose);
            yield driver.init(args.appiumCaps);
            return new AppiumDriver(driver, wd, _webio, driverConfig, args);
        });
    }
    resetApp() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._driver.resetApp();
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._driver.init(this._args.appiumCaps);
            this._webio.requestHandler.sessionID = this._driver.sessionID;
            this._isAlive = true;
        });
    }
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Killing driver");
            try {
                yield this._driver.quit();
                yield this._driver.quit();
                yield this._webio.quit();
            }
            catch (error) {
            }
            this._isAlive = false;
            console.log("Driver is dead");
        });
    }
    convertArrayToUIElements(array, searchM, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let i = 0;
            const arrayOfUIElements = new Array();
            if (!array || array === null) {
                return arrayOfUIElements;
            }
            array.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                arrayOfUIElements.push(new ui_element_1.UIElement(yield element, this._driver, this._wd, this._webio, searchM, args, i));
                i++;
            }));
            return arrayOfUIElements;
        });
    }
    static configureLogging(driver, verbose) {
        driver.on("status", function (info) {
            utils_1.log(info.cyan, verbose);
        });
        driver.on("command", function (meth, path, data) {
            utils_1.log(" > " + meth.yellow + path.grey + " " + (data || ""), verbose);
        });
        driver.on("http", function (meth, path, data) {
            utils_1.log(" > " + meth.magenta + path + " " + (data || "").grey, verbose);
        });
    }
    ;
}
AppiumDriver.pngFileExt = '.png';
AppiumDriver.partialUrl = "/wd/hub/session/";
exports.AppiumDriver = AppiumDriver;
//# sourceMappingURL=appium-driver.js.map