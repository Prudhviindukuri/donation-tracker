/**
 * Load .env.local for standalone scripts.
 * Next.js reads .env.local automatically, but `tsx scripts/*` does not.
 */
import { readFileSync } from "fs";
import { join } from "path";

const envPath = join(process.cwd(), ".env.local");

try {
  const contents = readFileSync(envPath, "utf8");

  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^(['"])([\s\S]*)\1$/, "$2");

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
} catch {
  console.warn("Could not read .env.local; relying on existing environment.");
}
