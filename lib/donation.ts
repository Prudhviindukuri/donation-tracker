import { PaymentMode, Language } from "@/lib/translations";

export interface DonationPayload {
  name: string;
  aliasName: string;
  fatherName: string;
  notes: string;
  amount: number;
  donationDate: Date;
  paymentMode: PaymentMode;
}

export function parsePaymentMode(value: unknown): PaymentMode | null {
  if (value === "CASH" || value === "ONLINE") return value;
  return null;
}

export function parseDonationPayload(
  body: unknown
): { data: DonationPayload } | { error: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body" };
  }

  const record = body as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const aliasName =
    typeof record.aliasName === "string" ? record.aliasName.trim() : "";
  const fatherName =
    typeof record.fatherName === "string" ? record.fatherName.trim() : "";
  const notes = typeof record.notes === "string" ? record.notes.trim() : "";
  const amount = Number(record.amount);
  const donationDateRaw =
    typeof record.donationDate === "string" ? record.donationDate.trim() : "";
  const paymentMode = parsePaymentMode(record.paymentMode);

  if (!name) {
    return { error: "Donor name is required" };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Amount must be greater than 0" };
  }

  if (!donationDateRaw) {
    return { error: "Date is required" };
  }

  const donationDate = new Date(`${donationDateRaw}T12:00:00.000Z`);
  if (Number.isNaN(donationDate.getTime())) {
    return { error: "Invalid date" };
  }

  if (!paymentMode) {
    return { error: "Payment mode is required" };
  }

  return {
    data: {
      name,
      aliasName,
      fatherName,
      notes,
      amount,
      donationDate,
      paymentMode,
    },
  };
}

export function toInputDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toISOString().slice(0, 10);
}

export function localizedField(
  en: string,
  te: string,
  lang: Language
): string {
  if (lang === "te" && te.trim()) return te.trim();
  return en.trim();
}

export function getLocalizedDonorName(
  donation: { name: string; nameTe: string },
  lang: Language
): string {
  return localizedField(donation.name, donation.nameTe, lang);
}

export function getLocalizedFatherName(
  donation: { fatherName: string; fatherNameTe: string },
  lang: Language
): string {
  return localizedField(donation.fatherName, donation.fatherNameTe, lang);
}

/** Public-facing alias: localized alias when set, otherwise em dash */
export function getPublicAliasDisplay(
  donation: { aliasName: string; aliasNameTe: string },
  lang: Language
): string {
  const localized = localizedField(donation.aliasName, donation.aliasNameTe, lang);
  return localized || "—";
}

export function donationMatchesSearch(
  donation: {
    name: string;
    nameTe: string;
    aliasName: string;
    aliasNameTe: string;
    fatherName: string;
    fatherNameTe: string;
  },
  query: string
): boolean {
  if (!query) return true;

  const haystack = [
    donation.name,
    donation.nameTe,
    donation.aliasName,
    donation.aliasNameTe,
    donation.fatherName,
    donation.fatherNameTe,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}
