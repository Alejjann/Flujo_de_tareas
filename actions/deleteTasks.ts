"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No autenticado");
  }

  const result = await prisma.task.deleteMany({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (result.count === 0) {
    throw new Error(
      "No se encontró la tarea o no tienes permiso para eliminarla."
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/profile");

  return {
    success: true,
  };
}