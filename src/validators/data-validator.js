const config = require("../config");

class DataValidator {
  constructor(countries, states, cities) {
    this.countries = countries;
    this.states = states;
    this.cities = cities;
  }

  validateDataStructure() {
    console.log("Validating data structure...");

    // Validate countries structure
    if (this.countries.length > 0) {
      const sampleCountry = this.countries[0];
      const requiredFields = ["id", "name", "iso2", "iso3"];
      const missingFields = requiredFields.filter(
        (field) => !(field in sampleCountry)
      );

      if (missingFields.length > 0) {
        throw new Error(
          `Countries data missing required fields: ${missingFields.join(", ")}`
        );
      }

      // Log available country fields for reference
      const availableFields = Object.keys(sampleCountry);
      console.log(
        `✓ Countries data structure validated (${availableFields.length} fields available)`
      );
      console.log(
        `  Available fields: ${availableFields.slice(0, 10).join(", ")}${availableFields.length > 10 ? "..." : ""}`
      );
    }

    // Validate states structure - Updated for your data structure
    if (this.states.length > 0) {
      const sampleState = this.states[0];
      const requiredFields = [
        "id",
        "name",
        "country_id",
        "country_code",
        "country_name",
      ];
      const missingFields = requiredFields.filter(
        (field) => !(field in sampleState)
      );

      if (missingFields.length > 0) {
        throw new Error(
          `States data missing required fields: ${missingFields.join(", ")}`
        );
      }

      // Log available state fields for reference
      const availableFields = Object.keys(sampleState);
      console.log(
        `✓ States data structure validated (${availableFields.length} fields available)`
      );
      console.log(`  Available fields: ${availableFields.join(", ")}`);

      // Check for enhanced fields
      const enhancedFields = [
        "iso2",
        "iso3166_2",
        "type",
        "timezone",
        "latitude",
        "longitude",
      ];
      const presentEnhanced = enhancedFields.filter(
        (field) => field in sampleState
      );
      if (presentEnhanced.length > 0) {
        console.log(
          `  Enhanced fields detected: ${presentEnhanced.join(", ")}`
        );
      }
    }

    // Validate cities structure - Updated for your data structure
    if (this.cities.length > 0) {
      const sampleCity = this.cities[0];
      const requiredFields = [
        "id",
        "name",
        "state_id",
        "state_name",
        "country_id",
        "country_name",
      ];
      const missingFields = requiredFields.filter(
        (field) => !(field in sampleCity)
      );

      if (missingFields.length > 0) {
        throw new Error(
          `Cities data missing required fields: ${missingFields.join(", ")}`
        );
      }

      // Log available city fields for reference
      const availableFields = Object.keys(sampleCity);
      console.log(
        `✓ Cities data structure validated (${availableFields.length} fields available)`
      );
      console.log(`  Available fields: ${availableFields.join(", ")}`);

      // Check for enhanced fields
      const enhancedFields = [
        "state_code",
        "country_code",
        "wikiDataId",
        "timezone",
        "latitude",
        "longitude",
      ];
      const presentEnhanced = enhancedFields.filter(
        (field) => field in sampleCity
      );
      if (presentEnhanced.length > 0) {
        console.log(
          `  Enhanced fields detected: ${presentEnhanced.join(", ")}`
        );
      }
    }

    // Validate data relationships
    this.validateDataRelationships();
  }

  validateDataRelationships() {
    console.log("Validating data relationships...");

    // Create lookup maps
    const countryIds = new Set(this.countries.map((c) => c.id));
    const stateIds = new Set(this.states.map((s) => s.id));

    // Validate state-country relationships
    const invalidStateCountries = this.states.filter(
      (state) => !countryIds.has(state.country_id)
    );
    if (invalidStateCountries.length > 0) {
      console.warn(
        `⚠️  Found ${invalidStateCountries.length} states with invalid country_id references`
      );
      console.warn(
        `  Sample invalid states: ${invalidStateCountries
          .slice(0, 3)
          .map((s) => `${s.name} (country_id: ${s.country_id})`)
          .join(", ")}`
      );
    } else {
      console.log("✓ All states have valid country references");
    }

    // Validate city-state relationships
    const invalidCityStates = this.cities.filter(
      (city) => !stateIds.has(city.state_id)
    );
    if (invalidCityStates.length > 0) {
      console.warn(
        `⚠️  Found ${invalidCityStates.length} cities with invalid state_id references`
      );
      console.warn(
        `  Sample invalid cities: ${invalidCityStates
          .slice(0, 3)
          .map((c) => `${c.name} (state_id: ${c.state_id})`)
          .join(", ")}`
      );
    } else {
      console.log("✓ All cities have valid state references");
    }

    // Validate city-country relationships
    const invalidCityCountries = this.cities.filter(
      (city) => !countryIds.has(city.country_id)
    );
    if (invalidCityCountries.length > 0) {
      console.warn(
        `⚠️  Found ${invalidCityCountries.length} cities with invalid country_id references`
      );
    } else {
      console.log("✓ All cities have valid country references");
    }
  }
}

module.exports = DataValidator;
