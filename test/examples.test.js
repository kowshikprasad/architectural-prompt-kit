import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validatePrompt, buildPrompt } from "../src/index.js";

const examples = [
  "tropical-residence.json",
  "interior-apartment.json",
  "landscape-public-plaza.json",
  "product-chair.json"
];

for (const filename of examples) {
  test(`example ${filename} validates and generates prompt text`, async () => {
    const source = await readFile(new URL(`../examples/${filename}`, import.meta.url), "utf8");
    const prompt = JSON.parse(source);
    const result = validatePrompt(prompt);
    assert.equal(result.valid, true, result.errors.join("; "));
    assert.ok(buildPrompt(prompt).length > 80);
  });
}
