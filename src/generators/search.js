const FileUtils = require("../utils/file-utils");
const DataUtils = require("../utils/data-utils");
const config = require("../config");
const BaseGenerator = require("./base-generator");

class SearchGenerator extends BaseGenerator {
  constructor(countries, states, cities) {
    super(countries);
    this.countries = countries;
    this.states = states;
    this.cities = cities;
  }

  async generate() {
    console.log("Generating search endpoints...");

    await this.generateCountriesSearch();
    await this.generateStatesSearch();
    await this.generateCitiesSearch();
    await this.generateCombinedSearch();

    console.log("✓ Generated search endpoints");
  }

  async generateCountriesSearch() {
    const searchData = this.countries.map((country) => ({
      id: country.id,
      name: country.name,
      iso2: country.iso2,
      iso3: country.iso3,
      native: country.native,
      capital: country.capital,
      currency: country.currency,
      currency_name: country.currency_name,
      region: country.region,
      subregion: country.subregion,
      emoji: country.emoji,
      // Add searchable translations
      translations: country.translations
        ? Object.values(country.translations)
        : [],
    }));

    const dataWithMeta = DataUtils.addMetadata(searchData, "countries_search", {
      searchable_fields: config.SEARCH_FIELDS.countries,
      usage: "Filter client-side using any of the searchable fields",
      total_countries: searchData.length,
    });

    await FileUtils.writeJSON("search/countries.json", dataWithMeta);
  }

  async generateStatesSearch() {
    const searchData = this.states.map((state) => ({
      id: state.id,
      name: state.name,
      iso2: state.iso2 || null,
      country_id: state.country_id,
      country_name: state.country_name,
      country_iso2: state.country_iso2,
    }));

    const dataWithMeta = DataUtils.addMetadata(searchData, "states_search", {
      searchable_fields: config.SEARCH_FIELDS.states,
      usage: "Filter client-side using name, iso2, or country_name fields",
      total_states: searchData.length,
    });

    await FileUtils.writeJSON("search/states.json", dataWithMeta);
  }

  async generateCitiesSearch() {
    // Create a lightweight search index for cities
    const searchData = this.cities.map((city) => ({
      id: city.id,
      name: city.name,
      state_id: city.state_id,
      state_name: city.state_name,
      country_id: city.country_id,
      country_name: city.country_name,
    }));

    const dataWithMeta = DataUtils.addMetadata(searchData, "cities_search", {
      searchable_fields: config.SEARCH_FIELDS.cities,
      usage:
        "Filter client-side using name, state_name, or country_name fields",
      note: "Large dataset - consider implementing client-side pagination or filtering",
      total_cities: searchData.length,
    });

    await FileUtils.writeJSON("search/cities.json", dataWithMeta);
  }

  async generateCombinedSearch() {
    // Create a combined lightweight search index
    const combinedData = {
      countries: this.countries.map((c) => ({
        type: "country",
        id: c.id,
        name: c.name,
        iso2: c.iso2,
        emoji: c.emoji,
      })),
      states: this.states.slice(0, 1000).map((s) => ({
        // Limit states for performance
        type: "state",
        id: s.id,
        name: s.name,
        country_name: s.country_name,
      })),
      cities: this.cities.slice(0, 5000).map((c) => ({
        // Limit cities for performance
        type: "city",
        id: c.id,
        name: c.name,
        state_name: c.state_name,
        country_name: c.country_name,
      })),
    };

    const dataWithMeta = DataUtils.addMetadata(
      combinedData,
      "combined_search",
      {
        usage: "Quick search across all entity types",
        limitations: {
          states: "Limited to first 1000 states",
          cities: "Limited to first 5000 cities",
        },
        note: "For complete search, use individual search endpoints",
      }
    );

    await FileUtils.writeJSON("search/combined.json", dataWithMeta);
  }
}

module.exports = SearchGenerator;
