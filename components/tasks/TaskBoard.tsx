// components/tasks/TaskBoard.tsx
"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AlertCircle,
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  FileText,
  ListTodo,
  Pencil,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

import { reorderTasks } from "@/actions/reorderTasks";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { formatTaskDate } from "@/lib/formatTaskDate";
import { useGuestTasks } from "@/components/providers/GuestTasksProvider";

import DeleteTaskDialog from "./DeleteTaskDialog";
import EditTaskDialog from "./EditTaskDialog";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  status: TaskStatus;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  tag: string | null;
  position?: number | null;
}

interface TaskBoardProps {
  tasks: Task[];
  guestMode?: boolean;
}

interface BoardColumn {
  id: TaskStatus;
  title: string;
  icon: typeof ListTodo;
  color: string;
  bg: string;
  border: string;
}

type TranslationObject = {
  priority: {
    high: string;
    medium: string;
    low: string;
  };
  tasks: {
    edit: string;
    delete: string;
    dragHere: string;
    details: {
      title: string;
      description: string;
      noDescription: string;
      priority: string;
      status: string;
      dueDate: string;
      close: string;
      editTask: string;
      deleteTask: string;
      completeTask: string;
      markPending: string;
      pending: string;
      inProgress: string;
      completed: string;
    };
  };
  board: {
    pending: string;
    inProgress: string;
    completed: string;
    task: string;
    tasks: string;
    completedMessage: string;
    inProgressMessage: string;
    pendingMessage: string;
    movedError: string;
    orderUpdated: string;
    undo: string;
    undoSuccess: string;
    undoError: string;
  };
};

const priorityStyles = {
  LOW: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  MEDIUM: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  HIGH: "border-rose-400/20 bg-rose-400/10 text-rose-300",
};

const tagStyles: Record<string, string> = {
  Trabajo: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  Estudios: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  Personal: "border-pink-400/20 bg-pink-400/10 text-pink-300",
  Casa: "border-orange-400/20 bg-orange-400/10 text-orange-300",
  Work: "border-blue-400/20 bg-blue-400/10 text-blue-300",
  Studies: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  Home: "border-orange-400/20 bg-orange-400/10 text-orange-300",
};

function getTagStyle(tag: string | null) {
  if (!tag) {
    return "";
  }

  return (
    tagStyles[tag] ??
    "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
  );
}

function getPriorityLabel(
  priority: Task["priority"],
  t: TranslationObject
) {
  if (priority === "HIGH") {
    return t.priority.high;
  }

  if (priority === "MEDIUM") {
    return t.priority.medium;
  }

  return t.priority.low;
}

function getStatusLabel(
  status: TaskStatus,
  t: TranslationObject
) {
  if (status === "COMPLETED") {
    return t.tasks.details.completed;
  }

  if (status === "IN_PROGRESS") {
    return t.tasks.details.inProgress;
  }

  return t.tasks.details.pending;
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    value === "PENDING" ||
    value === "IN_PROGRESS" ||
    value === "COMPLETED"
  );
}

function getTaskPosition(task: Task) {
  return typeof task.position === "number" ? task.position : 0;
}

