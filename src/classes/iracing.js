import { irsdk, connection } from "../app.js";

export default class Iracing {
  constructor() {
    this._teamId = 0;
    this._driverId = 0;
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

  set sessionCooldown(time) {
    this._sessionCooldown = time;
  }

  set telemetryCooldown(time) {
    this._telemetryCooldown = time;
  }

  set driverId(driverid) {
    const number = Number(driverid);
    if (!isNaN(number)) {
      if (this._driverId !== number) {
        this._driverId = number;
        connection.connect();
      }
    }
  }

  set teamId(teamid) {
    const number = Number(teamid);
    if (!isNaN(number)) {
      if (this._teamId !== number) {
        this._teamId = number;
      }
    }
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
      console.log("Connected to iRacing.");
    });

    this._iracing.on("error", function (error) {
      console.error("Error occurred:", error);
    });

    this._iracing.on("Disconnected", function () {
      console.log("iRacing shut down.");
    });

    this._iracing.on("SessionInfo", (sessionInfo) => {
      this.teamId =
        sessionInfo.data.DriverInfo.Drivers[
          sessionInfo.data.DriverInfo.DriverCarIdx
        ].TeamID;
      this.driverId =
        sessionInfo.data.DriverInfo.Drivers[
          sessionInfo.data.DriverInfo.DriverCarIdx
        ].UserID;
      const now = Date.now();
      if (this.sessionCooldown < now - 2000) {
        connection.sendMessage({ key: "SessionInfo", value: sessionInfo });
        this.sessionCooldown = now;
      }
    });

    this._iracing.on("Telemetry", (telemetry) => {
      const now = Date.now();
      if (this.telemetryCooldown < now - 1000) {
        connection.sendMessage({ key: "Telemetry", value: telemetry });
        this.telemetryCooldown = now;
      }
    });
  }
}
