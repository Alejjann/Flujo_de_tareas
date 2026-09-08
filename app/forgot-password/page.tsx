"use client";

import type { FormEvent } from "react";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Mail,
  Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { requestPasswordReset } from "@/actions/requestPasswordReset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!email.trim()) {
      toast.error("Introduce tu correo electrónico.");
      return;
    }

    setLoading(true);

    try {
      const result = await requestPasswordReset(email);

      setSubmitted(true);
      setEmail("");
      toast.success(result.message);
    } catch (error) {
      console.error(
        "ERROR SOLICITANDO RECUPERACIÓN:",
        error
      );

      setSubmitted(true);
      setEmail("");
      toast.success(
        "Si existe una cuenta con ese correo, te hemos enviado un enlace para restablecer la contraseña."
      );
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
          {/* Panel de marca: solo escritorio */}
          <section className="relative hidden min-h-[620px] overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-sky-500 text-lg font-black text-slate-950 shadow-lg shadow-cyan-500/25">
                  F
                </div>

                <span className="text-2xl font-black tracking-[-0.04em] text-white">
                  Flow<span className="text-cyan-300">Desk</span>
                </span>
              </div>

              <div className="mt-20 max-w-md">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">
                  <Mail size={14} />
                  Recuperación de cuenta
                </span>

                <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-[-0.065em] text-white">
                  Vuelve a tu
                  <br />
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                    espacio de trabajo.
                  </span>
                </h1>

                <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">
                  Te enviaremos un enlace seguro para que puedas crear
                  una contraseña nueva y volver a FlowDesk.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    Proceso seguro
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Recibirás un enlace único que caduca después de 30
                    minutos.
                  </p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          </section>

          {/* Formulario */}
          <section className="flex min-h-[620px] items-center p-5 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              {/* Marca en móvil */}
              <div className="mb-9 flex items-center justify-center gap-2.5 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-sky-500 text-base font-black text-slate-950 shadow-lg shadow-cyan-500/25">
                  F
                </div>

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
                  <Mail size={22} />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Recuperación de cuenta
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-4xl">
                  ¿Olvidaste tu contraseña?
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Introduce el correo asociado a tu cuenta y te
                  enviaremos un enlace para crear una contraseña nueva.
                </p>
              </div>

              {submitted ? (
                <div
                  role="status"
                  className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={21}
                      className="mt-0.5 shrink-0 text-emerald-300"
                    />

                    <div>
                      <p className="font-semibold text-emerald-200">
                        Revisa tu correo
                      </p>

                      <p className="mt-1 text-sm leading-6 text-emerald-100/75">
                        Si existe una cuenta con ese correo, te hemos
                        enviado un enlace de recuperación. Revisa
                        también la carpeta de spam.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200"
                    >
                      <Mail size={16} className="text-cyan-300" />
                      Correo electrónico
                    </label>

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="tu@email.com"
                      autoComplete="email"
                      disabled={loading}
                      className="h-12 border-white/10 !bg-[#07101f]/80 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:from-cyan-300 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        Enviando enlace...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Enviar enlace de recuperación
                      </>
                    )}
                  </Button>
                </form>
              )}

              {submitted && (
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 w-full rounded-xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/[0.08] hover:text-white"
                >
                  Enviar a otro correo
                </button>
              )}

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