"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
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
      user: {
        connect: {
          email: "demo@taskflow.com", // Debe coincidir con el usuario que has creado
        },
      },
    },
  });

  revalidatePath("/");
}