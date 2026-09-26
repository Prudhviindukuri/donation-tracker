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

interface AdminLanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const AdminLanguageContext = createContext<AdminLanguageContextValue | null>(
  null
);

const ADMIN_STORAGE_KEY = "donation-admin-lang";

export function AdminLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (stored === "en" || stored === "te") {
      setLangState(stored);
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    localStorage.setItem(ADMIN_STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key],
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  if (!mounted) {
    return (
      <AdminLanguageContext.Provider value={value}>
        {children}
      </AdminLanguageContext.Provider>
    );
  }

  return (
    <AdminLanguageContext.Provider value={value}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error("useAdminLanguage must be used within AdminLanguageProvider");
  }
  return context;
}
