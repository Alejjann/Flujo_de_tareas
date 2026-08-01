"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTask(id: string) {
  await prisma.task.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
}