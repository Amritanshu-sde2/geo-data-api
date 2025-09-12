class DataAnalyzer {
  constructor(countries, states, cities) {
    this.countries = countries;
    this.states = states;
    this.cities = cities;
    this.dataAnalysis = null;
  }

  analyzeData() {
    console.log("Analyzing data...");

    // Analyze countries
    const regions = [...new Set(this.countries.map((c) => c.region))].filter(
      Boolean
    );
    const subregions = [
      ...new Set(this.countries.map((c) => c.subregion)),
    ].filter(Boolean);
    const currencies = [
      ...new Set(this.countries.map((c) => c.currency)),
    ].filter(Boolean);

    console.log(`📊 Countries Analysis:`);
    console.log(`   • ${this.countries.length} countries`);
    console.log(`   • ${regions.length} regions`);
    console.log(`   • ${subregions.length} subregions`);
    console.log(`   • ${currencies.length} unique currencies`);

    // Analyze states
    const stateTypes = [...new Set(this.states.map((s) => s.type))].filter(
      Boolean
    );
    const stateTimezones = [
      ...new Set(this.states.map((s) => s.timezone)),
    ].filter(Boolean);
    const statesWithCoords = this.states.filter(
      (s) => s.latitude && s.longitude
    ).length;

    console.log(`📊 States Analysis:`);
    console.log(`   • ${this.states.length} states`);
    // Only show the count of state types to avoid overly verbose output
    console.log(`   • ${stateTypes.length} state types`);
    console.log(`   • ${stateTimezones.length} unique timezones`);
    console.log(
      `   • ${statesWithCoords} states with coordinates (${((statesWithCoords / this.states.length) * 100).toFixed(1)}%)`
    );

    // Analyze cities
    const citiesWithWikiData = this.cities.filter((c) => c.wikiDataId).length;
    const citiesWithCoords = this.cities.filter(
      (c) => c.latitude && c.longitude
    ).length;
    const cityTimezones = [
      ...new Set(this.cities.map((c) => c.timezone)),
    ].filter(Boolean);

    console.log(`📊 Cities Analysis:`);
    console.log(`   • ${this.cities.length} cities`);
    console.log(
      `   • ${citiesWithWikiData} cities with WikiData (${((citiesWithWikiData / this.cities.length) * 100).toFixed(1)}%)`
    );
    console.log(
      `   • ${citiesWithCoords} cities with coordinates (${((citiesWithCoords / this.cities.length) * 100).toFixed(1)}%)`
    );
    console.log(`   • ${cityTimezones.length} unique city timezones`);

    // Analyze distribution
    const citiesByCountry = {};
    const statesByCountry = {};

    this.cities.forEach((city) => {
      citiesByCountry[city.country_name] =
        (citiesByCountry[city.country_name] || 0) + 1;
    });

    this.states.forEach((state) => {
      statesByCountry[state.country_name] =
        (statesByCountry[state.country_name] || 0) + 1;
    });

    const topCountriesByCities = Object.entries(citiesByCountry)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topCountriesByStates = Object.entries(statesByCountry)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    console.log(`📊 Distribution Analysis:`);
    console.log(
      `   • Top countries by cities: ${topCountriesByCities.map(([name, count]) => `${name} (${count})`).join(", ")}`
    );
    console.log(
      `   • Top countries by states: ${topCountriesByStates.map(([name, count]) => `${name} (${count})`).join(", ")}`
    );

    // Store analysis for API info
    this.dataAnalysis = {
      countries: {
        total: this.countries.length,
        regions: regions.length,
        subregions: subregions.length,
        currencies: currencies.length,
      },
      states: {
        total: this.states.length,
        types: stateTypes,
        timezones: stateTimezones.length,
        with_coordinates: statesWithCoords,
      },
      cities: {
        total: this.cities.length,
        with_wikidata: citiesWithWikiData,
        with_coordinates: citiesWithCoords,
        timezones: cityTimezones.length,
      },
      distribution: {
        top_countries_by_cities: topCountriesByCities,
        top_countries_by_states: topCountriesByStates,
      },
    };

    return this.dataAnalysis;
  }

  getAnalysis() {
    return this.dataAnalysis;
  }
}

module.exports = DataAnalyzer;
