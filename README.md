# Architectural Prompt Kit

[![Tests](https://github.com/kowshikprasad/architectural-prompt-kit/actions/workflows/prompt-kit.yml/badge.svg)](https://github.com/kowshikprasad/architectural-prompt-kit/actions/workflows/prompt-kit.yml)

A dependency-free JavaScript toolkit for validating structured architectural visualization prompts and assembling them into readable prompt text.

Maintained by AI 3D Renderlab as an independent open-source developer utility.

## Why it exists

Architectural visualization prompts combine design intent, camera direction, materials, lighting, context, and preservation constraints. This project gives those inputs a versioned JSON structure so they can be validated, reused, and converted into consistent prompt text.

## Capabilities

- Validate prompt fields, types, and supported enumerations.
- Check camera focal length and common camera-shot labels.
- Assemble structured fields into readable prompt text.
- Format valid prompt data as JSON.
- Provide a JSON Schema for editor and form integrations.
- Validate, format, or generate prompt text from the command line.
- Include reusable exterior, interior, landscape, and product examples.
- Run tests using Node.js' built-in test runner; no runtime dependencies.

## Requirements

Node.js 20 or newer.

## Quick start

Clone the repository and run:

```bash
npm test
npm run check:example
```

The CLI can validate a JSON file, print its assembled prompt, or format the JSON:

```bash
node bin/apk.js examples/tropical-residence.json
node bin/apk.js examples/tropical-residence.json --prompt
node bin/apk.js examples/tropical-residence.json --format
```

After installing the package globally or linking it locally, the executable is available as `apk`.

## JavaScript API

```js
import {
  validatePrompt,
  buildPrompt,
  formatPromptJson
} from "@ai3drenderlab/architectural-prompt-kit";

const prompt = {
  schemaVersion: "1.0",
  projectType: "exterior",
  subject: "a contemporary courtyard house",
  camera: {
    shotType: "wide",
    focalLengthMm: 28,
    angle: "eye-level view"
  },
  materials: ["board-formed concrete", "timber", "glass"],
  lighting: {
    type: "natural",
    timeOfDay: "late afternoon"
  },
  constraints: "preserve the supplied building geometry and openings"
};

const validation = validatePrompt(prompt);
if (!validation.valid) {
  console.error(validation.errors);
} else {
  console.log(buildPrompt(prompt));
  console.log(formatPromptJson(prompt));
}
```

## Prompt data format

| Field | Type | Required | Notes |
|---|---|---:|---|
| `schemaVersion` | string | Yes | Currently `1.0` |
| `projectType` | string | Yes | exterior, interior, landscape, product, architectural-diagram |
| `subject` | string | Yes | The design or scene being visualized |
| `camera` | object | No | shotType, focalLengthMm, angle |
| `materials` | string[] | No | Material and finish references |
| `lighting` | object | No | type, timeOfDay, direction, quality |
| `environment` | string | No | Site and contextual description |
| `style` | string | No | Intended visual language |
| `constraints` | string | No | Geometry, camera, or design elements to preserve |

The canonical machine-readable definition is [schema/prompt.schema.json](schema/prompt.schema.json). The JavaScript validator provides actionable error messages and warnings; keep the schema and validator aligned when changing the prompt format.

Validation returns `{ valid, errors, warnings }`. Prompt generation throws a `TypeError` when required data is invalid.

## Example library

The `examples/` directory contains complete, validated prompt documents:

- [Tropical residence](examples/tropical-residence.json) — exterior architecture
- [Contemporary apartment](examples/interior-apartment.json) — interior visualization
- [Public plaza](examples/landscape-public-plaza.json) — landscape architecture
- [Timber lounge chair](examples/product-chair.json) — product visualization

Use these as starting points and adapt the subject, camera, materials, lighting, and preservation constraints to your project.

## Design limitations

This toolkit does not generate images, call an AI model, guarantee photorealism, or determine whether a prompt will work with a particular image-generation provider. It structures and validates user-authored prompt information. Provider-specific adapters may be added in future releases.

## Roadmap

- [x] Versioned JSON prompt structure (v1.0)
- [x] Validation and prompt assembly
- [x] Unit tests and continuous integration
- [x] JSON Schema
- [x] Basic CLI
- [x] Exterior, interior, landscape, and product examples
- [ ] Provider-neutral prompt export profiles
- [ ] Community-contributed examples and adapters

Roadmap items are planned, not currently implemented.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md), open an issue for larger changes, and include tests for new validation behavior. Changes to the prompt format should update the JavaScript validator, JSON Schema, tests, and documentation together.

## License

MIT. See [LICENSE](LICENSE).
