// Import the WebSocket module for real-time communication
import WebSocket from "ws";

// Import the createRequire function to enable the use of CommonJS modules in an ES module environment
import { createRequire } from "module";

// Create a require function using the current module's URL
const require = createRequire(import.meta.url);

// Require the node-irsdk-2023 package using the created require function
const irsdk = require("node-irsdk-2023");

// Export irsdk and WebSocket so they can be used in other modules
export { irsdk, WebSocket };

// Import the Iracing and Connection classes from their respective files
import Iracing from "./classes/iracing.js";
import Connection from "./classes/connection.js";

// Create instances of Iracing and Connection classes
export const iracing = new Iracing();
export const connection = new Connection();
