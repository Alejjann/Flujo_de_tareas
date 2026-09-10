"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export async function updateTaskStatus(
  id: string,
  status: TaskStatus,
  position?: number
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autenticado");
  }

  const task = await prisma.task.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!task) {
    throw new Error("Tarea no encontrada o no autorizada");
  }

  await prisma.task.update({
    where: {
      id: task.id,
    },
    data: {
      status,
      completed: status === "COMPLETED",

      ...(typeof position === "number" ? { position } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
}