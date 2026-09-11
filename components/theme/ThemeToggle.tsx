"use client";

import { Moon, Sun } from "lucide-react";

import {
  useAppTheme,
} from "@/components/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Cambiar a modo claro"
          : "Cambiar a modo oscuro"
      }
      title={
        isDark
          ? "Cambiar a modo claro"
          : "Cambiar a modo oscuro"
      }
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:border-primary/60 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {isDark ? (
        <Sun size={18} className="text-warning" />
      ) : (
        <Moon size={18} className="text-primary" />
      )}
    </button>
  );
}