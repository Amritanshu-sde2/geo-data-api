const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // Handle root path
  let filePath = path.join("./dist", req.url === "/" ? "/index.html" : req.url);

  // Get file extension for MIME type
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
  };

  const contentType = mimeTypes[ext] || "application/octet-stream";

  // Read and serve file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File not found
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(`
          <h1>404 - Not Found</h1>
          <p>The requested file <code>${req.url}</code> was not found.</p>
          <p><a href="/">← Back to Home</a></p>
        `);
      } else {
        // Server error
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>500 - Server Error</h1>");
      }
    } else {
      // Serve file with CORS headers
      res.writeHead(200, {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end(content, "utf-8");
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("");
  console.log("🚀 Geo-Data API Server");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📡 Server running at: http://localhost:${port}`);
  console.log(`📁 Serving files from: ./dist folder`);
  console.log("");
  console.log("📖 Available URLs:");
  console.log(`   🏠 Homepage:      http://localhost:${port}`);
  console.log(`   🎮 Demo:          http://localhost:${port}/demo/demo.html`);
  console.log(
    `   🌍 Countries:     http://localhost:${port}/api/v1/countries.json`
  );
  console.log(
    `   🏛️  States:        http://localhost:${port}/api/v1/states/all.json`
  );
  console.log(
    `   🏙️  Cities (US):   http://localhost:${port}/api/v1/cities/country/us.json`
  );
  console.log(
    `   🏙️  Cities (CA):   http://localhost:${port}/api/v1/cities/state/us-ca.json`
  );
  console.log(
    `   🔍 Search:        http://localhost:${port}/api/v1/search/countries.json`
  );
  console.log("");
  console.log("💡 Tips:");
  console.log("   • Use Ctrl+C to stop the server");
  console.log("   • All API endpoints support CORS");
  console.log("   • Try the interactive demo for API testing");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n");
  console.log("👋 Shutting down server...");
  console.log("✅ Server stopped successfully");
  process.exit(0);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
