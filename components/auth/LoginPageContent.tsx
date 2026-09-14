"use client";

import Image from "next/image";

import LoginForm from "@/components/auth/LoginForm";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function LoginPageContent() {
  const { language } = useLanguage();

  const copy =
    language === "es"
      ? {
          badge: "Tu espacio de trabajo",
          titleFirst: "Organiza hoy.",
          titleAccent: "Avanza cada día.",
          description:
            "Centraliza tus tareas, controla tu progreso y mantén el foco en lo que realmente importa.",
          featureTitle: "Todo en un mismo lugar.",
          featureDescription:
            "Planifica, organiza y sigue tu progreso con FlowDesk.",
        }
      : {
          badge: "Your workspace",
          titleFirst: "Organize today.",
          titleAccent: "Make progress every day.",
          description:
            "Keep your tasks in one place, track your progress, and stay focused on what truly matters.",
          featureTitle: "Everything in one place.",
          featureDescription:
            "Plan, organize, and track your progress with FlowDesk.",
        };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08111f] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full bg-info/15 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/45 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative hidden min-h-[640px] overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg shadow-cyan-500/20">
                  <Image
                    src="/flowdesk_logo.png"
                    alt=""
                    width={44}
                    height={44}
                    priority
                    className="h-full w-full object-contain"
                  />
                </div>

                <span className="text-2xl font-black tracking-[-0.04em] text-white">
                  Flow<span className="text-cyan-300">Desk</span>
                </span>
              </div>

              <div className="mt-20 max-w-md">
                <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
                  {copy.badge}
                </span>

                <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-[-0.065em] text-white">
                  {copy.titleFirst}
                  <br />

                  <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                    {copy.titleAccent}
                  </span>
                </h1>

                <p className="mt-6 max-w-sm text-base leading-7 text-slate-300">
                  {copy.description}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">
                {copy.featureTitle}
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                {copy.featureDescription}
              </p>
            </div>

            <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
          </section>

          <section className="flex min-h-[560px] items-center p-5 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-10 flex items-center justify-center gap-2.5 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg shadow-cyan-500/20">
                  <Image
                    src="/flowdesk_logo.png"
                    alt=""
                    width={40}
                    height={40}
                    priority
                    className="h-full w-full object-contain"
                  />
                </div>

                <span className="text-xl font-black tracking-[-0.04em] text-white">
                  Flow<span className="text-cyan-300">Desk</span>
                </span>
              </div>

              <LoginForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}