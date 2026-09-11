"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Languages,
  ListTodo,
  LockKeyhole,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function HomePage() {
  const { language, setLanguage } = useLanguage();

  const isSpanish = language === "es";

  const copy = isSpanish
    ? {
        login: "Iniciar sesión",
        eyebrow: "Organiza tu día con claridad",
        brandDescription:
          "Tu espacio personal para planificar, priorizar y terminar lo importante.",
        titleFirst: "Convierte tus planes en",
        titleAccent: "progreso visible.",
        description:
          "FlowDesk te ayuda a organizar tus tareas, establecer prioridades y avanzar paso a paso desde un espacio claro y visual.",
        tryDemo: "Probar página de prueba",
        demoNote:
          "Prueba FlowDesk sin registrarte y organiza tus tareas directamente desde tu navegador.",
        featureOneTitle: "Organiza tus tareas",
        featureOneDescription:
          "Reúne tus pendientes, objetivos y recordatorios en un solo espacio.",
        featureTwoTitle: "Prioriza lo importante",
        featureTwoDescription:
          "Distingue lo urgente de lo secundario y concéntrate en lo que toca ahora.",
        featureThreeTitle: "Avanza a tu ritmo",
        featureThreeDescription:
          "Mueve tus tareas entre pendientes, en progreso y completadas para ver tu avance.",
        callTitle: "Empieza a organizar tu día hoy.",
        callDescription:
          "Prueba FlowDesk directamente o inicia sesión para guardar tus tareas en una cuenta y acceder a ellas desde cualquier dispositivo.",
        callDemo: "Probar página de prueba",
        changeToEnglish: "Cambiar idioma a inglés",
      }
    : {
        login: "Log in",
        eyebrow: "Organize your day with clarity",
        brandDescription:
          "Your personal space to plan, prioritize, and finish what matters.",
        titleFirst: "Turn your plans into",
        titleAccent: "visible progress.",
        description:
          "FlowDesk helps you organize your tasks, set priorities, and make steady progress from one clear visual workspace.",
        tryDemo: "Try the demo page",
        demoNote:
          "Try FlowDesk without signing up and organize your tasks directly in your browser.",
        featureOneTitle: "Organize your tasks",
        featureOneDescription:
          "Keep tasks, goals, and reminders together in one place.",
        featureTwoTitle: "Prioritize what matters",
        featureTwoDescription:
          "Separate urgent work from the rest and focus on what matters now.",
        featureThreeTitle: "Move at your own pace",
        featureThreeDescription:
          "Move tasks between pending, in progress, and completed to see your progress.",
        callTitle: "Start organizing your day today.",
        callDescription:
          "Try FlowDesk directly, or log in to save your tasks to an account and access them from any device.",
        callDemo: "Try the demo page",
        changeToEnglish: "Change language to Spanish",
      };

  function toggleLanguage() {
    setLanguage(language === "es" ? "en" : "es");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-32 top-24 h-[360px] w-[360px] rounded-full bg-info/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-violet/10 blur-3xl" />
      </div>

      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-xl px-1 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="FlowDesk"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-info to-violet text-sm font-black text-primary-foreground shadow-lg shadow-primary/25">
            F
          </span>

          <span className="text-xl font-black tracking-[-0.05em] text-foreground sm:text-2xl">
            Flow<span className="text-primary">Desk</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={copy.changeToEnglish}
            title={copy.changeToEnglish}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground transition hover:border-primary/60 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Languages size={17} className="text-primary" />
            <span>{language === "es" ? "EN" : "ES"}</span>
          </button>

          <Link
            href="/login"
            className="rounded-xl px-3 py-2 text-sm font-bold text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-4"
          >
            {copy.login}
          </Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-20 pt-20 text-center sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary shadow-sm sm:text-xs">
          <Sparkles size={15} />
          {copy.eyebrow}
        </div>

        <h1 className="mt-8 max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.065em] text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
          <span className="block">{copy.titleFirst}</span>

          <span className="mt-3 block bg-gradient-to-r from-primary via-info to-violet bg-clip-text pb-2 text-transparent">
            {copy.titleAccent}
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-base font-medium leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {copy.description}
        </p>

        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/guest"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <PlayCircle size={18} />
            {copy.tryDemo}
            <ArrowRight size={17} />
          </Link>

          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <LockKeyhole size={17} />
            {copy.login}
          </Link>
        </div>

        <p className="mt-4 max-w-md text-xs font-medium leading-5 text-muted-foreground">
          {copy.demoNote}
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="ui-card-main p-6">
            <div className="ui-icon-box ui-icon-primary h-11 w-11 rounded-2xl">
              <ListTodo size={21} />
            </div>

            <h2 className="mt-5 text-lg font-black tracking-[-0.03em] text-foreground">
              {copy.featureOneTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {copy.featureOneDescription}
            </p>
          </article>

          <article className="ui-card-main p-6">
            <div className="ui-icon-box ui-icon-success h-11 w-11 rounded-2xl">
              <CheckCircle2 size={21} />
            </div>

            <h2 className="mt-5 text-lg font-black tracking-[-0.03em] text-foreground">
              {copy.featureTwoTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {copy.featureTwoDescription}
            </p>
          </article>

          <article className="ui-card-main p-6">
            <div className="ui-icon-box ui-icon-violet h-11 w-11 rounded-2xl">
              <Target size={21} />
            </div>

            <h2 className="mt-5 text-lg font-black tracking-[-0.03em] text-foreground">
              {copy.featureThreeTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {copy.featureThreeDescription}
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-10">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-foreground sm:text-3xl">
            {copy.callTitle}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            {copy.callDescription}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/guest"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-primary/90"
            >
              {copy.callDemo}
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition hover:bg-secondary"
            >
              {copy.login}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}