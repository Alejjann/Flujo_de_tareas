"use client";

import DashboardContent from "@/components/dashboard/DashboardContent";
import { useGuestTasks } from "@/components/providers/GuestTasksProvider";

export default function GuestDashboardWrapper() {
  const guestTasks = useGuestTasks();


  if (!guestTasks) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm text-destructive">
        No se pudo iniciar el modo invitado. Falta
        GuestTasksProvider en la página /guest.
      </div>
    );
  }

  const { tasks } = guestTasks;

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

  /*
   * CalendarView, TaskBoard y DashboardContent trabajan con Date.
   * localStorage solo guarda strings, así que se convierten aquí.
   */
  const tasksWithDates = tasks.map((task) => ({
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : null,
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
      guestMode={true}
    />
  );
}