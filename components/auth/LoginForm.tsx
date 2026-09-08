"use client";

import type { FormEvent } from "react";

import Link from "next/link";
import { useState } from "react";
import { LoaderCircle, LockKeyhole, Mail, Eye, EyeOff } from "lucide-react";

import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

      if (result?.error) {
        setError(result.error);
      }
    } catch (error) {
      console.error("ERROR LOGIN:", error);

      setError(
        "No se pudo iniciar sesión. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
          Bienvenido de nuevo
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
          Inicia sesión
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Accede a tu espacio personal y continúa donde lo
          dejaste.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-medium leading-6 text-red-200"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-400/15 text-xs">
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
              <LockKeyhole size={16} className="text-cyan-300" />
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

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-slate-500">o</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <p className="text-center text-sm text-slate-400">
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