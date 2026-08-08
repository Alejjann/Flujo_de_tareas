"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No estás autenticado.");
  }

  const name = formData.get("name") as string;

  if (!name?.trim()) {
    throw new Error("El nombre no puede estar vacío.");
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: name.trim(),
    },
  });

  revalidatePath("/profile");
  revalidatePath("/");
}