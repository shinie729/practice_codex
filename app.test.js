import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_TAGS,
  formatDate,
  formatTime,
  getTagValidationMessage,
  isDuplicateTag,
  normalizeTag,
} from "./app.js";

test("formats a readable date and time", () => {
  const date = new Date("2026-08-18T14:05:09Z");
  assert.equal(formatDate(date, "en-US"), "Tuesday, August 18, 2026");
  assert.match(formatTime(date, "en-US"), /2:05:09 PM|14:05:09/);
});

test("normalizes tag whitespace", () => {
  assert.equal(normalizeTag("  deep   work  "), "deep work");
});

test("finds duplicate tags without case sensitivity", () => {
  assert.equal(isDuplicateTag(["Focused"], "focused"), true);
  assert.equal(isDuplicateTag(["Focused"], "rested"), false);
});

test("requires a tag with at least 10 normalized characters", () => {
  assert.equal(getTagValidationMessage("   "), "Enter a tag.");
  assert.equal(
    getTagValidationMessage("  too   short  "),
    "Tags must be at least 10 characters long.",
  );
  assert.equal(getTagValidationMessage("deep focus"), "");
});

test("provides default tags that satisfy tag validation", () => {
  assert.ok(DEFAULT_TAGS.length > 0);
  DEFAULT_TAGS.forEach((tag) => {
    assert.equal(getTagValidationMessage(tag), "");
  });
});
