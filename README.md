# Geo-Data API Static Generator

Generate a static JSON API for geographic data including countries, states and cities that can be hosted on any CDN.

This repository transforms the upstream dataset (countries, states, cities) into a small, cacheable, CDN-ready API under `dist/api/v1/`.

This project uses the latest upstream database maintained at [dr5hn/countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database).

## Quick start

Prerequisites: Node.js and npm.

1. Place source JSON files in the `db/` directory:
   - `countries.json`
   - `states.json`
   - `cities.json`

You can download the dataset from the GitHub project: [dr5hn/countries-states-cities-database](https://github.com/dr5hn/countries-states-cities-database)

1. Install dependencies and build the API:

```powershell
npm install
npm run build
```

1. Upload the contents of `dist/api/v1/` to your CDN.

1. Update `src/config.js` (for example, `CDN_BASE_URL`) if you need client-side configuration.

## What this generates

The generator creates a small static API tree (example):

```text
dist/api/v1/
├── countries.json                # list all countries
├── countries/{iso2}.json         # country details (ISO2 code)
├── states/country/{iso2}.json    # states by country (ISO2 code)
├── states/{iso3166_2}.json       # state details (ISO 3166-2 code)
├── cities/country/{iso2}.json    # cities by country (ISO2 code)
├── cities/state/{iso3166_2}.json # cities by state (ISO 3166-2 code)
├── cities/{id}.json              # (limited) city details
└── search/
    ├── countries.json            # searchable country index
    ├── states.json               # searchable state index
    └── cities.json               # searchable city index
```

## API endpoints (static files)

### Countries

- GET /countries.json
- GET /countries/{iso2}.json
- GET /countries/region/{region}.json
- GET /countries/subregion/{subregion}.json

### States

- GET /states/country/{iso2}.json
- GET /states/{iso3166_2}.json
- GET /states/type/{type}.json
- GET /states/timezone/{timezone}.json
- GET /states/types.json
- GET /states/timezones.json
- GET /states/all.json

### Cities

- GET /cities/country/{iso2}.json
- GET /cities/state/{iso3166_2}.json
- GET /cities/timezone/{timezone}.json
- GET /cities/{id}.json
- GET /cities/batch/{batchId}.json
- GET /cities/batches.json

### Search

- GET /search/countries.json
- GET /search/states.json
- GET /search/cities.json
- GET /search/combined.json

## Configuration

Edit `src/config.js` to customize:

- Output formatting (pretty vs compact)
- Search fields included in index files
- `CDN_BASE_URL` used by examples
- Optional: country flag icons via [flag-icons (Lipis)](https://flagicons.lipis.dev/) (configurable in `src/config.js`)

## Advanced Features

### Performance Optimizations

- **Sequential Processing**: Optimized for large datasets with controlled memory usage
- **Batch Processing**: Cities are split into manageable batches for efficient API access
- **Compact JSON**: Production-optimized minified output (use `--pretty` for development)
- **Memory Management**: Automatic cache clearing and memory optimization during generation

### Smart Search & Filtering

- **Multi-entity Search**: Combined search index across countries, states, and cities
- **Advanced Filtering**: Filter by region, subregion, administrative type, and timezone
- **Client-side Search**: Pre-built search indexes for fast client-side filtering
- **Batch City Access**: Efficient city lookup with 100 cities per batch file

### Geographic Intelligence

- **100% Coordinate Coverage**: All states and cities include latitude/longitude
- **Timezone Support**: Complete timezone data for states and cities
- **Administrative Types**: 93 different state/province types supported
- **WikiData Integration**: 99.8% of cities linked to Wikipedia references

## Roadmap

### 🚀 Phase 1: Enhanced User Experience

- [ ] **Astro-powered Landing Page**: Replace current HTML with Astro for better performance and maintainability
- [ ] **Interactive Demo Redesign**: Rebuild demo pages using Astro with improved UX and modern design
- [ ] **Single City Endpoints**: Add option to generate individual city API endpoints for better granularity

### 🔧 Phase 2: Developer Experience

- [ ] **OpenAPI Specification**: Generate comprehensive OpenAPI/Swagger docs for better API discovery
- [ ] **SDK Generation**: Create SDKs for JavaScript, Python, and PHP
- [ ] **TypeScript Support**: Add TypeScript definitions for better developer experience
- [ ] **CLI Tool Enhancement**: Improve command-line interface with more options and better error handling

### 📊 Phase 3: Advanced Features

- [ ] **GraphQL API**: Add GraphQL support alongside REST API for flexible querying
- [ ] **Real-time Updates**: Implement webhook system for data updates and notifications
- [ ] **Advanced Search**: Add fuzzy search, autocomplete, and advanced filtering capabilities
- [ ] **Data Export**: Support for CSV, XML, and other data formats

## Deployment

1. Run the build (see Quick start).
1. Upload `dist/api/` to your CDN or static host.
1. Configure CORS on the CDN to allow public reads. Example headers:

```text
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Performance tips:

- Enable gzip/brotli compression on your CDN.
- Use long cache TTLs for static files and versioning on rebuilds.
- Use the `/search` endpoints for client-side filtering instead of downloading full datasets.

## Usage examples

Fetch all countries:

```javascript
const resp = await fetch("https://your-cdn.com/api/v1/countries.json");
const data = await resp.json();
console.log(data);
```

Get states for a country (example: Afghanistan):

```javascript
const resp = await fetch("https://your-cdn.com/api/v1/states/country/af.json");
const states = await resp.json();
```

Get cities for a state (example: Badakhshan province):

```javascript
const resp = await fetch(
  "https://your-cdn.com/api/v1/cities/state/af-bds.json"
);
const cities = await resp.json();
```

Search client-side (example):

```javascript
const resp = await fetch("https://your-cdn.com/api/v1/search/countries.json");
const index = await resp.json();
const matches = index.data.filter((c) => c.name.toLowerCase().includes("ind"));
```

React hook example (tiny helper):

```javascript
import { useState, useEffect } from "react";

export function useCountriesAPI(baseURL) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getCountries() {
    setLoading(true);
    const r = await fetch(`${baseURL}/countries.json`);
    const j = await r.json();
    setCountries(j.data || []);
    setLoading(false);
  }

  useEffect(() => {
    getCountries();
  }, [baseURL]);

  async function getStates(countryId) {
    // Use ISO2 code (e.g., 'af' for Afghanistan) or numeric ID
    const r = await fetch(`${baseURL}/states/country/${countryId}.json`);
    return r.json();
  }

  async function getCities(stateId) {
    // Use ISO 3166-2 code (e.g., 'af-bds' for Badakhshan) or numeric ID
    const r = await fetch(`${baseURL}/cities/state/${stateId}.json`);
    return r.json();
  }

  return { countries, loading, getStates, getCities };
}
```

## File structure (project)

- `src/` - generator source code
  - `config.js` - configuration and field mappings
  - `data-processor.js` - main processing logic and orchestration
  - `server.js` - development server for testing
  - `generators/` - per-entity generators
    - `countries.js` - country endpoint generation
    - `states.js` - state endpoint generation
    - `cities.js` - city endpoint generation
    - `search.js` - search index generation
    - `base-generator.js` - shared generator utilities
  - `analyzers/` - data analysis and validation
  - `validators/` - data structure validation
  - `utils/` - utility helpers and performance monitoring
  - `docs/` - documentation generation templates
- `db/` - source JSON data files (not committed)
  - `countries.json` - country data
  - `states.json` - state/province data
  - `cities.json` - city data
- `dist/` - generated API tree (gitignored)
  - `api/v1/` - static JSON API files
  - `demo/` - interactive demo files
- `docs/` - generated documentation
- `demo/` - demo HTML files

## Notes

- The repository is intended to produce a fully static API; no runtime server is required.
- Keep `db/*.json` out of source control; the repo's `.gitignore` already excludes them.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
