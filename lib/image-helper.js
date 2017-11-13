"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blinkDiff = require("blink-diff");
const image_options_1 = require("./image-options");
class ImageHelper {
    constructor(_args) {
        this._args = _args;
    }
    getOffsetPixels() {
        return this._args.device.config ? this._args.device.config.offsetPixels : 40; // TODO: iOS = 40
    }
    imageOutputLimit() {
        return image_options_1.ImageOptions.outputAll;
    }
    thresholdType() {
        return image_options_1.ImageOptions.pixel;
    }
    threshold() {
        return 0.1; // 0.1 percent; 500 percent
    }
    delta() {
        return 20;
    }
    cropImageA() {
        return { x: 0, y: this.getOffsetPixels() };
    }
    cropImageB() {
        return { x: 0, y: this.getOffsetPixels() };
    }
    verbose() {
        return false;
    }
    runDiff(diffOptions, diffImage) {
        return new Promise((resolve, reject) => {
            diffOptions.run(function (error, result) {
                if (error) {
                    throw error;
                }
                else {
                    let message;
                    let resultCode = diffOptions.hasPassed(result.code);
                    if (resultCode) {
                        message = "Screen compare passed!";
                        console.log(message);
                        console.log('Found ' + result.differences + ' differences.');
                        return resolve(true);
                    }
                    else {
                        message = "Screen compare failed!";
                        console.log(message);
                        console.log('Found ' + result.differences + ' differences.');
                        console.log('Diff image: ' + diffImage);
                        return resolve(false);
                    }
                }
            });
        });
    }
    compareImages(actual, expected, output, valueThreshold = this.threshold(), typeThreshold = image_options_1.ImageOptions.pixel) {
        let diff = new blinkDiff({
            imageAPath: actual,
            imageBPath: expected,
            imageOutputPath: output,
            imageOutputLimit: this.imageOutputLimit(),
            thresholdType: typeThreshold,
            threshold: valueThreshold,
            delta: this.delta(),
            cropImageA: this.cropImageA(),
            cropImageB: this.cropImageB(),
            verbose: this.verbose(),
        });
        return this.runDiff(diff, output);
    }
}
exports.ImageHelper = ImageHelper;
//# sourceMappingURL=image-helper.js.map