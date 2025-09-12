const FileUtils = require("./utils/file-utils");
const CountriesGenerator = require("./generators/countries");
const StatesGenerator = require("./generators/states");
const CitiesGenerator = require("./generators/cities");
const SearchGenerator = require("./generators/search");
const DataValidator = require("./validators/data-validator");
const DataAnalyzer = require("./analyzers/data-analyzer");
const PerformanceMonitor = require("./utils/performance-monitor");
const config = require("./config");
const path = require("path");

class DataProcessor {
  constructor() {
    this.countries = [];
    this.states = [];
    this.cities = [];
    this.dataAnalysis = null;
    this.performanceMonitor = new PerformanceMonitor();
  }

  async loadData() {
    console.log("Loading source data from db folder...");

    try {
      this.countries = await FileUtils.readJSON(
        `${config.INPUT_DIR}/countries.json`
      );
      this.states = await FileUtils.readJSON(`${config.INPUT_DIR}/states.json`);
      this.cities = await FileUtils.readJSON(`${config.INPUT_DIR}/cities.json`);

      console.log(`✓ Loaded ${this.countries.length} countries`);
      console.log(`✓ Loaded ${this.states.length} states`);
      console.log(`✓ Loaded ${this.cities.length} cities`);

      // Validate data structure
      this.validateDataStructure();

      // Perform data analysis
      this.analyzeData();
    } catch (error) {
      console.error("Error loading data:", error.message);
      console.error(
        "Make sure countries.json, states.json, and cities.json exist in the db/ folder"
      );
      process.exit(1);
    }
  }

  validateDataStructure() {
    // Suppress verbose data structure validation logs, keep only relationship checks
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    console.log = (message) => {
      // Only show relationship validation messages
      if (
        message.includes("All states have valid") ||
        message.includes("All cities have valid")
      ) {
        originalConsoleLog(message);
      }
    };
    console.warn = (message) => {
      // Only show relationship validation warnings
      if (
        message.includes("All states have valid") ||
        message.includes("All cities have valid")
      ) {
        originalConsoleWarn(message);
      }
    };

    try {
      const validator = new DataValidator(
        this.countries,
        this.states,
        this.cities
      );
      validator.validateDataStructure();
    } finally {
      // Restore console logging
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
    }
  }

  analyzeData() {
    const analyzer = new DataAnalyzer(this.countries, this.states, this.cities);
    this.dataAnalysis = analyzer.analyzeData();
  }

  async generateAPI() {
    console.log("Starting API generation...");

    // Clean dist folder
    await this.performanceMonitor.measure("clean_dist_folder", () =>
      FileUtils.cleanOutput()
    );

    // Generate countries endpoints
    await this.performanceMonitor.measure("countries_generation", async () => {
      const countriesGen = new CountriesGenerator(this.countries);
      await countriesGen.generate();
      this.performanceMonitor.increment(
        "files_generated",
        this.countries.length + 10
      ); // Estimate
    });

    // Generate states endpoints
    await this.performanceMonitor.measure("states_generation", async () => {
      const statesGen = new StatesGenerator(this.states, this.countries);
      await statesGen.generate();
      this.performanceMonitor.increment(
        "files_generated",
        this.states.length + 10
      ); // Estimate
    });

    // Generate cities endpoints
    await this.performanceMonitor.measure("cities_generation", async () => {
      const citiesGen = new CitiesGenerator(
        this.cities,
        this.states,
        this.countries
      );
      await citiesGen.generate();
      // Cities might generate fewer files due to sampling
      this.performanceMonitor.increment(
        "files_generated",
        Math.min(1000, this.cities.length) + 10
      );
    });

    // Generate search endpoints
    await this.performanceMonitor.measure("search_generation", async () => {
      const searchGen = new SearchGenerator(
        this.countries,
        this.states,
        this.cities
      );
      await searchGen.generate();
      this.performanceMonitor.increment("files_generated", 5); // Estimate
    });

    console.log("✅ API generation completed successfully!");
    console.log(`📁 Generated files are in: ${config.OUTPUT_DIR}`);
    console.log(`🌐 Upload the entire output/api/ folder to your CDN`);

    // Print performance report
    this.performanceMonitor.printReport();
  }

  async run() {
    try {
      console.log("🚀 Geo-Data API Generator");
      console.log("⚡ Sequential processing enabled");
      console.log(
        `📄 JSON formatting: ${config.PRETTY_JSON ? "Pretty (readable)" : "Compact (optimized)"}`
      );
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Load and process data
      await this.performanceMonitor.measure("data_loading", () =>
        this.loadData()
      );

      // Generate API files
      await this.generateAPI();

      console.log("================================================");
      console.log("✅ Generation completed successfully!");
      console.log("");
      console.log("Next steps:");
      console.log("1. Upload the output/api/ folder to your CDN");
      console.log("2. Update CDN_BASE_URL in src/config.js");
      console.log("3. Test your endpoints");
      console.log("");
      console.log(`📊 Generated API contains:`);
      console.log(`   • ${this.countries.length} countries`);
      console.log(
        `   • ${this.states.length} states (${this.dataAnalysis.states.types.length} types)`
      );
      console.log(
        `   • ${this.cities.length} cities across ${this.dataAnalysis.cities.countries} countries`
      );
      console.log("🎉 Generation completed! Your API is ready to be deployed.");

      // Force exit the process cleanly
      process.exit(0);
    } catch (error) {
      console.error("❌ Fatal error:", error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }
}

// Run the processor with command line argument processing
function parseArgs() {
  const args = process.argv.slice(2);
  const config = require("./config");

  if (args.includes("--pretty")) {
    console.log("✓ Pretty JSON formatting enabled");
    // Override config for this run
    config.PRETTY_JSON = true;
  }

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Usage: node src/data-processor.js [options]

Options:
  --pretty          Enable pretty JSON formatting for all files
  --help, -h        Show this help message

Performance Notes:
  - Compact JSON (default) is faster and produces smaller files
  - Sequential processing is used for all file generation
  - Use --pretty for development/debugging, compact for production
`);
    process.exit(0);
  }
}

parseArgs();

const processor = new DataProcessor();
processor.run();
