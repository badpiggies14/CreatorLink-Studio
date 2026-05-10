const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const output = path.join(root, "dist");
const files = [
  "index.html",
  "styles.css",
  "app.js",
  "supabase-config.js",
  path.join("u", "mayamakes", "index.html")
];

fs.rmSync(output, { recursive: true, force: true });

for (const file of files) {
  const source = path.join(root, file);
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

console.log("Static site exported to dist.");
