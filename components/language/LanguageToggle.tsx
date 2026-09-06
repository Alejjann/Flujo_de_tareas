"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  function handleToggleLanguage() {
    const nextLanguage = language === "es" ? "en" : "es";

    setLanguage(nextLanguage);
  }

  return (
    <button
      type="button"
      onClick={handleToggleLanguage}
      aria-label={
        language === "es"
          ? "Change language to English"
          : "Cambiar idioma a español"
      }
      title={
        language === "es"
          ? "Change language to English"
          : "Cambiar idioma a español"
      }
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground transition hover:border-primary/60 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Languages size={17} className="text-primary" />

      {/* Muestra el idioma al que se cambiará al hacer clic */}
      <span>{language === "es" ? "EN" : "ES"}</span>
    </button>
  );
}