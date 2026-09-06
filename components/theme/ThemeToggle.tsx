"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    const isDark = savedTheme !== "light";

    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);

  function toggleTheme() {
    const nextDark = !dark;

    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    setDark(nextDark);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        dark
          ? "Cambiar a modo claro"
          : "Cambiar a modo oscuro"
      }
      title={
        dark
          ? "Cambiar a modo claro"
          : "Cambiar a modo oscuro"
      }
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-primary/60 hover:bg-secondary hover:text-primary"
    >
      {dark ? (
        <Sun size={18} className="text-warning" />
      ) : (
        <Moon size={18} className="text-primary" />
      )}
    </button>
  );
}