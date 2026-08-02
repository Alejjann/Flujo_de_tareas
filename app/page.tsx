import { prisma } from "@/lib/prisma";
import {
  CheckCircle,
  Clock,
  ClipboardList,
} from "lucide-react";

import SearchBar from "@/components/SearchBar";
import AddTaskButton from "@/components/tasks/AddTaskButton";
import TaskCard from "@/components/tasks/TaskCard";
import TaskFilters from "@/components/tasks/TaskFilters";
import PriorityFilters from "@/components/tasks/PriorityFilter";
import SortTasks from "@/components/tasks/SortTasks";
import CalendarView from "@/components/tasks/CalendarView";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import UserMenu from "@/components/auth/UserMenu";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    sort?: string;
  }>;
}) {
  const { search, status, priority, sort } =
    await searchParams;

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,

      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),

      ...(status === "completed"
        ? { completed: true }
        : {}),

      ...(status === "pending"
        ? { completed: false }
        : {}),

      ...(priority
        ? {
            priority:
              priority as
                | "LOW"
                | "MEDIUM"
                | "HIGH",
          }
        : {}),
    },

    orderBy:
      sort === "priority"
        ? { priority: "desc" }
        : sort === "title"
        ? { title: "asc" }
        : sort === "due"
        ? { dueDate: "asc" }
        : { createdAt: "desc" },
  });

  const completed = tasks.filter(
    (t) => t.completed
  ).length;

  const pending = tasks.length - completed;

  const high = tasks.filter(
    (t) => t.priority === "HIGH"
  ).length;

  const medium = tasks.filter(
    (t) => t.priority === "MEDIUM"
  ).length;

  const low = tasks.filter(
    (t) => t.priority === "LOW"
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completed / tasks.length) * 100
        );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-8 py-10">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-5xl font-black tracking-tight">
              TaskFlow
            </h1>

            <p className="mt-2 text-slate-400">
              Organiza tus tareas de forma sencilla.
            </p>
          </div>

          <UserMenu />

        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 shadow-2xl shadow-cyan-500/20">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
                🚀 Dashboard
              </span>

              <h2 className="mt-5 text-4xl font-bold">
                ¡Bienvenido,
                {" "}
                {session.user.name || "Usuario"}!
              </h2>

              <p className="mt-4 max-w-xl text-cyan-100">
                Gestiona tus tareas, controla tu
                productividad y mantén todo bajo
                control desde un único lugar.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

                <p className="text-cyan-100">
                  📋 Total
                </p>

                <h3 className="text-4xl font-bold">
                  {tasks.length}
                    
                </h3>

              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

                <p className="text-cyan-100">
                  ✅ Completadas
                </p>

                <h3 className="text-4xl font-bold">
                {completed}
                  
                </h3>

              </div>

            </div>

          </div>

        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Progreso general
            </h2>

            <span className="font-bold text-cyan-400">
              {progress}%
            </span>

          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>
                <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/15">
              <CheckCircle
                size={30}
                className="text-green-400 transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            <h2 className="text-4xl font-bold">
             {completed}
            </h2>

            <p className="mt-2 text-slate-400">
              Completadas
            </p>

          </div>

          <div className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/15">
              <Clock
                size={30}
                className="text-yellow-400 transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            <h2 className="text-4xl font-bold">
              {pending} 
            </h2>

            <p className="mt-2 text-slate-400">
              Pendientes
            </p>

          </div>

          <div className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15">
              <ClipboardList
                size={30}
                className="text-cyan-400 transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            <h2 className="text-4xl font-bold">
          {tasks.length} 
            </h2>

            <p className="mt-2 text-slate-400">
              Total
            </p>

          </div>

        </div>

        <div className="mt-10">
          <DashboardCharts
            completed={completed}
            pending={pending}
            high={high}
            medium={medium}
            low={low}
          />
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex flex-wrap items-center gap-3">
            <SearchBar />
            <TaskFilters />
            <PriorityFilters />
            <SortTasks />
          </div>

          <AddTaskButton />

        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">

          <div>
            <CalendarView tasks={tasks} />
          </div>

          <div className="space-y-5">

            {tasks.length === 0 ? (

              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-14 text-center">

                <ClipboardList
                  className="mx-auto mb-6 text-slate-500"
                  size={60}
                />

                <h2 className="text-3xl font-bold">
                  No hay tareas
                </h2>

                <p className="mt-3 text-slate-400">
                  Crea tu primera tarea para empezar.
                </p>

              </div>

            ) : (

              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description ?? ""}
                  completed={task.completed}
                  priority={task.priority}
                  dueDate={task.dueDate}
                />
              ))

            )}

          </div>

        </div>

      </div>
    </main>
  );
}