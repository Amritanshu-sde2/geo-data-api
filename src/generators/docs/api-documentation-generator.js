const FileUtils = require("../../utils/file-utils");
const config = require("../../config");

class APIDocumentationGenerator {
  constructor(countries, states, cities, dataAnalysis) {
    this.countries = countries;
    this.states = states;
    this.cities = cities;
    this.dataAnalysis = dataAnalysis;
  }

  async generate() {
    const documentation = {
      title: "Geo-Data API Documentation",
      version: config.API_VERSION,
      generated_at: new Date().toISOString(),
      base_url: config.CDN_BASE_URL,

      overview: {
        description:
          "Static JSON API for countries, states, and cities data with enhanced geographic and administrative information",
        features: [
          `${this.countries.length}+ countries with detailed information`,
          `${this.states.length}+ states/provinces/regions with administrative details`,
          `${this.cities.length}+ cities with geographic coordinates`,
          "Multi-language support for countries",
          "Timezone information for states and cities",
          "Currency details with symbols",
          "Geographic coordinates for precise location",
          "Regional and administrative groupings",
          "WikiData integration for cities",
          "Administrative type classification for states",
          "ISO codes and FIPS codes support",
        ],
      },

      authentication: {
        type: "None",
        description: "This is a public API with no authentication required",
      },

      rate_limits: {
        description: "No rate limits - cached by CDN",
        recommendation: "Implement client-side caching for better performance",
      },

      data_quality: {
        coordinates: `${((this.states.filter((s) => s.latitude && s.longitude).length / this.states.length) * 100).toFixed(1)}% of states and ${((this.cities.filter((c) => c.latitude && c.longitude).length / this.cities.length) * 100).toFixed(1)}% of cities have coordinates`,
        wikidata: `${((this.cities.filter((c) => c.wikiDataId).length / this.cities.length) * 100).toFixed(1)}% of cities have WikiData references`,
        timezones: `${[...new Set(this.states.map((s) => s.timezone))].filter(Boolean).length} unique state timezones available`,
      },

      endpoints: this._generateEndpointsDocumentation(),
      response_format: this._generateResponseFormatDocumentation(),
      client_examples: this._generateClientExamples(),
      best_practices: this._generateBestPractices(),
    };

    await FileUtils.writeJSON("documentation.json", documentation);
  }

  _generateEndpointsDocumentation() {
    return {
      countries: {
        "GET /countries.json": {
          description: "Get list of all countries with essential information",
          response_fields: config.COUNTRY_FIELDS.list,
          example: `${config.CDN_BASE_URL}/countries.json`,
        },
        "GET /countries/{id}.json": {
          description:
            "Get detailed information for a specific country including timezones and translations",
          parameters: { id: "Country ID (integer)" },
          response_fields:
            "All available fields including timezones, translations, and geographic data",
          example: `${config.CDN_BASE_URL}/countries/1.json`,
        },
        "GET /countries/region/{region}.json": {
          description: "Get countries by region (e.g., Asia, Europe, Africa)",
          parameters: { region: "Region name (lowercase, hyphenated)" },
          example: `${config.CDN_BASE_URL}/countries/region/asia.json`,
        },
        "GET /countries/regions.json": {
          description: "Get index of all available regions with country counts",
          example: `${config.CDN_BASE_URL}/countries/regions.json`,
        },
      },

      states: {
        "GET /states/all.json": {
          description: "Get all states (full list, not paginated)",
          note: "States are provided as a full list (no pagination)",
          example: `${config.CDN_BASE_URL}/states/all.json`,
        },
        "GET /states/country/{country_iso2}.json": {
          description:
            "Get states for a specific country with administrative details",
          parameters: {
            country_iso2: "Country ISO2 code (2-letter uppercase)",
          },
          features: [
            "Administrative type",
            "Timezone",
            "Geographic coordinates",
            "ISO codes",
          ],
          example: `${config.CDN_BASE_URL}/states/country/us.json`,
        },
        "GET /states/type/{type}.json": {
          description:
            "Get states by administrative type (province, state, region, etc.)",
          parameters: { type: "Administrative type (lowercase, hyphenated)" },
          example: `${config.CDN_BASE_URL}/states/type/province.json`,
        },
        "GET /states/timezone/{timezone}.json": {
          description: "Get states by timezone",
          parameters: { timezone: "Timezone name (URL encoded)" },
          example: `${config.CDN_BASE_URL}/states/timezone/Asia-Kabul.json`,
        },
        "GET /states/{id}.json": {
          description: "Get detailed information for a specific state",
          parameters: { id: "State ID (integer)" },
          example: `${config.CDN_BASE_URL}/states/3901.json`,
        },
        "GET /states/types.json": {
          description: "Get index of all state types with counts",
          example: `${config.CDN_BASE_URL}/states/types.json`,
        },
      },

      cities: {
        "GET /cities/major.json": {
          description: "Get major cities (curated list with WikiData priority)",
          note: "Up to 50 cities per country, prioritizing cities with WikiData",
          example: `${config.CDN_BASE_URL}/cities/major.json`,
        },
        "GET /cities/country/{country_iso2}.json": {
          description:
            "Get cities for a specific country (full list, not paginated)",
          parameters: {
            country_iso2: "Country ISO2 code (2-letter uppercase)",
          },
          note: "Cities are provided as a full list (no pagination)",
          example: `${config.CDN_BASE_URL}/cities/country/us.json`,
        },
        "GET /cities/state/{state_iso3166_2}.json": {
          description: "Get cities for a specific state",
          parameters: {
            state_iso3166_2:
              "State ISO 3166-2 code (format: {country_iso2}-{state_code})",
          },
          example: `${config.CDN_BASE_URL}/cities/state/us-ca.json`,
        },
        "GET /cities/batches.json": {
          description: "Get batch index for efficient single city access",
          note: "Contains 1512+ batch files with ID ranges for optimal city lookup",
          response_fields: ["filename", "start_id", "end_id", "count"],
          example: `${config.CDN_BASE_URL}/cities/batches.json`,
        },
        "GET /cities/batch/{filename}.json": {
          description: "Get a specific batch of cities (100 cities per batch)",
          parameters: {
            filename: "Batch filename (e.g., batch-57900-58006.json)",
          },
          note: "Cities are stored as objects keyed by ID within the batch data",
          example: `${config.CDN_BASE_URL}/cities/batch/batch-57900-58006.json`,
        },
        "GET /cities/{id}.json": {
          description: "Get detailed information for a specific city",
          parameters: { id: "City ID (integer)" },
          note: "Individual city files generated for sample cities only. For full access, use batch system",
          example: `${config.CDN_BASE_URL}/cities/52.json`,
        },
      },

      search: {
        "GET /search/countries.json": {
          description: "Searchable countries index for client-side filtering",
          searchable_fields: config.SEARCH_FIELDS.countries,
          usage:
            "Download once and filter client-side using any searchable field",
          example: `${config.CDN_BASE_URL}/search/countries.json`,
        },
        "GET /search/states.json": {
          description: "Searchable states index for client-side filtering",
          searchable_fields: config.SEARCH_FIELDS.states,
          example: `${config.CDN_BASE_URL}/search/states.json`,
        },
        "GET /search/cities.json": {
          description: "Searchable cities index for client-side filtering",
          searchable_fields: config.SEARCH_FIELDS.cities,
          warning: "Large file - consider pagination in your application",
          example: `${config.CDN_BASE_URL}/search/cities.json`,
        },
        "GET /search/combined.json": {
          description:
            "Combined search index across all entity types (limited dataset)",
          limitations: "Limited to prevent large file sizes",
          example: `${config.CDN_BASE_URL}/search/combined.json`,
        },
      },
    };
  }

