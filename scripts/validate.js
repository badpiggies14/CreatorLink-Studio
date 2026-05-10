const fs = require("fs");
const path = require("path");

const required = ["index.html", "styles.css", "app.js", "supabase-config.js", "README.md", "local-server.js", "vercel.json"];
const missing = required.filter((file) => !fs.existsSync(path.join(__dirname, "..", file)));

if (missing.length) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
for (const asset of ["styles.css", "supabase-config.js", "app.js"]) {
  if (!html.includes(asset)) {
    console.error(`index.html does not reference ${asset}`);
    process.exit(1);
  }
}

const publicProfile = path.join(__dirname, "..", "u", "mayamakes", "index.html");
if (!fs.existsSync(publicProfile)) {
  console.error("Missing public profile route: u/mayamakes/index.html");
  process.exit(1);
}

console.log("Build validation passed. Static production demo is ready.");
