function filterEntries(entries, tag) {
  if (!Array.isArray(entries)) {
    return [];
  }

  const selectedTag = typeof tag === "string" ? tag.trim().toLowerCase() : "";
  if (!selectedTag) {
    return entries;
  }

  return entries.filter((entry) =>
    Array.isArray(entry.tags)
    && entry.tags.some((entryTag) =>
      typeof entryTag === "string" && entryTag.trim().toLowerCase() === selectedTag));
}

module.exports = { filterEntries };
