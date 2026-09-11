"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  getPasswordErrors,
  PASSWORD_MAX_LENGTH,
} from "@/lib//password";

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const EMAIL_MAX_LENGTH = 255;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

  if (name.length < NAME_MIN_LENGTH) {
    throw new Error(
      "El nombre debe tener al menos 2 caracteres."
    );
  }

  if (name.length > NAME_MAX_LENGTH) {
    throw new Error(
      "El nombre no puede superar los 80 caracteres."
    );
  }

  if (!email) {
    throw new Error("El correo no puede estar vacío.");
  }

  if (email.length > EMAIL_MAX_LENGTH) {
    throw new Error(
      "El correo no puede superar los 255 caracteres."
    );
  }

  if (!isValidEmail(email)) {
    throw new Error(
      "Introduce un correo electrónico válido."
    );
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!currentUser) {
    throw new Error("No se encontró tu cuenta.");
  }

  if (email !== currentUser.email) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (userWithSameEmail) {
      throw new Error("Ese correo ya está en uso.");
    }
  }

  const data: {
    name: string;
    email: string;
    password?: string;
  } = {
    name,
    email,
  };

  if (password !== "") {
    if (password.length > PASSWORD_MAX_LENGTH) {
      throw new Error(
        `La contraseña no puede superar los ${PASSWORD_MAX_LENGTH} caracteres.`
      );
    }

    const passwordErrors = getPasswordErrors(password);

    if (passwordErrors.length > 0) {
      throw new Error(passwordErrors[0]);
    }

    data.password = await bcrypt.hash(password, 12);
  }

  try {
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data,
    });
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);

    throw new Error(
      "No se ha podido actualizar el perfil. Inténtalo de nuevo."
    );
  }

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  revalidatePath("/dashboard");

  return {
    success: true,
  };
}