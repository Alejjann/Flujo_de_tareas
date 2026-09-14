"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
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

const LANGUAGE_COOKIE_KEY = "flowdesk-language";

function readLanguageCookie(): Language {
  if (typeof document === "undefined") {
    return "es";
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((item) =>
      item.startsWith(`${LANGUAGE_COOKIE_KEY}=`)
    )
    ?.split("=")[1];

  return cookieValue === "en" ? "en" : "es";
}

function saveLanguageCookie(language: Language) {
  document.cookie = [
    `${LANGUAGE_COOKIE_KEY}=${language}`,
    "Path=/",
    "Max-Age=31536000",
    "SameSite=Lax",
  ].join("; ");
}

export default function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("es");

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initialLanguage = readLanguageCookie();

    setLanguageState(initialLanguage);
    document.documentElement.lang = initialLanguage;
    setReady(true);
  }, []);

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage);
    saveLanguageCookie(nextLanguage);
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

  if (!ready) {
    return (
      <div
        className="min-h-screen bg-background"
        aria-hidden="true"
      />
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
    throw new Error(
      "useLanguage debe usarse dentro de LanguageProvider"
    );
  }

  return context;
}