"use client";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LanguageToggle from "@/components/language/LanguageToggle";
import Link from "next/link";
import { useState } from "react";
import {
  CheckSquare,
  User,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface HeaderProps {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export default function Header({
  name,
  email,
  avatarUrl,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const displayName = name?.trim() || "Usuario";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8">
        {/* LOGO */}
        <Link
          href="/dashboard"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-info shadow-lg shadow-primary/20 transition group-hover:scale-105">
            <CheckSquare
              size={22}
              className="text-primary-foreground"
            />
          </div>

          <span className="text-xl font-bold text-foreground">
            Flow<span className="text-primary">Desk</span>
          </span>
        </Link>

        {/* NAVEGACIÓN */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <CheckSquare size={17} />
            {t.navigation.tasks}
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <User size={17} />
            {t.navigation.profile}
          </Link>
        </nav>

        {/* IDIOMA Y USUARIO */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageToggle />

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-haspopup="menu"
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 text-foreground transition hover:border-primary/60 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`Avatar de ${displayName}`}
                  className="h-9 w-9 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-info text-sm font-bold text-primary-foreground">
                  {initial}
                </div>
              )}

              <div className="hidden text-left lg:block">
                <p className="max-w-[130px] truncate text-sm font-semibold text-foreground">
                  {displayName}
                </p>

                {email && (
                  <p className="max-w-[130px] truncate text-xs text-muted-foreground">
                    {email}
                  </p>
                )}
              </div>

              <ChevronDown
                size={16}
                className={`text-muted-foreground transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl shadow-black/15"
              >
                <Link
                  href="/profile"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                >
                  <User size={18} />

                  <div>
                    <p className="font-medium">
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
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                >
                  <Settings size={18} />

                  <div>
                    <p className="font-medium">
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
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-destructive transition hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <LogOut size={18} />

                  <div className="text-left">
                    <p className="font-medium">
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