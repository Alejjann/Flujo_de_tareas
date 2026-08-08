"use client";

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

  const displayName = name?.trim() || "Usuario";

  const initial = displayName
    .charAt(0)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8">

        {/* LOGO */}

        <Link
          href="/dashboard"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20 transition group-hover:scale-105">
            <CheckSquare
              size={22}
              className="text-white"
            />
          </div>

          <span className="text-xl font-bold text-white">
            Flow<span className="text-cyan-400">Desk</span>
          </span>
        </Link>

        {/* NAVEGACIÓN */}

        <nav className="hidden items-center gap-2 md:flex">

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <CheckSquare size={17} />
            Tareas
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <User size={17} />
            Mi perfil
          </Link>

        </nav>

        {/* USUARIO */}

        <div className="relative">

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 transition hover:border-cyan-500/60 hover:bg-slate-800"
          >

            {/* AVATAR */}

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white">
                {initial}
              </div>
            )}

            {/* NOMBRE */}

            <div className="hidden text-left lg:block">
              <p className="max-w-[130px] truncate text-sm font-semibold text-white">
                {displayName}
              </p>

              {email && (
                <p className="max-w-[130px] truncate text-xs text-slate-500">
                  {email}
                </p>
              )}
            </div>

            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />

          </button>

          {/* MENÚ */}

          {open && (
            <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl shadow-black/40">

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                <User size={18} />

                <div>
                  <p className="font-medium">
                    Mi perfil
                  </p>

                  <p className="text-xs text-slate-500">
                    Ver mi información
                  </p>
                </div>
              </Link>

              <Link
                href="/profile/edit"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-400"
              >
                <Settings size={18} />

                <div>
                  <p className="font-medium">
                    Editar perfil
                  </p>

                  <p className="text-xs text-slate-500">
                    Modificar mis datos
                  </p>
                </div>
              </Link>

              <div className="my-2 border-t border-slate-800" />

              <button
                type="button"
                onClick={() =>
                  signOut({
                    callbackUrl: "/login",
                  })
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
              >
                <LogOut size={18} />

                <div className="text-left">
                  <p className="font-medium">
                    Cerrar sesión
                  </p>

                  <p className="text-xs text-red-400/60">
                    Salir de mi cuenta
                  </p>
                </div>
              </button>

            </div>
          )}

        </div>

      </div>
    </header>
  );
}