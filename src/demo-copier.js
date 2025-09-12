const FileUtils = require("./utils/file-utils");
const path = require("path");
const fs = require("fs-extra");

class DemoCopier {
  async copyDemoFiles() {
    console.log("Starting demo files copy...");

    const projectRoot = path.resolve(__dirname, "../");

    // Copy index.html
    const indexSourcePath = path.join(projectRoot, "index.html");
    const indexDestPath = path.join(projectRoot, "dist", "index.html");
    await FileUtils.copyFile(indexSourcePath, indexDestPath);

    // Copy entire demo folder (if present) into dist/demo
    const demoSourceDir = path.join(projectRoot, "demo");
    const demoDestDir = path.join(projectRoot, "dist", "demo");

    // Use FileUtils.copyDir to ensure proper copying without hard links
    if (await fs.pathExists(demoSourceDir)) {
      await FileUtils.copyDir(demoSourceDir, demoDestDir);
      console.log(`✓ Copied: demo -> ${demoDestDir}`);
    } else {
      console.warn(`⚠ Source demo folder not found: ${demoSourceDir}`);
    }

    console.log("✅ Demo files copy completed successfully!");
  }

  async run() {
    try {
      console.log("🚀 Geo-Data API - Demo Copier");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      // Copy demo files
      await this.copyDemoFiles();

      console.log("================================================");
      console.log("✅ Copy completed successfully!");
      console.log("");
      console.log("Copied files:");
      console.log("• Index HTML (dist/index.html)");
      console.log("• Demo files (dist/demo/)");

      // Force exit the process cleanly
      process.exit(0);
    } catch (error) {
      console.error("❌ Fatal error:", error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }
}

const copier = new DemoCopier();
copier.run();
