"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { resend } from "@/lib/mail";
import { getPasswordErrors } from "@/lib/password";
import { prisma } from "@/lib/prisma";

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

const GENERIC_RESET_MESSAGE =
  "Si existe una cuenta con ese correo, te hemos enviado un enlace para restablecer la contraseña.";

function hashResetToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function getAppUrl() {
  const appUrl =
    process.env.APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  return appUrl.replace(/\/$/, "");
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character
  );
}

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

  /*
   * No se valida complejidad en login porque se permite el acceso
   * a cuentas antiguas creadas antes de la nueva política.
   */
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

  const passwordErrors = getPasswordErrors(password);

  if (passwordErrors.length > 0) {
    return {
      error: passwordErrors[0],
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

  const hashedPassword = await bcrypt.hash(password, 12);

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
   RECUPERAR CONTRASEÑA
========================= */

export async function requestPasswordReset(formData: FormData) {
  const emailValue = formData.get("email");

  const email =
    typeof emailValue === "string"
      ? emailValue.trim().toLowerCase()
      : "";

  /*
   * La respuesta es idéntica si el email existe o no.
   * Esto evita revelar cuentas registradas.
   */
  if (!email) {
    return {
      success: true,
      message: GENERIC_RESET_MESSAGE,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    return {
      success: true,
      message: GENERIC_RESET_MESSAGE,
    };
  }

  /*
   * rawToken se manda al email.
   * tokenHash se guarda en la base de datos.
   */
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetToken: tokenHash,
      resetTokenExpiry: new Date(
        Date.now() + RESET_TOKEN_TTL_MS
      ),
    },
  });

  const resetUrl = new URL("/reset-password", getAppUrl());
  resetUrl.searchParams.set("token", rawToken);

  const safeName = user.name
    ? escapeHtml(user.name)
    : "";

  try {
    const { error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM ??
        "FlowDesk <onboarding@resend.dev>",
      to: [user.email],
      subject: "Restablece tu contraseña de FlowDesk",
      text: `
Hola${user.name ? ` ${user.name}` : ""},

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de FlowDesk.

Abre este enlace para crear una contraseña nueva:
${resetUrl.toString()}

Este enlace caduca en 30 minutos y solo se puede utilizar una vez.

Si no solicitaste este cambio, puedes ignorar este correo.
      `.trim(),
      html: `
        <div style="margin:0; padding:32px 16px; background:#07101f; font-family:Arial, Helvetica, sans-serif;">
          <div style="max-width:560px; margin:0 auto; padding:32px; border:1px solid #2b4564; border-radius:24px; background:#13233a; color:#f8fbff;">
            <p style="margin:0 0 20px; color:#38bdf8; font-size:13px; font-weight:800; letter-spacing:1.4px; text-transform:uppercase;">
              FlowDesk
            </p>

            <h1 style="margin:0 0 16px; color:#ffffff; font-size:28px; line-height:1.2;">
              Restablece tu contraseña
            </h1>

            <p style="margin:0 0 16px; color:#cbd5e1; font-size:16px; line-height:1.65;">
              Hola${safeName ? ` ${safeName}` : ""},
            </p>

            <p style="margin:0 0 16px; color:#cbd5e1; font-size:16px; line-height:1.65;">
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de FlowDesk.
            </p>

            <p style="margin:28px 0;">
              <a
                href="${resetUrl.toString()}"
                style="display:inline-block; padding:14px 20px; border-radius:12px; background:#38bdf8; color:#06111f; font-size:15px; font-weight:800; text-decoration:none;"
              >
                Crear contraseña nueva
              </a>
            </p>

            <p style="margin:0 0 12px; color:#b5c5da; font-size:14px; line-height:1.6;">
              Este enlace caduca en 30 minutos y solo puede utilizarse una vez.
            </p>

            <p style="margin:0; color:#8ea3bd; font-size:13px; line-height:1.6;">
              Si no solicitaste este cambio, puedes ignorar este mensaje.
            </p>
          </div>
        </div>
      `,
    });

    /*
     * Resend devuelve errores dentro de la respuesta; no siempre
     * los lanza como excepción.
     */
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error(
      "ERROR ENVIANDO EMAIL DE RECUPERACIÓN:",
      error
    );

    /*
     * Si no se envió el email, anulamos el token nuevo.
     */
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  return {
    success: true,
    message: GENERIC_RESET_MESSAGE,
  };
}

/* =========================
   LOGOUT
========================= */

export async function logoutUser() {
  await signOut({
    redirectTo: "/login",
  });
}