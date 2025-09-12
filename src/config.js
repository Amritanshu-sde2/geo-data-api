module.exports = {
  // Input paths - Updated to use db folder
  INPUT_DIR: "./db",
  OUTPUT_DIR: "./dist/api/v1",

  // File settings
  PRETTY_JSON: false, // Changed to false for performance - can be overridden with --pretty flag
  OPTIMIZE_JSON: true, // Enable advanced JSON optimizations (remove null/empty values, optimize coordinates)
  COORDINATE_PRECISION: 8, // Decimal places for latitude/longitude

  // JSON serialization thresholds
  PRETTY_JSON_THRESHOLD: 100, // Files smaller than this (in records) will be pretty-printed

  // API version
  API_VERSION: "v1",

  // CDN settings (for reference)
  CDN_BASE_URL: "https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1",

  // Suppress detailed per-file logs (pagination and other verbose file writes).
  // When true, FileUtils.writeJSON will skip routine generated file logs unless forceLog is set.
  SUPPRESS_DETAILED_LOGS: true,

  // Updated search fields to include new data
  SEARCH_FIELDS: {
    countries: [
      "name",
      "iso2",
      "iso3",
      "native",
      "capital",
      "currency",
      "region",
      "subregion",
    ],
    states: [
      "name",
      "iso2",
      "country_name",
      "country_code",
      "type",
      "timezone",
    ],
    cities: [
      "name",
      "state_name",
      "country_name",
      "state_code",
      "country_code",
      "wikiDataId",
    ],
  },

  // Country fields to include in different endpoints
  COUNTRY_FIELDS: {
    list: [
      "id",
      "name",
      "iso2",
      // "iso3",
      // "numeric_code",
      "phonecode",
      // "capital",
      // "currency",
      // "currency_name",
      // "currency_symbol",
      // "region",
      // "subregion",
      // "emoji",
      // "latitude",
      // "longitude",
    ],
    detail: "all", // Include all fields for individual country endpoints
  },

  // State fields configuration
  STATE_FIELDS: {
    list: [
      "id",
      "name",
      // "country_id",
      // "country_code",
      // "country_name",
      "iso2",
      "iso3166_2", // Uncommented to include ISO 3166-2 codes in state lists
      // "type",
      // "latitude",
      // "longitude",
      // "timezone",
    ],
    detail: "all", // Include all fields for individual state endpoints
  },

  // City fields configuration
  CITY_FIELDS: {
    list: [
      "id",
      "name",
      "iso2",
      // "state_id",
      // "state_code",
      // "state_name",
      // "country_id",
      // "country_code",
      // "country_name",
      "latitude",
      "longitude",
      "wikiDataId",
    ],
    detail: "all", // Include all fields for individual city endpoints
  },

  // Generation options for improved performance and configurability
  GENERATION_OPTIONS: {
    // Batch size for processing large datasets
    batchSize: 100,
    // Maximum concurrent file operations
    maxConcurrentFiles: 5,
    // Enable progress logging during generation
    enableProgressLogging: false,
    // Error handling mode: 'strict', 'warn', 'ignore'
    errorHandlingMode: "warn",
    // Memory optimization: clear caches after each generator
    enableMemoryOptimization: true,
    // Validation strictness: 'strict', 'warn', 'skip'
    validationMode: "warn",
  },
};
