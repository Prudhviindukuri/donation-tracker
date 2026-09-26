/**
 * Verify Google Cloud transliteration credentials and output quality.
 * Run: npx tsx scripts/test-transliterate.ts
 */
import "./load-env";
import { toTelugu } from "../lib/transliterate";

const samples = [
  "Ranga raju",
  "D. Ranga raju",
  "D.V. Subba raju",
  "Dasari Ranga Raju",
  "Lakshmi Devi",
];

async function main() {
  if (!process.env.GOOGLE_CLOUD_PROJECT_ID?.trim()) {
    console.error("GOOGLE_CLOUD_PROJECT_ID is missing from .env.local");
    process.exit(1);
  }

  console.log(`Project: ${process.env.GOOGLE_CLOUD_PROJECT_ID}\n`);

  let failures = 0;

  for (const sample of samples) {
    const telugu = await toTelugu(sample);

    if (telugu) {
      console.log(`${sample.padEnd(20)} -> ${telugu}`);
    } else {
      failures++;
      console.log(`${sample.padEnd(20)} -> (empty — see error above)`);
    }
  }

  if (failures === samples.length) {
    console.error("\nAll calls failed. Check credentials and that the Cloud Translation API is enabled.");
    process.exit(1);
  }

  console.log("\nTransliteration is working.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
