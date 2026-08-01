"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleTask(id: string, completed: boolean) {
  await prisma.task.update({
    where: {
      id,
    },
    data: {
      completed: !completed,
    },
  });

  revalidatePath("/");
}