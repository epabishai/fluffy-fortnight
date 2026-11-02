const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test("cards assign untrusted titles and summaries as text, never HTML", () => {
  const elements = [];
  function createElement(tagName) {
    const node = {
      tagName,
      children: [],
      textContent: "",
      setAttribute() {},
      append(...children) { this.children.push(...children); },
    };
    Object.defineProperty(node, "innerHTML", {
      set() { assert.fail("Feed content must not be assigned to innerHTML"); },
    });
    elements.push(node);
    return node;
  }

  const source = fs.readFileSync(path.join(__dirname, "..", "public", "app.js"), "utf8");
  const context = vm.createContext({
    document: {
      createElement,
      querySelector() {
        return { value: "", addEventListener() {}, replaceChildren() {} };
      },
    },
    fetch: () => new Promise(() => {}),
  });
  vm.runInContext(source, context);
  const entry = {
    title: "Community note: <strong>render feed titles as text</strong>",
    summary: "<em>This summary must also stay text.</em>",
    pubDate: "Wed, 21 Oct 2026 12:00:00 +0000",
    tags: ["<strong>Community</strong>"],
  };
  const card = context.createCard(entry);
  assert.equal(card.children.find((node) => node.tagName === "h2").textContent, entry.title);
  assert.equal(card.children.find((node) => node.tagName === "p").textContent, entry.summary);
  assert.equal(elements.find((node) => node.tagName === "span").textContent, entry.tags[0]);
  assert.equal(elements.some((node) => ["strong", "em"].includes(node.tagName)), false);
});
