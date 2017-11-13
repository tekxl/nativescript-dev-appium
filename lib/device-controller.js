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
const mobile_devices_controller_1 = require("mobile-devices-controller");
class DeviceController {
    static startDevice(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.isSauceLab || args.ignoreDeviceController) {
                return DeviceController.getDefaultDevice(args);
            }
            const allDevices = (yield mobile_devices_controller_1.DeviceManager.getAllDevices(args.appiumCaps.platformName.toLowerCase()));
            if (!allDevices || allDevices === null || allDevices.size === 0) {
                console.log("We couldn't find any devices. We will try to prossede to appium! Maybe avd manager is missing");
                console.log("Available devices:\n", allDevices);
            }
            let searchedDevices = allDevices.get(args.appiumCaps.deviceName);
            if (!searchedDevices || searchedDevices.length === 0) {
                console.log(`No such device ${args.appiumCaps.deviceName}!!!\n Check your device name!!!`);
                console.log("Available devices:\n", allDevices);
            }
            let device;
            if (searchedDevices && searchedDevices.length > 0) {
                // Should find new device
                if (!args.reuseDevice) {
                    device = DeviceController.getDevicesByStatus(searchedDevices, mobile_devices_controller_1.Status.SHUTDOWN);
                }
                // If there is no shutdown device
                if (!device || device === null) {
                    device = DeviceController.getDevicesByStatus(searchedDevices, mobile_devices_controller_1.Status.BOOTED);
                }
                // In case reuse device is true but there weren't any booted devices. We need to fall back and boot new one.
                if (!device || device === null && args.reuseDevice) {
                    device = DeviceController.getDevicesByStatus(searchedDevices, mobile_devices_controller_1.Status.SHUTDOWN);
                }
                if (device.status === mobile_devices_controller_1.Status.SHUTDOWN) {
                    yield mobile_devices_controller_1.DeviceManager.startDevice(device);
                    console.log("Started device: ", device);
                }
                else {
                    console.log("Device is already started", device);
                    if (!args.reuseDevice) {
                        DeviceController.kill(device);
                        yield mobile_devices_controller_1.DeviceManager.startDevice(device);
                    }
                }
            }
            if (!device || device === null) {
                device = DeviceController.getDefaultDevice(args);
            }
            DeviceController._emulators.set(args.runType, device);
            return device;
        });
    }
    static stop(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (DeviceController._emulators.has(args.runType) && !args.reuseDevice && !args.isSauceLab && !args.ignoreDeviceController) {
                const device = DeviceController._emulators.get(args.runType);
                yield mobile_devices_controller_1.DeviceManager.kill(device);
            }
        });
    }
    static kill(device) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mobile_devices_controller_1.DeviceManager.kill(device);
        });
    }
    static getDefaultDevice(args) {
        return new mobile_devices_controller_1.Device(args.appiumCaps.deviceName, args.appiumCaps.platformVersion, undefined, args.appiumCaps.platformName, undefined, undefined);
    }
    static device(runType) {
        return DeviceController._emulators.get(runType);
    }
    static getDevicesByStatus(devices, status) {
        let device;
        const shutdownDeivces = devices.filter(dev => {
            return dev.status === status;
        });
        if (shutdownDeivces && shutdownDeivces !== null && shutdownDeivces.length > 0) {
            device = shutdownDeivces[0];
        }
        return device;
    }
}
DeviceController._emulators = new Map();
exports.DeviceController = DeviceController;
//# sourceMappingURL=device-controller.js.map