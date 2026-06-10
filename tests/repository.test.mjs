import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function exists(path) {
  return existsSync(new URL(`../${path}`, import.meta.url));
}

const packageJson = JSON.parse(read("package.json"));

assert.equal(packageJson.type, "module");
assert.match(packageJson.scripts.test, /tests\/repository\.test\.mjs/);
assert.equal(packageJson.scripts.lint, "node scripts/lint.mjs");
assert.equal(packageJson.scripts["format:check"], "prettier --check .");
assert.equal(packageJson.scripts.format, "prettier --write .");
assert.equal(packageJson.scripts.check, "npm run format:check && npm run lint && npm test");
assert.match(packageJson.devDependencies.prettier, /^\^3\./);

assert.ok(exists(".gitignore"));
assert.ok(exists(".prettierrc.json"));
assert.ok(exists(".prettierignore"));
assert.ok(exists("README.md"));
assert.ok(exists("scripts/lint.mjs"));
assert.ok(exists(".github/workflows/ci.yml"));

const gitignore = read(".gitignore");
assert.match(gitignore, /node_modules\//);
assert.match(gitignore, /\.DS_Store/);

const prettierConfig = read(".prettierrc.json");
assert.doesNotThrow(() => JSON.parse(prettierConfig));

const prettierIgnore = read(".prettierignore");
assert.match(prettierIgnore, /node_modules/);
assert.match(prettierIgnore, /assets\/\*\.png/);

const readme = read("README.md");
assert.match(readme, /WebBuild Landing/);
assert.match(readme, /npm run check/);
assert.match(readme, /landing-init/);

const workflow = read(".github/workflows/ci.yml");
assert.match(workflow, /pull_request:/);
assert.match(workflow, /branches:\s*\[\s*main\s*\]/);
assert.match(workflow, /npm install/);
assert.match(workflow, /npm run check/);
assert.match(workflow, /node-version:\s*20/);

const lintScript = read("scripts/lint.mjs");
assert.match(lintScript, /Referenced local file is missing/);
assert.match(lintScript, /External link missing target="_blank"/);

console.log("repository tests passed");
