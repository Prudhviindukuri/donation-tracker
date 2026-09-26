"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAdminLanguage } from "@/components/AdminLanguageProvider";
import { toInputDate } from "@/lib/donation";
import { fetchTeluguPreview } from "@/lib/fetch-telugu-preview";
import { AdminDonation, PaymentMode } from "@/lib/translations";

interface AdminEditModalProps {
  donation: AdminDonation;
  onClose: () => void;
  onSuccess: () => void;
}

const inputClassName =
  "w-full rounded-lg border border-card-border bg-ivory px-4 py-2 text-text outline-none focus:border-saffron";

export default function AdminEditModal({
  donation,
  onClose,
  onSuccess,
}: AdminEditModalProps) {
  const { t, lang } = useAdminLanguage();
  const [name, setName] = useState(donation.name);
  const [nameTe, setNameTe] = useState(donation.nameTe);
  const [aliasName, setAliasName] = useState(donation.aliasName);
  const [aliasNameTe, setAliasNameTe] = useState(donation.aliasNameTe);
  const [fatherName, setFatherName] = useState(donation.fatherName);
  const [fatherNameTe, setFatherNameTe] = useState(donation.fatherNameTe);
  const [notes, setNotes] = useState(donation.notes);
  const [amount, setAmount] = useState(String(donation.amount));
  const [donationDate, setDonationDate] = useState(
    toInputDate(donation.donationDate)
  );
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(
    donation.paymentMode
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fillTeluguPreview = async (
    english: string,
    setter: (value: string) => void
  ) => {
    const preview = await fetchTeluguPreview(english);
    if (preview) setter(preview);
  };

  useEffect(() => {
    setName(donation.name);
    setNameTe(donation.nameTe);
    setAliasName(donation.aliasName);
    setAliasNameTe(donation.aliasNameTe);
    setFatherName(donation.fatherName);
    setFatherNameTe(donation.fatherNameTe);
    setNotes(donation.notes);
    setAmount(String(donation.amount));
    setDonationDate(toInputDate(donation.donationDate));
    setPaymentMode(donation.paymentMode);
    setError("");
  }, [donation]);

  useEffect(() => {
    void fillTeluguPreview(donation.name, setNameTe);
    if (donation.aliasName) void fillTeluguPreview(donation.aliasName, setAliasNameTe);
    if (donation.fatherName) void fillTeluguPreview(donation.fatherName, setFatherNameTe);
  }, [donation]);

  const labelClass = `mb-1 block text-sm font-medium text-text ${
    lang === "te" ? "font-telugu" : ""
  }`;

  const teluguInputClass = `${inputClassName} font-telugu`;

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
      const response = await fetch("/api/admin/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: donation.id,
          name: trimmedName,
          nameTe: nameTe.trim(),
          aliasName: aliasName.trim(),
          aliasNameTe: aliasNameTe.trim(),
          fatherName: fatherName.trim(),
          fatherNameTe: fatherNameTe.trim(),
          notes: notes.trim(),
          amount: parsedAmount,
          donationDate,
          paymentMode,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("updateFailed"));
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("updateFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          className={`mb-4 text-xl font-semibold text-text ${
            lang === "te" ? "font-telugu" : "font-heading"
          }`}
        >
          {t("editDonation")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className={`text-xs text-text/60 ${lang === "te" ? "font-telugu" : ""}`}>
            {t("teluguHint")}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-donor-name" className={labelClass}>
                {t("donorName")}
              </label>
              <input
                id="edit-donor-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => fillTeluguPreview(name, setNameTe)}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="edit-donor-name-te" className={labelClass}>
                {t("donorNameTe")}
              </label>
              <input
                id="edit-donor-name-te"
                type="text"
                value={nameTe}
                onChange={(e) => setNameTe(e.target.value)}
                className={teluguInputClass}
              />
            </div>

            <div>
              <label htmlFor="edit-alias-name" className={labelClass}>
                {t("aliasName")}
              </label>
              <input
                id="edit-alias-name"
                type="text"
                value={aliasName}
                onChange={(e) => setAliasName(e.target.value)}
                onBlur={() => fillTeluguPreview(aliasName, setAliasNameTe)}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="edit-alias-name-te" className={labelClass}>
                {t("aliasNameTe")}
              </label>
              <input
                id="edit-alias-name-te"
                type="text"
                value={aliasNameTe}
                onChange={(e) => setAliasNameTe(e.target.value)}
                className={teluguInputClass}
              />
            </div>

            <div>
              <label htmlFor="edit-father-name" className={labelClass}>
                {t("fatherName")}
              </label>
              <input
                id="edit-father-name"
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                onBlur={() => fillTeluguPreview(fatherName, setFatherNameTe)}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="edit-father-name-te" className={labelClass}>
                {t("fatherNameTe")}
              </label>
              <input
                id="edit-father-name-te"
                type="text"
                value={fatherNameTe}
                onChange={(e) => setFatherNameTe(e.target.value)}
                className={teluguInputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-notes" className={labelClass}>
              {t("notes")}
            </label>
            <textarea
              id="edit-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("notesPlaceholder")}
              className={inputClassName}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-amount" className={labelClass}>
                {t("amount")} (₹)
              </label>
              <input
                id="edit-amount"
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="edit-date" className={labelClass}>
                {t("date")}
              </label>
              <input
                id="edit-date"
                type="date"
                value={donationDate}
                onChange={(e) => setDonationDate(e.target.value)}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label htmlFor="edit-payment-mode" className={labelClass}>
              {t("paymentMode")}
            </label>
            <select
              id="edit-payment-mode"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
              className={inputClassName}
            >
              <option value="CASH">{t("cash")}</option>
              <option value="ONLINE">{t("online")}</option>
            </select>
          </div>

          {error && (
            <p className={`text-sm text-red-700 ${lang === "te" ? "font-telugu" : ""}`}>
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`rounded-lg bg-saffron px-5 py-2.5 font-medium text-white transition-colors hover:bg-saffron/90 disabled:cursor-not-allowed disabled:opacity-60 ${
                lang === "te" ? "font-telugu" : ""
              }`}
            >
              {t("save")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`rounded-lg border border-card-border px-5 py-2.5 text-text transition-colors hover:bg-ivory ${
                lang === "te" ? "font-telugu" : ""
              }`}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
