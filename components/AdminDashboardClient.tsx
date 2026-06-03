"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import AdminEditModal from "@/components/AdminEditModal";
import AdminForm from "@/components/AdminForm";
import AdminProgressSection from "@/components/AdminProgressSection";
import { useLanguage } from "@/components/LanguageProvider";
import { getPublicAliasDisplay } from "@/lib/donation";
import {
  AdminDonation,
  formatAmount,
  formatDate,
  formatPaymentMode,
} from "@/lib/translations";

export default function AdminDashboardClient() {
  const { t, lang } = useLanguage();
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDonation, setEditingDonation] = useState<AdminDonation | null>(
    null
  );

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/donations", {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const totalRaised = useMemo(
    () => donations.reduce((sum, d) => sum + d.amount, 0),
    [donations]
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("confirmDelete"))) return;

    const response = await fetch("/api/admin/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      fetchDonations();
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b-4 border-saffron bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <h1
            className={`text-2xl font-semibold text-text ${
              lang === "te" ? "font-telugu" : "font-heading"
            }`}
          >
            {t("dashboard")}
          </h1>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin" })}
            className="rounded-lg border border-card-border px-4 py-2 text-sm text-text transition-colors hover:bg-ivory"
          >
            {t("logout")}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <div className="card">
          <p className={`text-sm text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
            {t("totalRaised")}
          </p>
          <p className="font-heading text-3xl font-bold text-saffron">
            {formatAmount(totalRaised)}
          </p>
        </div>

        <AdminForm onSuccess={fetchDonations} />

        <section className="card">
          <h2
            className={`mb-4 text-xl font-semibold text-text ${
              lang === "te" ? "font-telugu" : "font-heading"
            }`}
          >
            {t("allDonations")}
          </h2>

          {loading ? (
            <p className={`text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
              {t("loading")}
            </p>
          ) : donations.length === 0 ? (
            <p className={`text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
              {t("noDonations")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead>
                  <tr className="border-b border-card-border text-text/70">
                    <th className="pb-3 pr-4 font-medium">{t("donorName")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("aliasName")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("fatherName")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("notes")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("amount")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("date")}</th>
                    <th className="pb-3 pr-4 font-medium">{t("paymentMode")}</th>
                    <th className="pb-3 font-medium">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr
                      key={donation.id}
                      className="border-b border-card-border/60 last:border-0"
                    >
                      <td className="py-3 pr-4 font-medium text-text">
                        {donation.name}
                      </td>
                      <td className="py-3 pr-4 text-text/80">
                        {getPublicAliasDisplay(donation)}
                      </td>
                      <td className="py-3 pr-4 text-text/80">
                        {donation.fatherName || "—"}
                      </td>
                      <td className="max-w-[200px] py-3 pr-4 text-text/80">
                        <span className="line-clamp-2 whitespace-pre-wrap">
                          {donation.notes || "—"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-saffron">
                        {formatAmount(donation.amount)}
                      </td>
                      <td className="py-3 pr-4 text-text/80">
                        {formatDate(donation.donationDate)}
                      </td>
                      <td className="py-3 pr-4 text-text/80">
                        {formatPaymentMode(donation.paymentMode, lang)}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingDonation(donation)}
                            className="rounded-lg border border-card-border px-3 py-1.5 text-sm text-text transition-colors hover:bg-ivory"
                          >
                            {t("edit")}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(donation.id)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 transition-colors hover:bg-red-50"
                          >
                            {t("delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <AdminProgressSection />
      </main>

      {editingDonation && (
        <AdminEditModal
          donation={editingDonation}
          onClose={() => setEditingDonation(null)}
          onSuccess={fetchDonations}
        />
      )}
    </div>
  );
}
