# API Endpoints Reference

## Countries

### GET /countries.json

Get list of all countries with essential information.

**Response Fields**: id, name, iso2, phonecode

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/countries.json`

### GET /countries/{iso2}.json

Get detailed information for a specific country by ISO2 code.

**Parameters**:

- `iso2`: Country ISO2 code (2-letter uppercase)

**Response Fields**: All available fields including timezones, translations, and geographic data

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/countries/us.json`

### GET /countries/region/{region}.json

Get countries by region (e.g., Asia, Europe, Africa).

**Parameters**:

- `region`: Region name (lowercase, hyphenated)

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/countries/region/asia.json`

**Available Regions**:

- Asia
- Europe
- Africa
- Oceania
- Americas
- Polar

### GET /countries/subregion/{subregion}.json

Get countries by subregion.

**Parameters**:

- `subregion`: Subregion name (lowercase, hyphenated)

---

## States

### GET /states/all.json

Get all states (full list, not paginated in this release).

**Note**: States are provided as a full list (no pagination)

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/states/all.json`

### GET /states/country/{country_iso2}.json

Get states for a specific country with administrative details.

**Parameters**:

- `country_iso2`: Country ISO2 code (2-letter uppercase)

**Features**:
- Administrative type
- Timezone
- Geographic coordinates
- ISO codes

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/states/country/af.json`

### GET /states/type/{type}.json

Get states by administrative type (province, state, region, etc.).

**Parameters**:

- `type`: Administrative type (lowercase, hyphenated)

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/states/type/province.json`

**Available Types**:

- province
- municipality
- district
- county
- atoll
- parish
- dependency
- city
- region
- capital city
- territory
- state
- autonomous republic
- governorate
- division
- oblast
- department
- special municipality
- canton
- entity
- federal district
- autonomous municipality
- geographical region
- prefecture
- commune
- economic prefecture
- autonomous region
- special administrative region
- capital district
- island
- autonomous district
- administration
- metropolitan department
- European collectivity
- metropolitan region
- metropolitan collectivity with special status
- overseas region
- overseas collectivity
- overseas territory
- land
- regional unit
- administrative region
- village
- city with county rights
- union territory
- Special region
- free municipal consortium
- decentralized regional entity
- metropolitan city
- state city
- popularate
- district municipality
- federal territory
- administrative atoll
- local council
- sheadings
- chain
- autonomous territorial unit
- territorial unit
- quarter
- special island authority
- capital territory
- special city
- arctic region
- administered area
- federal capital territory
- indigenous region
- capital
- voivodship
- republic
- administrative territory
- autonomous city
- area
- urban municipality
- special self-governing province
- special self-governing city
- autonomous community
- districts under republic administration
- metropolitan administration
- borough
- town council
- island council
- emirate
- council area
- unitary authority
- district council
- borough council
- london borough
- metropolitan district
- two-tier county
- country
- outlying area
- federal dependency

### GET /states/{iso3166_2}.json

Get detailed information for a specific state by ISO 3166-2 code.

**Parameters**:

- `iso3166_2`: State ISO 3166-2 code (format: {country_iso2}-{state_code})

**Response Fields**: All available fields including geographic coordinates and timezone

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/states/af-bds.json` (Badakhshan, Afghanistan)

### GET /states/timezone/{timezone}.json

Get states by timezone.

**Parameters**:

- `timezone`: Timezone name (URL encoded)

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/states/timezone/Asia-Kabul.json`

### GET /states/timezones.json

Get index of all state timezones with counts.

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/states/timezones.json`

---

## Cities

### GET /cities/country/{country_iso2}.json

Get cities for a specific country.

**Parameters**:

- `country_iso2`: Country ISO2 code (2-letter uppercase)

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/cities/country/af.json`

### GET /cities/state/{state_iso3166_2}.json

Get cities for a specific state.

**Parameters**:

- `state_iso3166_2`: State ISO 3166-2 code (format: {country_iso2}-{state_code})

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/cities/state/af-bds.json`



### GET /cities/batches.json

Get batch index for efficient individual city lookups.

**Note**: Contains metadata about all city batch files with start/end ID ranges. This is the recommended way to find the correct batch file for any city ID.

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/cities/batches.json`

**Response Structure**:
```json
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
```

### GET /cities/batch/{filename}

Get a batch of cities for efficient individual city access.

**Parameters**:

- `filename`: Batch filename from the batch index (e.g., "cities/batch/batch-57900-58006.json")

**Note**: Cities are accessible by ID as object keys in the `data` field. Use the batch index to find the correct filename for any city ID.

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/cities/batch/batch-57900-58006.json`

**Response Structure**:
```json
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
```

### GET /cities/timezone/{timezone}.json

Get cities by timezone.

**Parameters**:

- `timezone`: Timezone name (URL encoded)

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/cities/timezone/Asia-Kabul.json`

### GET /cities/{id}.json

Get detailed information for a specific city.

**Parameters**:

- `id`: City ID (integer)

**Note**: Individual city files generated for sample cities only

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/cities/52.json`

---

## Search

### GET /search/countries.json

Searchable countries index for client-side filtering.

**Searchable Fields**: name, iso2, iso3, native, capital, currency, region, subregion

**Usage**: Download once and filter client-side using any searchable field

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/search/countries.json`

### GET /search/states.json

Searchable states index for client-side filtering.

**Searchable Fields**: name, iso2, country_name, country_code, type, timezone

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/search/states.json`

### GET /search/cities.json

Searchable cities index for client-side filtering.

**Searchable Fields**: name, state_name, country_name, state_code, country_code, wikiDataId

**Warning**: Large file - consider client-side filtering in your application

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/search/cities.json`

### GET /search/combined.json

Combined search index across all entity types (limited dataset).

**Limitations**: Limited to prevent large file sizes

**Example**: `https://cdn.jsdelivr.net/npm/geo-data-api@latest/dist/api/v1/search/combined.json`

---

## Rate Limits

- **No rate limits** - API is cached by CDN
- **Recommendation**: Implement client-side caching for better performance

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `404`: Resource not found
- `500`: Server error (rare for static files)
