"use client";

import AddTaskButton from "@/components/tasks/AddTaskButton";
import SearchBar from "@/components/SearchBar";
import TaskFilters from "@/components/tasks/TaskFilters";
import PriorityFilters from "@/components/tasks/PriorityFilter";
import SortTasks from "@/components/tasks/SortTasks";
import CalendarView from "@/components/tasks/CalendarView";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import TaskBoard from "@/components/tasks/TaskBoard";

import {
  CheckCircle2,
  Clock3,
  ListTodo,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";

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
  }[];

  completed: number;
  pending: number;
  high: number;
  medium: number;
  low: number;
  productivity: number;
}

export default function DashboardContent({
  tasks,
  completed,
  pending,
  high,
  medium,
  low,
  productivity,
}: DashboardContentProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* HEADER DEL DASHBOARD */}
      <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ListTodo
                size={22}
                className="text-primary"
              />
            </div>

            <span className="text-sm font-semibold tracking-[0.2em] text-primary">
              FLOWDESK
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            {t.dashboard.title}
          </h1>

          <p className="mt-3 max-w-xl text-muted-foreground">
            {t.dashboard.description}
          </p>
        </div>

        <AddTaskButton />
      </header>

      {/* BIENVENIDA */}
      <section className="relative mb-8 overflow-hidden rounded-[28px] border border-primary/20 bg-gradient-to-br from-primary/15 via-info/10 to-violet/10 p-7 shadow-2xl shadow-primary/10 sm:p-9">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-info/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              {t.dashboard.todaySummary}
            </p>

            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              {t.dashboard.welcome}
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              {t.dashboard.welcomeDescription}
            </p>
          </div>

          <div className="min-w-[190px] rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-xl">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <ListTodo size={16} />
              {t.dashboard.totalTasks}
            </div>

            <p className="text-5xl font-black text-foreground">
              {tasks.length}
            </p>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL */}
        <div className="group rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <ListTodo
                size={21}
                className="text-primary"
              />
            </div>

            <span className="text-xs font-semibold tracking-wider text-muted-foreground">
              {t.dashboard.statistics.total}
            </span>
          </div>

          <p className="text-3xl font-bold text-foreground">
            {tasks.length}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {t.dashboard.statistics.createdTasks}
          </p>
        </div>

        {/* COMPLETADAS */}
        <div className="group rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-success/50 hover:shadow-lg hover:shadow-success/5">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle2
                size={21}
                className="text-success"
              />
            </div>

            <span className="text-xs font-semibold tracking-wider text-muted-foreground">
              {t.dashboard.statistics.completed}
            </span>
          </div>

          <p className="text-3xl font-bold text-foreground">
            {completed}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {t.dashboard.statistics.finishedTasks}
          </p>
        </div>

        {/* PENDIENTES */}
        <div className="group rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-warning/50 hover:shadow-lg hover:shadow-warning/5">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10">
              <Clock3
                size={21}
                className="text-warning"
              />
            </div>

            <span className="text-xs font-semibold tracking-wider text-muted-foreground">
              {t.dashboard.statistics.pending}
            </span>
          </div>

          <p className="text-3xl font-bold text-foreground">
            {pending}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {t.dashboard.statistics.pendingTasks}
          </p>
        </div>

        {/* PRODUCTIVIDAD */}
        <div className="group rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-violet/50 hover:shadow-lg hover:shadow-violet/5">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet/10">
              <TrendingUp
                size={21}
                className="text-violet"
              />
            </div>

            <span className="text-xs font-semibold tracking-wider text-muted-foreground">
              {t.dashboard.statistics.productivity}
            </span>
          </div>

          <p className="text-3xl font-bold text-foreground">
            {productivity}%
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-info transition-all duration-700"
              style={{
                width: `${productivity}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* ACTIVIDAD Y RESUMEN */}
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {t.dashboard.activity}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t.dashboard.activityDescription}
            </p>
          </div>

          <DashboardCharts
            completed={completed}
            pending={pending}
            high={high}
            medium={medium}
            low={low}
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {t.dashboard.summary}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t.dashboard.summaryDescription}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2
                    size={18}
                    className="text-success"
                  />
                </div>

                <span className="text-sm text-foreground">
                  {t.dashboard.completed}
                </span>
              </div>

              <span className="font-bold text-foreground">
                {completed}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Clock3
                    size={18}
                    className="text-warning"
                  />
                </div>

                <span className="text-sm text-foreground">
                  {t.dashboard.pending}
                </span>
              </div>

              <span className="font-bold text-foreground">
                {pending}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertCircle
                    size={18}
                    className="text-destructive"
                  />
                </div>

                <span className="text-sm text-foreground">
                  {t.dashboard.highPriority}
                </span>
              </div>

              <span className="font-bold text-foreground">
                {high}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS */}
      <section className="mb-8 rounded-2xl border border-border bg-card p-5">
        <div className="mb-5">
          <h2 className="font-bold text-foreground">
            {t.dashboard.myTasks}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {t.dashboard.myTasksDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <SearchBar />
          <TaskFilters />
          <PriorityFilters />
          <SortTasks />
        </div>
      </section>

      {/* CALENDARIO Y TABLERO */}
      <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-4 px-2 font-bold text-foreground">
            {t.dashboard.calendar}
          </h2>

          <CalendarView tasks={tasks} />
        </div>

        <div>
          {tasks.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <ListTodo
                  size={30}
                  className="text-primary"
                />
              </div>

              <h2 className="text-2xl font-bold text-foreground">
                {t.dashboard.noTasks}
              </h2>

              <p className="mt-2 max-w-md text-muted-foreground">
                {t.dashboard.noTasksDescription}
              </p>

              <div className="mt-6">
                <AddTaskButton />
              </div>
            </div>
          ) : (
            <TaskBoard tasks={tasks} />
          )}
        </div>
      </section>
    </>
  );
}