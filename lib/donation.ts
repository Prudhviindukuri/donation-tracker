import { PaymentMode } from "@/lib/translations";

export interface DonationPayload {
  name: string;
  fatherName: string;
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
  const fatherName =
    typeof record.fatherName === "string" ? record.fatherName.trim() : "";
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
    data: { name, fatherName, amount, donationDate, paymentMode },
  };
}

export function toInputDate(date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toISOString().slice(0, 10);
}
