"use client";

import Link from "next/link";
import { useState } from "react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  name?: string | null;
  email?: string | null;
}

export default function UserMenu({
  name,
  email,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);

  const displayName = name || "Usuario";

  return (
    <div className="relative">
      {/* BOTÓN DEL USUARIO */}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 transition hover:border-cyan-500 hover:bg-slate-800"
      >
        {/* AVATAR */}

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white">
          {displayName.charAt(0).toUpperCase()}
        </div>

        {/* DATOS */}

        <div className="hidden text-left sm:block">
          <p className="font-semibold text-white">
            {displayName}
          </p>

          {email && (
            <p className="max-w-[180px] truncate text-xs text-slate-500">
              {email}
            </p>
          )}
        </div>

        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* MENÚ */}

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl shadow-black/40">

          {/* PERFIL */}

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

          {/* EDITAR PERFIL */}

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

          {/* CERRAR SESIÓN */}

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
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
  );
}