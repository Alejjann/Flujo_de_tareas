"use client";

import type { ReactNode } from "react";

import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListPlus,
  ListTodo,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import AddTaskButton from "@/components/tasks/AddTaskButton";
import CalendarView from "@/components/tasks/CalendarView";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import PriorityFilters from "@/components/tasks/PriorityFilter";
import SearchBar from "@/components/SearchBar";
import TaskBoard from "@/components/tasks/TaskBoard";
import TaskFilters from "@/components/tasks/TaskFilters";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useSearchParams } from "next/navigation";

interface DashboardContentProps {
  tasks: {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: Date | null;
    tag: string | null;
    position: number;
  }[];
  completed: number;
  pending: number;
  high: number;
  medium: number;
  low: number;
  productivity: number;
  isFirstTask: boolean;
  guestMode?: boolean;
}

function StatCard({
  icon,
  iconClassName,
  label,
  value,
  description,
  accentClassName = "",
  children,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string | number;
  description: string;
  accentClassName?: string;
  children?: ReactNode;
}) {
  return (
    <article
      className={`ui-card-interactive group relative min-w-0 overflow-hidden p-4 sm:p-5 lg:p-6 ${accentClassName}`}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-current opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5">
        <div
          className={`ui-icon-box h-10 w-10 rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl ${iconClassName}`}
        >
          {icon}
        </div>

        <span className="max-w-[55%] truncate text-right text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:text-[11px]">
          {label}
        </span>
      </div>

      <p className="text-2xl font-black tracking-[-0.04em] text-foreground sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 min-h-5 text-xs leading-5 text-muted-foreground sm:text-sm">
        {description}
      </p>

      {children}
    </article>
  );
}

function SummaryRow({
  icon,
  iconClassName,
  label,
  value,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: number;
}) {
  return (
    <div className="ui-card-subtle group flex items-center justify-between gap-3 px-3.5 py-3 transition-colors duration-200 hover:border-primary/25 hover:bg-secondary/70 sm:px-4 sm:py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`ui-icon-box h-9 w-9 rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconClassName}`}
        >
          {icon}
        </div>

        <span className="truncate text-sm font-semibold text-foreground">
          {label}
        </span>
      </div>

      <span className="shrink-0 rounded-lg bg-card px-2.5 py-1 text-sm font-bold tabular-nums text-foreground shadow-sm ring-1 ring-inset ring-border">
        {value}
      </span>
    </div>
  );
}

