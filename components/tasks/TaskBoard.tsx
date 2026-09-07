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
import { toast } from "sonner";

import { updateTaskStatus } from "@/actions/updateTaskStatus";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { formatTaskDate } from "@/lib/formatTaskDate";

import {
  AlertCircle,
  CalendarDays,
  CircleCheck,
  Clock3,
  GripVertical,
  ListTodo,
  Pencil,
  Trash2,
} from "lucide-react";

import EditTaskDialog from "./EditTaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";

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
  LOW: "border-success/20 bg-success/10 text-success",
  MEDIUM: "border-warning/20 bg-warning/10 text-warning",
  HIGH: "border-destructive/20 bg-destructive/10 text-destructive",
};

const tagStyles: Record<string, string> = {
  Trabajo: "bg-primary/10 text-primary",
  Estudios: "bg-violet/10 text-violet",
  Personal: "bg-pink-500/10 text-pink-500",
  Casa: "bg-orange-500/10 text-orange-500",
};

function getTagStyle(tag: string | null) {
  if (!tag) {
    return "";
  }

  return tagStyles[tag] || "bg-info/10 text-info";
}

function getPriorityLabel(
  priority: Task["priority"],
  t: ReturnType<typeof useLanguage>["t"]
) {
  if (priority === "HIGH") {
    return t.priority.high;
  }

  if (priority === "MEDIUM") {
    return t.priority.medium;
  }

  return t.priority.low;
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

  const priorityLabel = getPriorityLabel(task.priority, t);

  const taskDate = task.dueDate
    ? formatTaskDate({
        dueDate: task.dueDate,
        language,
        completed: task.completed,
      })
    : null;

  const isOverdue = taskDate?.isOverdue ?? false;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`ui-task-card group ${
        isDragging
          ? "z-50 scale-[1.02] border-primary opacity-40 shadow-2xl shadow-primary/20"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`line-clamp-2 min-w-0 flex-1 text-sm font-semibold leading-5 transition-colors ${
            task.completed
              ? "text-muted-foreground line-through"
              : "text-foreground group-hover:text-primary"
          }`}
        >
          {task.title}
        </h3>

        <span
          className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
            priorityStyles[task.priority]
          }`}
        >
          {priorityLabel}
        </span>
      </div>

      {task.description && (
        <p
          className={`mt-2 line-clamp-2 whitespace-pre-wrap break-words text-xs leading-5 ${
            task.completed
              ? "text-muted-foreground/70"
              : "text-muted-foreground"
          }`}
        >
          {task.description}
        </p>
      )}

      {(task.tag || task.dueDate) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {task.tag && (
            <span
              className={`max-w-[130px] truncate rounded-full px-2.5 py-1 text-xs font-medium ${getTagStyle(
                task.tag
              )}`}
              title={task.tag}
            >
              {task.tag}
            </span>
          )}

          {task.dueDate && (
            <span
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                isOverdue
                  ? "bg-destructive/10 text-destructive"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {isOverdue ? (
                <AlertCircle size={12} />
              ) : (
                <CalendarDays size={12} />
              )}

              {taskDate?.label}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
        <button
          type="button"
          {...listeners}
          {...attributes}
          className="inline-flex min-h-8 cursor-grab items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground active:cursor-grabbing"
          title={t.board.drag}
          aria-label={t.board.drag}
        >
          <GripVertical size={15} />
          <span className="hidden sm:inline">{t.tasks.move}</span>
        </button>

        <div className="flex items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onEdit}
            className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            title={t.tasks.edit}
            aria-label={t.tasks.edit}
          >
            <Pencil size={15} />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title={t.tasks.delete}
            aria-label={t.tasks.delete}
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>
    </article>
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
    <section
      ref={setNodeRef}
      className={`ui-kanban-column ${
        column.border
      } ${isOver ? "ui-kanban-column-active" : ""}`}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${column.bg}`}
          >
            <Icon size={18} className={column.color} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-foreground">
              {column.title}
            </h2>

            <p className="text-xs text-muted-foreground">{taskCount}</p>
          </div>
        </div>

        <span
          className={`inline-flex min-w-8 shrink-0 items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ${column.bg} ${column.color}`}
        >
          {tasks.length}
        </span>
      </header>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="ui-drop-zone">
            <div className="text-center">
              <Icon
                size={28}
                className={`mx-auto mb-3 ${column.color} opacity-60`}
              />

              <p className="text-sm font-medium text-muted-foreground">
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
    </section>
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
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

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

  const activePriorityLabel = activeTask
    ? getPriorityLabel(activeTask.priority, t)
    : "";

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="ui-scrollbar overflow-x-auto pb-4">
          <div className="grid min-w-[900px] grid-cols-3 gap-4 lg:min-w-0 lg:gap-5">
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={tasks.filter(
                  (task) => task.status === column.id
                )}
                onEdit={(task) => setEditingTask(task)}
                onDelete={(task) => setDeletingTask(task)}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[300px] rounded-2xl border border-primary/50 bg-card p-4 shadow-2xl shadow-primary/20">
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 break-words text-sm font-semibold text-foreground">
                  {activeTask.title}
                </h3>

                <span
                  className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${
                    priorityStyles[activeTask.priority]
                  }`}
                >
                  {activePriorityLabel}
                </span>
              </div>

              {activeTask.description && (
                <p className="mt-2 line-clamp-2 whitespace-pre-wrap break-words text-xs leading-5 text-muted-foreground">
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

      {deletingTask && (
        <DeleteTaskDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setDeletingTask(null);
            }
          }}
          taskId={deletingTask.id}
          taskTitle={deletingTask.title}
          onDeleted={() => {
            setTasks((current) =>
              current.filter(
                (task) => task.id !== deletingTask.id
              )
            );

            setDeletingTask(null);
          }}
        />
      )}
    </>
  );
}