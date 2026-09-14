"use client";

import { Languages } from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const nextLanguage = language === "es" ? "en" : "es";

  function handleToggleLanguage() {
    setLanguage(nextLanguage);
  }

  return (
    <button
      type="button"
      onClick={handleToggleLanguage}
      aria-label={
        language === "es"
          ? "Cambiar a inglés"
          : "Change to Spanish"
      }
      title={
        language === "es"
          ? "Cambiar a inglés"
          : "Change to Spanish"
      }
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground transition hover:border-primary/60 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Languages size={17} className="text-primary" />
      <span>{language.toUpperCase()}</span>
    </button>
  );
}