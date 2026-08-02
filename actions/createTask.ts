"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createTask(formData: FormData) {
  const session = await auth();
  const tag = formData.get("tag") as string;

  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH";
  const dueDate = formData.get("dueDate") as string;

  if (!title.trim()) return;

  await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: session.user.id,
      tag,
    },
  });

  revalidatePath("/");
}