function TaskDetailsModal({
  task,
  onClose,
  onEdit,
  onDelete,
  onToggleCompleted,
}: {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleCompleted: () => void;
}) {
  const { t: rawTranslations, language } = useLanguage();
  const t = rawTranslations as TranslationObject;

  const taskDate = task.dueDate
    ? formatTaskDate({
        dueDate: task.dueDate,
        language,
        completed: task.completed,
      })
    : null;

  const isOverdue = taskDate?.isOverdue ?? false;
  const isCompleted = task.status === "COMPLETED";

  const priorityLabel = getPriorityLabel(task.priority, t);
  const statusLabel = getStatusLabel(task.status, t);

  const statusStyles =
    task.status === "COMPLETED"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : task.status === "IN_PROGRESS"
        ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
        : "border-amber-400/20 bg-amber-400/10 text-amber-300";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-details-title"
      onMouseDown={onClose}
    >
      <section
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overflow-x-hidden rounded-3xl border border-slate-700/80 bg-[#10233d] shadow-2xl shadow-black/60"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-transparent" />

        <header className="relative flex items-start justify-between gap-4 px-6 pb-5 pt-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                {t.tasks.details.title}
              </p>
            </div>

            <h2
              id="task-details-title"
              className={`mt-3 break-words text-3xl font-extrabold leading-[1.12] tracking-tight [overflow-wrap:anywhere] ${
                task.completed
                  ? "text-slate-400 line-through"
                  : "bg-gradient-to-r from-white via-slate-100 to-cyan-100 bg-clip-text text-transparent"
              }`}
            >
              {task.title}
            </h2>

            <div className="mt-3 h-px w-16 bg-gradient-to-r from-cyan-400/80 to-transparent" />
          </div>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-9 w-9 shrink-0 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label={t.tasks.details.close}
            title={t.tasks.details.close}
          >
            <X size={18} />
          </Button>
        </header>

        <div className="relative space-y-7 px-6 pb-7">
          <div className="mt-2 flex flex-wrap gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                priorityStyles[task.priority]
              }`}
            >
              <AlertCircle size={13} />
              {t.tasks.details.priority}: {priorityLabel}
            </span>

            <span
              className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyles}`}
            >
              {t.tasks.details.status}: {statusLabel}
            </span>

            {task.tag && (
              <span
                className={`inline-flex max-w-full items-center break-words rounded-full border px-3 py-1.5 text-xs font-bold [overflow-wrap:anywhere] ${getTagStyle(
                  task.tag
                )}`}
              >
                {task.tag}
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/20 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                <FileText size={15} />
              </div>

              <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                {t.tasks.details.description}
              </p>
            </div>

            {task.description ? (
              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-100 [overflow-wrap:anywhere]">
                {task.description}
              </p>
            ) : (
              <p className="text-sm italic text-slate-400">
                {t.tasks.details.noDescription}
              </p>
            )}
          </div>

          {task.dueDate && (
            <div
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium ${
                isOverdue
                  ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
                  : "border-slate-700/80 bg-slate-950/20 text-slate-100"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  isOverdue
                    ? "bg-rose-400/15 text-rose-300"
                    : "bg-cyan-400/10 text-cyan-300"
                }`}
              >
                {isOverdue ? (
                  <AlertCircle size={17} />
                ) : (
                  <CalendarDays size={17} />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {t.tasks.details.dueDate}
                </p>

                <p
                  className={`mt-0.5 truncate ${
                    isOverdue ? "text-rose-300" : "text-slate-100"
                  }`}
                >
                  {taskDate?.label}
                </p>
              </div>
            </div>
          )}

          <footer className="flex flex-col-reverse gap-2 border-t border-slate-700/70 pt-5 sm:flex-row sm:flex-wrap sm:justify-end">
            {!isCompleted && (
              <Button
                type="button"
                onClick={onToggleCompleted}
                className="h-10 gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/15 text-emerald-200 hover:bg-emerald-400/25 hover:text-emerald-100"
              >
                <Check size={17} strokeWidth={3} />
                {t.tasks.details.completeTask}
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="h-10 gap-2 rounded-xl border-slate-600 bg-slate-800/60 text-slate-100 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-200"
            >
              <Pencil size={16} />
              {t.tasks.details.editTask}
            </Button>

            <Button
              type="button"
              onClick={() => {
                onClose();
                onDelete();
              }}
              className="h-10 gap-2 rounded-xl border border-rose-400/20 bg-rose-400/15 text-rose-200 hover:bg-rose-400/25 hover:text-rose-100"
            >
              <Trash2 size={16} />
              {t.tasks.details.deleteTask}
            </Button>
          </footer>
        </div>
      </section>
    </div>
  );
}

function SortableTaskItem({
  task,
  onOpenDetails,
  onEdit,
  onDelete,
  onToggleCompleted,
}: {
  task: Task;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleCompleted: () => void;
}) {
  const { t: rawTranslations, language } = useLanguage();
  const t = rawTranslations as TranslationObject;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      taskId: task.id,
      status: task.status,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityLabel = getPriorityLabel(task.priority, t);

  const taskDate = task.dueDate
    ? formatTaskDate({
        dueDate: task.dueDate,
        language,
        completed: task.completed,
      })
    : null;

  const isOverdue = taskDate?.isOverdue ?? false;

  function stopDrag(event: React.PointerEvent | React.MouseEvent) {
    event.stopPropagation();
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onOpenDetails}
      className={`ui-task-card group min-w-0 cursor-grab select-none touch-none active:cursor-grabbing ${
        isDragging
          ? "z-50 scale-[1.02] border-primary opacity-30 shadow-2xl shadow-primary/20"
          : ""
      }`}
      aria-label={task.title}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`line-clamp-2 min-w-0 flex-1 break-words text-sm font-semibold leading-5 transition-colors [overflow-wrap:anywhere] ${
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
          className={`mt-2 line-clamp-2 whitespace-pre-wrap break-words text-xs leading-5 [overflow-wrap:anywhere] ${
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
              className={`max-w-[130px] truncate rounded-full border px-2.5 py-1 text-xs font-medium ${getTagStyle(
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
        <div className="min-w-0">
          {task.status !== "COMPLETED" && (
            <Button
              type="button"
              size="sm"
              onPointerDown={stopDrag}
              onClick={(event) => {
                event.stopPropagation();
                onToggleCompleted();
              }}
              className="h-8 gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-400/20 hover:text-emerald-200"
              title={t.tasks.details.completeTask}
              aria-label={t.tasks.details.completeTask}
            >
              <Check size={15} strokeWidth={3} />
              <span>Completar</span>
            </Button>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 border-l border-border/70 pl-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onPointerDown={stopDrag}
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
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
            onPointerDown={stopDrag}
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
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
  onOpenDetails,
  onEdit,
  onDelete,
  onToggleCompleted,
}: {
  column: BoardColumn;
  tasks: Task[];
  onOpenDetails: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleCompleted: (taskId: string) => void;
}) {
  const { t: rawTranslations } = useLanguage();
  const t = rawTranslations as TranslationObject;

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      status: column.id,
    },
  });

  const Icon = column.icon;

  const taskCount =
    tasks.length === 1
      ? `1 ${t.board.task}`
      : `${tasks.length} ${t.board.tasks}`;

  return (
    <section
      className={`ui-kanban-column flex h-[min(70vh,720px)] min-h-[420px] min-w-0 flex-col overflow-hidden ${column.border} ${
        isOver ? "ui-kanban-column-active" : ""
      }`}
      aria-label={column.title}
    >
      <header className="mb-3 flex shrink-0 items-start justify-between gap-3 border-b border-border/70 pb-3">
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

            <p className="text-xs text-muted-foreground">
              {taskCount}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex min-w-8 shrink-0 items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ${column.bg} ${column.color}`}
        >
          {tasks.length}
        </span>
      </header>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`ui-scrollbar min-h-[240px] flex-1 space-y-3 overflow-y-auto rounded-2xl p-1 pr-2 transition-colors ${
            isOver
              ? "bg-primary/10 ring-2 ring-inset ring-primary/50"
              : ""
          }`}
        >
          {tasks.length === 0 ? (
            <div
              className={`ui-drop-zone flex min-h-[220px] items-center justify-center ${
                isOver ? "ui-drop-zone-active" : ""
              }`}
            >
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
              <SortableTaskItem
                key={task.id}
                task={task}
                onOpenDetails={() => onOpenDetails(task)}
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task)}
                onToggleCompleted={() =>
                  onToggleCompleted(task.id)
                }
              />
            ))
          )}

          <div
            className={`flex min-h-[76px] items-center justify-center rounded-2xl border border-dashed transition-colors ${
              isOver
                ? "border-primary/70 bg-primary/15"
                : "border-border/60 bg-secondary/20"
            }`}
          >
            <p className="text-xs font-medium text-muted-foreground">
              {t.tasks.dragHere}
            </p>
          </div>
        </div>
      </SortableContext>
    </section>
  );
}

export default function TaskBoard({
  tasks: initialTasks,
  guestMode = false,
}: TaskBoardProps) {
  const { t: rawTranslations } = useLanguage();
  const t = rawTranslations as TranslationObject;

  // Hook SOLO si guestMode
  const guestApi = guestMode ? useGuestTasks() : null;

  const columns = useMemo<BoardColumn[]>(
    () => [
      {
        id: "PENDING",
        title: t.board.pending,
        icon: ListTodo,
        color: "text-warning",
        bg: "bg-warning/10",
        border: "border-warning/30",
      },
      {
        id: "IN_PROGRESS",
        title: t.board.inProgress,
        icon: Clock3,
        color: "text-info",
        bg: "bg-info/10",
        border: "border-info/30",
      },
      {
        id: "COMPLETED",
        title: t.board.completed,
        icon: CircleCheck,
        color: "text-success",
        bg: "bg-success/10",
        border: "border-success/30",
      },
    ],
    [t]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  function getTasksByStatus(
    currentTasks: Task[],
    status: TaskStatus
  ) {
    return currentTasks
      .filter((task) => task.status === status)
      .sort(
        (firstTask, secondTask) =>
          getTaskPosition(firstTask) - getTaskPosition(secondTask)
      );
  }

  function normalizePositions(currentTasks: Task[]) {
    return columns.flatMap((column) =>
      currentTasks
        .filter((task) => task.status === column.id)
        .sort(
          (firstTask, secondTask) =>
            getTaskPosition(firstTask) - getTaskPosition(secondTask)
        )
        .map((task, index) => ({
          ...task,
          position: index,
          completed: column.id === "COMPLETED",
        }))
    );
  }

  async function saveOrder(updatedTasks: Task[]) {
    if (guestMode && guestApi) {
      guestApi.reorderTasks(
        updatedTasks.map((task) => ({
          id: task.id,
          status: task.status,
          position: getTaskPosition(task),
        }))
      );
    } else {
      await reorderTasks(
        updatedTasks.map((task) => ({
          id: task.id,
          status: task.status,
          position: getTaskPosition(task),
        }))
      );
    }
  }

  async function restorePreviousOrder(previousTasks: Task[]) {
    const currentTasks = tasks;

    setTasks(previousTasks);

    setViewingTask((current) =>
      current
        ? previousTasks.find((task) => task.id === current.id) ?? null
        : null
    );

    try {
      if (guestMode && guestApi) {
        guestApi.reorderTasks(
          previousTasks.map((task) => ({
            id: task.id,
            status: task.status,
            position: getTaskPosition(task),
          }))
        );
      } else {
        await saveOrder(previousTasks);
      }

      toast.success(t.board.undoSuccess);
    } catch (error) {
      console.error("ERROR DESHACIENDO EL MOVIMIENTO:", error);

      setTasks(currentTasks);

      setViewingTask((current) =>
        current
          ? currentTasks.find((task) => task.id === current.id) ?? null
          : null
      );

      toast.error(t.board.undoError);
    }
  }

  async function moveTaskToStatus(
    taskId: string,
    destinationStatus: TaskStatus,
    insertIndex?: number
  ) {
    const activeTask = tasks.find((task) => task.id === taskId);

    if (!activeTask) {
      return;
    }

    const oldTasks = tasks;

    const sourceTasks = getTasksByStatus(
      tasks,
      activeTask.status
    ).filter((task) => task.id !== taskId);

    const destinationTasks =
      activeTask.status === destinationStatus
        ? sourceTasks
        : getTasksByStatus(tasks, destinationStatus);

    const movedTask: Task = {
      ...activeTask,
      status: destinationStatus,
      completed: destinationStatus === "COMPLETED",
    };

    const safeInsertIndex =
      typeof insertIndex === "number"
        ? Math.max(
            0,
            Math.min(insertIndex, destinationTasks.length)
          )
        : destinationTasks.length;

    const nextDestinationTasks = [...destinationTasks];
    nextDestinationTasks.splice(safeInsertIndex, 0, movedTask);

    const untouchedTasks = tasks.filter(
      (task) =>
        task.id !== taskId &&
        task.status !== activeTask.status &&
        task.status !== destinationStatus
    );

    const nextTasks =
      activeTask.status === destinationStatus
        ? [
            ...tasks.filter(
              (task) =>
                task.status !== activeTask.status &&
                task.id !== taskId
            ),
            ...nextDestinationTasks,
          ]
        : [
            ...untouchedTasks,
            ...sourceTasks,
            ...nextDestinationTasks,
          ];

    const normalizedTasks = normalizePositions(nextTasks);

    setTasks(normalizedTasks);

    const updatedTask =
      normalizedTasks.find((task) => task.id === taskId) ?? null;

    setViewingTask((current) =>
      current?.id === taskId ? updatedTask : current
    );

    try {
      if (guestMode && guestApi) {
        guestApi.reorderTasks(
          normalizedTasks.map((task) => ({
            id: task.id,
            status: task.status,
            position: getTaskPosition(task),
          }))
        );
      } else {
        await saveOrder(normalizedTasks);
      }

      const message =
        destinationStatus === "COMPLETED"
          ? t.board.completedMessage
          : destinationStatus === "IN_PROGRESS"
            ? t.board.inProgressMessage
            : t.board.pendingMessage;

      toast.success(message, {
        duration: 5000,
        action: {
          label: t.board.undo,
          onClick: () => {
            void restorePreviousOrder(oldTasks);
          },
        },
      });
    } catch (error) {
      console.error("ERROR MOVIENDO LA TAREA:", error);

      setTasks(oldTasks);

      setViewingTask((current) =>
        current?.id === taskId
          ? oldTasks.find((task) => task.id === taskId) ?? null
          : current
      );

      toast.error(t.board.movedError);
    }
  }

  async function handleToggleCompleted(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);

    if (!task || task.status === "COMPLETED") {
      return;
    }

    if (guestMode && guestApi) {
      guestApi.toggleCompleted(taskId);
    } else {
      await moveTaskToStatus(taskId, "COMPLETED");
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find(
      (item) => item.id === String(event.active.id)
    );

    setActiveTask(task ?? null);
  }

  function handleDragCancel() {
    setActiveTask(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    const activeTask = tasks.find(
      (task) => task.id === activeTaskId
    );

    if (!activeTask) {
      return;
    }

    const overTask = tasks.find((task) => task.id === overId);

    const destinationStatus = overTask
      ? overTask.status
      : isTaskStatus(overId)
        ? overId
        : null;

    if (!destinationStatus) {
      return;
    }

    if (
      activeTask.status === destinationStatus &&
      activeTaskId === overId
    ) {
      return;
    }

    let insertIndex: number | undefined;

    if (overTask) {
      const destinationTasks = getTasksByStatus(
        tasks,
        destinationStatus
      ).filter((task) => task.id !== activeTaskId);

      const foundIndex = destinationTasks.findIndex(
        (task) => task.id === overTask.id
      );

      insertIndex =
        foundIndex === -1 ? destinationTasks.length : foundIndex;
    }

    await moveTaskToStatus(
      activeTaskId,
      destinationStatus,
      insertIndex
    );
  }

  const activePriorityLabel = activeTask
    ? getPriorityLabel(activeTask.priority, t)
    : "";

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <div className="ui-scrollbar w-full overflow-x-auto pb-4">
          <div className="grid min-w-[900px] grid-cols-3 gap-4 xl:min-w-0 xl:gap-5">
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={getTasksByStatus(tasks, column.id)}
                onOpenDetails={(task) => setViewingTask(task)}
                onEdit={(task) => setEditingTask(task)}
                onDelete={(task) => setDeletingTask(task)}
                onToggleCompleted={(taskId) => {
                  void handleToggleCompleted(taskId);
                }}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[300px] rounded-2xl border border-primary/50 bg-card p-4 shadow-2xl shadow-primary/20">
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 min-w-0 flex-1 break-words text-sm font-semibold text-foreground">
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
                <p className="mt-2 line-clamp-2 whitespace-pre-wrap break-words text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
                  {activeTask.description}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {viewingTask && (
        <TaskDetailsModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={() => {
            setEditingTask(viewingTask);
          }}
          onDelete={() => {
            setDeletingTask(viewingTask);
          }}
          onToggleCompleted={() => {
            if (viewingTask.status !== "COMPLETED") {
              void handleToggleCompleted(viewingTask.id);
            }
          }}
        />
      )}

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
          guestMode={guestMode}
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
            if (guestMode && guestApi) {
              guestApi.deleteTask(deletingTask.id);
            }

            setTasks((current) =>
              current.filter((task) => task.id !== deletingTask.id)
            );

            setViewingTask(null);
            setDeletingTask(null);
          }}
          guestMode={guestMode}
        />
      )}
    </>
  );
}