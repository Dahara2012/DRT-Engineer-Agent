// Import the Iracing and Websocket classes from their respective files
import Helper from "./classes/helper.js";
import Iracing from "./classes/iracing.js";
import Websocket from "./classes/websocket.js";

// Create instances of Iracing and Websocket classes
export const helper = new Helper();
export const iracing = new Iracing();
export const websocket = new Websocket();
