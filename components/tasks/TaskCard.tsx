"use client";

import { Pencil, Trash2, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleTask } from "@/actions/toggleTasks";
import { deleteTask } from "@/actions/deleteTasks";
import { useState } from "react";
import EditTaskDialog from "./EditTaskDialog";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
}

const priorityColors = {
  LOW: "bg-green-500",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-red-500",
};

export default function TaskCard({
  id,
  title,
  description,
  completed,
  priority,
  dueDate
}: TaskCardProps) {

  const [openEdit, setOpenEdit] = useState(false);
  async function handleToggle() {
    await toggleTask(id, completed);
  }

  async function handleDelete() {
  const confirmed = window.confirm(
    "¿Seguro que quieres eliminar esta tarea?"
  );

  if (!confirmed) return;

  await deleteTask(id);
}
    const isOverdue =
  dueDate &&
  !completed &&
  new Date(dueDate) < new Date();

  return (
    <>
    <div
      className={`rounded-2xl border p-6 transition-all duration-300
      hover:border-cyan-500/40
      hover:shadow-lg
      hover:shadow-cyan-500/10
      ${
            isOverdue
              ? "border-red-500 bg-red-950/20"
              : "border-slate-800 bg-slate-900"
          }
      ${completed ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${priorityColors[priority]}`}
          />

          <h3
            className={`text-lg font-semibold ${
              completed ? "line-through text-slate-500" : "text-white"
            }`}
          >
            {title}
          </h3>

          <div className="mt-2 flex items-center gap-4 text-sm">
          <span
            className={
              priority === "HIGH"
                ? "text-red-400"
                : priority === "MEDIUM"
                ? "text-yellow-400"
                : "text-green-400"
            }
            >
            {priority === "HIGH"
              ? "🔴 Alta"
              : priority === "MEDIUM"
              ? "🟡 Media"
              : "🟢 Baja"}
          </span>

          {dueDate && (
            <span className="text-slate-400">
              📅 {new Date(dueDate).toLocaleDateString("es-ES")}
            </span>
          )}

          {isOverdue && (
          <span className="text-red-400 text-sm font-medium">
            ⚠ Vencida
          </span>
          )}

        </div>
        </div>

        <div className="flex gap-2">
          <Button
              size="icon"
              variant="ghost"
              onClick={handleToggle}
            >
            <CircleCheck
              size={18}
              className={completed ? "text-green-500" : "text-slate-400"}
            />
          </Button>

          <Button
          size="icon"
          variant="ghost"
          onClick={() => setOpenEdit(true)}
        >
          <Pencil size={18} />
        </Button>

        <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
            >
              <Trash2 size={18} className="text-red-500" />
    </Button>
        </div>
      </div>

      <p
        className={`mt-3 ${
          completed ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {description}
      </p>
    </div>

    <EditTaskDialog
      open={openEdit}
      onOpenChange={setOpenEdit}
      id={id}
      title={title}
      description={description}
      priority={priority}
      dueDate={dueDate}
    />
    </>
      );
    }