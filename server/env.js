// Minimal zero-dependency .env loader so a local (gitignored) .env supplies keys.
// Imported first by index.js + setup-persona.js. Existing process.env wins.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const f of [".env", "server/.env"]) {
  try {
    for (const line of fs.readFileSync(path.join(root, f), "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch (_) { /* no .env — fine */ }
}
