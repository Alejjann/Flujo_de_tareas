"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createTask(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado");
  }

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();

  const priority = String(
    formData.get("priority") || "MEDIUM"
  ) as "LOW" | "MEDIUM" | "HIGH";

  const dueDateValue = String(formData.get("dueDate") || "");

  const selectedTag = String(formData.get("tag") || "").trim();
  const customTag = String(formData.get("customTag") || "").trim();

  const tag =
    selectedTag === "CUSTOM"
      ? customTag || null
      : selectedTag || null;

  if (!title) {
    throw new Error("El título es obligatorio");
  }

  await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDateValue ? new Date(dueDateValue) : null,
      userId: session.user.id,
      tag,
      status: "PENDING",
      completed: false,
    },
  });

  revalidatePath("/");
}