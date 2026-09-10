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
import AuthControls from "@/components/auth/AuthPageControls";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function isNextRedirectError(error: unknown) {
  if (
    typeof error !== "object" ||
    error === null
  ) {
    return false;
  }

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
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const copy =
    language === "es"
      ? {
          eyebrow: "Bienvenido de nuevo",
          title: "Inicia sesión",
          description:
            "Accede a tu espacio personal y continúa donde lo dejaste.",
          email: "Correo electrónico",
          emailPlaceholder: "tu@email.com",
          password: "Contraseña",
          passwordPlaceholder:
            "Introduce tu contraseña",
          forgotPassword:
            "¿Olvidaste tu contraseña?",
          showPassword: "Mostrar contraseña",
          hidePassword: "Ocultar contraseña",
          signingIn: "Iniciando sesión...",
          signIn: "Iniciar sesión",
          dontHaveAccount:
            "¿Aún no tienes una cuenta?",
          createAccount: "Crea una cuenta",
          loginError:
            "No se pudo iniciar sesión. Inténtalo de nuevo.",
        }
      : {
          eyebrow: "Welcome back",
          title: "Log in",
          description:
            "Access your personal workspace and continue where you left off.",
          email: "Email",
          emailPlaceholder: "you@email.com",
          password: "Password",
          passwordPlaceholder: "Enter your password",
          forgotPassword: "Forgot your password?",
          showPassword: "Show password",
          hidePassword: "Hide password",
          signingIn: "Signing in...",
          signIn: "Log in",
          dontHaveAccount:
            "Don't have an account yet?",
          createAccount: "Create an account",
          loginError:
            "Could not sign in. Please try again.",
        };

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
        setLoading(false);
        return;
      }
    } catch (error) {
      if (isNextRedirectError(error)) {
        return;
      }

      console.error("ERROR LOGIN:", error);

      setError(copy.loginError);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AuthControls />

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
          {copy.eyebrow}
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
          {copy.title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {copy.description}
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
            {copy.email}
          </label>

          <Input
            id="login-email"
            type="email"
            name="email"
            placeholder={copy.emailPlaceholder}
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
              {copy.password}
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200 hover:underline"
            >
              {copy.forgotPassword}
            </Link>
          </div>

          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={copy.passwordPlaceholder}
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
                  ? copy.hidePassword
                  : copy.showPassword
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
            {copy.signingIn}
          </>
        ) : (
          copy.signIn
        )}
      </Button>

      <p className="mt-6 text-center text-sm text-slate-400">
        {copy.dontHaveAccount}{" "}
        <Link
          href="/register"
          className="font-semibold text-cyan-300 transition hover:text-cyan-200 hover:underline"
        >
          {copy.createAccount}
        </Link>
      </p>
    </form>
  );
}