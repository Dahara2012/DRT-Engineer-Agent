import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = join(__dirname, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

// Generate a version number based on the current date and time (e.g., 2023.07.04.1234)
const now = new Date();
const year = String(now.getFullYear()).slice(-2);
const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based in JavaScript
const day = String(now.getDate()).padStart(2, "0");
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");

const newVersion = `${year}.${month}.${day}.${hours}${minutes}`;

packageJson.version = newVersion;

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");

console.log(`${helper.getCurrentTimeString()}: Version updated to ${newVersion}`);
