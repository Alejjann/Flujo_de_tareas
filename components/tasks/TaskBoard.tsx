"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCorners,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { useEffect, useState } from "react";

import { updateTaskStatus } from "@/actions/updateTaskStatus";
import { deleteTask } from "@/actions/deleteTasks";

import { toast } from "sonner";

import {
  CircleCheck,
  Clock3,
  ListTodo,
  Pencil,
  Trash2,
  GripVertical,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import EditTaskDialog from "./EditTaskDialog";

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  tag: string | null;
}

interface TaskBoardProps {
  tasks: Task[];
}

const columns = [
  {
    id: "PENDING" as const,
    title: "Pendientes",
    icon: ListTodo,
    color: "text-yellow-400",
    border: "border-yellow-500/30",
  },
  {
    id: "IN_PROGRESS" as const,
    title: "En progreso",
    icon: Clock3,
    color: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  {
    id: "COMPLETED" as const,
    title: "Completadas",
    icon: CircleCheck,
    color: "text-green-400",
    border: "border-green-500/30",
  },
];

const priorityStyles = {
  LOW: "bg-green-500/20 text-green-400 border-green-500/20",
  MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  HIGH: "bg-red-500/20 text-red-400 border-red-500/20",
};

const tagStyles: Record<string, string> = {
  Trabajo: "bg-blue-500/15 text-blue-300",
  Estudios: "bg-purple-500/15 text-purple-300",
  Personal: "bg-pink-500/15 text-pink-300",
  Casa: "bg-orange-500/15 text-orange-300",
};

function getTagStyle(tag: string | null) {
  if (!tag) return "";

  return (
    tagStyles[tag] ||
    "bg-cyan-500/15 text-cyan-300"
  );
}

function TaskItem({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border border-slate-700 bg-slate-950 p-4 transition-all ${
        isDragging
          ? "z-50 opacity-40"
          : "hover:border-slate-600"
      }`}
    >
      {/* CABECERA */}
      <div className="flex items-start justify-between gap-3">

        <h3
          className={`min-w-0 flex-1 break-words text-base font-semibold ${
            task.completed
              ? "text-slate-500 line-through"
              : "text-white"
          }`}
        >
          {task.title}
        </h3>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
            priorityStyles[task.priority]
          }`}
        >
          {task.priority === "HIGH"
            ? "Alta"
            : task.priority === "MEDIUM"
            ? "Media"
            : "Baja"}
        </span>
      </div>

      {/* DESCRIPCIÓN COMPLETA */}
      {task.description && (
        <p
          className={`mt-3 whitespace-pre-wrap break-words text-sm leading-6 ${
            task.completed
              ? "text-slate-600"
              : "text-slate-400"
          }`}
        >
          {task.description}
        </p>
      )}

      {/* DATOS */}
      <div className="mt-4 flex flex-wrap gap-2">

        {task.tag && (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getTagStyle(
              task.tag
            )}`}
          >
            🏷 {task.tag}
          </span>
        )}

        {task.dueDate && (
          <span className="flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
            <CalendarDays size={12} />
            {new Date(
              task.dueDate
            ).toLocaleDateString("es-ES")}
          </span>
        )}
      </div>

      {/* ACCIONES */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">

        {/* MOVER */}
        <button
          type="button"
          {...listeners}
          {...attributes}
          className="flex cursor-grab items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-500 transition hover:bg-slate-800 hover:text-slate-300 active:cursor-grabbing"
          title="Arrastrar tarea"
        >
          <GripVertical size={16} />
          Mover
        </button>

        <div className="flex items-center gap-1">

          {/* EDITAR */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onEdit}
            className="h-8 w-8 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400"
            title="Editar tarea"
          >
            <Pencil size={16} />
          </Button>

          {/* ELIMINAR */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onDelete}
            className="h-8 w-8 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            title="Eliminar tarea"
          >
            <Trash2 size={16} />
          </Button>

        </div>
      </div>
    </div>
  );
}

function TaskColumn({
  column,
  tasks,
  onEdit,
  onDelete,
}: {
  column: (typeof columns)[number];
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: column.id,
  });

  const Icon = column.icon;

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[420px] rounded-3xl border bg-slate-900/70 p-4 backdrop-blur transition-all ${
        column.border
      } ${
        isOver
          ? "border-cyan-400 bg-slate-800/80"
          : ""
      }`}
    >
      {/* CABECERA COLUMNA */}
      <div className="mb-4 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <Icon
            size={18}
            className={column.color}
          />

          <h2 className="font-bold text-white">
            {column.title}
          </h2>
        </div>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
          {tasks.length}
        </span>
      </div>

      {/* TAREAS */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-slate-700 p-6 text-center">
            <p className="text-sm text-slate-500">
              Arrastra una tarea aquí
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function TaskBoard({
  tasks: initialTasks,
}: TaskBoardProps) {
  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const [activeTask, setActiveTask] =
    useState<Task | null>(null);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  function handleDragStart(event: any) {
    const task = tasks.find(
      (task) =>
        task.id === String(event.active.id)
    );

    if (task) {
      setActiveTask(task);
    }
  }

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);

    const newStatus =
      String(over.id) as
        | "PENDING"
        | "IN_PROGRESS"
        | "COMPLETED";

    const task = tasks.find(
      (task) => task.id === taskId
    );

    if (!task) return;

    if (task.status === newStatus) return;

    const oldStatus = task.status;

    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completed:
                newStatus === "COMPLETED",
            }
          : task
      )
    );

    try {
      await updateTaskStatus(
        taskId,
        newStatus
      );

      toast.success(
        newStatus === "COMPLETED"
          ? "Tarea completada ✅"
          : newStatus === "IN_PROGRESS"
          ? "Tarea en progreso 🔵"
          : "Tarea pendiente 🟡"
      );
    } catch (error) {
      console.error(error);

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: oldStatus,
                completed:
                  oldStatus === "COMPLETED",
              }
            : task
        )
      );

      toast.error(
        "No se pudo mover la tarea"
      );
    }
  }

  async function handleDelete(task: Task) {
    const confirmed =
      window.confirm(
        `¿Seguro que quieres eliminar "${task.title}"?`
      );

    if (!confirmed) return;

    try {
      await deleteTask(task.id);

      setTasks((current) =>
        current.filter(
          (item) => item.id !== task.id
        )
      );

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

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-5 xl:grid-cols-3">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              tasks={tasks.filter(
                (task) =>
                  task.status === column.id
              )}
              onEdit={(task) =>
                setEditingTask(task)
              }
              onDelete={handleDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[320px] rounded-2xl border border-cyan-500 bg-slate-900 p-4 shadow-2xl shadow-cyan-500/20">
              <h3 className="break-words font-semibold text-white">
                {activeTask.title}
              </h3>

              {activeTask.description && (
                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-400">
                  {activeTask.description}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* EDITAR */}
      {editingTask && (
        <EditTaskDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setEditingTask(null);
            }
          }}
          id={editingTask.id}
          title={editingTask.title}
          description={editingTask.description}
          priority={editingTask.priority}
          dueDate={editingTask.dueDate}
          tag={editingTask.tag}
        />
      )}
    </>
  );
}