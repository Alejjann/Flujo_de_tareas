import { prisma } from "@/lib/prisma";
import { CheckCircle, Clock } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import AddTaskButton from "@/components/tasks/AddTaskButton";
import TaskFilters from "@/components/tasks/TaskFilters";
import PriorityFilters from "@/components/tasks/PriorityFilter";
import SortTasks from "@/components/tasks/SortTasks";
import CalendarView from "@/components/tasks/CalendarView";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import TaskBoard from "@/components/tasks/TaskBoard";
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
  const {
    search,
    status,
    priority,
    sort,
  } = await searchParams;

  const session = await auth();

  if (!session?.user?.id) {
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
            ? {
                status: "COMPLETED" as const,
                }
            : {}),

            ...(status === "pending"
            ? {
                status: {
                    in: ["PENDING", "IN_PROGRESS"] as const,
                },
                }
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
        ? {
            priority: "desc",
          }
        : sort === "title"
        ? {
            title: "asc",
          }
        : sort === "due"
        ? {
            dueDate: "asc",
          }
        : {
            createdAt: "desc",
          },
  });

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const pending =
    tasks.length - completed;

  const high = tasks.filter(
    (task) => task.priority === "HIGH"
  ).length;

  const medium = tasks.filter(
    (task) => task.priority === "MEDIUM"
  ).length;

  const low = tasks.filter(
    (task) => task.priority === "LOW"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-8 py-10">

        {/* HEADER */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Flow Desk
            </h1>

            <p className="mt-2 text-slate-400">
              Organiza tus tareas de forma sencilla.
            </p>
          </div>
       </div>

        {/* BIENVENIDA */}
        <div className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 p-8 shadow-2xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-3xl font-bold text-white">
                ¡Bienvenido de nuevo! 👋
              </h2>

              <p className="mt-2 text-cyan-100">
                Gestiona tus tareas de una forma rápida y organizada.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur">
              <p className="text-sm text-cyan-100">
                Total de tareas
              </p>

              <h3 className="text-4xl font-bold text-white">
                {tasks.length}
              </h3>
            </div>

          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10">
            <CheckCircle
              className="mb-3 text-green-400 transition-transform duration-300 group-hover:scale-110"
              size={34}
            />

            <h2 className="text-3xl font-bold">
              {completed}
            </h2>

            <p className="text-slate-400">
              Completadas
            </p>
          </div>

          <div className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10">
            <Clock
              className="mb-3 text-yellow-400 transition-transform duration-300 group-hover:scale-110"
              size={34}
            />

            <h2 className="text-3xl font-bold">
              {pending}
            </h2>

            <p className="text-slate-400">
              Pendientes
            </p>
          </div>

          <div className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10">
            <CheckCircle
              className="mb-3 text-cyan-400 transition-transform duration-300 group-hover:scale-110"
              size={34}
            />

            <h2 className="text-3xl font-bold">
              {tasks.length}
            </h2>

            <p className="text-slate-400">
              Total
            </p>
          </div>

        </div>

        {/* GRÁFICAS */}
        <div className="mt-10">
          <DashboardCharts
            completed={completed}
            pending={pending}
            high={high}
            medium={medium}
            low={low}
          />
        </div>

        {/* FILTROS */}
        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex flex-wrap items-center gap-3">
            <SearchBar />
            <TaskFilters />
            <PriorityFilters />
            <SortTasks />
          </div>

          <AddTaskButton />

        </div>

        {/* CALENDARIO + KANBAN */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">

          {/* CALENDARIO */}
          <div>
            <CalendarView tasks={tasks} />
          </div>

          {/* KANBAN */}
          <div>
            {tasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-700 p-12 text-center">

                <h2 className="text-2xl font-bold">
                  No hay tareas
                </h2>

                <p className="mt-3 text-slate-400">
                  Crea tu primera tarea para empezar.
                </p>

              </div>
            ) : (
              <TaskBoard
                tasks={tasks.map((task) => ({
                  id: task.id,
                  title: task.title,
                  description:
                    task.description,
                  completed:
                    task.completed,
                  status:
                    task.status as
                      | "PENDING"
                      | "IN_PROGRESS"
                      | "COMPLETED",
                  priority:
                    task.priority,
                  dueDate:
                    task.dueDate,
                  tag:
                    task.tag,
                }))}
              />
            )}
          </div>

        </div>

      </div>
    </main>
  );
}