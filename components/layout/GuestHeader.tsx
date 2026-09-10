// components/layout/GuestHeader.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";

import LanguageToggle from "@/components/language/LanguageToggle";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function GuestHeader() {
  const pathname = usePathname();

  const isLoginActive = pathname.startsWith("/login");

  return (
    <>
      {/* Espacio para el header fijo */}
      <div aria-hidden="true" className="h-[72px]" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 md:px-8">
          {/* Logo: invitado vuelve a la página principal */}
          <Link
            href="/"
            aria-label="Ir a la página principal de Flowdesk"
            title="Ir a la página principal"
            className="group flex shrink-0 items-center gap-2 rounded-xl transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-3"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:scale-[1.03] group-hover:shadow-primary/30">
              <Image
                src="/flowdesk_logo.png"
                alt=""
                width={40}
                height={40}
                priority
                className="h-full w-full object-contain"
              />
            </div>

            <span className="hidden text-2xl font-bold tracking-[-0.04em] text-foreground sm:inline">
              Flow<span className="text-primary">desk</span>
            </span>
          </Link>

          {/* Centro: acceso al login */}
          <nav
            aria-label="Navegación de invitado"
            className="hidden items-center rounded-2xl border border-border bg-card/70 p-1 shadow-sm md:flex"
          >
            <Link
              href="/login"
              aria-current={isLoginActive ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                isLoginActive
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-inset ring-primary/15"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <LogIn size={16} />
              Iniciar sesión
            </Link>
          </nav>

          {/* Tema, idioma y botón de login para móvil */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-1 rounded-xl border border-border bg-card/70 p-1 shadow-sm sm:flex">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            <div className="flex items-center gap-1 sm:hidden">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            <Link
              href="/login"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-primary/25 bg-primary/10 px-3 text-sm font-bold text-primary shadow-sm transition-all hover:border-primary/45 hover:bg-primary/15 sm:hidden"
              aria-label="Iniciar sesión"
              title="Iniciar sesión"
            >
              <LogIn size={17} />
              <span className="hidden xs:inline">Entrar</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}