"use client";

import { useSearchParams } from "next/navigation";

import DashboardContent from "@/components/dashboard/DashboardContent";
import { useGuestTasks } from "@/components/providers/GuestTasksProvider";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

const VALID_PRIORITIES: TaskPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

export default function GuestDashboardWrapper() {
  const guestTasks = useGuestTasks();
  const searchParams = useSearchParams();

  if (!guestTasks) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
        No se pudo iniciar el modo invitado. Falta
        GuestTasksProvider en la página /guest.
      </div>
    );
  }

  const { tasks } = guestTasks;

  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status") ?? "all";
  const priority = searchParams.get("priority") ?? "all";

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
   * Las estadísticas muestran el estado de TODAS las tareas guardadas
   * del invitado, no solo las tareas filtradas.
   */
  const completed = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const pending = tasks.filter(
    (task) => task.status !== "COMPLETED"
  ).length;

  const high = tasks.filter(
    (task) => task.priority === "HIGH"
  ).length;

  const medium = tasks.filter(
    (task) => task.priority === "MEDIUM"
  ).length;

  const low = tasks.filter(
    (task) => task.priority === "LOW"
  ).length;

  const productivity =
    tasks.length > 0
      ? Math.round((completed / tasks.length) * 100)
      : 0;

  const isFirstTask = tasks.length === 0;

  const tasksWithDates = filteredTasks.map((task) => ({
    ...task,
    dueDate: task.dueDate
      ? new Date(task.dueDate)
      : null,
  }));

  return (
    <DashboardContent
      tasks={tasksWithDates}
      completed={completed}
      pending={pending}
      high={high}
      medium={medium}
      low={low}
      productivity={productivity}
      isFirstTask={isFirstTask}
      guestMode
    />
  );
}