  _generateResponseFormatDocumentation() {
    return {
      structure: {
        data: "Array or Object containing the requested data",
        meta: {
          type: "Type of data (countries, states, cities, etc.)",
          count: "Number of items in data array (for arrays)",
          generated_at: "ISO timestamp of when the data was generated",
          api_version: "API version",
          "...additional_meta": "Context-specific metadata",
        },
      },
      example: {
        data: [
          {
            id: 3901,
            name: "Badakhshan",
            country_id: 1,
            country_code: "AF",
            country_name: "Afghanistan",
            iso2: "BDS",
            type: "province",
            latitude: "36.80402540",
            longitude: "71.36765800",
            timezone: "Asia/Kabul",
          },
        ],
        meta: {
          type: "states",
          count: 1,
          country_id: 1,
          country_name: "Afghanistan",
          generated_at: "2024-01-01T00:00:00.000Z",
          api_version: "v1",
        },
      },
    };
  }

  _generateClientExamples() {
    return {
      javascript: {
        basic_fetch: `
// Get all countries
const response = await fetch('${config.CDN_BASE_URL}/countries.json');
const data = await response.json();
console.log(data.data); // Array of countries
        `,
        get_states_by_country: `
// Get states for USA (country_iso2: us)
const response = await fetch('${config.CDN_BASE_URL}/states/country/us.json');
const data = await response.json();
console.log(data.data); // Array of US states
        `,
        get_single_city_batch_system: `
// Get single city using batch system (recommended approach)
async function getCityById(cityId) {
  // Step 1: Get batch index to find correct batch
  const indexResponse = await fetch('${config.CDN_BASE_URL}/cities/batches.json');
  const batchIndex = await indexResponse.json();

  // Step 2: Find which batch contains the city
  const batch = batchIndex.data.find(b =>
    cityId >= b.start_id && cityId <= b.end_id
  );

  if (!batch) {
    throw new Error(\`City with ID \${cityId} not found\`);
  }

  // Step 3: Fetch the specific batch
  const batchResponse = await fetch(\`${config.CDN_BASE_URL}/cities/batch/\${batch.filename}\`);
  const batchData = await batchResponse.json();

  // Step 4: Extract city data from batch
  return batchData.data[cityId];
}

// Example: Get Bhopal (ID: 57995)
const bhopal = await getCityById(57995);
console.log('Bhopal:', bhopal);
        `,
        search_example: `
// Client-side search for provinces
const searchData = await fetch('${config.CDN_BASE_URL}/search/states.json');
const states = await searchData.json();
const provinces = states.data.filter(state =>
  state.type === 'province' &&
  state.name.toLowerCase().includes('badakh')
);
        `,
      },
    };
  }

  _generateBestPractices() {
    return {
      caching:
        "Implement client-side caching as data doesn't change frequently",
      search:
        "Use search endpoints for client-side filtering instead of downloading all data",
      coordinates:
        "Check for latitude/longitude availability before using location features",
      wikidata:
        "Use WikiData IDs to fetch additional information from Wikipedia/Wikidata APIs",
      cities_batch_system:
        "For single city access, use the batch system (/cities/batches.json + /cities/batch/) instead of individual city files for better performance and reliability",
    };
  }
}

module.exports = APIDocumentationGenerator;
