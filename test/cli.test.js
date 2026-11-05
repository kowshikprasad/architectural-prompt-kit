import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

const runCli = (...args) => spawnSync(
  process.execPath,
  ["bin/apk.js", ...args],
  { encoding: "utf8" }
);

test("CLI validates the bundled example", () => {
  const result = runCli("examples/tropical-residence.json");
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /is a valid Architectural Prompt Kit document/);
});

test("CLI assembles prompt text", () => {
  const result = runCli("examples/tropical-residence.json", "--prompt");
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /two-storey tropical residence/);
});

test("CLI prints formatted JSON", () => {
  const result = runCli("examples/tropical-residence.json", "--format");
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).schemaVersion, "1.0");
});

test("CLI reports missing files with a non-zero exit code", () => {
  const result = runCli("examples/does-not-exist.json");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Error:/);
});

test("published JSON Schema is valid JSON and identifies v1.0", async () => {
  const schema = JSON.parse(await readFile("schema/prompt.schema.json", "utf8"));
  assert.equal(schema.properties.schemaVersion.const, "1.0");
  assert.ok(schema.required.includes("subject"));
});
