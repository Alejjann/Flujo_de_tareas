"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";

import { getPasswordErrors } from "@/lib/validation/password";
import { prisma } from "@/lib/prisma";

function hashResetToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

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

  const passwordErrors = getPasswordErrors(newPassword);

  if (passwordErrors.length > 0) {
    throw new Error(passwordErrors[0]);
  }

  /*
   * Del email llega el token original. Se convierte a SHA-256
   * para buscar el hash guardado en PostgreSQL.
   */
  const tokenHash = hashResetToken(token);

  const user = await prisma.user.findFirst({
    where: {
      resetToken: tokenHash,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error(
      "El enlace ha caducado, ya se utilizó o no es válido."
    );
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return {
    success: true,
  };
}