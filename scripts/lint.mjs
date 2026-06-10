import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = normalize(join(dirname(fileURLToPath(import.meta.url)), ".."));
const ignoredDirectories = new Set([".git", "node_modules", "coverage", "dist"]);
const checkedExtensions = new Set([".html", ".css", ".js", ".mjs", ".json", ".md", ".svg", ".yml"]);
const htmlFiles = ["index.html", "privacy.html"];
const errors = [];

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const relativePath = normalize(path.slice(root.length + 1));
    const stats = statSync(path);

    if (stats.isDirectory()) {
      return ignoredDirectories.has(entry) ? [] : walk(path);
    }

    if (!checkedExtensions.has(extname(path))) {
      return [];
    }

    return [relativePath];
  });
}

function localTargetExists(fromFile, value) {
  if (!value.startsWith("./")) return true;
  const target = value.split("#")[0];
  if (!target) return true;
  return existsSync(join(root, dirname(fromFile), target));
}

function report(message) {
  errors.push(message);
}

for (const file of walk(root)) {
  const content = readFileSync(join(root, file), "utf8");

  if (/\t/.test(content)) {
    report(`${file}: tabs are not allowed`);
  }

  if (/[ \t]$/m.test(content)) {
    report(`${file}: trailing whitespace is not allowed`);
  }

  if (!content.endsWith("\n")) {
    report(`${file}: file must end with a newline`);
  }
}

for (const file of htmlFiles) {
  const content = readFileSync(join(root, file), "utf8");
  const ids = [...content.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

  assert.equal(
    duplicateIds.length,
    0,
    `${file}: duplicate id attributes: ${duplicateIds.join(", ")}`,
  );

  for (const match of content.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (!localTargetExists(file, value)) {
      report(`${file}: Referenced local file is missing: ${value}`);
    }
  }

  for (const match of content.matchAll(/<a\b([^>]*?)>/g)) {
    const attributes = match[1];
    const href = attributes.match(/\shref="([^"]+)"/)?.[1] ?? "";
    const isExternal = /^https?:\/\//.test(href);
    const isBlank = /\starget="_blank"/.test(attributes);
    const hasSafeRel = /\srel="[^"]*\bnoopener\b[^"]*\bnoreferrer\b[^"]*"/.test(attributes);

    if (isExternal && !isBlank) {
      report(`${file}: External link missing target="_blank": ${href}`);
    }

    if (isExternal && !hasSafeRel) {
      report(`${file}: External link missing rel="noopener noreferrer": ${href}`);
    }
  }
}

if (errors.length > 0) {
  throw new Error(errors.join("\n"));
}

console.log("lint checks passed");
