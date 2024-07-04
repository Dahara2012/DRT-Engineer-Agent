import WebSocket from 'ws';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const irsdk = require('node-irsdk-2023');

export {
	irsdk,
	WebSocket
};

import Iracing from './classes/iracing.js';
import Connection from './classes/connection.js';



export const iracing = new Iracing();
export const connection = new Connection();

connection.connect();