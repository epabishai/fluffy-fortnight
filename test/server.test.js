const test = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");
const fs = require("node:fs");
const path = require("node:path");
const app = require("../server");

test("the offline demo serves entries and only the committed fixture", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;

  const page = await fetch(base);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Changelog Radar/);

  const response = await fetch(`${base}/api/entries`);
  assert.equal(response.status, 200);
  const { entries, tags } = await response.json();
  assert.equal(entries.length, 17);
  assert.equal(entries[0].title, "GitHub Copilot code review is generally available");
  assert.ok(tags.includes("retired"));

  const filtered = await fetch(`${base}/api/entries?tag=retired`);
  const filteredBody = await filtered.json();
  assert.equal(filtered.status, 200);
  assert.equal(filteredBody.entries.length, 2);
  assert.ok(filteredBody.entries.every((entry) => entry.tags.includes("retired")));
  assert.deepEqual(filteredBody.tags, tags);

  const fixture = await fetch(`${base}/fixtures/feed.xml`);
  assert.equal(fixture.status, 200);
  assert.equal(
    await fixture.text(),
    fs.readFileSync(path.join(__dirname, "..", "fixtures", "feed.xml"), "utf8"),
  );

  for (const route of ["/fixtures/unknown.xml", "/fixtures/..%2fpackage.json", "/fixtures/package.json"]) {
    const denied = await fetch(`${base}${route}`);
    assert.equal(denied.status, 404, route);
  }
});
