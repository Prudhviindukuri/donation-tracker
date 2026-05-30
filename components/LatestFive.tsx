"use client";

import { useLanguage } from "@/components/LanguageProvider";
import {
  Donation,
  formatAmount,
  formatDate,
} from "@/lib/translations";

interface LatestFiveProps {
  donations: Donation[];
}

export default function LatestFive({ donations }: LatestFiveProps) {
  const { t, lang } = useLanguage();
  const latest = donations.slice(0, 5);

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
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-card-border text-text/70">
                <th className={`pb-3 pr-4 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                  {t("donorName")}
                </th>
                <th className={`pb-3 pr-4 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                  {t("amount")}
                </th>
                <th className={`pb-3 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                  {t("date")}
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
                  <td className="py-3 pr-4 font-semibold text-saffron">
                    {formatAmount(donation.amount)}
                  </td>
                  <td className="py-3 text-text/80">
                    {formatDate(donation.createdAt)}
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
