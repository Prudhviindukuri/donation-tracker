"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import {
  Donation,
  formatAmount,
  formatDate,
  formatPaymentMode,
} from "@/lib/translations";

interface DonationTableProps {
  donations: Donation[];
}

const PAGE_SIZE = 20;

type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

function SortableHeader({
  label,
  active,
  direction,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  className: string;
}) {
  return (
    <th className={className}>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 font-medium text-text/70 transition-colors hover:text-saffron"
      >
        {label}
        <span className={`text-xs ${active ? "text-saffron" : "text-text/40"}`}>
          {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    </th>
  );
}

export default function DonationTable({ donations }: DonationTableProps) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOption>("date-desc");

  const sortField = sort.startsWith("date") ? "date" : "amount";
  const sortDir = sort.endsWith("asc") ? "asc" : "desc";

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return donations;
    return donations.filter(
      (donation) =>
        donation.name.toLowerCase().includes(query) ||
        donation.fatherName.toLowerCase().includes(query)
    );
  }, [donations, search]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const cmp =
        sortField === "amount"
          ? a.amount - b.amount
          : new Date(a.donationDate).getTime() -
            new Date(b.donationDate).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSort(value);
    setPage(1);
  };

  const toggleColumnSort = (field: "date" | "amount") => {
    setPage(1);
    if (sortField === field) {
      setSort(
        sortDir === "desc"
          ? `${field}-asc`
          : `${field}-desc`
      );
      return;
    }
    setSort(`${field}-desc`);
  };

  const thClass = `px-4 py-3 ${lang === "te" ? "font-telugu" : ""}`;
  const controlClass = `rounded-lg border border-card-border bg-ivory px-4 py-2 text-sm text-text outline-none focus:border-saffron ${
    lang === "te" ? "font-telugu" : ""
  }`;

  return (
    <section className="card">
      <div className="mb-4 flex flex-col gap-4">
        <h2
          className={`text-2xl font-semibold text-text ${
            lang === "te" ? "font-telugu" : "font-heading"
          }`}
        >
          {t("allDonations")}
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t("search")}
            className={`${controlClass} w-full sm:max-w-xs ${
              lang === "te" ? "placeholder:font-telugu" : ""
            }`}
          />
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            aria-label={t("sortBy")}
            className={`${controlClass} w-full sm:max-w-xs`}
          >
            <option value="date-desc">{t("dateNewest")}</option>
            <option value="date-asc">{t("dateOldest")}</option>
            <option value="amount-desc">{t("amountHigh")}</option>
            <option value="amount-asc">{t("amountLow")}</option>
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className={`text-text/70 ${lang === "te" ? "font-telugu" : ""}`}>
          {t("noDonations")}
        </p>
      ) : (
        <>
          <div className="max-h-[480px] overflow-auto rounded-lg border border-card-border/60">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-card-border text-text/70">
                  <th className={`${thClass} font-medium`}>{t("serialNo")}</th>
                  <th className={`${thClass} font-medium`}>{t("donorName")}</th>
                  <th className={`${thClass} font-medium`}>{t("fatherName")}</th>
                  <SortableHeader
                    label={t("amount")}
                    active={sortField === "amount"}
                    direction={sortDir}
                    onClick={() => toggleColumnSort("amount")}
                    className={thClass}
                  />
                  <SortableHeader
                    label={t("date")}
                    active={sortField === "date"}
                    direction={sortDir}
                    onClick={() => toggleColumnSort("date")}
                    className={thClass}
                  />
                  <th className={`${thClass} font-medium`}>{t("paymentMode")}</th>
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
                    <td className="px-4 py-3 text-text/80">
                      {donation.fatherName || "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-saffron">
                      {formatAmount(donation.amount)}
                    </td>
                    <td className="px-4 py-3 text-text/80">
                      {formatDate(donation.donationDate)}
                    </td>
                    <td className="px-4 py-3 text-text/80">
                      {formatPaymentMode(donation.paymentMode, lang)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sorted.length > PAGE_SIZE && (
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
