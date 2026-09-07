"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageToggle from "@/components/language/LanguageToggle";
import { useLanguage } from "@/components/providers/LanguageProvider";

import {
  CheckSquare,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

interface HeaderProps {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

function getInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "U";
  }

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
}

export default function Header({
  name,
  email,
  avatarUrl,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const { t } = useLanguage();

  const displayName = name?.trim() || "Usuario";
  const initials = getInitials(displayName);

  const isDashboardActive =
    pathname === "/" || pathname.startsWith("/dashboard");

  const isProfileActive = pathname.startsWith("/profile");

  const navigation = [
    {
      href: "/dashboard",
      label: t.navigation.tasks,
      icon: CheckSquare,
      active: isDashboardActive,
    },
    {
      href: "/profile",
      label: t.navigation.profile,
      icon: User,
      active: isProfileActive,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 md:px-8">
        {/* LOGO */}
        <Link
          href="/dashboard"
          aria-label="FlowDesk dashboard"
          className="group flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-info text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-primary/30">
            <CheckSquare size={21} />
          </div>

          <span className="hidden text-xl font-bold tracking-[-0.03em] text-foreground xs:inline sm:text-2xl">
            Flow<span className="text-primary">Desk</span>
          </span>
        </Link>

        {/* NAVEGACIÓN */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 rounded-2xl border border-border bg-card/70 p-1 shadow-sm md:flex"
        >
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                  item.active
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-inset ring-primary/15"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* UTILIDADES Y PERFIL */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-1 rounded-xl border border-border bg-card/70 p-1 shadow-sm sm:flex">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          <div className="flex items-center gap-1 sm:hidden">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          <div className="relative ml-1">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-haspopup="menu"
              aria-label={open ? "Cerrar menú de usuario" : "Abrir menú de usuario"}
              className={`flex h-11 items-center gap-2 rounded-2xl border bg-card px-1.5 text-foreground shadow-sm transition-all duration-200 hover:border-primary/45 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-2 ${
                open ? "border-primary/45 bg-secondary" : "border-border"
              }`}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`Avatar de ${displayName}`}
                  className="h-8 w-8 rounded-xl border border-border object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-info text-xs font-bold text-primary-foreground shadow-sm">
                  {initials}
                </div>
              )}

              <div className="hidden min-w-0 text-left lg:block">
                <p className="max-w-[132px] truncate text-sm font-semibold text-foreground">
                  {displayName}
                </p>

                {email && (
                  <p className="max-w-[132px] truncate text-[11px] text-muted-foreground">
                    {email}
                  </p>
                )}
              </div>

              <ChevronDown
                size={15}
                className={`mr-0.5 hidden text-muted-foreground transition-transform duration-200 sm:block ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div
                role="menu"
                aria-label="Menú de usuario"
                className="absolute right-0 mt-3 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl shadow-slate-950/15"
              >
                <div className="mb-2 flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-10 w-10 rounded-xl border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-info text-sm font-bold text-primary-foreground">
                      {initials}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {displayName}
                    </p>

                    {email && (
                      <p className="truncate text-xs text-muted-foreground">
                        {email}
                      </p>
                    )}
                  </div>
                </div>

                {/* En móvil, los enlaces aparecen dentro del menú. */}
                <div className="mb-2 border-b border-border pb-2 md:hidden">
                  {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        aria-current={item.active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                          item.active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <Icon size={17} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href="/profile"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-muted-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                >
                  <User size={18} />

                  <div>
                    <p className="text-sm font-semibold">
                      {t.userMenu.profile}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {t.userMenu.profileDescription}
                    </p>
                  </div>
                </Link>

                <Link
                  href="/profile/edit"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-muted-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                >
                  <Settings size={18} />

                  <div>
                    <p className="text-sm font-semibold">
                      {t.userMenu.editProfile}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {t.userMenu.editProfileDescription}
                    </p>
                  </div>
                </Link>

                <div className="my-2 border-t border-border" />

                <button
                  type="button"
                  role="menuitem"
                  onClick={() =>
                    signOut({
                      callbackUrl: "/login",
                    })
                  }
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-destructive transition-colors duration-200 hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <LogOut size={18} />

                  <div className="text-left">
                    <p className="text-sm font-semibold">
                      {t.userMenu.logout}
                    </p>

                    <p className="text-xs text-destructive/70">
                      {t.userMenu.logoutDescription}
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}