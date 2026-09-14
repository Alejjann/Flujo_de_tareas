
"use client";

import Image from "next/image";

import RegisterForm from "@/components/auth/RegisterForm";
import { useLanguage } from "@/components/providers/LanguageProvider";

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

export default function RegisterPageContent() {
  const { language } = useLanguage();

  const copy =
    language === "es"
      ? {
          titleFirst: "Tu trabajo,",
          titleAccent: "más claro y simple.",
          description:
            "Crea tu cuenta y reúne tareas, objetivos y avances en un único espacio diseñado para ayudarte a concentrarte.",
          stepOne: "Organiza tus tareas en segundos.",
          stepTwo: "Visualiza tu progreso con claridad.",
          stepThree: "Mantén el foco en lo importante.",
        }
      : {
          titleFirst: "Your work,",
          titleAccent: "clearer and simpler.",
          description:
            "Create your account and keep tasks, goals, and progress together in one focused workspace designed to help you stay on track.",
          stepOne: "Organize your tasks in seconds.",
          stepTwo: "See your progress clearly.",
          stepThree: "Stay focused on what matters.",
        };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08111f] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-[-12rem] h-[31rem] w-[31rem] rounded-full bg-violet-500/15 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-cyan-400/15 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/45 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative hidden min-h-[720px] overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <FlowDeskLogo size={44} />

                <span className="text-2xl font-black tracking-[-0.04em] text-white">
                  Flow<span className="text-cyan-300">Desk</span>
                </span>
              </div>

              <div className="mt-16 max-w-md">
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

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/15 text-sm font-black text-cyan-200">
                  1
                </span>

                <p className="text-sm font-medium text-slate-300">
                  {copy.stepOne}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-400/15 text-sm font-black text-violet-200">
                  2
                </span>

                <p className="text-sm font-medium text-slate-300">
                  {copy.stepTwo}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-400/15 text-sm font-black text-sky-200">
                  3
                </span>

                <p className="text-sm font-medium text-slate-300">
                  {copy.stepThree}
                </p>
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

              <RegisterForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}