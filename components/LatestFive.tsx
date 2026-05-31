"use client";

import { useLanguage } from "@/components/LanguageProvider";
import {
  Donation,
  formatAmount,
  formatDate,
  formatPaymentMode,
} from "@/lib/translations";

interface LatestFiveProps {
  donations: Donation[];
}

export default function LatestFive({ donations }: LatestFiveProps) {
  const { t, lang } = useLanguage();
  const latest = donations.slice(0, 5);
  const thClass = `pb-3 pr-4 font-medium ${lang === "te" ? "font-telugu" : ""}`;

  return (
    <section className="card">
      <h2
        className={`mb-4 text-2xl font-semibold text-text ${
          lang === "te" ? "font-telugu" : "font-heading"
        }`}
      >
        {t("latestDonations")}
      </h2>

      {latest.length === 0 ? (
        <p className={`text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
          {t("noDonations")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-card-border text-text/70">
                <th className={thClass}>{t("donorName")}</th>
                <th className={thClass}>{t("fatherName")}</th>
                <th className={thClass}>{t("amount")}</th>
                <th className={thClass}>{t("date")}</th>
                <th className={`pb-3 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                  {t("paymentMode")}
                </th>
              </tr>
            </thead>
            <tbody>
              {latest.map((donation, index) => (
                <tr
                  key={donation.id}
                  className={`border-b border-card-border/60 last:border-0 ${
                    index === 0
                      ? "rounded-lg bg-white ring-2 ring-saffron/30 shadow-md"
                      : ""
                  }`}
                >
                  <td className="py-3 pr-4 font-medium text-text">
                    {donation.name}
                  </td>
                  <td className="py-3 pr-4 text-text/80">
                    {donation.fatherName || "—"}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-saffron">
                    {formatAmount(donation.amount)}
                  </td>
                  <td className="py-3 pr-4 text-text/80">
                    {formatDate(donation.donationDate)}
                  </td>
                  <td className="py-3 text-text/80">
                    {formatPaymentMode(donation.paymentMode, lang)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
