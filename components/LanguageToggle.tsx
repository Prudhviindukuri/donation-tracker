"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex rounded-lg border border-card-border bg-white p-0.5 text-sm shadow-sm">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
          lang === "en"
            ? "bg-saffron text-white"
            : "text-text hover:bg-ivory"
        }`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("te")}
        className={`rounded-md px-3 py-1.5 font-telugu font-medium transition-colors ${
          lang === "te"
            ? "bg-saffron text-white"
            : "text-text hover:bg-ivory"
        }`}
        aria-pressed={lang === "te"}
      >
        తె
      </button>
    </div>
  );
}
