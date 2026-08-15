"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
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
      error: "Introduce el correo electrÃ³nico.",
    };
  }

  if (!password) {
    return {
      error: "Introduce la contraseÃ±a.",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      error: "Correo o contraseÃ±a incorrectos.",
    };
  }

  const passwordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordCorrect) {
    return {
      error: "Correo o contraseÃ±a incorrectos.",
    };
  }

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });

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
      error: "La contraseÃ±a debe tener al menos 6 caracteres.",
    };
  }

  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exists) {
    return {
      error: "Ese correo ya estÃ¡ registrado.",
    };
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

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