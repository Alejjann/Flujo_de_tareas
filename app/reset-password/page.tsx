"use client";

import type { ChangeEvent, FormEvent } from "react";

import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Circle,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { resetPassword } from "@/actions/resetPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PASSWORD_MIN_LENGTH = 8;

function FlowDeskLogo({
  size = 44,
}: {
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg shadow-cyan-500/25"
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src="/flowdesk_logo.png"
        alt="FlowDesk"
        width={size}
        height={size}
        priority
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
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

  const passwordsAreComparable =
    form.password.length > 0 &&
    form.confirmPassword.length > 0;

  const passwordsMatch =
    passwordsAreComparable &&
    form.password === form.confirmPassword;

  const hasPasswordMismatch =
    passwordsAreComparable && !passwordsMatch;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!token) {
      setError(
        "Este enlace no es válido o ha caducado. Solicita uno nuevo."
      );
      return;
    }

    if (!form.password) {
      setError("Introduce una nueva contraseña.");
      return;
    }

    if (!isPasswordValid) {
      setError(
        "La contraseña no cumple todos los requisitos indicados."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await resetPassword(
        token,
        form.password
      );

      if (result?.success) {
        toast.success(
          "Contraseña actualizada. Ya puedes iniciar sesión."
        );

        window.location.assign("/login?passwordReset=1");
      }
    } catch (error) {
      console.error("ERROR RESTABLECIENDO CONTRASEÑA:", error);

      const message =
        error instanceof Error
          ? error.message
          : "No se pudo restablecer la contraseña. Solicita un enlace nuevo e inténtalo otra vez.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07101f] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-[-12rem] h-[31rem] w-[31rem] rounded-full bg-cyan-400/15 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-violet-500/15 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[35rem] w-[35rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#13233a]/95 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden min-h-[680px] overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <FlowDeskLogo size={44} />

                <span className="text-2xl font-black tracking-[-0.04em] text-white">
                  Flow<span className="text-cyan-300">Desk</span>
                </span>
              </div>

              <div className="mt-20 max-w-md">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-bold text-violet-200">
                  <ShieldCheck size={14} />
                  Cuenta protegida
                </span>

                <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-[-0.065em] text-white">
                  Recupera el acceso
                  <br />
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                    con seguridad.
                  </span>
                </h1>

                <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">
                  Elige una contraseña única y segura para proteger
                  tus tareas, proyectos y progreso.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Enlace de un solo uso
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Por seguridad, este enlace solo puede utilizarse
                    una vez y caduca en 30 minutos.
                  </p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          </section>

          <section className="flex min-h-[620px] items-center p-5 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-9 flex items-center justify-center gap-2.5 lg:hidden">
                <FlowDeskLogo size={40} />

                <span className="text-xl font-black tracking-[-0.04em] text-white">
                  Flow<span className="text-cyan-300">Desk</span>
                </span>
              </div>

              <Link
                href="/login"
                className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
              >
                <ArrowLeft size={17} />
                Volver a iniciar sesión
              </Link>

              <div className="mb-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-300">
                  <KeyRound size={22} />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Recuperación de cuenta
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                  Nueva contraseña
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Crea una contraseña segura para volver a acceder a
                  tu cuenta.
                </p>
              </div>

              {!token && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-medium leading-6 text-red-200"
                >
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />

                  <span>
                    Este enlace no es válido o ha caducado. Solicita
                    uno nuevo desde la pantalla de recuperación.
                  </span>
                </div>
              )}

              {error && token && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-medium leading-6 text-red-200"
                >
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200"
                  >
                    <LockKeyhole size={16} className="text-cyan-300" />
                    Contraseña nueva
                  </label>

                  <div className="relative">
                    <Input
                      id="new-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Crea una contraseña segura"
                      autoComplete="new-password"
                      disabled={loading || !token}
                      aria-invalid={hasPasswordMismatch}
                      aria-describedby={
                        form.password
                          ? "password-rules"
                          : undefined
                      }
                      className={`h-12 border-white/10 !bg-[#07101f]/80 pr-12 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 ${
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
                      disabled={loading || !token}
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
                      id="password-rules"
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
                              <Check
                                size={14}
                                className="shrink-0"
                              />
                            ) : (
                              <Circle
                                size={14}
                                className="shrink-0"
                              />
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
                    htmlFor="confirm-password"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200"
                  >
                    <LockKeyhole size={16} className="text-cyan-300" />
                    Confirmar contraseña
                  </label>

                  <div className="relative">
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repite la contraseña"
                      autoComplete="new-password"
                      disabled={loading || !token}
                      aria-invalid={hasPasswordMismatch}
                      aria-describedby={
                        hasPasswordMismatch
                          ? "password-match-error"
                          : undefined
                      }
                      className={`h-12 border-white/10 !bg-[#07101f]/80 pr-12 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 ${
                        hasPasswordMismatch
                          ? "border-red-400/70 focus:border-red-400 focus:ring-red-400/10"
                          : passwordsMatch
                            ? "border-emerald-400/70 focus:border-emerald-400 focus:ring-emerald-400/10"
                            : ""
                      }`}
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      disabled={loading || !token}
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
                      id="password-match-error"
                      role="alert"
                      className="mt-2 flex items-center gap-2 text-sm font-medium text-red-300"
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      Las contraseñas no coinciden.
                    </p>
                  )}

                  {passwordsMatch && (
                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-emerald-300">
                      <Check size={16} className="shrink-0" />
                      Las contraseñas coinciden.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || !token}
                  className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:from-cyan-300 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Guardando contraseña...
                    </>
                  ) : (
                    <>
                      <KeyRound size={18} />
                      Cambiar contraseña
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                Al cambiar tu contraseña, el enlace de recuperación
                quedará invalidado por seguridad.
              </p>

              <p className="mt-6 text-center text-xs text-slate-600">
                © {new Date().getFullYear()} FlowDesk
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}