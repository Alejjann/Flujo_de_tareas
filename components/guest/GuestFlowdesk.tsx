"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CloudOff,
  Download,
  LayoutDashboard,
  LogIn,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import GuestTaskBoard, {
  type GuestTask,
  type GuestTaskStatus,
} from "@/components/guest/GuestTaskBoard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "flowdesk_guest_tasks_v1";

const initialGuestTasks: GuestTask[] = [
  {
    id: "guest-welcome-1",
    title: "Explora el tablero",
    description:
      "Arrastra esta tarjeta a En progreso para probar el flujo de trabajo.",
    status: "PENDING",
    priority: "MEDIUM",
    dueDate: null,
    tag: "Primeros pasos",
    createdAt: Date.now() - 2_000,
    position: 0,
  },
  {
    id: "guest-welcome-2",
    title: "Crea tu primera tarea",
    description:
      "Pulsa Nueva tarea y organiza el trabajo como prefieras.",
    status: "PENDING",
    priority: "LOW",
    dueDate: null,
    tag: "Primeros pasos",
    createdAt: Date.now() - 1_000,
    position: 1,
  },
];

function normalizeTasks(tasks: GuestTask[]) {
  const statuses: GuestTaskStatus[] = [
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
  ];

  return statuses.flatMap((status) =>
    tasks
      .filter((task) => task.status === status)
      .sort((firstTask, secondTask) => firstTask.position - secondTask.position)
      .map((task, index) => ({
        ...task,
        position: index,
      }))
  );
}

