"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface AdminFormProps {
  onSuccess: () => void;
}

export default function AdminForm({ onSuccess }: AdminFormProps) {
  const { t, lang } = useLanguage();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const response = await fetch("/api/admin/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, amount: parsedAmount }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add donation");
      }

      setName("");
      setAmount("");
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

      <div>
        <label
          htmlFor="donor-name"
          className={`mb-1 block text-sm font-medium text-text ${
            lang === "te" ? "font-telugu" : ""
          }`}
        >
          {t("donorName")}
        </label>
        <input
          id="donor-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-card-border bg-ivory px-4 py-2 text-text outline-none focus:border-saffron"
        />
      </div>

      <div>
        <label
          htmlFor="donor-amount"
          className={`mb-1 block text-sm font-medium text-text ${
            lang === "te" ? "font-telugu" : ""
          }`}
        >
          {t("amount")} (₹)
        </label>
        <input
          id="donor-amount"
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-lg border border-card-border bg-ivory px-4 py-2 text-text outline-none focus:border-saffron"
        />
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
