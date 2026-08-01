"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface Task {
  dueDate: Date | null;
}

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({
  tasks,
}: CalendarViewProps) {
  const dates = tasks
    .filter((task) => task.dueDate)
    .map((task) => new Date(task.dueDate!));

  return (
    <div className="sticky top-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="mb-4 text-xl font-semibold">
        Calendario
      </h2>

      <DayPicker
        mode="multiple"
        selected={dates}
      />
    </div>
  );
}