export default class Helper {
  constructor() {}

  /**
   * Get the current time as a formatted string.
   * @returns {string} The current time in HH:MM:SS format.
   */
  getCurrentTimeString() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
}
