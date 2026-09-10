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
import {
  AlertCircle,
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  ListTodo,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type GuestTaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export type GuestTask = {
  id: string;
  title: string;
  description: string | null;
  status: GuestTaskStatus;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  tag: string | null;
  createdAt: number;
  position: number;
};

type GuestTaskBoardProps = {
  tasks: GuestTask[];
  onTasksChange: (tasks: GuestTask[]) => void;
};

type BoardColumn = {
  id: GuestTaskStatus;
  title: string;
  icon: typeof ListTodo;
  color: string;
  bg: string;
  border: string;
};

const priorityStyles = {
  LOW: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  MEDIUM: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  HIGH: "border-rose-400/20 bg-rose-400/10 text-rose-300",
};

function getPriorityLabel(priority: GuestTask["priority"]) {
  if (priority === "HIGH") {
    return "Alta";
  }

  if (priority === "MEDIUM") {
    return "Media";
  }

  return "Baja";
}

function formatDueDate(dueDate: string | null) {
  if (!dueDate) {
    return null;
  }

  const date = new Date(`${dueDate}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function isTaskStatus(value: string): value is GuestTaskStatus {
  return (
    value === "PENDING" ||
    value === "IN_PROGRESS" ||
    value === "COMPLETED"
  );
}

function normalizeTasks(tasks: GuestTask[]) {
  const statuses: GuestTaskStatus[] = [
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
  ];

  return statuses.flatMap((status) =>
    tasks
      .filter((task) => task.status === status)
      .sort((firstTask, secondTask) => firstTask.position - secondTask.position)
      .map((task, index) => ({
        ...task,
        position: index,
      }))
  );
}

function SortableGuestTask({
  task,
  onOpen,
  onComplete,
}: {
  task: GuestTask;
  onOpen: () => void;
  onComplete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formattedDueDate = formatDueDate(task.dueDate);

  function stopDrag(event: React.PointerEvent | React.MouseEvent) {
    event.stopPropagation();
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onOpen}
      className={`ui-task-card cursor-grab select-none touch-none active:cursor-grabbing ${
        isDragging
          ? "scale-[1.02] border-primary opacity-30 shadow-xl shadow-primary/20"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 min-w-0 flex-1 break-words text-sm font-semibold leading-5 text-foreground [overflow-wrap:anywhere]">
          {task.title}
        </h3>

        <span
          className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
            priorityStyles[task.priority]
          }`}
        >
          {getPriorityLabel(task.priority)}
        </span>
      </div>

      {task.description && (
        <p className="mt-2 line-clamp-2 whitespace-pre-wrap break-words text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
          {task.description}
        </p>
      )}

      {(task.tag || formattedDueDate) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {task.tag && (
            <span className="max-w-[140px] truncate rounded-full border border-violet/20 bg-violet/10 px-2.5 py-1 text-xs font-medium text-violet">
              {task.tag}
            </span>
          )}

          {formattedDueDate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
              <CalendarDays size={12} />
              {formattedDueDate}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
        <div>
          {task.status !== "COMPLETED" && (
            <Button
              type="button"
              size="sm"
              onPointerDown={stopDrag}
              onClick={(event) => {
                event.stopPropagation();
                onComplete();
              }}
              className="h-8 gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-400/20 hover:text-emerald-200"
            >
              <Check size={15} strokeWidth={3} />
              Completar
            </Button>
          )}
        </div>

        <span className="text-[11px] font-medium text-muted-foreground">
          Arrastra para mover
        </span>
      </div>
    </article>
  );
}

function GuestColumn({
  column,
  tasks,
  onOpenTask,
  onCompleteTask,
}: {
  column: BoardColumn;
  tasks: GuestTask[];
  onOpenTask: (task: GuestTask) => void;
  onCompleteTask: (taskId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const Icon = column.icon;

  return (
    <section
      className={`ui-kanban-column flex h-[min(68vh,680px)] min-h-[430px] min-w-0 flex-col overflow-hidden ${column.border} ${
        isOver ? "ui-kanban-column-active" : ""
      }`}
    >
      <header className="mb-3 flex shrink-0 items-start justify-between gap-3 border-b border-border/70 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${column.bg}`}
          >
            <Icon size={18} className={column.color} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-foreground">
              {column.title}
            </h2>

            <p className="text-xs text-muted-foreground">
              {tasks.length === 1
                ? "1 tarea"
                : `${tasks.length} tareas`}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex min-w-8 items-center justify-center rounded-full px-2.5 py-1 text-xs font-bold ${column.bg} ${column.color}`}
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
          className={`min-h-[240px] flex-1 space-y-3 overflow-y-auto rounded-2xl p-1 pr-2 transition ${
            isOver
              ? "bg-primary/10 ring-2 ring-inset ring-primary/50"
              : ""
          }`}
        >
          {tasks.length === 0 ? (
            <div className="ui-drop-zone flex min-h-[220px] items-center justify-center">
              <div className="text-center">
                <Icon
                  size={28}
                  className={`mx-auto mb-3 ${column.color} opacity-60`}
                />
                <p className="text-sm font-medium text-muted-foreground">
                  Arrastra una tarea aquí
                </p>
              </div>
            </div>
          ) : (
            tasks.map((task) => (
              <SortableGuestTask
                key={task.id}
                task={task}
                onOpen={() => onOpenTask(task)}
                onComplete={() => onCompleteTask(task.id)}
              />
            ))
          )}

          <div
            className={`flex min-h-[68px] items-center justify-center rounded-2xl border border-dashed transition ${
              isOver
                ? "border-primary/70 bg-primary/15"
                : "border-border/60 bg-secondary/20"
            }`}
          >
            <p className="text-xs font-medium text-muted-foreground">
              Arrastra una tarea aquí
            </p>
          </div>
        </div>
      </SortableContext>
    </section>
  );
}

export default function GuestTaskBoard({
  tasks,
  onTasksChange,
}: GuestTaskBoardProps) {
  const columns = useMemo<BoardColumn[]>(
    () => [
      {
        id: "PENDING",
        title: "Pendientes",
        icon: ListTodo,
        color: "text-warning",
        bg: "bg-warning/10",
        border: "border-warning/30",
      },
      {
        id: "IN_PROGRESS",
        title: "En progreso",
        icon: Clock3,
        color: "text-info",
        bg: "bg-info/10",
        border: "border-info/30",
      },
      {
        id: "COMPLETED",
        title: "Completadas",
        icon: CircleCheck,
        color: "text-success",
        bg: "bg-success/10",
        border: "border-success/30",
      },
    ],
    []
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [activeTask, setActiveTask] = useState<GuestTask | null>(
    null
  );
  const [selectedTask, setSelectedTask] = useState<GuestTask | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);

  function getTasksByStatus(status: GuestTaskStatus) {
    return tasks
      .filter((task) => task.status === status)
      .sort((firstTask, secondTask) => firstTask.position - secondTask.position);
  }

  function moveTask(
    taskId: string,
    destinationStatus: GuestTaskStatus,
    insertIndex?: number
  ) {
    const active = tasks.find((task) => task.id === taskId);

    if (!active) {
      return;
    }

    const sourceTasks = getTasksByStatus(active.status).filter(
      (task) => task.id !== taskId
    );

    const destinationTasks =
      active.status === destinationStatus
        ? sourceTasks
        : getTasksByStatus(destinationStatus);

    const nextTask: GuestTask = {
      ...active,
      status: destinationStatus,
    };

    const nextDestinationTasks = [...destinationTasks];
    const targetIndex =
      typeof insertIndex === "number"
        ? Math.max(
            0,
            Math.min(insertIndex, nextDestinationTasks.length)
          )
        : nextDestinationTasks.length;

    nextDestinationTasks.splice(targetIndex, 0, nextTask);

    const unaffectedTasks = tasks.filter(
      (task) =>
        task.id !== taskId &&
        task.status !== active.status &&
        task.status !== destinationStatus
    );

    const nextTasks =
      active.status === destinationStatus
        ? [
            ...tasks.filter(
              (task) =>
                task.status !== active.status &&
                task.id !== taskId
            ),
            ...nextDestinationTasks,
          ]
        : [
            ...unaffectedTasks,
            ...sourceTasks,
            ...nextDestinationTasks,
          ];

    onTasksChange(normalizeTasks(nextTasks));

    const message =
      destinationStatus === "IN_PROGRESS"
        ? "Tarea movida a En progreso."
        : destinationStatus === "COMPLETED"
          ? "Tarea completada."
          : "Tarea movida a Pendientes.";

    toast.success(message);
  }

  function handleDragStart(event: DragStartEvent) {
    const currentTask = tasks.find(
      (task) => task.id === String(event.active.id)
    );

    setActiveTask(currentTask ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = String(active.id);
    const overId = String(over.id);

    const draggedTask = tasks.find((task) => task.id === taskId);

    if (!draggedTask) {
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

    let insertIndex: number | undefined;

    if (overTask) {
      const destinationTasks = getTasksByStatus(
        destinationStatus
      ).filter((task) => task.id !== taskId);

      const index = destinationTasks.findIndex(
        (task) => task.id === overTask.id
      );

      insertIndex =
        index === -1 ? destinationTasks.length : index;
    }

    moveTask(taskId, destinationStatus, insertIndex);
  }

  function completeTask(taskId: string) {
    moveTask(taskId, "COMPLETED");
  }

  function deleteTask(taskId: string) {
    onTasksChange(tasks.filter((task) => task.id !== taskId));
    setSelectedTask(null);
    toast.success("Tarea eliminada.");
  }

  function updateTask(formData: FormData) {
    if (!selectedTask) {
      return;
    }

    const title = String(formData.get("title") || "").trim();
    const description = String(
      formData.get("description") || ""
    ).trim();
    const priority = String(
      formData.get("priority") || "MEDIUM"
    ) as GuestTask["priority"];
    const tag = String(formData.get("tag") || "").trim();
    const dueDate = String(formData.get("dueDate") || "").trim();

    if (!title) {
      toast.error("El título es obligatorio.");
      return;
    }

    onTasksChange(
      tasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              title,
              description: description || null,
              priority,
              tag: tag || null,
              dueDate: dueDate || null,
            }
          : task
      )
    );

    setSelectedTask(null);
    setIsEditing(false);
    toast.success("Cambios guardados.");
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragCancel={() => setActiveTask(null)}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-4">
          <div className="grid min-w-[900px] grid-cols-3 gap-4 xl:min-w-0 xl:gap-5">
            {columns.map((column) => (
              <GuestColumn
                key={column.id}
                column={column}
                tasks={getTasksByStatus(column.id)}
                onOpenTask={(task) => setSelectedTask(task)}
                onCompleteTask={completeTask}
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
                  {getPriorityLabel(activeTask.priority)}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog
        open={Boolean(selectedTask)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTask(null);
            setIsEditing(false);
          }
        }}
      >
        <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl overflow-hidden rounded-3xl border border-border bg-popover p-0">
          {selectedTask && !isEditing && (
            <>
              <DialogHeader className="border-b border-border bg-gradient-to-br from-primary/10 via-transparent to-info/5 px-5 py-5 pr-12 sm:px-6">
                <DialogTitle className="break-words text-2xl font-black tracking-[-0.04em] text-foreground [overflow-wrap:anywhere]">
                  {selectedTask.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                      priorityStyles[selectedTask.priority]
                    }`}
                  >
                    {getPriorityLabel(selectedTask.priority)}
                  </span>

                  <span className="rounded-full border border-info/20 bg-info/10 px-3 py-1.5 text-xs font-bold text-info">
                    {selectedTask.status === "PENDING"
                      ? "Pendiente"
                      : selectedTask.status === "IN_PROGRESS"
                        ? "En progreso"
                        : "Completada"}
                  </span>

                  {selectedTask.tag && (
                    <span className="rounded-full border border-violet/20 bg-violet/10 px-3 py-1.5 text-xs font-bold text-violet">
                      {selectedTask.tag}
                    </span>
                  )}
                </div>

                <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Descripción
                  </p>

                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-foreground [overflow-wrap:anywhere]">
                    {selectedTask.description ||
                      "Esta tarea no tiene descripción."}
                  </p>
                </div>

                {selectedTask.dueDate && (
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/30 p-4">
                    <CalendarDays size={18} className="text-info" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        Fecha límite
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatDueDate(selectedTask.dueDate)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:flex-wrap sm:justify-end">
                  {selectedTask.status !== "COMPLETED" && (
                    <Button
                      type="button"
                      onClick={() => {
                        completeTask(selectedTask.id);
                        setSelectedTask(null);
                      }}
                      className="gap-2"
                    >
                      <Check size={16} />
                      Completar
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Pencil size={16} />
                    Editar
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => deleteTask(selectedTask.id)}
                    className="gap-2 border-destructive/25 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedTask && isEditing && (
            <>
              <DialogHeader className="border-b border-border bg-gradient-to-br from-primary/10 via-transparent to-violet/5 px-5 py-5 pr-12 sm:px-6">
                <DialogTitle className="text-2xl font-black tracking-[-0.04em] text-foreground">
                  Editar tarea
                </DialogTitle>
              </DialogHeader>

              <form
                action={updateTask}
                className="max-h-[calc(100dvh-10rem)] space-y-5 overflow-y-auto overflow-x-hidden p-5 sm:p-6"
              >
                <div>
                  <label
                    htmlFor="guest-edit-title"
                    className="ui-label-icon"
                  >
                    Título
                  </label>

                  <Input
                    id="guest-edit-title"
                    name="title"
                    defaultValue={selectedTask.title}
                    className="mt-2 w-full"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="guest-edit-description"
                    className="ui-label-icon"
                  >
                    Descripción
                  </label>

                  <Textarea
                    id="guest-edit-description"
                    name="description"
                    defaultValue={selectedTask.description || ""}
                    rows={5}
                    className="mt-2 min-h-[120px] w-full resize-y [overflow-wrap:anywhere]"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="guest-edit-priority"
                      className="ui-label-icon"
                    >
                      Prioridad
                    </label>

                    <select
                      id="guest-edit-priority"
                      name="priority"
                      defaultValue={selectedTask.priority}
                      className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                    >
                      <option value="LOW">Baja</option>
                      <option value="MEDIUM">Media</option>
                      <option value="HIGH">Alta</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="guest-edit-tag"
                      className="ui-label-icon"
                    >
                      Etiqueta
                    </label>

                    <Input
                      id="guest-edit-tag"
                      name="tag"
                      defaultValue={selectedTask.tag || ""}
                      className="mt-2 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="guest-edit-date"
                    className="ui-label-icon"
                  >
                    Fecha límite
                  </label>

                  <Input
                    id="guest-edit-date"
                    name="dueDate"
                    type="date"
                    defaultValue={selectedTask.dueDate || ""}
                    className="mt-2 w-full cursor-pointer"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    className="w-full gap-2 sm:w-auto"
                  >
                    <Check size={16} />
                    Guardar cambios
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}