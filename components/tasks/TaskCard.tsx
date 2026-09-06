"use client";

import {
  Pencil,
  Trash2,
  CircleCheck,
  Calendar,
} from "lucide-react";

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
  Trabajo:
    "bg-blue-500/20 text-blue-400",
  Estudios:
    "bg-purple-500/20 text-purple-400",
  Personal:
    "bg-pink-500/20 text-pink-400",
  Casa:
    "bg-orange-500/20 text-orange-400",
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
  const [openEdit, setOpenEdit] =
    useState(false);

  async function handleToggle() {
    try {
      await toggleTask(
        id,
        completed
      );

      toast.success(
        completed
          ? "Tarea marcada como pendiente"
          : "Tarea completada"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "No se pudo actualizar la tarea"
      );
    }
  }

  async function handleDelete() {
    const confirmed =
      window.confirm(
        "¿Seguro que quieres eliminar esta tarea?"
      );

    if (!confirmed) return;

    try {
      await deleteTask(id);

      toast.success(
        "Tarea eliminada correctamente"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "No se pudo eliminar la tarea"
      );
    }
  }

  const isOverdue =
    dueDate &&
    !completed &&
    new Date(dueDate) < new Date();

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
        whileHover={{
          y: -4,
        }}
        className={`group rounded-3xl border p-6 transition-all duration-300 ${
          isOverdue
            ? "border-red-500/50 bg-red-950/20"
            : "border-slate-800 bg-slate-900/80"
        } ${
          completed
            ? "opacity-70"
            : "hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10"
        }`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">

            {/* BADGES */}

            <div className="flex flex-wrap items-center gap-3">

              {/* PRIORIDAD */}

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
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

              {/* TAG */}

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

              {/* VENCIDA */}

              {isOverdue && (
                <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
                  ⚠ Vencida
                </span>
              )}
            </div>

            {/* TÍTULO */}

            <h3
              className={`mt-4 break-words text-2xl font-bold transition-colors ${
                completed
                  ? "line-through text-slate-500"
                  : "text-white group-hover:text-cyan-300"
              }`}
            >
              {title}
            </h3>

            {/* DESCRIPCIÓN */}

            {description && (
              <p
                className={`mt-3 break-words leading-7 ${
                  completed
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                {description}
              </p>
            )}

            {/* FECHA */}

            {dueDate && (
              <div
                className={`mt-5 flex items-center gap-2 text-sm ${
                  isOverdue
                    ? "text-red-400"
                    : "text-slate-400"
                }`}
              >
                <Calendar size={16} />

                {isOverdue
                  ? "Vencida · "
                  : ""}

                {new Date(
                  dueDate
                ).toLocaleDateString(
                  "es-ES"
                )}
              </div>
            )}
          </div>

          {/* ACCIONES */}

          <div className="flex shrink-0 flex-col gap-2">

            {/* COMPLETAR */}

            <motion.div
              whileHover={{
                scale: 1.15,
              }}
              whileTap={{
                scale: 0.9,
              }}
            >
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="hover:bg-green-500/20"
                onClick={handleToggle}
                title={
                  completed
                    ? "Marcar como pendiente"
                    : "Completar tarea"
                }
              >
                <CircleCheck
                  size={20}
                  className={
                    completed
                      ? "text-green-500"
                      : "text-slate-400 hover:text-green-400"
                  }
                />
              </Button>
            </motion.div>

            {/* EDITAR */}

            <motion.div
              whileHover={{
                scale: 1.15,
              }}
              whileTap={{
                scale: 0.9,
              }}
            >
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="hover:bg-cyan-500/20 hover:text-cyan-400"
                onClick={() =>
                  setOpenEdit(true)
                }
                title="Editar tarea"
              >
                <Pencil size={20} />
              </Button>
            </motion.div>

            {/* ELIMINAR */}

            <motion.div
              whileHover={{
                scale: 1.15,
              }}
              whileTap={{
                scale: 0.9,
              }}
            >
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="hover:bg-red-500/20"
                onClick={handleDelete}
                title="Eliminar tarea"
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

      {/* EDITAR */}

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