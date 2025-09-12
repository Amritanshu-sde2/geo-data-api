const fs = require("fs-extra");
const path = require("path");
const config = require("../config");

class FileUtils {
  static async ensureDir(dirPath) {
    await fs.ensureDir(dirPath);
  }

  static async writeJSON(filePath, data, options = {}) {
    const fullPath = path.join(config.OUTPUT_DIR, filePath);
    await this.ensureDir(path.dirname(fullPath));

    // Determine if we should use pretty formatting
    const shouldPrettyPrint = this.shouldPrettyPrint(data, options);

    let jsonData;
    if (shouldPrettyPrint) {
      jsonData = JSON.stringify(data, null, 2);
    } else {
      // Apply minification optimizations
      jsonData = this.minifyJSON(data, options);
    }

    await fs.writeFile(fullPath, jsonData, "utf8");

    // Only log important files or if explicitly requested.
    const suppressionEnabled = !!config.SUPPRESS_DETAILED_LOGS;
    const isImportant = this.isImportantFile(filePath);

    if (suppressionEnabled) {
      // When suppression is enabled, only log files considered important by patterns.
      if (isImportant) {
        console.log(
          `✓ Generated: ${filePath}${shouldPrettyPrint ? "" : " (minified)"}`
        );
      }
    } else {
      // When suppression is disabled, log important files or explicit forceLog.
      if (options.forceLog || isImportant) {
        console.log(
          `✓ Generated: ${filePath}${shouldPrettyPrint ? "" : " (minified)"}`
        );
      }
    }
  }

  static shouldPrettyPrint(data, options = {}) {
    // If explicitly requested to pretty print
    if (options.pretty === true) return true;
    if (options.pretty === false) return false;

    // Check command line flag
    if (process.argv.includes("--pretty")) return true;

    // Use global config if available
    if (config.PRETTY_JSON === true) return true;
    if (config.PRETTY_JSON === false) {
      // Only pretty print if explicitly enabled - ignore threshold for minification
      return false;
    }

    // Default fallback - use threshold only when PRETTY_JSON is undefined
    const dataSize = Array.isArray(data?.data)
      ? data.data.length
      : Array.isArray(data)
        ? data.length
        : 1;

    return dataSize <= config.PRETTY_JSON_THRESHOLD;
  }

  static minifyJSON(data, options = {}) {
    // Custom JSON stringifier with optimizations
    const shouldOptimize = config.OPTIMIZE_JSON || options.optimize;
    const optimizedData = shouldOptimize
      ? this.optimizeDataForMinification(data, options)
      : data;

    // Use minimal spacing
    let jsonString = JSON.stringify(optimizedData, (key, value) => {
      // Round coordinates to configured decimal places to reduce precision
      if (
        (key === "latitude" || key === "longitude") &&
        typeof value === "string"
      ) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          const precision = config.COORDINATE_PRECISION || 8;
          const multiplier = Math.pow(10, precision);
          return Math.round(num * multiplier) / multiplier;
        }
      }
      return value;
    });

    return jsonString;
  }

  static optimizeDataForMinification(data, options = {}) {
    if (!options.optimize) return data;

    // Deep clone to avoid modifying original data
    const cloned = JSON.parse(JSON.stringify(data));

    // Recursively optimize the data structure
    return this.optimizeObject(cloned);
  }

  static optimizeObject(obj) {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.optimizeObject(item));
    } else if (obj && typeof obj === "object") {
      const optimized = {};
      for (const [key, value] of Object.entries(obj)) {
        // Remove null values and empty strings to save space
        if (value !== null && value !== "") {
          optimized[key] = this.optimizeObject(value);
        }
      }
      return optimized;
    }
    return obj;
  }

  static isImportantFile(filePath) {
    // Define patterns for files that should NOT be logged (pagination files)
    const suppressPatterns = [
      /^cities\/country\/.*-page-\d+\.json$/, // Cities by country pagination
      /^cities\/state\/.*-page-\d+\.json$/, // Cities by state pagination
      /^cities\/.*-page-\d+\.json$/, // Other cities pagination files
      /^states\/.*-page-\d+\.json$/, // States pagination files
      /^countries\/.*-page-\d+\.json$/, // Countries pagination files
    ];

    // If it matches a suppress pattern, don't log it
    if (suppressPatterns.some((pattern) => pattern.test(filePath))) {
      return false;
    }

    // Define patterns for important files that should always be logged
    const importantPatterns = [
      /^countries\.json$/,
      /^countries\/regions\.json$/,
      /^states\/all\.json$/,
      /^states\/types\.json$/,
      /^states\/timezones\.json$/,
      /^cities\/major\.json$/,
      /^cities\/wikidata\.json$/,
      /^search\//,
      /^api-info\.json$/,
      /^documentation\.json$/,
      // Individual files are not logged by default when suppression is enabled
    ];

    return importantPatterns.some((pattern) => pattern.test(filePath));
  }

  static async writeFile(filePath, content) {
    // For markdown files, we want to write to project root
    // Get the project root by going up from the current file location
    const projectRoot = path.resolve(__dirname, "../../");
    const fullPath = path.join(projectRoot, filePath);
    await this.ensureDir(path.dirname(fullPath));

    await fs.writeFile(fullPath, content, "utf8");
    console.log(`✓ Generated: ${path.basename(filePath)}`);
  }

  static async readJSON(filePath) {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  }

  static async cleanOutput() {
    // Remove the entire dist folder (project root /dist) instead of only the API output dir
    const projectRoot = path.resolve(__dirname, "../../");
    const distDir = path.join(projectRoot, "dist");
    await fs.remove(distDir);
    console.log("✓ Cleaned dist folder");
  }

  static createPaginatedData(data, pageSize, baseName) {
    const pages = [];
    const totalPages = Math.ceil(data.length / pageSize);

    for (let i = 0; i < totalPages; i++) {
      const start = i * pageSize;
      const end = start + pageSize;
      const pageData = data.slice(start, end);

      const pagination = {
        page: i + 1,
        total_pages: totalPages,
        total_records: data.length,
        has_next: i + 1 < totalPages,
        has_previous: i > 0,
        next_page: i + 1 < totalPages ? `${baseName}-page-${i + 2}.json` : null,
        previous_page: i > 0 ? `${baseName}-page-${i}.json` : null,
      };

      pages.push({
        filename: `${baseName}-page-${i + 1}.json`,
        data: {
          data: pageData,
          pagination,
          meta: {
            generated_at: new Date().toISOString(),
            api_version: config.API_VERSION,
          },
        },
      });
    }

    return pages;
  }

  static async copyFile(sourcePath, destPath) {
    // Ensure the source file exists
    if (!(await fs.pathExists(sourcePath))) {
      console.warn(`⚠ Source file not found: ${sourcePath}`);
      return;
    }

    // Create destination directory if it doesn't exist
    await this.ensureDir(path.dirname(destPath));

    // Copy the file
    await fs.copy(sourcePath, destPath);
    console.log(`✓ Copied: ${path.basename(sourcePath)} -> ${destPath}`);
  }
}

module.exports = FileUtils;
