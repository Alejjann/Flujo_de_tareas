"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

interface TaskOrderItem {
  id: string;
  status: TaskStatus;
  position: number;
}

export async function reorderTasks(tasks: TaskOrderItem[]) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autenticado");
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return;
  }

  const taskIds = tasks.map((task) => task.id);

  const ownedTasks = await prisma.task.findMany({
    where: {
      id: {
        in: taskIds,
      },
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (ownedTasks.length !== taskIds.length) {
    throw new Error(
      "No tienes permiso para reordenar una o más tareas"
    );
  }

  await prisma.$transaction(
    tasks.map((task) =>
      prisma.task.update({
        where: {
          id: task.id,
        },
        data: {
          status: task.status,
          completed: task.status === "COMPLETED",
          position: task.position,
        },
      })
    )
  );

  revalidatePath("/");
  revalidatePath("/dashboard");
}