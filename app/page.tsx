import { prisma } from "@/lib/prisma";
import { CheckCircle, Clock, Plus } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import AddTaskButton from "@/components/AddTaskButton";
import TaskCard from "@/components/tasks/TaskCard";

export default async function Home() {
  const tasks = await prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

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

          <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
            <Plus size={20} />
            Nueva tarea
          </button>
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

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar />
        <AddTaskButton />
       </div>

        <div className="mt-10 space-y-5">

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
                title={task.title}
                description={task.description ?? ""}
                completed={task.completed}
                priority={task.priority}
              />
            ))
          )}

        </div>

      </div>
    </main>
  );
}