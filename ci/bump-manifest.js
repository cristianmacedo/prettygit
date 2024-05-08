// update-manifest-version.js

const fs = require("fs");
const path = require("path");

// Read the version from package.json
const packageJsonPath = path.resolve(__dirname, "..", "package.json");
const packageJson = require(packageJsonPath);
const newVersion = packageJson.version;

const manifestJsonPath = path.resolve(
  __dirname,
  "..",
  "public",
  "manifest.json"
);
const manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, "utf8"));

// Update the version in manifest.json
manifestJson.version = newVersion;

// Write the updated manifest.json back to file
fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2));

console.log(`Updated manifest.json version to ${newVersion}`);
