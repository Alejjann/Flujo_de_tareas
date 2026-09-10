// components/providers/GuestTasksProvider.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface GuestTask {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  tag: string | null;
  position: number;
}

interface GuestTasksContextValue {
  tasks: GuestTask[];
  setTasks: React.Dispatch<React.SetStateAction<GuestTask[]>>;
  createTask: (task: Omit<GuestTask, "id" | "position">) => void;
  updateTask: (id: string, patch: Partial<GuestTask>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (updates: { id: string; status: TaskStatus; position: number }[]) => void;
  toggleCompleted: (id: string) => void;
}

const GuestTasksContext = createContext<GuestTasksContextValue | null>(null);

const STORAGE_KEY = "flowdesk_guest_tasks_v1";

function loadTasks(): GuestTask[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestTask[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: GuestTask[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function GuestTasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<GuestTask[]>([]);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const createTask = (task: Omit<GuestTask, "id" | "position">) => {
    setTasks((prev) => {
      const maxPos = prev
        .filter((t) => t.status === task.status)
        .reduce((max, t) => Math.max(max, t.position), -1);

      const newTask: GuestTask = {
        ...task,
        id: crypto.randomUUID(),
        position: maxPos + 1,
      };

      return [...prev, newTask];
    });
  };

  const updateTask = (id: string, patch: Partial<GuestTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const reorderTasks = (updates: { id: string; status: TaskStatus; position: number }[]) => {
    setTasks((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]));
      for (const u of updates) {
        const existing = map.get(u.id);
        if (!existing) continue;
        map.set(u.id, { ...existing, status: u.status, position: u.position });
      }
      return Array.from(map.values());
    });
  };

  const toggleCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "COMPLETED" ? "PENDING" : "COMPLETED",
              completed: t.status !== "COMPLETED",
            }
          : t
      )
    );
  };

  const value = useMemo(
    () => ({
      tasks,
      setTasks,
      createTask,
      updateTask,
      deleteTask,
      reorderTasks,
      toggleCompleted,
    }),
    [tasks]
  );

  return <GuestTasksContext.Provider value={value}>{children}</GuestTasksContext.Provider>;
}

export function useGuestTasks() {
  return useContext(GuestTasksContext);
}