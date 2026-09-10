import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  LockKeyhole,
  PlayCircle,
  Sparkles,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-32 top-24 h-[360px] w-[360px] rounded-full bg-info/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-violet/10 blur-3xl" />
      </div>

      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-info text-primary-foreground shadow-lg shadow-primary/25">
            <LayoutDashboard size={20} />
          </div>

          <span className="text-2xl font-black tracking-[-0.05em]">
            Flow<span className="text-primary">Desk</span>
          </span>
        </Link>

        <Link
          href="/login"
          className="rounded-xl px-4 py-2 text-sm font-bold text-muted-foreground transition hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Iniciar sesión
        </Link>
      </header>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-5 pb-16 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-24 lg:px-8 lg:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
          <Sparkles size={15} />
          Organiza el trabajo de tu equipo
        </div>

        <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.07em] text-foreground sm:text-6xl lg:text-8xl">
          Convierte las tareas en
          <span className="block bg-gradient-to-r from-primary via-info to-violet bg-clip-text text-transparent">
            progreso visible.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-base font-medium leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          FlowDesk ayuda a equipos y empresas a organizar tareas,
          establecer prioridades y mover el trabajo desde pendientes
          hasta completado en un tablero claro y visual.
        </p>

        <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/guest"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <PlayCircle size={18} />
            Probar sin iniciar sesión
            <ArrowRight size={17} />
          </Link>

          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <LockKeyhole size={17} />
            Iniciar sesión
          </Link>
        </div>

        <p className="mt-4 text-xs font-medium text-muted-foreground">
          Puedes usar FlowDesk sin cuenta. Tus tareas se guardan en este
          navegador.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="ui-card-main p-6">
            <div className="ui-icon-box ui-icon-primary h-11 w-11 rounded-2xl">
              <LayoutDashboard size={21} />
            </div>

            <h2 className="mt-5 text-lg font-black tracking-[-0.03em] text-foreground">
              Tablero Kanban
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Mueve tareas entre Pendientes, En progreso y Completadas
              con arrastrar y soltar.
            </p>
          </article>

          <article className="ui-card-main p-6">
            <div className="ui-icon-box ui-icon-success h-11 w-11 rounded-2xl">
              <CheckCircle2 size={21} />
            </div>

            <h2 className="mt-5 text-lg font-black tracking-[-0.03em] text-foreground">
              Prioridades claras
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Distingue tareas de prioridad alta, media o baja y conoce
              rápidamente qué necesita atención.
            </p>
          </article>

          <article className="ui-card-main p-6">
            <div className="ui-icon-box ui-icon-violet h-11 w-11 rounded-2xl">
              <Users size={21} />
            </div>

            <h2 className="mt-5 text-lg font-black tracking-[-0.03em] text-foreground">
              Para equipos
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Prueba el flujo completo de tareas antes de iniciar sesión.
              Todo se guarda localmente en tu navegador.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-10">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-foreground sm:text-3xl">
            Empieza a organizar tu trabajo hoy.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Prueba FlowDesk directamente o inicia sesión para guardar tus
            tareas en una cuenta y acceder desde cualquier dispositivo.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/guest"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-primary/90"
            >
              Probar FlowDesk
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-sm font-bold text-foreground transition hover:bg-secondary"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}