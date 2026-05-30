"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DonationTable from "@/components/DonationTable";
import LanguageToggle from "@/components/LanguageToggle";
import LatestFive from "@/components/LatestFive";
import Logo from "@/components/Logo";
import TopFive from "@/components/TopFive";
import { useLanguage } from "@/components/LanguageProvider";
import { Donation, formatAmount } from "@/lib/translations";

export default function HomePageClient() {
  const { t, lang } = useLanguage();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = useCallback(async () => {
    try {
      const response = await fetch("/api/donations", { cache: "no-store" });
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

  return (
    <div className="min-h-screen bg-ivory text-text">
      <header className="border-b-4 border-saffron bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo size={40} priority />
          <LanguageToggle />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-10 text-center">
          <Logo size={96} className="mx-auto mb-4" priority />
          <h1 className="font-heading text-3xl font-bold text-text sm:text-4xl">
            {t("heroTitleEn")}
          </h1>
          <p className="font-telugu mt-3 text-2xl font-semibold text-text sm:text-3xl">
            {t("heroTitleTe")}
          </p>

          <div className="card mx-auto mt-8 max-w-md">
            <p
              className={`text-sm uppercase tracking-wide text-text/70 ${
                lang === "te" ? "font-telugu" : "font-heading"
              }`}
            >
              {t("totalRaised")}
            </p>
            {loading ? (
              <div className="mx-auto mt-2 h-10 w-48 animate-pulse rounded bg-card-border/40" />
            ) : (
              <p className="font-heading mt-2 text-4xl font-bold text-saffron">
                {formatAmount(totalRaised)}
              </p>
            )}
          </div>
        </section>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="card h-48 animate-pulse bg-white/80"
              />
            ))}
            <p
              className={`text-center text-text/60 ${
                lang === "te" ? "font-telugu" : ""
              }`}
            >
              {t("loading")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <LatestFive donations={donations} />
            <TopFive donations={donations} />
            <DonationTable donations={donations} />
          </div>
        )}
      </main>

      <footer className="border-t border-card-border bg-white py-8">
        <div className="mx-auto max-w-3xl px-4 text-center text-sm leading-relaxed text-text/80 sm:px-6">
          <p>
            🙏 This donation supports the construction of a Hindu burial ground
            for our community
          </p>
          <p className="font-telugu mt-3">
            🙏 ఈ విరాళం మన సమాజానికి హిందూ స్మశాన వాటిక నిర్మాణానికి తోడ్పడుతుంది
          </p>
        </div>
      </footer>
    </div>
  );
}
