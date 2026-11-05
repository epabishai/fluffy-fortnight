const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");

const root = path.join(__dirname, "..");
const script = path.join(root, "scripts", "seed-issues.sh");

function preview(args) {
  return spawnSync("/bin/bash", [script, ...args], {
    cwd: os.tmpdir(),
    env: { ...process.env, PATH: "" },
    encoding: "utf8",
  });
}

test("issue preview works offline outside the checkout and matches the walkthrough", () => {
  const result = preview(["--dry-run"]);
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, "");

  const issues = result.stdout.trim().split("\n\n");
  const walkthrough = fs.readFileSync(path.join(root, "demo", "demo.md"), "utf8");
  const expected = [...walkthrough.matchAll(/^\| \d+ \| ([^|]+) \| ([^|]+) \|/gm)]
    .map((match) => `[${match[2].trim()}] ${match[1].trim()}`);

  assert.equal(expected.length, 11);
  assert.deepEqual(issues.map((issue) => issue.split("\n")[0]), expected);
  assert.ok(issues.every((issue) => issue.split("\n")[1]?.trim()));
  assert.match(issues[1], /already uses a fixed reference date/);
  assert.doesNotMatch(result.stdout, /planted freshness failure|uses the wall clock against/);
});

test("invalid issue-seeding arguments are rejected before accessing GitHub", () => {
  for (const args of [["--unknown"], ["--dry-run", "extra"]]) {
    const result = preview(args);
    assert.ifError(result.error);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, "");
    assert.match(result.stderr, /Usage: .* \[--dry-run\]/);
  }
});
