"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateTask(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  const dueDate = formData.get("dueDate") as string;

  await prisma.task.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      priority,
        dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath("/");
}