import { irsdk, connection } from '../app.js';

export default class Iracing {
	constructor() {
		this._teamId = 0;
		this._driverId = 0;
		this._connect();
	}

	get driverId() {
		return this._driverId;
	}

	get teamId() {
		return this._teamId;
	}

	set driverId(number) {
		if (this._driverId !== number) {
			this._driverId = number;
			connection.connect();
		}
	}

	set teamId(number) {
		if (this._teamId !== number) {
			this._teamId = number;
		}
	}

	_connect() {
		this._iracing = irsdk.getInstance();

		try {
			irsdk.init({
				telemetryUpdateInterval: 2000,
				sessionInfoUpdateInterval: 10000
			})
		} catch (error) {
			console.error('Failed to initialize iRacing SDK:', error);
		}

		this._iracing.on('Connected', function () {
			console.log('Connected to iRacing.');
		});

		this._iracing.on('error', function (error) {
			console.error('Error occurred:', error);
		});

		this._iracing.on('Disconnected', function () {
			console.log('iRacing shut down.')
		})

		this._iracing.on('SessionInfo', (sessionInfo) => {
			this.teamId = sessionInfo.data.DriverInfo.Drivers[sessionInfo.data.DriverInfo.DriverCarIdx].TeamID;
			this.driverId = sessionInfo.data.DriverInfo.Drivers[sessionInfo.data.DriverInfo.DriverCarIdx].UserID;
			connection.sendMessage({key: "SessionInfo", value: sessionInfo});
		});


		this._iracing.on('Telemetry', (telemetry) => {
			connection.sendMessage({key: "Telemetry", value: telemetry});
		})
	}

}
