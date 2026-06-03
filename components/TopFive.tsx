"use client";

import { useMemo } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { getPublicAliasDisplay } from "@/lib/donation";
import {
  Donation,
  formatAmount,
} from "@/lib/translations";

interface TopFiveProps {
  donations: Donation[];
}

const rankStyles: Record<number, string> = {
  1: "bg-gold/20 text-gold border-gold/40",
  2: "bg-[#C0C0C0]/20 text-[#6B6B6B] border-[#C0C0C0]/50",
  3: "bg-[#CD7F32]/20 text-[#8B5A2B] border-[#CD7F32]/50",
};

export default function TopFive({ donations }: TopFiveProps) {
  const { t, lang } = useLanguage();

  const topDonors = useMemo(() => {
    return [...donations]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [donations]);

  return (
    <section className="card">
      <h2
        className={`mb-4 text-2xl font-semibold text-text ${
          lang === "te" ? "font-telugu" : "font-heading"
        }`}
      >
        {t("topDonors")}
      </h2>

      {topDonors.length === 0 ? (
        <p className={`text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
          {t("noDonations")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-card-border text-text/70">
                <th className={`pb-3 pr-4 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                  {t("rank")}
                </th>
                <th className={`pb-3 pr-4 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                  {t("donorName")}
                </th>
                <th className={`pb-3 pr-4 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                  {t("aliasName")}
                </th>
                <th className={`pb-3 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                  {t("amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              {topDonors.map((donation, index) => {
                const rank = index + 1;
                const badgeStyle =
                  rankStyles[rank] ?? "bg-ivory text-text border-card-border";

                return (
                  <tr
                    key={donation.id}
                    className="border-b border-card-border/60 last:border-0"
                  >
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${badgeStyle}`}
                      >
                        #{rank}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-medium text-text">
                      <div>{donation.name}</div>
                      {donation.fatherName && (
                        <div className="text-xs text-text/60">
                          {donation.fatherName}
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-text/80">
                      {getPublicAliasDisplay(donation)}
                    </td>
                    <td className="py-3 font-semibold text-saffron">
                      {formatAmount(donation.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
