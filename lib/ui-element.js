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
const point_1 = require("./point");
const utils_1 = require("./utils");
class UIElement {
    constructor(_element, _driver, _wd, _webio, _searchMethod, _searchParams, _index) {
        this._element = _element;
        this._driver = _driver;
        this._wd = _wd;
        this._webio = _webio;
        this._searchMethod = _searchMethod;
        this._searchParams = _searchParams;
        this._index = _index;
    }
    /**
     * Click on element
     */
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.element()).click();
        });
    }
    /**
     * Tap on element
     */
    tap() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.element()).tap();
        });
    }
    /**
     * double tap
     */
    doubleTap() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._driver.execute('mobile: doubleTap', { element: (yield this.element()).value.ELEMENT });
        });
    }
    /**
     * Get location of element
     */
    location() {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield (yield this.element()).getLocation();
            const point = new point_1.Point(location.x, location.y);
            return point;
        });
    }
    /**
     * Get size of element
     */
    size() {
        return __awaiter(this, void 0, void 0, function* () {
            const size = yield (yield this.element()).getSize();
            const point = new point_1.Point(size.height, size.width);
            return point;
        });
    }
    text() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.element()).text();
        });
    }
    /**
     * Get web driver element
     */
    element() {
        return __awaiter(this, void 0, void 0, function* () {
            this._element = yield this.refetch();
            return yield this._element;
        });
    }
    /**
     * Shows if element is displayed. Returns true or false. If the element doesn't exist it will return false
     */
    isDisplayed() {
        return __awaiter(this, void 0, void 0, function* () {
            const el = (yield this.element());
            return (yield el) === null ? false : (yield this._element.isDisplayed());
        });
    }
    /**
     * Returns true or false
     */
    exists() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.element() === null ? false : true;
        });
    }
    /**
     * Waits until the element exists not.
     * @param wait
     */
    waitForExistNot(wait = 3000) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._webio.waitForExist(this._searchParams, wait, true);
        });
    }
    /**
     * Wait until the elements appear
     * @param wait
     */
    waitForExist(wait = 3000) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._webio.waitForExist(this._searchParams, wait, false);
        });
    }
    getAttribute(attr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (yield this.element()).getAttribute(attr);
        });
    }
    /**
     * Scroll with offset from elemnt with minimum inertia
     * @param direction
     * @param yOffset
     * @param xOffset
     */
    scroll(direction, yOffset = 0, xOffset = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this._driver.execute("mobile: scroll", [{direction: 'up'}])
            //await this._driver.execute('mobile: scroll', { direction: direction === 0 ? "down" : "up", element: this._element.ELEMENT });
            const location = yield this.location();
            const size = yield this.size();
            const x = location.x === 0 ? 10 : location.x;
            let y = (location.y + 15);
            if (yOffset === 0) {
                yOffset = location.y + size.y - 15;
            }
            if (direction === 0 /* down */) {
                y = (location.y + size.y) - 15;
                if (!this._webio.isIOS) {
                    if (yOffset === 0) {
                        yOffset = location.y + size.y - 15;
                    }
                }
            }
            if (direction === 1 /* up */) {
                if (yOffset === 0) {
                    yOffset = size.y - 15;
                }
            }
            const endPoint = utils_1.calculateOffset(direction, y, yOffset, x, xOffset, this._webio.isIOS, false);
            if (direction === 0 /* down */) {
                endPoint.point.y += location.y;
            }
            let action = new this._wd.TouchAction(this._driver);
            action
                .press({ x: x, y: y })
                .wait(endPoint.duration)
                .moveTo({ x: endPoint.point.x, y: endPoint.point.y })
                .release();
            yield action.perform();
            yield this._driver.sleep(150);
        });
    }
    /**
     * Scroll with offset from elemnt with minimum inertia
     * @param direction
     * @param yOffset
     * @param xOffset
     */
    scrollTo(direction, elementToSearch, yOffset = 0, xOffset = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this._driver.execute("mobile: scroll", [{direction: 'up'}])
            //await this._driver.execute('mobile: scroll', { direction: direction === 0 ? "down" : "up", element: this._element.ELEMENT });
            let el = null;
            let retries = 7;
            while (el === null && retries >= 0) {
                try {
                    el = yield elementToSearch();
                    if (!el || el === null || !(yield el.isDisplayed())) {
                        el = null;
                        yield this.scroll(direction, yOffset, xOffset);
                    }
                }
                catch (error) {
                    yield this.scroll(direction, yOffset, xOffset);
                }
                retries--;
            }
            return el;
        });
    }
    /**
 * Scroll with offset from elemnt with minimum inertia
 * @param direction
 * @param yOffset
 * @param xOffset
 */
    drag(direction, yOffset, xOffset = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield this.location();
            const x = location.x === 0 ? 10 : location.x;
            const y = location.y === 0 ? 10 : location.y;
            const endPoint = utils_1.calculateOffset(direction, y, yOffset, x, xOffset, this._webio.isIOS, false);
            let action = new this._wd.TouchAction(this._driver);
            action
                .press({ x: x, y: y })
                .wait(endPoint.duration)
                .moveTo({ x: endPoint.point.x, y: endPoint.point.y })
                .release();
            yield action.perform();
            yield this._driver.sleep(150);
        });
    }
    /**
     * Click and hold over an element
     */
    hold() {
        return __awaiter(this, void 0, void 0, function* () {
            let action = new this._wd.TouchAction(this._driver);
            action
                .longPress({ el: yield this.element() })
                .release();
            yield action.perform();
            yield this._driver.sleep(150);
        });
    }
    log() {
        return __awaiter(this, void 0, void 0, function* () {
            console.dir(yield this.element());
        });
    }
    refetch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this._index != null) {
                    return (yield this._driver[this._searchMethod](this._searchParams, 1000))[this._index];
                }
                else {
                    return yield this._driver[this._searchMethod](this._searchParams, 1000);
                }
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.UIElement = UIElement;
//# sourceMappingURL=ui-element.js.map