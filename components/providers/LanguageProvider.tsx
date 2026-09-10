"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  type Language,
  translations,
} from "@/i18n/translations";

type Translation = typeof translations.es;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
};

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

const LANGUAGE_STORAGE_KEY = "language";

function isLanguage(value: unknown): value is Language {
  return value === "es" || value === "en";
}

function getInitialLanguage(): Language {
  /*
   * En el servidor no existe localStorage.
   * Español solo es el valor seguro del render inicial SSR.
   */
  if (typeof window === "undefined") {
    return "es";
  }

  const savedLanguage = window.localStorage.getItem(
    LANGUAGE_STORAGE_KEY
  );

  return isLanguage(savedLanguage) ? savedLanguage : "es";
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>(
    getInitialLanguage
  );

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      language
    );
  }, [language]);

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage);
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language] as Translation,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage debe usarse dentro de LanguageProvider"
    );
  }

  return context;
}