# Architectural Prompt Kit

[![Tests](https://github.com/kowshikprasad/architectural-prompt-kit/actions/workflows/prompt-kit.yml/badge.svg)](https://github.com/kowshikprasad/architectural-prompt-kit/actions/workflows/prompt-kit.yml)

A small, dependency-free JavaScript toolkit for validating structured architectural visualization prompts and assembling them into readable prompt text.

Maintained by AI 3D Renderlab as an independent open-source developer utility.

## Why it exists

Architectural image-generation prompts often mix design intent, camera direction, material specifications, lighting, context, and preservation constraints in one unstructured paragraph. This toolkit gives those inputs a predictable JSON structure so they can be checked, reused, and converted into prompt text.

## Current capabilities

- Validate required prompt fields and supported enumerations.
- Check camera focal length and common camera-shot labels.
- Validate material lists and lighting descriptions.
- Assemble structured fields into a readable prompt.
- Format valid prompt data as JSON.
- Run tests using Node.js built-in test runner; no runtime dependencies.

## Requirements

- Node.js 20 or newer.

## Install / use locally

Clone this repository and run:

```bash
npm test
```

Import the functions into a JavaScript project:

```js
import {
  validatePrompt,
  buildPrompt,
  formatPromptJson
} from "./src/index.js";

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

A complete example is available in [examples/tropical-residence.json](examples/tropical-residence.json).

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

Validation returns errors and non-blocking warnings. Prompt generation throws a `TypeError` when required data is invalid.

## Design limitations

This toolkit does not generate images, call an AI model, guarantee photorealism, or determine whether a prompt will work with a particular image-generation provider. It structures and validates user-authored prompt information. Provider-specific adapters may be added in future releases.

## Roadmap

- [x] Versioned JSON prompt structure (v1.0)
- [x] Validation and prompt assembly
- [x] Unit tests and continuous integration
- [ ] JSON Schema published for editor integrations
- [ ] Provider-neutral prompt export profiles
- [ ] CLI for validating prompt files
- [ ] Community-contributed examples and adapters

Roadmap items are planned, not currently implemented.

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md), open an issue for larger changes, and include tests for new validation behavior.

## License

MIT. See [LICENSE](LICENSE).
