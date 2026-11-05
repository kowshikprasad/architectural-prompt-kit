import test from "node:test";
import assert from "node:assert/strict";
import { buildPrompt, validatePrompt } from "../src/index.js";

const base = { schemaVersion:"1.0", projectType:"exterior", subject:"a contemporary courtyard house" };

test("accepts explicit preservation controls", () => {
  const result=validatePrompt({...base,preservation:{geometry:true,vegetation:true,cameraComposition:true}});
  assert.equal(result.valid,true);
});

test("rejects non-boolean preservation controls", () => {
  const result=validatePrompt({...base,preservation:{geometry:"yes"}});
  assert.equal(result.valid,false);
  assert.ok(result.errors.some(error=>error.includes("preservation.geometry")));
});

test("turns enabled preservation controls into clear prompt instructions", () => {
  const output=buildPrompt({...base,preservation:{geometry:true,siteLayout:true,vegetation:true,roadsAndCirculation:true,facadeOpenings:true,cameraComposition:true,noUnrequestedAdditions:true}});
  for (const phrase of ["building and object geometry","site boundaries and spatial layout","existing vegetation and planting","roads, paths and circulation","doors and window openings","original camera viewpoint and composition","without adding unrequested objects"]) assert.ok(output.includes(phrase),phrase);
  assert.match(output,/Do not redesign, relocate, remove, reinterpret or alter/);
});

test("omits preservation language when all controls are false", () => {
  const output=buildPrompt({...base,preservation:{geometry:false}});
  assert.doesNotMatch(output,/Strict preservation requirements/);
});
