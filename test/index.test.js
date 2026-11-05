import test from "node:test";
import assert from "node:assert/strict";
import { buildPrompt, formatPromptJson, validatePrompt } from "../src/index.js";

const validPrompt = {
  schemaVersion: "1.0",
  projectType: "exterior",
  subject: "a two-storey tropical residence",
  camera: {
    shotType: "wide",
    focalLengthMm: 28,
    angle: "eye-level three-quarter view"
  },
  materials: ["exposed concrete", "teak timber", "clear low-iron glass"],
  lighting: {
    type: "natural",
    timeOfDay: "late afternoon",
    direction: "soft side light",
    quality: "diffused"
  },
  environment: "a planted tropical residential site",
  style: "restrained editorial architectural photography",
  constraints: "preserve the supplied building massing and opening positions"
};

test("accepts a valid structured prompt", () => {
  assert.equal(validatePrompt(validPrompt).valid, true);
});

test("reports missing and invalid required fields", () => {
  const result = validatePrompt({ schemaVersion: "2", projectType: "unknown", subject: " " });
  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 2);
});

test("rejects invalid focal lengths", () => {
  const result = validatePrompt({
    ...validPrompt,
    camera: { focalLengthMm: 0 }
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("focalLengthMm")));
});

test("builds a prompt from supplied fields without changing the input", () => {
  const original = structuredClone(validPrompt);
  const output = buildPrompt(validPrompt);
  assert.match(output, /two-storey tropical residence/);
  assert.match(output, /28mm lens/);
  assert.match(output, /preserve the supplied building massing/);
  assert.deepEqual(validPrompt, original);
});

test("formats validated JSON", () => {
  const output = formatPromptJson(validPrompt);
  assert.match(output, /"projectType": "exterior"/);
  assert.throws(() => formatPromptJson({}), /Invalid architectural prompt/);
});
