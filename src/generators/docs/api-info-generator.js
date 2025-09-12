const FileUtils = require("../../utils/file-utils");
const config = require("../../config");

class APIInfoGenerator {
  constructor(countries, states, cities, dataAnalysis) {
    this.countries = countries;
    this.states = states;
    this.cities = cities;
    this.dataAnalysis = dataAnalysis;
  }

  async generate() {
    const apiInfo = {
      api_version: config.API_VERSION,
      generated_at: new Date().toISOString(),
      base_url: config.CDN_BASE_URL,
      statistics: {
        total_countries: this.countries.length,
        total_states: this.states.length,
        total_cities: this.cities.length,
        regions: [...new Set(this.countries.map((c) => c.region))].filter(
          Boolean
        ).length,
        subregions: [...new Set(this.countries.map((c) => c.subregion))].filter(
          Boolean
        ).length,
        state_types: [...new Set(this.states.map((s) => s.type))].filter(
          Boolean
        ),
        cities_with_wikidata: this.cities.filter((c) => c.wikiDataId).length,
        states_with_coordinates: this.states.filter(
          (s) => s.latitude && s.longitude
        ).length,
        cities_with_coordinates: this.cities.filter(
          (c) => c.latitude && c.longitude
        ).length,
      },
      data_analysis: this.dataAnalysis,
      endpoints: {
        countries: {
          list: "countries.json",
          individual: "countries/{iso2}.json",
          by_region: "countries/region/{region-name}.json",
          by_subregion: "countries/subregion/{subregion-name}.json",
          regions_index: "countries/regions.json",
        },
        states: {
          all: "states/all.json",
          by_country: "states/country/{country_iso2}.json",
          by_type: "states/type/{type-name}.json",
          by_timezone: "states/timezone/{timezone-name}.json",
          individual: "states/{iso3166_2}.json",
          types_index: "states/types.json",
          timezones_index: "states/timezones.json",
        },
        cities: {
          major: "cities/major.json",
          by_country: "cities/country/{country_iso2}.json",
          by_state: "cities/state/{state_iso3166_2}.json",
          by_timezone: "cities/timezone/{timezone-name}.json",
          individual: "cities/{id}.json",
        },
        search: {
          countries: "search/countries.json",
          states: "search/states.json",
          cities: "search/cities.json",
          combined: "search/combined.json",
        },
      },
      usage_examples: {
        "Get all countries": `${config.CDN_BASE_URL}/countries.json`,
        "Get Afghanistan details": `${config.CDN_BASE_URL}/countries/af.json`,
        "Get Asian countries": `${config.CDN_BASE_URL}/countries/region/asia.json`,
        "Get states by country": `${config.CDN_BASE_URL}/states/country/us.json`,
        "Get provinces only": `${config.CDN_BASE_URL}/states/type/province.json`,
        "Get cities by state": `${config.CDN_BASE_URL}/cities/state/us-ca.json`,
        "Get major cities": `${config.CDN_BASE_URL}/cities/major.json`,
        // Note: a dedicated cities WikiData endpoint/file is no longer generated.
        "Search countries": `${config.CDN_BASE_URL}/search/countries.json`,
      },
      notes: {
        pagination:
          "States and cities are provided as full lists (no pagination) in this release",
        coordinates: "Geographic coordinates available for most locations",
        wikidata: "WikiData IDs available for enhanced city information",
        timezones: "Timezone information available for states and some cities",
        types:
          "States include type information (province, state, region, etc.)",
      },
    };

    await FileUtils.writeJSON("api-info.json", apiInfo);
  }
}

module.exports = APIInfoGenerator;
