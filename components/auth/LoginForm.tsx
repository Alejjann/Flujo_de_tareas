"use client";

import type { FormEvent } from "react";

import Link from "next/link";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useState } from "react";

import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function isNextRedirectError(error: unknown) {
  if (
    typeof error !== "object" ||
    error === null
  ) {
    return false;
  }

  /*
   * En Next.js, redirect() lanza un objeto con digest
   * que normalmente comienza por NEXT_REDIRECT.
   */
  const maybeError = error as {
    digest?: unknown;
    message?: unknown;
  };

  return (
    (typeof maybeError.digest === "string" &&
      maybeError.digest.startsWith("NEXT_REDIRECT")) ||
    (typeof maybeError.message === "string" &&
      maybeError.message.includes("NEXT_REDIRECT"))
  );
}

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await loginUser(formData);

      /*
       * Si loginUser devuelve error, es un fallo real:
       * credenciales incorrectas, input vacío, etc.
       */
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    } catch (error) {
      /*
       * No mostramos error cuando el login fue correcto.
       * Next.js usa NEXT_REDIRECT internamente para ir a dashboard.
       */
      if (isNextRedirectError(error)) {
        return;
      }

      console.error("ERROR LOGIN:", error);

      setError(
        "No se pudo iniciar sesión. Inténtalo de nuevo."
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
          Bienvenido de nuevo
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
          Inicia sesión
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Accede a tu espacio personal y continúa donde lo dejaste.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-medium leading-6 text-red-200"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-400/15 text-xs font-bold">
            !
          </span>

          <span>{error}</span>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200"
          >
            <Mail size={16} className="text-cyan-300" />
            Correo electrónico
          </label>

          <Input
            id="login-email"
            type="email"
            name="email"
            placeholder="tu@email.com"
            autoComplete="email"
            required
            disabled={loading}
            className="h-12 border-white/10 !bg-white/[0.045] text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label
              htmlFor="login-password"
              className="flex items-center gap-2 text-sm font-semibold text-slate-200"
            >
              <LockKeyhole
                size={16}
                className="text-cyan-300"
              />
              Contraseña
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Introduce tu contraseña"
              autoComplete="current-password"
              required
              disabled={loading}
              className="h-12 border-white/10 !bg-white/[0.045] pr-12 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              aria-label={
                showPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-300 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>

      <p className="mt-6 text-center text-sm text-slate-400">
        ¿Aún no tienes una cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-cyan-300 transition hover:text-cyan-200 hover:underline"
        >
          Crea una cuenta
        </Link>
      </p>
    </form>
  );
}