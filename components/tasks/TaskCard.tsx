"use client";

import {
  AlertCircle,
  Calendar,
  CircleCheck,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import { toggleTask } from "@/actions/toggleTasks";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatTaskDate } from "@/lib/formatTaskDate";

import DeleteTaskDialog from "./DeleteTaskDialog";
import EditTaskDialog from "./EditTaskDialog";

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
  Trabajo: "bg-primary/10 text-primary",
  Estudios: "bg-violet/10 text-violet",
  Personal: "bg-pink-500/10 text-pink-500",
  Casa: "bg-orange-500/10 text-orange-500",
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
  const [openDelete, setOpenDelete] = useState(false);

  const { t, language } = useLanguage();

  async function handleToggle() {
    try {
      await toggleTask(id, completed);

      toast.success(
        completed
          ? t.messages.togglePending
          : t.messages.toggleCompleted
      );
    } catch (error) {
      console.error(error);
      toast.error(t.messages.updateError);
    }
  }

  const taskDate = dueDate
    ? formatTaskDate({
        dueDate,
        language,
        completed,
      })
    : null;

  const isOverdue = taskDate?.isOverdue ?? false;

  const priorityLabel =
    priority === "HIGH"
      ? t.priority.high
      : priority === "MEDIUM"
        ? t.priority.medium
        : t.priority.low;

  const priorityClass =
    priority === "HIGH"
      ? "ui-badge-danger"
      : priority === "MEDIUM"
        ? "ui-badge-warning"
        : "ui-badge-success";

  return (
    <>
      <motion.article
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        whileHover={{
          y: -3,
        }}
        className={`ui-task-card group ${
          isOverdue ? "border-destructive/40" : ""
        } ${completed ? "opacity-70" : ""}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`ui-badge ${priorityClass}`}>
                {priorityLabel}
              </span>

              {tag && (
                <span
                  className={`ui-badge ${
                    tagColors[tag] ?? "ui-badge-info"
                  }`}
                >
                  {tag}
                </span>
              )}

              {isOverdue && (
                <span className="ui-badge ui-badge-danger">
                  <AlertCircle size={13} />
                  {t.tasks.overdue}
                </span>
              )}
            </div>

            <h3
              className={`mt-3 line-clamp-2 break-words text-lg font-bold leading-6 transition-colors sm:text-xl ${
                completed
                  ? "text-muted-foreground line-through"
                  : "text-foreground group-hover:text-primary"
              }`}
            >
              {title}
            </h3>

            {description && (
              <p
                className={`mt-2 line-clamp-3 break-words text-sm leading-6 ${
                  completed
                    ? "text-muted-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {description}
              </p>
            )}

            {dueDate && (
              <div
                className={`mt-4 flex items-center gap-2 text-xs font-medium sm:text-sm ${
                  isOverdue
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {isOverdue ? (
                  <AlertCircle size={16} />
                ) : (
                  <Calendar size={16} />
                )}

                {taskDate?.label}
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <button
              type="button"
              data-drag-handle
              aria-label="Mover tarea"
              title="Mover tarea"
              className="ui-icon-button h-9 w-9 touch-none"
            >
              <GripVertical size={18} />
            </button>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-muted-foreground hover:bg-success/10 hover:text-success"
              onClick={handleToggle}
              title={
                completed
                  ? t.tasks.markPending
                  : t.tasks.complete
              }
              aria-label={
                completed
                  ? t.tasks.markPending
                  : t.tasks.complete
              }
            >
              <CircleCheck
                size={18}
                className={completed ? "text-success" : ""}
              />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              onClick={() => setOpenEdit(true)}
              title={t.tasks.edit}
              aria-label={t.tasks.edit}
            >
              <Pencil size={18} />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setOpenDelete(true)}
              title={t.tasks.delete}
              aria-label={t.tasks.delete}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      </motion.article>

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

      <DeleteTaskDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        taskId={id}
        taskTitle={title}
      />
    </>
  );
}