"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Priority = "LOW" | "MEDIUM" | "HIGH";

function isPriority(value: string): value is Priority {
  return (
    value === "LOW" ||
    value === "MEDIUM" ||
    value === "HIGH"
  );
}

function parseDueDate(value: string) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("La fecha límite no es válida");
  }

  return date;
}

export async function createTask(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado");
  }

  const title = String(formData.get("title") || "").trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const priorityValue = String(
    formData.get("priority") || "MEDIUM"
  );

  const dueDateValue = String(
    formData.get("dueDate") || ""
  ).trim();

  const selectedTag = String(
    formData.get("tag") || ""
  ).trim();

  const customTag = String(
    formData.get("customTag") || ""
  ).trim();

  if (!title) {
    throw new Error("El título es obligatorio");
  }

  if (!isPriority(priorityValue)) {
    throw new Error(
      "La prioridad seleccionada no es válida"
    );
  }

  const tag =
    selectedTag === "CUSTOM"
      ? customTag || null
      : selectedTag || null;

  const dueDate = parseDueDate(dueDateValue);

  await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const pendingTaskCount = await tx.task.count({
        where: {
          userId: session.user.id,
          status: "PENDING",
        },
      });

      await tx.task.create({
        data: {
          title,
          description: description || null,
          priority: priorityValue,
          dueDate,
          userId: session.user.id,
          tag,
          status: "PENDING",
          completed: false,
          position: pendingTaskCount,
        },
      });
    }
  );

  revalidatePath("/");
  revalidatePath("/dashboard");

  return {
    success: true,
  };
}