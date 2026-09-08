"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getPasswordErrors } from "@/lib/password";

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No estás autenticado.");
  }

  const name = String(formData.get("name") ?? "").trim();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  if (!name) {
    throw new Error("El nombre no puede estar vacío.");
  }

  if (!email) {
    throw new Error("El correo no puede estar vacío.");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
      NOT: {
        id: session.user.id,
      },
    },
  });

  if (existingUser) {
    throw new Error("Ese correo ya está en uso.");
  }

  const data: {
    name: string;
    email: string;
    password?: string;
  } = {
    name,
    email,
  };

  if (password.trim() !== "") {
    const passwordErrors = getPasswordErrors(password);

    if (passwordErrors.length > 0) {
      throw new Error(passwordErrors[0]);
    }

    data.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data,
  });

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/dashboard");

  return {
    success: true,
  };
}