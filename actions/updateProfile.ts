"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfile(formData: FormData) {
  // Obtener sesión
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("No estás autenticado.");
  }

  // Obtener datos
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") ?? ""
  );

  // Validar nombre
  if (!name) {
    throw new Error(
      "El nombre no puede estar vacío."
    );
  }

  // Validar correo
  if (!email) {
    throw new Error(
      "El correo no puede estar vacío."
    );
  }

  // Comprobar si otro usuario utiliza ese correo
  const existingUser =
    await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id: session.user.id,
        },
      },
    });

  if (existingUser) {
    throw new Error(
      "Ese correo ya está en uso."
    );
  }

  // Datos que siempre actualizamos
  const data: {
    name: string;
    email: string;
    password?: string;
  } = {
    name,
    email,
  };

  // Si hay nueva contraseña, actualizarla
  if (password.trim() !== "") {
    if (password.length < 6) {
      throw new Error(
        "La contraseña debe tener al menos 6 caracteres."
      );
    }

    data.password = await bcrypt.hash(
      password,
      10
    );
  }

  console.log(
    "Actualizando usuario:",
    session.user.id
  );

  // Actualizar usuario
  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data,
  });

  console.log(
    "Usuario actualizado correctamente."
  );

  // Actualizar caché de las páginas
  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/dashboard");

  return {
    success: true,
  };
}