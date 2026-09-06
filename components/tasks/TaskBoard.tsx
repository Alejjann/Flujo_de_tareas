"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
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
import { useLanguage } from "@/components/providers/LanguageProvider";

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

const priorityStyles = {
  LOW: "border-success/20 bg-success/15 text-success",
  MEDIUM: "border-warning/20 bg-warning/15 text-warning",
  HIGH: "border-destructive/20 bg-destructive/15 text-destructive",
};

const tagStyles: Record<string, string> = {
  Trabajo: "bg-primary/15 text-primary",
  Estudios: "bg-violet/15 text-violet",
  Personal: "bg-pink-500/15 text-pink-500",
  Casa: "bg-orange-500/15 text-orange-500",
};

function getTagStyle(tag: string | null) {
  if (!tag) {
    return "";
  }

  return tagStyles[tag] || "bg-info/15 text-info";
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
  const { t, language } = useLanguage();

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

  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate) < new Date();

  const priorityLabel =
    task.priority === "HIGH"
      ? t.priority.high
      : task.priority === "MEDIUM"
      ? t.priority.medium
      : t.priority.low;

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(
        language === "es" ? "es-ES" : "en-US"
      )
    : "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-2xl border border-border bg-card p-4 transition-all duration-300 ${
        isDragging
          ? "z-50 scale-[1.02] border-primary opacity-40 shadow-2xl shadow-primary/20"
          : "hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
      }`}
    >
      {/* CABECERA */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`min-w-0 flex-1 break-words text-base font-semibold ${
            task.completed
              ? "text-muted-foreground line-through"
              : "text-foreground group-hover:text-primary"
          }`}
        >
          {task.title}
        </h3>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
            priorityStyles[task.priority]
          }`}
        >
          {priorityLabel}
        </span>
      </div>

      {/* DESCRIPCIÓN */}
      {task.description && (
        <p
          className={`mt-3 whitespace-pre-wrap break-words text-sm leading-6 ${
            task.completed
              ? "text-muted-foreground/70"
              : "text-muted-foreground"
          }`}
        >
          {task.description}
        </p>
      )}

      {/* ETIQUETA Y FECHA */}
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
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
              isOverdue
                ? "bg-destructive/15 text-destructive"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <CalendarDays size={12} />

            {isOverdue ? `${t.tasks.overdue} · ` : ""}

            {formattedDate}
          </span>
        )}
      </div>

      {/* ACCIONES */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <button
          type="button"
          {...listeners}
          {...attributes}
          className="flex cursor-grab items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground active:cursor-grabbing"
          title={t.board.drag}
        >
          <GripVertical size={16} />
          {t.tasks.move}
        </button>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onEdit}
            className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            title={t.tasks.edit}
          >
            <Pencil size={16} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title={t.tasks.delete}
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
  column: {
    id: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    title: string;
    icon: typeof ListTodo;
    color: string;
    bg: string;
    border: string;
  };
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const { t } = useLanguage();

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const Icon = column.icon;

  const taskCount =
    tasks.length === 1
      ? `1 ${t.board.task}`
      : `${tasks.length} ${t.board.tasks}`;

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[420px] rounded-3xl border p-4 transition-all duration-300 ${
        column.border
      } ${
        isOver
          ? "border-primary bg-primary/10 shadow-xl shadow-primary/10"
          : "bg-card"
      }`}
    >
      {/* CABECERA */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${column.bg}`}
          >
            <Icon size={18} className={column.color} />
          </div>

          <div>
            <h2 className="font-bold text-foreground">
              {column.title}
            </h2>

            <p className="text-xs text-muted-foreground">
              {taskCount}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${column.bg} ${column.color}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* TAREAS */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 p-6 text-center">
            <div>
              <Icon
                size={28}
                className={`mx-auto mb-3 ${column.color} opacity-50`}
              />

              <p className="text-sm text-muted-foreground">
                {t.tasks.dragHere}
              </p>
            </div>
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
  const { t } = useLanguage();

  const columns = [
    {
      id: "PENDING" as const,
      title: t.board.pending,
      icon: ListTodo,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
    },
    {
      id: "IN_PROGRESS" as const,
      title: t.board.inProgress,
      icon: Clock3,
      color: "text-info",
      bg: "bg-info/10",
      border: "border-info/30",
    },
    {
      id: "COMPLETED" as const,
      title: t.board.completed,
      icon: CircleCheck,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/30",
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(
    null
  );
  const [editingTask, setEditingTask] = useState<Task | null>(
    null
  );

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find(
      (item) => item.id === String(event.active.id)
    );

    if (task) {
      setActiveTask(task);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = String(active.id);

    const newStatus = String(over.id) as
      | "PENDING"
      | "IN_PROGRESS"
      | "COMPLETED";

    const task = tasks.find((item) => item.id === taskId);

    if (!task || task.status === newStatus) {
      return;
    }

    const oldStatus = task.status;

    setTasks((current) =>
      current.map((item) =>
        item.id === taskId
          ? {
              ...item,
              status: newStatus,
              completed: newStatus === "COMPLETED",
            }
          : item
      )
    );

    try {
      await updateTaskStatus(taskId, newStatus);

      toast.success(
        newStatus === "COMPLETED"
          ? t.board.completedMessage
          : newStatus === "IN_PROGRESS"
          ? t.board.inProgressMessage
          : t.board.pendingMessage
      );
    } catch (error) {
      console.error(error);

      setTasks((current) =>
        current.map((item) =>
          item.id === taskId
            ? {
                ...item,
                status: oldStatus,
                completed: oldStatus === "COMPLETED",
              }
            : item
        )
      );

      toast.error(t.board.movedError);
    }
  }

  async function handleDelete(task: Task) {
    const confirmed = window.confirm(
      `${t.messages.deleteConfirm}\n\n"${task.title}"`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(task.id);

      setTasks((current) =>
        current.filter((item) => item.id !== task.id)
      );

      toast.success(t.messages.deleteSuccess);
    } catch (error) {
      console.error(error);
      toast.error(t.messages.deleteError);
    }
  }

  const activePriorityLabel = activeTask
    ? activeTask.priority === "HIGH"
      ? t.priority.high
      : activeTask.priority === "MEDIUM"
      ? t.priority.medium
      : t.priority.low
    : "";

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
                (task) => task.status === column.id
              )}
              onEdit={(task) => setEditingTask(task)}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[320px] rounded-2xl border border-primary/50 bg-card p-4 shadow-2xl shadow-primary/20">
              <div className="flex items-center justify-between gap-3">
                <h3 className="break-words font-semibold text-foreground">
                  {activeTask.title}
                </h3>

                <span
                  className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold ${
                    priorityStyles[activeTask.priority]
                  }`}
                >
                  {activePriorityLabel}
                </span>
              </div>

              {activeTask.description && (
                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                  {activeTask.description}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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