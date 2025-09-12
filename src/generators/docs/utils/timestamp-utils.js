class TimestampUtils {
  /**
   * Generate a formatted timestamp for documentation
   * @returns {string} ISO timestamp
   */
  static generateTimestamp() {
    const now = new Date();
    return now.toISOString();
  }

  /**
   * Generate a human-readable timestamp for documentation
   * @returns {string} Human-readable timestamp
   */
  static generateHumanTimestamp() {
    const now = new Date();
    return now.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  }

  /**
   * Generate a formatted date for documentation headers
   * @returns {string} Formatted date
   */
  static generateDateOnly() {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Generate a timestamp with custom format
   * @param {string} format - Format type: 'iso', 'human', 'date', 'short'
   * @returns {string} Formatted timestamp
   */
  static generate(format = "human") {
    switch (format) {
      case "iso":
        return this.generateTimestamp();
      case "human":
        return this.generateHumanTimestamp();
      case "date":
        return this.generateDateOnly();
      case "short":
        return new Date().toLocaleString();
      default:
        return this.generateHumanTimestamp();
    }
  }
}

module.exports = TimestampUtils;
