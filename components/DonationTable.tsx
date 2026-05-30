"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  Donation,
  formatAmount,
  formatDate,
} from "@/lib/translations";

interface DonationTableProps {
  donations: Donation[];
}

const PAGE_SIZE = 20;

export default function DonationTable({ donations }: DonationTableProps) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return donations;
    return donations.filter((donation) =>
      donation.name.toLowerCase().includes(query)
    );
  }, [donations, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <section className="card">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          className={`text-2xl font-semibold text-text ${
            lang === "te" ? "font-telugu" : "font-heading"
          }`}
        >
          {t("allDonations")}
        </h2>
        <input
          type="search"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t("search")}
          className={`w-full rounded-lg border border-card-border bg-ivory px-4 py-2 text-sm text-text outline-none focus:border-saffron sm:max-w-xs ${
            lang === "te" ? "font-telugu placeholder:font-telugu" : ""
          }`}
        />
      </div>

      {filtered.length === 0 ? (
        <p className={`text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
          {t("noDonations")}
        </p>
      ) : (
        <>
          <div className="max-h-[480px] overflow-auto rounded-lg border border-card-border/60">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-card-border text-text/70">
                  <th className={`px-4 py-3 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                    {t("serialNo")}
                  </th>
                  <th className={`px-4 py-3 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                    {t("donorName")}
                  </th>
                  <th className={`px-4 py-3 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                    {t("amount")}
                  </th>
                  <th className={`px-4 py-3 font-medium ${lang === "te" ? "font-telugu" : ""}`}>
                    {t("date")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((donation, index) => (
                  <tr
                    key={donation.id}
                    className="border-b border-card-border/60 last:border-0 hover:bg-ivory/60"
                  >
                    <td className="px-4 py-3 text-text/70">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-text">
                      {donation.name}
                    </td>
                    <td className="px-4 py-3 font-semibold text-saffron">
                      {formatAmount(donation.amount)}
                    </td>
                    <td className="px-4 py-3 text-text/80">
                      {formatDate(donation.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length > PAGE_SIZE && (
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-card-border px-4 py-2 text-sm text-text transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("previous")}
              </button>
              <span className={`text-sm text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
                {t("page")} {currentPage} {t("of")} {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-card-border px-4 py-2 text-sm text-text transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("next")}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
