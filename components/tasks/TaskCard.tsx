"use client";

import { Pencil, Trash2, CircleCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleTask } from "@/actions/toggleTasks";
import { deleteTask } from "@/actions/deleteTasks";
import { useState } from "react";
import EditTaskDialog from "./EditTaskDialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  tag: string | null;
}

const tagColors: Record<string, string> = {
  Trabajo: "bg-blue-500/20 text-blue-400",
  Estudios: "bg-purple-500/20 text-purple-400",
  Personal: "bg-pink-500/20 text-pink-400",
  Casa: "bg-orange-500/20 text-orange-400",
};

export default function TaskCard({
  id,
  title,
  description,
  completed,
  priority,
  dueDate,
  tag,
}: TaskCardProps) {
  const [openEdit, setOpenEdit] = useState(false);

  async function handleToggle() {
    await toggleTask(id, completed);

    toast.success(
      completed
        ? "Tarea marcada como pendiente"
        : "Tarea completada"
    );
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta tarea?"
    );

    if (!confirmed) return;

    await deleteTask(id);

    toast.success("Tarea eliminada correctamente");
  }

  const isOverdue =
    dueDate &&
    !completed &&
    new Date(dueDate) < new Date();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        whileHover={{ y: -4 }}
        className={`group rounded-3xl border p-6 transition-all duration-300
        hover:border-cyan-500
        hover:shadow-2xl
        hover:shadow-cyan-500/20
        ${
          isOverdue
            ? "border-red-500 bg-red-950/20"
            : "border-slate-800 bg-slate-900/80"
        }
        ${completed ? "opacity-70" : ""}`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold
                ${
                  priority === "HIGH"
                    ? "bg-red-500/20 text-red-400"
                    : priority === "MEDIUM"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {priority === "HIGH"
                  ? "🔴 Alta"
                  : priority === "MEDIUM"
                  ? "🟡 Media"
                  : "🟢 Baja"}
              </span>

              {tag && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    tagColors[tag] ??
                    "bg-cyan-500/20 text-cyan-300"
                  }`}
                >
                  🏷 {tag}
                </span>
              )}

              {isOverdue && (
                <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
                  ⚠ Vencida
                </span>
              )}
            </div>

            <h3
              className={`mt-4 text-2xl font-bold transition-colors
              ${
                completed
                  ? "line-through text-slate-500"
                  : "text-white group-hover:text-cyan-300"
              }`}
            >
              {title}
            </h3>

            {description && (
              <p
                className={`mt-3 leading-7 ${
                  completed
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                {description}
              </p>
            )}

            {dueDate && (
              <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                <Calendar size={16} />
                {new Date(dueDate).toLocaleDateString("es-ES")}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-green-500/20"
                onClick={handleToggle}
              >
                <CircleCheck
                  size={20}
                  className={
                    completed
                      ? "text-green-500"
                      : "text-slate-400"
                  }
                />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-cyan-500/20"
                onClick={() => setOpenEdit(true)}
              >
                <Pencil size={20} />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-red-500/20"
                onClick={handleDelete}
              >
                <Trash2
                  size={20}
                  className="text-red-500"
                />
              </Button>
            </motion.div>

          </div>
        </div>
      </motion.div>

      <EditTaskDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        id={id}
        title={title}
        description={description}
        priority={priority}
        dueDate={dueDate}
        tag={tag}
      />
    </>
  );
}