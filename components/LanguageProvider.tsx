"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Language,
  TranslationKey,
  translations,
} from "@/lib/translations";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "donation-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "te") {
      setLangState(stored);
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key],
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t }),
    [lang, setLang, t]
  );

  if (!mounted) {
    return (
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
