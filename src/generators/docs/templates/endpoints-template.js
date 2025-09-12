const config = require("../../../config");

class EndpointsTemplate {
  constructor(countries, states, cities, dataAnalysis) {
    this.countries = countries;
    this.states = states;
    this.cities = cities;
    this.dataAnalysis = dataAnalysis;
  }

  generate() {
    return `# API Endpoints Reference

## Countries

### GET /countries.json

Get list of all countries with essential information.

**Response Fields**: ${config.COUNTRY_FIELDS ? (config.COUNTRY_FIELDS.list ? config.COUNTRY_FIELDS.list.join(", ") : "id, name, iso2, iso3, capital, currency, region, subregion") : "id, name, iso2, iso3, capital, currency, region, subregion"}

**Example**: \`${config.CDN_BASE_URL}/countries.json\`

### GET /countries/{iso2}.json

Get detailed information for a specific country by ISO2 code.

**Parameters**:

- \`iso2\`: Country ISO2 code (2-letter uppercase)

**Response Fields**: All available fields including timezones, translations, and geographic data

**Example**: \`${config.CDN_BASE_URL}/countries/us.json\`

### GET /countries/region/{region}.json

Get countries by region (e.g., Asia, Europe, Africa).

**Parameters**:

- \`region\`: Region name (lowercase, hyphenated)

**Example**: \`${config.CDN_BASE_URL}/countries/region/asia.json\`

**Available Regions**:

${[...new Set(this.countries.map((c) => c.region))]
  .filter(Boolean)
  .map((region) => `- ${region}`)
  .join("\n")}

### GET /countries/subregion/{subregion}.json

Get countries by subregion.

**Parameters**:

- \`subregion\`: Subregion name (lowercase, hyphenated)

---

## States

### GET /states/all.json

Get all states (full list, not paginated in this release).

**Note**: States are provided as a full list (no pagination)

**Example**: \`${config.CDN_BASE_URL}/states/all.json\`

### GET /states/country/{country_iso2}.json

Get states for a specific country with administrative details.

**Parameters**:

- \`country_iso2\`: Country ISO2 code (2-letter uppercase)

**Features**:
- Administrative type
- Timezone
- Geographic coordinates
- ISO codes

**Example**: \`${config.CDN_BASE_URL}/states/country/af.json\`

### GET /states/type/{type}.json

Get states by administrative type (province, state, region, etc.).

**Parameters**:

- \`type\`: Administrative type (lowercase, hyphenated)

**Example**: \`${config.CDN_BASE_URL}/states/type/province.json\`

**Available Types**:

${this.dataAnalysis.states.types.map((type) => `- ${type}`).join("\n")}

### GET /states/{iso3166_2}.json

Get detailed information for a specific state by ISO 3166-2 code.

**Parameters**:

- \`iso3166_2\`: State ISO 3166-2 code (format: {country_iso2}-{state_code})

**Response Fields**: All available fields including geographic coordinates and timezone

**Example**: \`${config.CDN_BASE_URL}/states/af-bds.json\` (Badakhshan, Afghanistan)

### GET /states/timezone/{timezone}.json

Get states by timezone.

**Parameters**:

- \`timezone\`: Timezone name (URL encoded)

**Example**: \`${config.CDN_BASE_URL}/states/timezone/Asia-Kabul.json\`

### GET /states/timezones.json

Get index of all state timezones with counts.

**Example**: \`${config.CDN_BASE_URL}/states/timezones.json\`

---

## Cities

### GET /cities/country/{country_iso2}.json

Get cities for a specific country.

**Parameters**:

- \`country_iso2\`: Country ISO2 code (2-letter uppercase)

**Example**: \`${config.CDN_BASE_URL}/cities/country/af.json\`

### GET /cities/state/{state_iso3166_2}.json

Get cities for a specific state.

**Parameters**:

- \`state_iso3166_2\`: State ISO 3166-2 code (format: {country_iso2}-{state_code})

**Example**: \`${config.CDN_BASE_URL}/cities/state/af-bds.json\`



### GET /cities/batches.json

Get batch index for efficient individual city lookups.

**Note**: Contains metadata about all city batch files with start/end ID ranges. This is the recommended way to find the correct batch file for any city ID.

**Example**: \`${config.CDN_BASE_URL}/cities/batches.json\`

**Response Structure**:
\`\`\`json
{
  "data": [
    {
      "filename": "cities/batch/batch-57900-58006.json",
      "start_id": 57900,
      "end_id": 58006,
      "count": 107
    },
    {
      "filename": "cities/batch/batch-58007-58116.json",
      "start_id": 58007,
      "end_id": 58116,
      "count": 110
    }
  ],
  "meta": {
    "type": "batch_index",
    "total_batches": 1512,
    "cities_per_batch": 100,
    "total_cities": 151165,
    "usage": "Use start_id/end_id to find which batch contains a specific city ID"
  }
}
\`\`\`

### GET /cities/batch/{filename}

Get a batch of cities for efficient individual city access.

**Parameters**:

- \`filename\`: Batch filename from the batch index (e.g., "cities/batch/batch-57900-58006.json")

**Note**: Cities are accessible by ID as object keys in the \`data\` field. Use the batch index to find the correct filename for any city ID.

**Example**: \`${config.CDN_BASE_URL}/cities/batch/batch-57900-58006.json\`

**Response Structure**:
\`\`\`json
{
  "data": {
    "57995": {
      "id": 57995,
      "name": "Bhopal",
      "state_id": 4030,
      "state_name": "Madhya Pradesh",
      "country_id": 101,
      "country_name": "India",
      "latitude": "23.25469000",
      "longitude": "77.40289000",
      "timezone": "Asia/Kolkata"
    }
  },
  "meta": {
    "type": "cities_batch",
    "batch_range": "57900-58006",
    "cities_count": 107,
    "usage": "Access city by ID: data[city_id]"
  }
}
\`\`\`

### GET /cities/timezone/{timezone}.json

Get cities by timezone.

**Parameters**:

- \`timezone\`: Timezone name (URL encoded)

**Example**: \`${config.CDN_BASE_URL}/cities/timezone/Asia-Kabul.json\`

### GET /cities/{id}.json

Get detailed information for a specific city.

**Parameters**:

- \`id\`: City ID (integer)

**Note**: Individual city files generated for sample cities only

**Example**: \`${config.CDN_BASE_URL}/cities/52.json\`

---

## Search

### GET /search/countries.json

Searchable countries index for client-side filtering.

**Searchable Fields**: ${config.SEARCH_FIELDS.countries.join(", ")}

**Usage**: Download once and filter client-side using any searchable field

**Example**: \`${config.CDN_BASE_URL}/search/countries.json\`

### GET /search/states.json

Searchable states index for client-side filtering.

**Searchable Fields**: ${config.SEARCH_FIELDS.states.join(", ")}

**Example**: \`${config.CDN_BASE_URL}/search/states.json\`

### GET /search/cities.json

Searchable cities index for client-side filtering.

**Searchable Fields**: ${config.SEARCH_FIELDS.cities.join(", ")}

**Warning**: Large file - consider client-side filtering in your application

**Example**: \`${config.CDN_BASE_URL}/search/cities.json\`

### GET /search/combined.json

Combined search index across all entity types (limited dataset).

**Limitations**: Limited to prevent large file sizes

**Example**: \`${config.CDN_BASE_URL}/search/combined.json\`

---

## Rate Limits

- **No rate limits** - API is cached by CDN
- **Recommendation**: Implement client-side caching for better performance

## Error Responses

All endpoints return appropriate HTTP status codes:

- \`200\`: Success
- \`404\`: Resource not found
- \`500\`: Server error (rare for static files)
`;
  }
}

module.exports = EndpointsTemplate;
