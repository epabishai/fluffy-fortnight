const test = require("node:test");
const assert = require("node:assert/strict");
const { filterEntries } = require("../src/lib/tagFilter");

const entries = [
  { title: "First", tags: ["Security", "Repositories"] },
  { title: "Second", tags: ["GitHub Actions"] },
  { title: "Third", tags: [] },
];

test("returns all entries when no topic is selected", () => {
  assert.deepEqual(filterEntries(entries, ""), entries);
});

test("matches tags without regard to surrounding whitespace or case", () => {
  assert.deepEqual(filterEntries(entries, " security "), [entries[0]]);
});

test("returns no entries when a topic does not match", () => {
  assert.deepEqual(filterEntries(entries, "Projects"), []);
});

test("returns an empty list for invalid input", () => {
  assert.deepEqual(filterEntries(null, "Security"), []);
});