function createTaskId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `guest-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function downloadTasks(tasks: GuestTask[]) {
  const content = JSON.stringify(tasks, null, 2);
  const file = new Blob([content], {
    type: "application/json",
  });

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "flowdesk-tareas-invitado.json";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export default function GuestFlowDesk() {
  const [tasks, setTasks] = useState<GuestTask[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    try {
      const savedTasks = window.localStorage.getItem(STORAGE_KEY);

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks) as GuestTask[];

        if (Array.isArray(parsedTasks)) {
          setTasks(normalizeTasks(parsedTasks));
        } else {
          setTasks(initialGuestTasks);
        }
      } else {
        setTasks(initialGuestTasks);
      }
    } catch {
      setTasks(initialGuestTasks);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch {
      toast.error(
        "No se pudieron guardar las tareas en este navegador."
      );
    }
  }, [hasLoaded, tasks]);

  const statistics = useMemo(() => {
    const completed = tasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;

    const inProgress = tasks.filter(
      (task) => task.status === "IN_PROGRESS"
    ).length;

    const pending = tasks.filter(
      (task) => task.status === "PENDING"
    ).length;

    return {
      completed,
      inProgress,
      pending,
      total: tasks.length,
    };
  }, [tasks]);

  function updateTasks(nextTasks: GuestTask[]) {
    setTasks(normalizeTasks(nextTasks));
  }

  function createTask(formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const description = String(
      formData.get("description") || ""
    ).trim();

    const priority = String(
      formData.get("priority") || "MEDIUM"
    ) as GuestTask["priority"];

    const tag = String(formData.get("tag") || "").trim();
    const dueDate = String(formData.get("dueDate") || "").trim();

    if (!title) {
      toast.error("El título es obligatorio.");
      return;
    }

    const pendingCount = tasks.filter(
      (task) => task.status === "PENDING"
    ).length;

    const nextTask: GuestTask = {
      id: createTaskId(),
      title,
      description: description || null,
      priority,
      tag: tag || null,
      dueDate: dueDate || null,
      status: "PENDING",
      createdAt: Date.now(),
      position: pendingCount,
    };

    setTasks((current) =>
      normalizeTasks([...current, nextTask])
    );

    setIsCreateOpen(false);
    toast.success("Tarea creada en Pendientes.");
  }

  function clearGuestTasks() {
    setTasks([]);
    toast.success("Se han eliminado las tareas del modo invitado.");
  }

  if (!hasLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="rounded-2xl border border-border bg-card px-6 py-5 text-sm font-semibold text-muted-foreground shadow-sm">
          Preparando tu espacio de trabajo…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground">
      <header className="border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 md:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-info text-primary-foreground shadow-lg shadow-primary/25 transition group-hover:-translate-y-0.5">
              <LayoutDashboard size={20} />
            </div>

            <span className="hidden text-2xl font-black tracking-[-0.05em] sm:inline">
              Flow<span className="text-primary">Desk</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-bold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Inicio</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-primary/90"
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">Iniciar sesión</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 md:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-5 shadow-lg shadow-primary/[0.06] sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-warning/25 bg-warning/10 px-3 py-1.5 text-xs font-bold text-warning">
                <CloudOff size={14} />
                Modo invitado
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-[-0.05em] text-foreground sm:text-4xl">
                Prueba FlowDesk sin crear una cuenta.
              </h1>

              <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                Puedes crear, editar, eliminar y mover tareas. Todo se
                guarda únicamente en este navegador.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => downloadTasks(tasks)}
                className="h-10 gap-2 rounded-xl"
              >
                <Download size={16} />
                Exportar
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={clearGuestTasks}
                className="h-10 gap-2 rounded-xl border-destructive/25 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 size={16} />
                Limpiar
              </Button>

              <Button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="h-10 gap-2 rounded-xl"
              >
                <Plus size={17} />
                Nueva tarea
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <article className="ui-card-main p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Total
            </p>
            <p className="mt-2 text-3xl font-black text-foreground">
              {statistics.total}
            </p>
          </article>

          <article className="ui-card-main p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-warning">
              Pendientes
            </p>
            <p className="mt-2 text-3xl font-black text-warning">
              {statistics.pending}
            </p>
          </article>

          <article className="ui-card-main p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-info">
              En progreso
            </p>
            <p className="mt-2 text-3xl font-black text-info">
              {statistics.inProgress}
            </p>
          </article>

          <article className="ui-card-main p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-success">
              Completadas
            </p>
            <p className="mt-2 text-3xl font-black text-success">
              {statistics.completed}
            </p>
          </article>
        </section>

        <section className="mt-6">
          <GuestTaskBoard
            tasks={tasks}
            onTasksChange={updateTasks}
          />
        </section>

        <section className="mt-6 rounded-3xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 className="font-bold text-foreground">
                  ¿Quieres guardar tus tareas en una cuenta?
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Crea una cuenta o inicia sesión para usar FlowDesk desde
                  cualquier dispositivo.
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary/90"
            >
              Crear cuenta o iniciar sesión
            </Link>
          </div>
        </section>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl overflow-hidden rounded-3xl border border-border bg-popover p-0">
          <DialogHeader className="border-b border-border bg-gradient-to-br from-primary/10 via-transparent to-info/5 px-5 py-5 pr-12 sm:px-6">
            <DialogTitle className="text-2xl font-black tracking-[-0.04em] text-foreground">
              Nueva tarea
            </DialogTitle>
          </DialogHeader>

          <form
            action={createTask}
            className="max-h-[calc(100dvh-10rem)] space-y-5 overflow-y-auto overflow-x-hidden p-5 sm:p-6"
          >
            <div>
              <label
                htmlFor="guest-title"
                className="ui-label-icon"
              >
                Título
              </label>

              <Input
                id="guest-title"
                name="title"
                required
                autoFocus
                placeholder="Escribe el título de la tarea…"
                className="mt-2 w-full"
              />
            </div>

            <div>
              <label
                htmlFor="guest-description"
                className="ui-label-icon"
              >
                Descripción
              </label>

              <Textarea
                id="guest-description"
                name="description"
                rows={5}
                placeholder="Añade detalles opcionales…"
                className="mt-2 min-h-[120px] w-full resize-y [overflow-wrap:anywhere]"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="guest-priority"
                  className="ui-label-icon"
                >
                  Prioridad
                </label>

                <select
                  id="guest-priority"
                  name="priority"
                  defaultValue="MEDIUM"
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="guest-tag"
                  className="ui-label-icon"
                >
                  Etiqueta
                </label>

                <Input
                  id="guest-tag"
                  name="tag"
                  placeholder="Ej.: Trabajo"
                  className="mt-2 w-full"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="guest-date"
                className="ui-label-icon"
              >
                Fecha límite
              </label>

              <Input
                id="guest-date"
                type="date"
                name="dueDate"
                className="mt-2 w-full cursor-pointer"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={isCreating}
                className="w-full gap-2 sm:w-auto"
              >
                <Plus size={17} />
                Crear tarea
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}