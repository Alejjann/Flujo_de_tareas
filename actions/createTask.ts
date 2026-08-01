"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title.trim()) return;

  await prisma.task.create({
    data: {
      title,
      description,
      priority: "MEDIUM",

      // Temporal hasta tener autenticación
      user: {
        connect: {
          email: "demo@taskflow.com",
        },
      },
    },
  });

  revalidatePath("/");
}