import { WebSocket, iracing } from "../app.js";

export default class Connection {
	constructor() {
		this._connected = false;
		this._isReconnecting = false;
		this._shouldReconnect = true;
	}

	get connected(){
		return this._connected;
	}

	get isReconnecting(){
		return this._isReconnecting;
	}

	get shouldReconnect(){
		return this._shouldReconnect;
	}

	set connected(bool){
		this._connected = bool;
	}

	set isReconnecting(bool){
		this._isReconnecting = bool;
	}

	set shouldReconnect(bool){
		this._shouldReconnect = bool;
	}

	sendMessage({key = 'key', value = 'value'} = {}) {
		const message = {key: key, value: value, driverid: iracing.driverId, teamId: iracing.teamId};
		this.ws.send(this._stringifyJSON(message));
	}

	connect() {
		if(this.connected){ return; }
		this.ws = new WebSocket('ws://127.0.0.1:13001');

		this.ws.onopen = () => {
			this.connected = true;
			this.sendMessage({key: "agentInit", value:""})
			console.log('WebSocket connected');
		}

		this.ws.onclose = (e) => {
			this.connected = false;
			console.log('WebSocket was closed. ' + e);
			if (this.shouldReconnect) {
				this._reconnect();
			}
		}

		this.ws.onerror = (error) => {
			this.connected = false;
			console.error('WebSocket encountered error: ' + error.message);
			if (this.shouldReconnect) {
				this._reconnect();
			}
		}

		this.ws.onmessage = (e) => {
			this.connected = true;
			const message = this._parseJSON(e.data.toString());

			if (message.key == "Code"){
				console.log(`Your Code is: ${message.value}`);
			}

			/* if (message.key == "driverinfo") { //Config driverinfo empfangen
				//global.driverinfo = message.value;
			} else if (message.key == "settings") { //Config settings empfangen
				if (this._compareVersions(status.version, message.value.overlayversion) < 0) {
					menu.send({ key: "oldversion", value: message.value.overlayversion });
					this.shouldReconnect = false;
					this.ws.close();
				}
			} else if (message.key == "userinfo") { //Config userinfo empfangen
				status.userinfo = message.value;
			} else if (message.key == "DisplayUpdate") {
				flag.send(message);
			} else if (message.key == "DisplaySync") {
				flag.send(message);
			} else if (message.key == "DriverSync") {
				drivers.update(message.value);
			} else if (message.key == "ServePenalty") {
				if (message.value.key == status.iracingId) {
					timepenalty.tp = message.value.value;
				}
			} else if (message.key == "FCYMeters") {
				if (message.value.userID == status.iracingId) {
					flag.send(message);
				}
			} */
		}
	}

	_reconnect() {
		if (this.isReconnecting) {
			return;
		}

		this.isReconnecting = true;

		let minDelay = 15000; // 15 seconds
		let maxDelay = 30000; // 30 seconds
		let delay = Math.random() * (maxDelay - minDelay) + minDelay;

		setTimeout(() => {
			this.connect();
			this.isReconnecting = false;
		}, delay);
	}

	_parseJSON(string) {
		return JSON.parse(string);
	}

	_stringifyJSON(object) {
		return JSON.stringify(object)
	}

	_compareVersions(version1, version2) {
		const v1Parts = version1.split('.').map(Number);
		const v2Parts = version2.split('.').map(Number);

		for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
			const v1 = v1Parts[i] || 0;
			const v2 = v2Parts[i] || 0;

			if (v1 > v2) return 1;
			if (v1 < v2) return -1;
		}

		return 0;
	}
}