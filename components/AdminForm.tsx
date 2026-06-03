"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { PaymentMode, todayInputDate } from "@/lib/translations";

interface AdminFormProps {
  onSuccess: () => void;
}

const inputClassName =
  "w-full rounded-lg border border-card-border bg-ivory px-4 py-2 text-text outline-none focus:border-saffron";

export default function AdminForm({ onSuccess }: AdminFormProps) {
  const { t, lang } = useLanguage();
  const [name, setName] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [donationDate, setDonationDate] = useState(todayInputDate());
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("CASH");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const labelClass = `mb-1 block text-sm font-medium text-text ${
    lang === "te" ? "font-telugu" : ""
  }`;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const parsedAmount = Number(amount);

    if (!trimmedName) {
      setError(t("nameRequired"));
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError(t("amountRequired"));
      return;
    }

    if (!donationDate) {
      setError(t("dateRequired"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          aliasName: aliasName.trim(),
          fatherName: fatherName.trim(),
          notes: notes.trim(),
          amount: parsedAmount,
          donationDate,
          paymentMode,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add donation");
      }

      setName("");
      setAliasName("");
      setFatherName("");
      setNotes("");
      setAmount("");
      setDonationDate(todayInputDate());
      setPaymentMode("CASH");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2
        className={`text-xl font-semibold text-text ${
          lang === "te" ? "font-telugu" : "font-heading"
        }`}
      >
        {t("addDonation")}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="donor-name" className={labelClass}>
            {t("donorName")}
          </label>
          <input
            id="donor-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="alias-name" className={labelClass}>
            {t("aliasName")}
          </label>
          <input
            id="alias-name"
            type="text"
            value={aliasName}
            onChange={(e) => setAliasName(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="father-name" className={labelClass}>
            {t("fatherName")}
          </label>
          <input
            id="father-name"
            type="text"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="donation-notes" className={labelClass}>
          {t("notes")}
        </label>
        <textarea
          id="donation-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("notesPlaceholder")}
          className={inputClassName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="donor-amount" className={labelClass}>
            {t("amount")} (₹)
          </label>
          <input
            id="donor-amount"
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="donation-date" className={labelClass}>
            {t("date")}
          </label>
          <input
            id="donation-date"
            type="date"
            value={donationDate}
            onChange={(e) => setDonationDate(e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="payment-mode" className={labelClass}>
            {t("paymentMode")}
          </label>
          <select
            id="payment-mode"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
            className={inputClassName}
          >
            <option value="CASH">{t("cash")}</option>
            <option value="ONLINE">{t("online")}</option>
          </select>
        </div>
      </div>

      {error && (
        <p className={`text-sm text-red-700 ${lang === "te" ? "font-telugu" : ""}`}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`rounded-lg bg-saffron px-6 py-2.5 font-medium text-white transition-colors hover:bg-saffron/90 disabled:cursor-not-allowed disabled:opacity-60 ${
          lang === "te" ? "font-telugu" : ""
        }`}
      >
        {t("addDonation")}
      </button>
    </form>
  );
}
