// Import the createRequire function to enable the use of CommonJS modules in an ES module environment
import { createRequire } from "module";
// Create a require function using the current module's URL
const require = createRequire(import.meta.url);
// Require the node-irsdk-2023 package using the created require function
const irsdk = require("node-irsdk-2023");

import { websocket, helper } from "../app.js";

export default class Iracing {
  constructor() {
    this._teamId = 0;
    this._driverId = 0;
    this._subsessionId = null;
    this._irsdkConnect();

    this._sessionCooldown = Date.now();
    this._telemetryCooldown = Date.now();
  }

  get driverId() {
    return this._driverId;
  }

  get teamId() {
    return this._teamId;
  }

  get sessionCooldown() {
    return this._sessionCooldown;
  }

  get telemetryCooldown() {
    return this._telemetryCooldown;
  }

  get subsessionId() {
    return this._subsessionId;
  }

  set subsessionId(arg) {
    if (this._subsessionId != arg) {
      this._subsessionId = arg;
      console.log(`${helper.getCurrentTimeString()}: Your SubsessionID is: ${this._subsessionId}`);
    }
    websocket.connect();
  }

  set sessionCooldown(time) {
    this._sessionCooldown = time;
  }

  set telemetryCooldown(time) {
    this._telemetryCooldown = time;
  }

  set driverId(arg) {
    this._driverId = arg;
  }

  set teamId(arg) {
    this._teamId = arg;
  }

  _irsdkConnect() {
    this._iracing = irsdk.getInstance();

    try {
      irsdk.init({
        telemetryUpdateInterval: 1000,
        sessionInfoUpdateInterval: 1000,
      });
    } catch (error) {
      console.error("Failed to initialize iRacing SDK:", error);
    }

    this._iracing.on("Connected", function () {
      console.log(`${helper.getCurrentTimeString()}: Connected to iRacing.`);
    });

    this._iracing.on("error", function (error) {
      console.error("Error occurred:", error);
    });

    this._iracing.on("Disconnected", function () {
      console.log(`${helper.getCurrentTimeString()}: iRacing shut down.`);
    });

    this._iracing.on("SessionInfo", (sessionInfo) => {
      this.teamId = sessionInfo.data.DriverInfo.Drivers[sessionInfo.data.DriverInfo.DriverCarIdx].TeamID;
      this.driverId = sessionInfo.data.DriverInfo.DriverUserID;
      this.subsessionId = sessionInfo.data.WeekendInfo.SubSessionID;

      const now = Date.now();

      if (this.sessionCooldown < now - 2000) {
        websocket.sendMessage({
          key: "sessionInfo",
          value: sessionInfo.data,
        });
        this.sessionCooldown = now;
      }
    });

    this._iracing.on("Telemetry", (telemetry) => {
      const now = Date.now();

      if (this.telemetryCooldown < now - 1000) {
        websocket.sendMessage({
          key: "telemetryInfo",
          value: telemetry.values,
        });
        this.telemetryCooldown = now;
      }
    });
  }
}
