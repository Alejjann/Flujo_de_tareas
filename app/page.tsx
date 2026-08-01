import { prisma } from "@/lib/prisma";
import { CheckCircle, Clock, Plus } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import AddTaskButton from "@/components/tasks/AddTaskButton";
import TaskCard from "@/components/tasks/TaskCard";
import TaskFilters from "@/components/tasks/TaskFilters";
import PriorityFilters from "@/components/tasks/PriorityFilter";
import SortTasks from "@/components/tasks/SortTasks";
import CalendarView from "@/components/tasks/CalendarView";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

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
const { search, status, priority, sort } = await searchParams;
const tasks = await prisma.task.findMany({
  where: {
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
          completed: true,
        }
      : {}),

    ...(status === "pending"
      ? {
          completed: false,
        }
      : {}),

      ...(priority
      ? {
          priority: priority as "LOW" | "MEDIUM" | "HIGH",
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
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const high = tasks.filter(t => t.priority === "HIGH").length;
  const medium = tasks.filter(t => t.priority === "MEDIUM").length;
  const low = tasks.filter(t => t.priority === "LOW").length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-8 py-10">

      <div className="flex items-center justify-between">
  <div>
    <h1 className="text-4xl font-bold">TaskFlow</h1>
    <p className="mt-2 text-slate-400">
      Organiza tus tareas de forma sencilla.
    </p>
  </div>

</div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <CheckCircle className="mb-3 text-green-400" size={34} />
            <h2 className="text-3xl font-bold">{completed}</h2>
            <p className="text-slate-400">Completadas</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <Clock className="mb-3 text-yellow-400" size={34} />
            <h2 className="text-3xl font-bold">{pending}</h2>
            <p className="text-slate-400">Pendientes</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <CheckCircle className="mb-3 text-cyan-400" size={34} />
            <h2 className="text-3xl font-bold">{tasks.length}</h2>
            <p className="text-slate-400">Total</p>
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
      <div className="rounded-2xl border border-dashed border-slate-700 p-12 text-center">
        <h2 className="text-2xl font-bold">
          No hay tareas
        </h2>

        <p className="mt-3 text-slate-400">
          Crea tu primera tarea.
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
 