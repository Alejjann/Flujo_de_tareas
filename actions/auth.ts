"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";

/* =========================
   LOGIN
========================= */

export async function loginUser(formData: FormData) {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  const email =
    typeof emailValue === "string"
      ? emailValue.trim().toLowerCase()
      : "";

  const password =
    typeof passwordValue === "string"
      ? passwordValue
      : "";

  if (!email) {
    return {
      error: "Introduce el correo electrónico.",
    };
  }

  if (!password) {
    return {
      error: "Introduce la contraseña.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return {
          error: "Correo o contraseña incorrectos.",
        };
      }

      return {
        error: "No se pudo iniciar sesión. Inténtalo de nuevo.",
      };
    }

    /*
      No captures otros errores aquí.

      Si el login es correcto, Auth.js/Next.js realiza la redirección
      internamente. También es importante dejar visibles errores reales
      de conexión, Prisma o configuración.
    */
    throw error;
  }

  return {
    success: true,
  };
}

/* =========================
   REGISTRO
========================= */

export async function registerUser(formData: FormData) {
  const nameValue = formData.get("name");
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  const name =
    typeof nameValue === "string"
      ? nameValue.trim()
      : "";

  const email =
    typeof emailValue === "string"
      ? emailValue.trim().toLowerCase()
      : "";

  const password =
    typeof passwordValue === "string"
      ? passwordValue
      : "";

  if (!name || !email || !password) {
    return {
      error: "Todos los campos son obligatorios.",
    };
  }

  if (password.length < 6) {
    return {
      error: "La contraseña debe tener al menos 6 caracteres.",
    };
  }

  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exists) {
    return {
      error: "Ese correo ya está registrado.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  redirect("/login");
}

/* =========================
   LOGOUT
========================= */

export async function logoutUser() {
  await signOut({
    redirectTo: "/login",
  });
}