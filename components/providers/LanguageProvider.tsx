"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  translations,
  type Language,
} from "@/i18n/translations";

type Translation = (typeof translations)[Language];

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
}

const LanguageContext =
  createContext<LanguageContextType | null>(null);

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("es");

  /*
   * Cargar idioma guardado
   */
  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("taskflow-language");

    if (
      savedLanguage === "es" ||
      savedLanguage === "en"
    ) {
      setLanguageState(savedLanguage);
    }
  }, []);

  /*
   * Cambiar idioma
   */
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);

    localStorage.setItem(
      "taskflow-language",
      newLanguage
    );

    /*
     * Cambiamos también el idioma del documento
     */
    document.documentElement.lang = newLanguage;
  };

  /*
   * Mantener el atributo lang correcto
   */
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

/*
 * Hook para utilizar las traducciones
 */
export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage debe utilizarse dentro de LanguageProvider"
    );
  }

  return context;
}