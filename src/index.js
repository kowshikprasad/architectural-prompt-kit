const PROJECT_TYPES = new Set(["exterior","interior","landscape","product","architectural-diagram"]);
const CAMERA_SHOTS = new Set(["wide","medium","close-up","aerial","eye-level","low-angle","high-angle","isometric","orthographic"]);
const LIGHTING_TYPES = new Set(["natural","studio","mixed","artificial"]);
const PRESERVATION_FLAGS = ["geometry","siteLayout","vegetation","roadsAndCirculation","facadeOpenings","cameraComposition","noUnrequestedAdditions"];
function isRecord(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
function nonEmptyString(value) { return typeof value === "string" && value.trim().length > 0; }

/** Validate a structured architectural visualization prompt without mutating it. */
export function validatePrompt(prompt) {
  const errors = [], warnings = [];
  if (!isRecord(prompt)) return { valid:false, errors:["Prompt must be a JSON object."], warnings };
  if (prompt.schemaVersion !== "1.0") errors.push('schemaVersion must be "1.0".');
  if (!PROJECT_TYPES.has(prompt.projectType)) errors.push(`projectType must be one of: ${[...PROJECT_TYPES].join(", ")}.`);
  if (!nonEmptyString(prompt.subject)) errors.push("subject must be a non-empty string.");
  if (prompt.camera !== undefined) {
    if (!isRecord(prompt.camera)) errors.push("camera must be an object.");
    else {
      if (prompt.camera.shotType !== undefined && !CAMERA_SHOTS.has(prompt.camera.shotType)) errors.push(`camera.shotType must be one of: ${[...CAMERA_SHOTS].join(", ")}.`);
      if (prompt.camera.focalLengthMm !== undefined && (!Number.isFinite(prompt.camera.focalLengthMm) || prompt.camera.focalLengthMm <= 0 || prompt.camera.focalLengthMm > 300)) errors.push("camera.focalLengthMm must be a number greater than 0 and no more than 300.");
      if (prompt.camera.angle !== undefined && !nonEmptyString(prompt.camera.angle)) errors.push("camera.angle must be a non-empty string when provided.");
    }
  }
  if (prompt.materials !== undefined && (!Array.isArray(prompt.materials) || !prompt.materials.every(nonEmptyString))) errors.push("materials must be an array of non-empty strings.");
  if (prompt.lighting !== undefined) {
    if (!isRecord(prompt.lighting)) errors.push("lighting must be an object.");
    else {
      if (prompt.lighting.type !== undefined && !LIGHTING_TYPES.has(prompt.lighting.type)) errors.push(`lighting.type must be one of: ${[...LIGHTING_TYPES].join(", ")}.`);
      for (const key of ["timeOfDay","direction","quality"]) if (prompt.lighting[key] !== undefined && !nonEmptyString(prompt.lighting[key])) errors.push(`lighting.${key} must be a non-empty string when provided.`);
    }
  }
  for (const key of ["environment","style","constraints"]) if (prompt[key] !== undefined && !nonEmptyString(prompt[key])) errors.push(`${key} must be a non-empty string when provided.`);
  if (prompt.preservation !== undefined) {
    if (!isRecord(prompt.preservation)) errors.push("preservation must be an object.");
    else for (const key of PRESERVATION_FLAGS) if (prompt.preservation[key] !== undefined && typeof prompt.preservation[key] !== "boolean") errors.push(`preservation.${key} must be a boolean.`);
  }
  if (!prompt.camera) warnings.push("No camera specification supplied; camera language will be omitted.");
  if (!prompt.lighting) warnings.push("No lighting specification supplied; lighting language will be omitted.");
  if (!prompt.materials?.length) warnings.push("No material references supplied.");
  return { valid:errors.length===0, errors, warnings };
}

/** Assemble validated prompt data; preservation flags become explicit negative constraints. */
export function buildPrompt(prompt, options = {}) {
  const result = validatePrompt(prompt);
  if (!result.valid) throw new TypeError(`Invalid architectural prompt: ${result.errors.join(" ")}`);
  const sections = [`Create an architectural visualization of ${prompt.subject.trim()}.`, `Project type: ${prompt.projectType}.`];
  if (prompt.camera) {
    const camera=[];
    if(prompt.camera.shotType) camera.push(`${prompt.camera.shotType} shot`);
    if(prompt.camera.focalLengthMm) camera.push(`${prompt.camera.focalLengthMm}mm lens`);
    if(prompt.camera.angle) camera.push(prompt.camera.angle);
    if(camera.length) sections.push(`Camera: ${camera.join(", ")}.`);
  }
  if(prompt.materials?.length) sections.push(`Materials and finishes: ${prompt.materials.join(", ")}.`);
  if(prompt.lighting) {
    const lighting=[prompt.lighting.type,prompt.lighting.timeOfDay,prompt.lighting.direction,prompt.lighting.quality].filter(Boolean);
    if(lighting.length) sections.push(`Lighting: ${lighting.join(", ")}.`);
  }
  if(prompt.environment) sections.push(`Environment: ${prompt.environment.trim()}.`);
  if(prompt.style) sections.push(`Visual direction: ${prompt.style.trim()}.`);
  if(prompt.constraints) sections.push(`Preserve these constraints: ${prompt.constraints.trim()}.`);
  if(prompt.preservation) {
    const labels={geometry:"building and object geometry",siteLayout:"site boundaries and spatial layout",vegetation:"existing vegetation and planting",roadsAndCirculation:"roads, paths and circulation",facadeOpenings:"facade details, doors and window openings",cameraComposition:"the original camera viewpoint and composition",noUnrequestedAdditions:"all existing scene content without adding unrequested objects"};
    const active=PRESERVATION_FLAGS.filter(key=>prompt.preservation[key]===true).map(key=>labels[key]);
    if(active.length) sections.push(`Strict preservation requirements: retain ${active.join("; ")}. Do not redesign, relocate, remove, reinterpret or alter these elements.`);
  }
  const format = options.format ?? "paragraph";
  if (!["paragraph", "sectioned", "compact"].includes(format)) {
    throw new RangeError('format must be "paragraph", "sectioned", or "compact".');
  }
  if (format === "sectioned") return sections.join("\\n\\n");
  if (format === "compact") return sections.join(" ").replace(/\\s+/g, " ").trim();
  return sections.join(" ");
}

/** Return formatted JSON after successful validation. */
export function formatPromptJson(prompt) {
  const result=validatePrompt(prompt);
  if(!result.valid) throw new TypeError(`Invalid architectural prompt: ${result.errors.join(" ")}`);
  return JSON.stringify(prompt,null,2);
}
