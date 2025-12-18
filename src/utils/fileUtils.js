export function parseFile(f) {
  if (!f) return { url: "", name: "", storageKey: "" };

  // If already an object
  if (typeof f === "object") {
    const url = f.url || "";
    const storageKey = f.storageKey || (url ? decodeURIComponent(String(url).split('/').pop().split('?')[0]) : "");
    const name = f.name || storageKey || (url ? decodeURIComponent(String(url).split('/').pop()) : "");
    return { url, name, storageKey };
  }

  // If it's a string, maybe it's JSON-encoded object
  if (typeof f === "string") {
    const trimmed = f.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const obj = JSON.parse(trimmed);
        return parseFile(obj);
      } catch (e) {
        // fallthrough to treat as URL
      }
    }

    // treat as URL
    const url = f;
    const storageKey = decodeURIComponent(String(url).split('/').pop().split('?')[0]);
    const name = storageKey;
    return { url, name, storageKey };
  }

  return { url: "", name: "", storageKey: "" };
}

export function getFileNameFromUrlOrObject(f) {
  return parseFile(f).name;
}

export default {
  parseFile,
  getFileNameFromUrlOrObject,
};
