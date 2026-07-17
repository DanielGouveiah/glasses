import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = relative => JSON.parse(readFileSync(path.join(root, relative), "utf8"));
const marketplace = readJson(".claude-plugin/marketplace.json");

assert.match(marketplace.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
assert.ok(Array.isArray(marketplace.plugins) && marketplace.plugins.length > 0);

for (const entry of marketplace.plugins) {
  assert.match(entry.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(entry.source.startsWith("./"));
  const pluginRoot = path.resolve(root, entry.source);
  assert.ok(pluginRoot.startsWith(root + path.sep));
  assert.ok(statSync(pluginRoot).isDirectory());
  const manifest = JSON.parse(readFileSync(path.join(pluginRoot, ".claude-plugin", "plugin.json")));
  assert.equal(manifest.name, entry.name);
  assert.equal(manifest.version, entry.version);
  assert.ok(statSync(path.join(pluginRoot, "skills")).isDirectory());
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.isDirectory() && [".git", "node_modules", "work", "results"].includes(entry.name)) {
      return [];
    }
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

for (const file of walk(root).filter(file => file.endsWith(".json"))) {
  JSON.parse(readFileSync(file, "utf8"));
}

console.log(`Validated ${marketplace.plugins.length} plugin(s).`);
