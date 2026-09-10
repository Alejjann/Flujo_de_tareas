"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import LanguageToggle from "@/components/language/LanguageToggle";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AuthPageControls() {
  const { language } = useLanguage();

  const backLabel =
    language === "es"
      ? "Volver a la página principal"
      : "Back to home";

  return (
    <div className="mb-7 flex items-center justify-between gap-3">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <ArrowLeft size={17} />

        <span className="hidden sm:inline">
          {backLabel}
        </span>

        <span className="sm:hidden">
          {language === "es" ? "Volver" : "Back"}
        </span>
      </Link>

      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 shadow-sm backdrop-blur-xl">
        <LanguageToggle />
      </div>
    </div>
  );
}