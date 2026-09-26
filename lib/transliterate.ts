import { v3 } from "@google-cloud/translate";
import { DonationPayload } from "@/lib/donation";
import { PaymentMode } from "@/lib/translations";

const TELUGU_SCRIPT = /[\u0C00-\u0C7F]/;

let translationClient: v3.TranslationServiceClient | null = null;

function getTranslationClient(): v3.TranslationServiceClient | null {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID?.trim();
  if (!projectId) {
    console.error("GOOGLE_CLOUD_PROJECT_ID is not set");
    return null;
  }

  if (!translationClient) {
    const serviceAccountJson =
      process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_JSON?.trim();

    translationClient = new v3.TranslationServiceClient(
      serviceAccountJson
        ? {
            credentials: JSON.parse(serviceAccountJson) as object,
            projectId,
          }
        : { projectId }
    );
  }

  return translationClient;
}

function isTeluguScript(text: string): boolean {
  return TELUGU_SCRIPT.test(text);
}

function normalizeRomanInput(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/([A-Za-z])\.(?=[A-Za-z])/g, "$1. ");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Cloud Translation's transliterationConfig only maps romanized text into a
 * *different* language, so it rejects en -> te. Plain en -> te translation is
 * what renders names in Telugu script ("D. Ranga raju" -> "డి. రంగ రాజు").
 */
async function googleCloudTransliterate(text: string): Promise<string | null> {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID?.trim();
  const client = getTranslationClient();
  if (!projectId || !client) return null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const [response] = await client.translateText({
        parent: `projects/${projectId}/locations/global`,
        contents: [text],
        mimeType: "text/plain",
        sourceLanguageCode: "en",
        targetLanguageCode: "te",
      });

      const translated = response.translations?.[0]?.translatedText?.trim();
      return translated || null;
    } catch (error) {
      if (attempt === 2) {
        console.error("Google Cloud transliteration failed:", error);
        return null;
      }
      await sleep(400 * (attempt + 1));
    }
  }

  return null;
}

/** Roman/English → Telugu via Google Cloud Translation API (transliteration) */
export async function toTelugu(text: string): Promise<string> {
  const normalized = normalizeRomanInput(text);
  if (!normalized) return "";

  if (isTeluguScript(normalized)) {
    return normalized;
  }

  const result = await googleCloudTransliterate(normalized);
  if (result && isTeluguScript(result)) {
    return result;
  }

  return "";
}

export type PrismaDonationData = {
  name: string;
  nameTe: string;
  aliasName: string;
  aliasNameTe: string;
  fatherName: string;
  fatherNameTe: string;
  notes: string;
  amount: number;
  donationDate: Date;
  paymentMode: PaymentMode;
};

export async function buildDonationData(
  payload: DonationPayload
): Promise<PrismaDonationData> {
  const [autoNameTe, autoAliasNameTe, autoFatherNameTe] = await Promise.all([
    toTelugu(payload.name),
    toTelugu(payload.aliasName),
    toTelugu(payload.fatherName),
  ]);

  return {
    name: payload.name,
    nameTe: autoNameTe || payload.nameTe || "",
    aliasName: payload.aliasName,
    aliasNameTe: autoAliasNameTe || payload.aliasNameTe || "",
    fatherName: payload.fatherName,
    fatherNameTe: autoFatherNameTe || payload.fatherNameTe || "",
    notes: payload.notes,
    amount: payload.amount,
    donationDate: payload.donationDate,
    paymentMode: payload.paymentMode,
  };
}

/** @deprecated Use buildDonationData */
export async function withTeluguNames(payload: DonationPayload) {
  return buildDonationData(payload);
}
