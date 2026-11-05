# Architectural Prompt Kit

[![Tests](https://github.com/kowshikprasad/architectural-prompt-kit/actions/workflows/prompt-kit.yml/badge.svg)](https://github.com/kowshikprasad/architectural-prompt-kit/actions/workflows/prompt-kit.yml)

A dependency-free JavaScript toolkit for validating structured architectural visualization prompts and assembling them into readable prompt text.

Maintained by AI 3D Renderlab as an independent open-source developer utility.

## Capabilities
- Validate prompt fields, types, and supported enumerations.
- Assemble readable prompt text from camera, materials, lighting, context and style.
- Add explicit preservation controls for geometry, site layout, vegetation, roads, facade openings and camera composition.
- Use the JSON Schema, CLI and reusable exterior, interior, landscape and product examples.
- Run tests using Node.js' built-in test runner; no runtime dependencies.

## Requirements
Node.js 20 or newer.

## Quick start
```bash
npm test
npm run check:example
node bin/apk.js examples/tropical-residence.json --prompt
```

## JavaScript API
```js
import { validatePrompt, buildPrompt } from "@ai3drenderlab/architectural-prompt-kit";

const prompt = {
  schemaVersion: "1.0",
  projectType: "exterior",
  subject: "a contemporary courtyard house",
  camera: { shotType: "wide", focalLengthMm: 28, angle: "eye-level three-quarter view" },
  materials: ["board-formed concrete", "timber", "glass"],
  preservation: {
    geometry: true,
    siteLayout: true,
    vegetation: true,
    roadsAndCirculation: true,
    facadeOpenings: true,
    cameraComposition: true,
    noUnrequestedAdditions: true
  }
};

const result = validatePrompt(prompt);
if (!result.valid) throw new Error(result.errors.join("\n"));
console.log(buildPrompt(prompt));
console.log(buildPrompt(prompt, { format: "sectioned" }));
```

### Provider-neutral export formats

`buildPrompt(prompt, { format })` supports three presentation profiles without binding the output to a specific image provider:

- `paragraph` (default): one continuous paragraph, preserving the existing API behaviour.
- `sectioned`: separate camera, materials, lighting and preservation sections with blank lines.
- `compact`: a whitespace-normalized single-line prompt for interfaces with limited space.

Example: `buildPrompt(prompt, { format: "sectioned" })`. Unknown formats throw a `RangeError`.

## Prompt format
Required fields are `schemaVersion` (`1.0`), `projectType` (`exterior`, `interior`, `landscape`, `product`, or `architectural-diagram`) and a non-empty `subject`. Optional fields include `camera`, `materials`, `lighting`, `environment`, `style`, `constraints` and `preservation`.

The canonical JSON Schema is [schema/prompt.schema.json](schema/prompt.schema.json). The preservation object accepts booleans for:
- `geometry`: retain building and object geometry.
- `siteLayout`: retain site boundaries and spatial layout.
- `vegetation`: retain existing trees and planting.
- `roadsAndCirculation`: retain roads, paths and circulation.
- `facadeOpenings`: retain facade details, doors and windows.
- `cameraComposition`: retain original viewpoint and composition.
- `noUnrequestedAdditions`: avoid introducing unrequested scene objects.

These are prompt instructions, not a technical guarantee that an image model will obey them.

## Examples
- [Tropical residence](examples/tropical-residence.json)
- [Contemporary apartment](examples/interior-apartment.json)
- [Public plaza](examples/landscape-public-plaza.json)
- [Timber lounge chair](examples/product-chair.json)

## Limitations
This toolkit does not generate images, call an AI model, guarantee photorealism or guarantee preservation by downstream image-generation systems. It structures and validates user-authored prompt information.

## Development
```bash
npm test
npm run check:example
```
See [CONTRIBUTING.md](CONTRIBUTING.md). MIT licensed.