export default function DashboardContent({
  tasks,
  completed,
  pending,
  high,
  medium,
  low,
  productivity,
  isFirstTask,
  guestMode = false,
}: DashboardContentProps) {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();

  const safeProductivity = Math.min(
    Math.max(productivity, 0),
    100
  );

  const totalTasksLabel = t.dashboard.totalTasks.toLowerCase();

  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status") ?? "all";
  const priority = searchParams.get("priority") ?? "all";

  type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

  const VALID_PRIORITIES: TaskPriority[] = [
    "LOW",
    "MEDIUM",
    "HIGH",
  ];

  const selectedPriority = VALID_PRIORITIES.includes(
    priority as TaskPriority
  )
    ? (priority as TaskPriority)
    : null;

  const filteredTasks = tasks
    .filter((task) => {
      if (!search) {
        return true;
      }

      const normalizedSearch = search.toLocaleLowerCase();

      return (
        task.title.toLocaleLowerCase().includes(normalizedSearch) ||
        task.description
          ?.toLocaleLowerCase()
          .includes(normalizedSearch) ||
        task.tag?.toLocaleLowerCase().includes(normalizedSearch)
      );
    })
    .filter((task) => {
      if (status === "completed") {
        return task.status === "COMPLETED";
      }

      if (status === "pending") {
        return (
          task.status === "PENDING" ||
          task.status === "IN_PROGRESS"
        );
      }

      return true;
    })
    .filter((task) => {
      if (!selectedPriority) {
        return true;
      }

      return task.priority === selectedPriority;
    });

  /*
   * Textos que antes estaban escritos directamente en español.
   * Se mantienen aquí de momento para que no tengas que cambiar
   * el enorme archivo translations.ts.
   */
  const onboarding =
    language === "es"
      ? {
          badge: "Tu primer paso",
          title: "¡Empieza a organizar tu día!",
          description:
            "Aún no tienes tareas. Crea la primera, añade una fecha o prioridad y convierte FlowDesk en tu espacio de trabajo.",
          hint:
            "Pulsa el botón “Nueva tarea” situado abajo a la derecha.",
          addTasks: "Añade tareas",
          setPriorities: "Define prioridades",
          completeGoals: "Completa objetivos",
          emptyHint:
            "Usa el botón “Nueva tarea” que permanece abajo a la derecha.",
        }
      : {
          badge: "Your first step",
          title: "Start organizing your day!",
          description:
            "You do not have any tasks yet. Create your first one, add a due date or priority, and make FlowDesk your personal workspace.",
          hint:
            "Click the “New task” button at the bottom right.",
          addTasks: "Add tasks",
          setPriorities: "Set priorities",
          completeGoals: "Complete goals",
          emptyHint:
            "Use the “New task” button at the bottom right.",
      };

  return (
    <>
      {/* CABECERA */}
      <header className="mb-8 border-b border-border/80 pb-8 sm:mb-10 sm:pb-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.065em] text-foreground sm:text-5xl lg:text-6xl">
            {t.dashboard.title}
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-muted-foreground sm:text-base">
            {t.dashboard.description}
          </p>
        </div>
      </header>

      {/* ONBOARDING: solo al no tener tareas */}
      {isFirstTask && (
        <section className="ui-glow-card relative mb-6 overflow-hidden p-5 sm:mb-8 sm:p-7 lg:p-8">
          <div className="relative z-10 grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="max-w-2xl">
              <span className="ui-badge ui-badge-primary">
                <Sparkles size={14} />
                {onboarding.badge}
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl">
                {onboarding.title}
              </h2>

              <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                {onboarding.description}
              </p>

              <p className="mt-6 text-sm font-semibold text-primary">
                {onboarding.hint}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:w-[310px]">
              <div className="rounded-2xl border border-white/10 bg-slate-950/15 p-3 text-center backdrop-blur-sm sm:p-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <ListPlus size={19} />
                </div>

                <p className="mt-3 text-xs font-bold text-foreground">
                  {onboarding.addTasks}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/15 p-3 text-center backdrop-blur-sm sm:p-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-violet/15 text-violet">
                  <Target size={19} />
                </div>

                <p className="mt-3 text-xs font-bold text-foreground">
                  {onboarding.setPriorities}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/15 p-3 text-center backdrop-blur-sm sm:p-4">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
                  <CheckCircle2 size={19} />
                </div>

                <p className="mt-3 text-xs font-bold text-foreground">
                  {onboarding.completeGoals}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RESUMEN PRINCIPAL */}
      <section className="relative mb-6 overflow-hidden rounded-3xl border border-primary/20 bg-card p-5 shadow-lg shadow-primary/[0.06] sm:mb-8 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.13] via-transparent to-info/[0.08]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-[28%] h-56 w-56 rounded-full bg-info/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary sm:text-[11px]">
              {t.dashboard.todaySummary}
            </p>

            <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] text-foreground sm:text-3xl">
              {t.dashboard.welcome}
            </h2>

            <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {t.dashboard.welcomeDescription}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href="#my-tasks"
                className="ui-button-primary h-10 px-4 text-sm"
              >
                <ListTodo size={16} />
                {t.dashboard.myTasks}
                <ArrowRight size={16} />
              </a>

              <span className="inline-flex h-10 items-center rounded-xl border border-border bg-card/75 px-4 text-sm font-semibold text-muted-foreground shadow-sm backdrop-blur-sm">
                <Clock3 size={15} className="mr-2 text-warning" />
                {pending} {t.status.pendingPlural.toLowerCase()}
              </span>
            </div>
          </div>

          <div className="w-full rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-xl sm:max-w-[280px] sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                <TrendingUp size={15} className="text-violet" />
                {t.dashboard.statistics.productivity}
              </span>

              <span className="text-xl font-black tracking-[-0.04em] text-violet">
                {safeProductivity}%
              </span>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-label={t.dashboard.statistics.productivity}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={safeProductivity}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-info to-violet transition-all duration-700 ease-out"
                style={{
                  width: `${safeProductivity}%`,
                }}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 divide-x divide-border border-t border-border pt-4">
              <div className="pr-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {t.dashboard.totalTasks}
                </p>

                <p className="mt-1 text-2xl font-black tracking-[-0.045em] text-foreground">
                  {tasks.length}
                </p>
              </div>

              <div className="pl-4 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {t.dashboard.completed}
                </p>

                <p className="mt-1 text-2xl font-black tracking-[-0.045em] text-success">
                  {completed}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MÉTRICAS */}
      <section
        className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-5 xl:grid-cols-4"
        aria-label={t.dashboard.statistics.total}
      >
        <StatCard
          icon={<ListTodo size={20} />}
          iconClassName="ui-icon-primary"
          label={t.dashboard.statistics.total}
          value={tasks.length}
          description={t.dashboard.statistics.createdTasks}
          accentClassName="text-primary hover:border-primary/45 hover:shadow-primary/10"
        />

        <StatCard
          icon={<CheckCircle2 size={20} />}
          iconClassName="ui-icon-success"
          label={t.dashboard.statistics.completed}
          value={completed}
          description={t.dashboard.statistics.finishedTasks}
          accentClassName="text-success hover:border-success/45 hover:shadow-success/10"
        />

        <StatCard
          icon={<Clock3 size={20} />}
          iconClassName="ui-icon-warning"
          label={t.dashboard.statistics.pending}
          value={pending}
          description={t.dashboard.statistics.pendingTasks}
          accentClassName="text-warning hover:border-warning/45 hover:shadow-warning/10"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          iconClassName="ui-icon-violet"
          label={t.dashboard.statistics.productivity}
          value={`${safeProductivity}%`}
          description={t.dashboard.statistics.productivity}
          accentClassName="text-violet hover:border-violet/45 hover:shadow-violet/10"
        >
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-label={t.dashboard.statistics.productivity}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safeProductivity}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-info to-violet transition-all duration-700 ease-out"
              style={{
                width: `${safeProductivity}%`,
              }}
            />
          </div>
        </StatCard>
      </section>

      {/* ACTIVIDAD Y RESUMEN */}
      {!isFirstTask && (
        <section className="mb-6 grid gap-6 sm:mb-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(290px,1fr)]">
          <article className="ui-card-main overflow-hidden p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-border pb-5 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-6">
              <div>
                <h2 className="ui-section-title">
                  {t.dashboard.activity}
                </h2>

                <p className="ui-section-description">
                  {t.dashboard.activityDescription}
                </p>
              </div>

              <div className="ui-badge ui-badge-primary w-fit">
                <TrendingUp size={14} />
                {safeProductivity}%
              </div>
            </div>

            <DashboardCharts
              completed={completed}
              pending={pending}
              high={high}
              medium={medium}
              low={low}
            />
          </article>

          <article className="ui-card-main p-5 sm:p-6">
            <div className="mb-5 border-b border-border pb-5 sm:mb-6 sm:pb-6">
              <h2 className="ui-section-title">
                {t.dashboard.summary}
              </h2>

              <p className="ui-section-description">
                {t.dashboard.summaryDescription}
              </p>
            </div>

            <div className="space-y-3">
              <SummaryRow
                icon={<CheckCircle2 size={18} />}
                iconClassName="ui-icon-success"
                label={t.dashboard.completed}
                value={completed}
              />

              <SummaryRow
                icon={<Clock3 size={18} />}
                iconClassName="ui-icon-warning"
                label={t.dashboard.pending}
                value={pending}
              />

              <SummaryRow
                icon={<AlertCircle size={18} />}
                iconClassName="ui-icon-danger"
                label={t.dashboard.highPriority}
                value={high}
              />
            </div>
          </article>
        </section>
      )}

      {/* FILTROS */}
      <section
        id="my-tasks"
        className="ui-card-main mb-6 scroll-mt-28 p-4 sm:mb-8 sm:p-5"
      >
        <div className="mb-4 flex flex-col gap-1 border-b border-border pb-4 sm:mb-5 sm:pb-5">
          <h2 className="ui-section-title text-lg sm:text-xl">
            {t.dashboard.myTasks}
          </h2>

          <p className="ui-section-description text-xs sm:text-sm">
            {t.dashboard.myTasksDescription}
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-md">
            <SearchBar />
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <TaskFilters />
            <PriorityFilters />
          </div>
        </div>
      </section>

      {/* CALENDARIO Y TABLERO */}
      <section className="grid gap-6 pb-24 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="ui-card-main h-fit overflow-hidden p-4 sm:p-5 xl:sticky xl:top-24">
          <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
            <div className="ui-icon-box ui-icon-primary h-9 w-9 rounded-xl">
              <CalendarDays size={18} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-foreground sm:text-base">
                {t.dashboard.calendar}
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {filteredTasks.length} {totalTasksLabel}
              </p>
            </div>
          </div>

          <CalendarView tasks={filteredTasks} />
        </aside>

        <div className="min-w-0">
          {filteredTasks.length === 0 ? (
            <div className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-primary/35 bg-card p-7 text-center shadow-sm sm:min-h-[420px] sm:p-12">
              <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-info/10 blur-3xl" />

              <div className="relative">
                <div className="ui-icon-box ui-icon-primary mx-auto mb-5 h-16 w-16 rounded-3xl sm:h-20 sm:w-20">
                  <ListTodo size={32} />
                </div>

                <h2 className="text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
                  {t.dashboard.noTasks}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
                  {t.dashboard.noTasksDescription}
                </p>

                <p className="mx-auto mt-5 max-w-sm text-sm font-semibold text-primary">
                  {onboarding.emptyHint}
                </p>
              </div>
            </div>
          ) : (
            <TaskBoard tasks={filteredTasks} guestMode={guestMode} />
          )}
        </div>
      </section>

      {/* BOTÓN FLOTANTE */}
      <AddTaskButton variant="floating" guestMode={guestMode} />
    </>
  );
}