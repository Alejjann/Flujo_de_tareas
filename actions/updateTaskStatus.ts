"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateTaskStatus(
  id: string,
  status:
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autenticado");
  }

  await prisma.task.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      status,
      completed: status === "COMPLETED",
    },
  });

  revalidatePath("/");
}