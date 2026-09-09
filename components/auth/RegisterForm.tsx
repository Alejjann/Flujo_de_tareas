"use client";

import type { ChangeEvent } from "react";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  Check,
  Circle,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PASSWORD_MIN_LENGTH = 8;

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordRules = [
    {
      label: `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`,
      valid: form.password.length >= PASSWORD_MIN_LENGTH,
    },
    {
      label: "Una mayúscula",
      valid: /[A-Z]/.test(form.password),
    },
    {
      label: "Una minúscula",
      valid: /[a-z]/.test(form.password),
    },
    {
      label: "Un número",
      valid: /\d/.test(form.password),
    },
    {
      label: "Un carácter especial",
      valid: /[^A-Za-z0-9]/.test(form.password),
    },
  ];

  const isPasswordValid = passwordRules.every(
    (rule) => rule.valid
  );

  const hasPasswordMismatch = Boolean(passwordError);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    const nextForm = {
      ...form,
      [name]: value,
    };

    setForm(nextForm);

    if (name === "email") {
      setEmailError("");
    }

    if (name === "password" || name === "confirmPassword") {
      const passwordsAreComparable =
        nextForm.password.length > 0 &&
        nextForm.confirmPassword.length > 0;

      setPasswordError(
        passwordsAreComparable &&
          nextForm.password !== nextForm.confirmPassword
          ? "Las contraseñas no coinciden."
          : ""
      );
    }
  }

  async function handleSubmit(formData: FormData) {
    if (loading) {
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    setEmailError("");

    if (!name) {
      toast.error("Introduce tu nombre.");
      return;
    }

    if (!email) {
      toast.error("Introduce tu correo electrónico.");
      return;
    }

    if (!password) {
      toast.error("Introduce una contraseña.");
      return;
    }

    if (!isPasswordValid) {
      toast.error(
        "La contraseña no cumple todos los requisitos."
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setPasswordError("");
    setLoading(true);

    try {
      formData.set("name", name);
      formData.set("email", email);
      formData.set("password", password);

      const result = await registerUser(formData);

      /*
       * Si el registro funciona, registerUser redirige a /login.
       * Si devuelve un error, lo mostramos y devolvemos el botón
       * a su estado normal.
       */
      if (result?.error) {
        if (result.field === "email") {
          setEmailError(result.error);
        }

        toast.error(result.error);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("ERROR REGISTRANDO USUARIO:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo crear la cuenta."
      );

      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="w-full">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
          Empieza ahora
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
          Crea tu cuenta
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Organiza tu trabajo, sigue tu progreso y mantén el foco
          desde un solo lugar.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="register-name"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200"
          >
            <UserRound size={16} className="text-cyan-300" />
            Nombre
          </label>

          <Input
            id="register-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            autoComplete="name"
            disabled={loading}
            className="h-12 border-white/10 !bg-white/[0.045] text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
            required
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200"
          >
            <Mail size={16} className="text-cyan-300" />
            Correo electrónico
          </label>

          <Input
            id="register-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            autoComplete="email"
            disabled={loading}
            required
            aria-invalid={Boolean(emailError)}
            aria-describedby={
              emailError ? "register-email-error" : undefined
            }
            className={`h-12 border-white/10 !bg-white/[0.045] text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 ${
              emailError
                ? "border-red-400/70 focus:border-red-400 focus:ring-red-400/10"
                : ""
            }`}
          />

          {emailError && (
            <p
              id="register-email-error"
              role="alert"
              className="mt-2 flex items-start gap-2 text-sm font-medium leading-5 text-red-300"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{emailError}</span>
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-password"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200"
          >
            <LockKeyhole size={16} className="text-cyan-300" />
            Contraseña
          </label>

          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Crea una contraseña segura"
              autoComplete="new-password"
              disabled={loading}
              aria-invalid={hasPasswordMismatch}
              aria-describedby={
                form.password
                  ? "register-password-rules"
                  : undefined
              }
              className={`h-12 border-white/10 !bg-white/[0.045] pr-12 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 ${
                hasPasswordMismatch
                  ? "border-red-400/70 focus:border-red-400 focus:ring-red-400/10"
                  : ""
              }`}
              required
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

          {form.password && (
            <div
              id="register-password-rules"
              className="mt-3 rounded-xl border border-white/10 bg-white/[0.035] p-3.5"
            >
              <p className="mb-2.5 text-xs font-bold text-slate-200">
                Tu contraseña debe incluir:
              </p>

              <ul className="grid gap-2 sm:grid-cols-2">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 text-xs font-medium ${
                      rule.valid
                        ? "text-emerald-300"
                        : "text-slate-500"
                    }`}
                  >
                    {rule.valid ? (
                      <Check size={14} className="shrink-0" />
                    ) : (
                      <Circle size={14} className="shrink-0" />
                    )}

                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="register-confirm-password"
            className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200"
          >
            <LockKeyhole size={16} className="text-cyan-300" />
            Confirmar contraseña
          </label>

          <div className="relative">
            <Input
              id="register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              disabled={loading}
              aria-invalid={hasPasswordMismatch}
              aria-describedby={
                hasPasswordMismatch
                  ? "register-password-error"
                  : undefined
              }
              className={`h-12 border-white/10 !bg-white/[0.045] pr-12 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 ${
                hasPasswordMismatch
                  ? "border-red-400/70 focus:border-red-400 focus:ring-red-400/10"
                  : ""
              }`}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((current) => !current)
              }
              disabled={loading}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              aria-label={
                showConfirmPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {hasPasswordMismatch && (
            <p
              id="register-password-error"
              role="alert"
              className="mt-2 flex items-center gap-2 text-sm font-medium text-red-300"
            >
              <AlertCircle size={16} className="shrink-0" />
              {passwordError}
            </p>
          )}
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
            Creando cuenta...
          </>
        ) : (
          "Crear cuenta"
        )}
      </Button>

      <p className="mt-6 text-center text-sm text-slate-400">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-cyan-300 transition hover:text-cyan-200 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}