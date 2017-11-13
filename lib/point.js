"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Point {
    constructor(_x, _y) {
        this._x = _x;
        this._y = _y;
    }
    get x() {
        return this._x;
    }
    set x(x) {
        this._x = x;
    }
    get y() {
        return this._y;
    }
    set y(y) {
        this._y = y;
    }
    toString() {
        return `${this.x} ${this.y}`;
    }
}
exports.Point = Point;
//# sourceMappingURL=point.js.map