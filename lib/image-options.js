"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blinkDiff = require("blink-diff");
var ImageOptions;
(function (ImageOptions) {
    ImageOptions[ImageOptions["outputAll"] = blinkDiff.OUTPUT_ALL] = "outputAll";
    ImageOptions[ImageOptions["pixel"] = blinkDiff.THRESHOLD_PIXEL] = "pixel";
    ImageOptions[ImageOptions["percent"] = blinkDiff.THRESHOLD_PERCENT] = "percent";
})(ImageOptions = exports.ImageOptions || (exports.ImageOptions = {}));
//# sourceMappingURL=image-options.js.map