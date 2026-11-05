#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildPrompt, formatPromptJson, validatePrompt } from "../src/index.js";

const HELP = `Architectural Prompt Kit

Usage:
  apk <file.json> [--check|--prompt|--format]
  node bin/apk.js <file.json> [--check|--prompt|--format]

Options:
  --check   Validate the prompt file (default)
  --prompt  Validate and print assembled prompt text
  --format  Validate and print normalized, pretty JSON
  --help    Show this help message

Examples:
  apk examples/tropical-residence.json
  apk examples/tropical-residence.json --prompt
`;

function fail(message) {
  console.error(`Error: ${message}`);
  process.exitCode = 1;
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.length === 0) {
  console.log(HELP);
} else {
  const file = args.find((arg) => !arg.startsWith("--"));
  const mode = args.find((arg) => arg.startsWith("--")) ?? "--check";
  if (!file) {
    fail("Provide a JSON file path.");
  } else if (![ "--check", "--prompt", "--format" ].includes(mode)) {
    fail(`Unknown option: ${mode}`);
  } else {
    try {
      const source = await readFile(resolve(process.cwd(), file), "utf8");
      let prompt;
      try {
        prompt = JSON.parse(source);
      } catch (error) {
        throw new Error(`Invalid JSON: ${error.message}`);
      }

      const result = validatePrompt(prompt);
      if (!result.valid) {
        for (const error of result.errors) console.error(`✗ ${error}`);
        process.exitCode = 1;
      } else if (mode === "--prompt") {
        console.log(buildPrompt(prompt));
      } else if (mode === "--format") {
        console.log(formatPromptJson(prompt));
      } else {
        console.log(`✓ ${file} is a valid Architectural Prompt Kit document.`);
        for (const warning of result.warnings) console.warn(`Warning: ${warning}`);
      }
    } catch (error) {
      fail(error.message);
    }
  }
}
