import test from "node:test";
import assert from "node:assert/strict";
import { buildPrompt } from "../src/index.js";

const prompt={schemaVersion:"1.0",projectType:"interior",subject:"a calm apartment",camera:{shotType:"wide",focalLengthMm:24,angle:"eye-level view"},materials:["oak","travertine"],lighting:{type:"natural",timeOfDay:"morning"}};

test("paragraph remains the default export profile",()=>assert.equal(buildPrompt(prompt),buildPrompt(prompt,{format:"paragraph"})));
test("sectioned profile separates prompt components",()=>assert.match(buildPrompt(prompt,{format:"sectioned"}),/\\n\\nCamera:/));
test("compact profile returns a single whitespace-normalized line",()=>assert.doesNotMatch(buildPrompt(prompt,{format:"compact"}),/\\n|  /));
test("unknown export profiles are rejected",()=>assert.throws(()=>buildPrompt(prompt,{format:"provider-x"}),/format must be/));
