"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function resetPassword(
  token: string,
  newPassword: string
) {
  if (!token) {
    throw new Error(
      "El enlace de recuperación no es válido."
    );
  }

  if (!newPassword) {
    throw new Error(
      "Introduce una nueva contraseña."
    );
  }

  if (newPassword.length < 6) {
    throw new Error(
      "La contraseña debe tener al menos 6 caracteres."
    );
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error(
      "El enlace ha caducado o no es válido."
    );
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return {
    success: true,
  };
}