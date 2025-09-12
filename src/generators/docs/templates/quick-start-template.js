const config = require("../../../config");

class QuickStartTemplate {
  generate() {
    return `# Quick Start Guide

## Installation

No installation required! This is a static JSON API hosted on a CDN.

## Basic Usage

### 1. Get All Countries

\`\`\`javascript
const response = await fetch('${config.CDN_BASE_URL}/countries.json');
const countries = await response.json();

console.log(\`Found \${countries.meta.count} countries\`);
countries.data.forEach(country => {
  console.log(\`\${country.name} (\${country.iso2})\`);
});
\`\`\`

### 2. Get Country Details

\`\`\`javascript
// Get detailed information for Afghanistan (ISO2: AF)
const response = await fetch('${config.CDN_BASE_URL}/countries/af.json');
const country = await response.json();

console.log(country.data.name); // "Afghanistan"
console.log(country.data.capital); // "Kabul"
console.log(country.data.currency); // "AFN"
\`\`\`

### 3. Get States for a Country

\`\`\`javascript
// Get all states for Afghanistan
const response = await fetch('${config.CDN_BASE_URL}/states/country/af.json');
const states = await response.json();

states.data.forEach(state => {
  console.log(\`\${state.name} (\${state.type})\`);
});
\`\`\`

### 4. Get Cities for a State

\`\`\`javascript
// Get cities for Badakhshan province (AF-BDS)
const response = await fetch('${config.CDN_BASE_URL}/cities/state/af-bds.json');
const cities = await response.json();

cities.data.forEach(city => {
  console.log(\`\${city.name} - \${city.latitude}, \${city.longitude}\`);
});
\`\`\`

### 6. Get Individual State Details

\`\`\`javascript
// Get detailed information for a specific state
const response = await fetch('${config.CDN_BASE_URL}/states/af-bds.json');
const state = await response.json();

console.log(state.data.name); // "Badakhshan"
console.log(state.data.type); // "province"
console.log(state.data.timezone); // "Asia/Kabul"
console.log(\`\${state.data.latitude}, \${state.data.longitude}\`);
\`\`\`

\`\`\`javascript
// Method 1: Direct batch index lookup (recommended)
async function getCity(cityId) {
  // Step 1: Load the batch index
  const indexResponse = await fetch('${config.CDN_BASE_URL}/cities/batches.json');
  const batchIndex = await indexResponse.json();

  // Step 2: Find which batch contains the city
  const batch = batchIndex.data.find(b => cityId >= b.start_id && cityId <= b.end_id);

  if (!batch) {
    throw new Error(\`City with ID \${cityId} not found\`);
  }

  // Step 3: Fetch the specific batch file
  const batchResponse = await fetch(\`${config.CDN_BASE_URL}/\${batch.filename}\`);
  const batchData = await batchResponse.json();

  // Step 4: Extract the city data
  return batchData.data[cityId];
}

// Usage examples
const bhopal = await getCity(57995); // Bhopal, India
const tokyo = await getCity(18514);  // Tokyo, Japan
const london = await getCity(3435);  // London, UK

console.log(bhopal.name); // "Bhopal"
console.log(\`\${bhopal.latitude}, \${bhopal.longitude}\`);

// Method 2: Using a helper class with caching
class CityAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.batchIndex = null;
    this.batchCache = new Map();
  }

  async loadBatchIndex() {
    if (!this.batchIndex) {
      const response = await fetch(\`\${this.baseUrl}/cities/batches.json\`);
      const data = await response.json();
      this.batchIndex = data.data;
    }
    return this.batchIndex;
  }

  async getCity(cityId) {
    await this.loadBatchIndex();

    const batch = this.batchIndex.find(b =>
      cityId >= b.start_id && cityId <= b.end_id
    );

    if (!batch) {
      throw new Error(\`City ID \${cityId} not found\`);
    }

    if (this.batchCache.has(batch.filename)) {
      const cachedBatch = this.batchCache.get(batch.filename);
      return cachedBatch[cityId];
    }

    const response = await fetch(\`\${this.baseUrl}/\${batch.filename}\`);
    const batchData = await response.json();

    this.batchCache.set(batch.filename, batchData.data);
    return batchData.data[cityId];
  }

  async getCities(cityIds) {
    const results = {};
    const batchGroups = {};

    // Group city IDs by batch
    for (const cityId of cityIds) {
      await this.loadBatchIndex();
      const batch = this.batchIndex.find(b =>
        cityId >= b.start_id && cityId <= b.end_id
      );

      if (batch) {
        if (!batchGroups[batch.filename]) {
          batchGroups[batch.filename] = [];
        }
        batchGroups[batch.filename].push(cityId);
      }
    }

    // Fetch each batch once and extract needed cities
    for (const [filename, ids] of Object.entries(batchGroups)) {
      if (!this.batchCache.has(filename)) {
        const response = await fetch(\`\${this.baseUrl}/\${filename}\`);
        const batchData = await response.json();
        this.batchCache.set(filename, batchData.data);
      }

      const batchData = this.batchCache.get(filename);
      ids.forEach(id => {
        results[id] = batchData[id];
      });
    }

    return results;
  }
}

// Usage:
const cityAPI = new CityAPI('${config.CDN_BASE_URL}');

// Get single city
const kabul = await cityAPI.getCity(52);
console.log(kabul.name); // "Kabul"

// Get multiple cities efficiently
const cities = await cityAPI.getCities([57995, 18514, 3435]);
console.log(cities[57995].name, cities[18514].name);
\`\`\`

### 7. Search and Filter

\`\`\`javascript
// Download search index for client-side filtering
const searchResponse = await fetch('${config.CDN_BASE_URL}/search/cities.json');
const searchData = await searchResponse.json();

// Filter cities with WikiData
const citiesWithWikiData = searchData.data.filter(city => city.wikiDataId);

// Filter by country
const usaCities = searchData.data.filter(city => city.country_code === 'US');

// Filter by name (case-insensitive)
const newYorkCities = searchData.data.filter(city =>
  city.name.toLowerCase().includes('new york')
);
\`\`\`

### 8. Filter by Region

\`\`\`javascript
// Get all Asian countries
const response = await fetch('${config.CDN_BASE_URL}/countries/region/asia.json');
const asianCountries = await response.json();

asianCountries.data.forEach(country => {
  console.log(\`\${country.name} - \${country.subregion}\`);
});
\`\`\`

### 9. Get by Administrative Type

\`\`\`javascript
// Get all provinces
const response = await fetch('${config.CDN_BASE_URL}/states/type/province.json');
const provinces = await response.json();

console.log(\`Found \${provinces.meta.count} provinces worldwide\`);
\`\`\`

### 10. Working with Timezones

\`\`\`javascript
// Get states in a specific timezone
const response = await fetch('${config.CDN_BASE_URL}/states/timezone/Asia-Kabul.json');
const states = await response.json();

states.data.forEach(state => {
  console.log(\`\${state.name}, \${state.country_name}\`);
});
\`\`\`

## Error Handling

\`\`\`javascript
async function fetchCountries() {
  try {
    const response = await fetch('${config.CDN_BASE_URL}/countries.json');

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return null;
  }
}
\`\`\`

## Next Steps

1. Explore the [Endpoints Reference](ENDPOINTS.md) for all available endpoints
2. Check the [Data Structure Reference](DATA_STRUCTURE.md) for field definitions
3. Read the [API Documentation](API_DOCUMENTATION.md) for detailed information
`;
  }
}

module.exports = QuickStartTemplate;
