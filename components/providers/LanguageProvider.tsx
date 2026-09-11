"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";

import { translations } from "@/i18n/translations";

type Language = "es" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof translations.es | typeof translations.en;
};

const LanguageContext = createContext<
  LanguageContextValue | undefined
>(undefined);

const LANGUAGE_STORAGE_KEY = "flowdesk-language";

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "es";
  }

  const saved = window.localStorage.getItem(
    LANGUAGE_STORAGE_KEY
  );

  console.log(
    "[LanguageProvider] saved language:",
    saved
  );

  if (saved === "es" || saved === "en") {
    return saved;
  }

  return "es";
}

export default function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>(getInitialLanguage);

  function setLanguage(nextLanguage: Language) {
    console.log(
      "[LanguageProvider] setting language:",
      nextLanguage
    );

    setLanguageState(nextLanguage);

    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      nextLanguage
    );

    document.documentElement.lang = nextLanguage;
  }

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t:
      language === "es"
        ? translations.es
        : translations.en,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage debe usarse dentro de LanguageProvider"
    );
  }

  return context;
}