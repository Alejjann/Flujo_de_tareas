"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

import {
  CheckSquare,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import LanguageToggle from "@/components/language/LanguageToggle";
import {
  useLanguage,
} from "@/components/providers/LanguageProvider";
import ThemeToggle from "@/components/theme/ThemeToggle";

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

  return `${words[0].charAt(0)}${words[1].charAt(
    0
  )}`.toUpperCase();
}

export default function Header({
  name,
  email,
  avatarUrl,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef(0);

  const pathname = usePathname();


  const { language } = useLanguage();

  const displayName = name?.trim() || "Usuario";
  const initials = getInitials(displayName);

  const isDashboardActive =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard");

  const isProfileActive = pathname.startsWith("/profile");

  const copy =
    language === "es"
      ? {
          tasks: "Tareas",
          profile: "Perfil",
          openMenu: "Abrir menú de usuario",
          closeMenu: "Cerrar menú de usuario",
          userMenu: "Menú de usuario",
          myProfile: "Mi perfil",
          profileDescription: "Gestiona tu cuenta",
          editProfile: "Editar perfil",
          editProfileDescription:
            "Cambia tu nombre o contraseña",
          logout: "Cerrar sesión",
          logoutDescription: "Salir de tu cuenta",
          avatarOf: "Avatar de",
        }
      : {
          tasks: "Tasks",
          profile: "Profile",
          openMenu: "Open user menu",
          closeMenu: "Close user menu",
          userMenu: "User menu",
          myProfile: "My profile",
          profileDescription: "Manage your account",
          editProfile: "Edit profile",
          editProfileDescription:
            "Change your name or password",
          logout: "Log out",
          logoutDescription: "Sign out of your account",
          avatarOf: "Avatar of",
        };

  const navigation = [
    {
      href: "/dashboard",
      label: copy.tasks,
      icon: CheckSquare,
      active: isDashboardActive,
    },
    {
      href: "/profile",
      label: copy.profile,
      icon: User,
      active: isProfileActive,
    },
  ];

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const difference = currentScrollY - lastScrollY.current;

      if (currentScrollY < 12) {
        setHidden(false);
      } else if (difference > 6) {
        setHidden(true);
        setOpen(false);
      } else if (difference < -6) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setHidden(false);
    lastScrollY.current = window.scrollY;
  }, [pathname]);

  return (
    <>
      <div aria-hidden="true" className="h-[72px]" />

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl transition-transform duration-300 ease-out ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 md:px-8">
          <Link
            href="/dashboard"
            aria-label="FlowDesk"
            title="FlowDesk"
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

          <nav
            aria-label={
              language === "es"
                ? "Navegación principal"
                : "Main navigation"
            }
            className="hidden items-center gap-1 rounded-2xl border border-border bg-card/70 p-1 shadow-sm md:flex"
          >
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={
                    item.active ? "page" : undefined
                  }
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

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-1 rounded-xl border border-border bg-card/70 p-1 shadow-sm sm:flex">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            <div className="flex items-center gap-1 sm:hidden">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            <div ref={menuRef} className="relative ml-1">
              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-haspopup="menu"
                aria-label={
                  open ? copy.closeMenu : copy.openMenu
                }
                className={`flex h-11 items-center gap-2 rounded-2xl border bg-card px-1.5 text-foreground shadow-sm transition-all duration-200 hover:border-primary/45 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-2 ${
                  open
                    ? "border-primary/45 bg-secondary"
                    : "border-border"
                }`}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${copy.avatarOf} ${displayName}`}
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
                  aria-label={copy.userMenu}
                  className="absolute right-0 mt-3 w-[min(19rem,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-2xl shadow-slate-950/20"
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

                  <div className="mb-2 border-b border-border pb-2 md:hidden">
                    {navigation.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          aria-current={
                            item.active
                              ? "page"
                              : undefined
                          }
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
                        {copy.myProfile}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {copy.profileDescription}
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
                        {copy.editProfile}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {copy.editProfileDescription}
                      </p>
                    </div>
                  </Link>

                  <div className="my-2 border-t border-border" />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      signOut({
                        callbackUrl: "/",
                      })
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-destructive transition-colors duration-200 hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <LogOut size={18} />

                    <div className="text-left">
                      <p className="text-sm font-semibold">
                        {copy.logout}
                      </p>

                      <p className="text-xs text-destructive/70">
                        {copy.logoutDescription}
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}