"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { resend } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { getPasswordErrors } from "@/lib/validation/password";

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const EMAIL_MAX_LENGTH = 255;

const GENERIC_RESET_MESSAGE =
  "Si existe una cuenta con ese correo, te hemos enviado un enlace para restablecer la contraseña.";

const EMAIL_ALREADY_REGISTERED_MESSAGE =
  "Ya existe una cuenta con este correo electrónico. Inicia sesión o utiliza otro correo.";

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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

function isPrismaUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function isNextRedirectError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("NEXT_REDIRECT")
  );
}

function isInvalidCredentialsError(error: unknown) {
  if (
    typeof error !== "object" ||
    error === null
  ) {
    return false;
  }

  const authError = error as {
    type?: string;
    cause?: {
      err?: {
        code?: string;
        type?: string;
      };
    };
  };

  return (
    authError.type === "CredentialsSignin" ||
    authError.cause?.err?.code === "credentials" ||
    authError.cause?.err?.type === "CredentialsSignin"
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

  /*
   * Usamos el mismo mensaje para campos incompletos o credenciales
   * incorrectas para no revelar si un correo está registrado.
   */
  if (!email || !password) {
    return {
      error: "Correo o contraseña incorrectos.",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    /*
     * Tras un login correcto Auth.js ejecuta un redirect interno.
     * Next.js representa ese redirect como un error especial que
     * debe relanzarse para que la navegación funcione.
     */
    if (isNextRedirectError(error)) {
      throw error;
    }

    if (isInvalidCredentialsError(error)) {
      return {
        error: "Correo o contraseña incorrectos.",
      };
    }

    console.error("ERROR_INICIANDO_SESION", error);

    return {
      error: "No se pudo iniciar sesión. Inténtalo de nuevo.",
    };
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

  if (name.length < NAME_MIN_LENGTH) {
    return {
      error: "El nombre debe tener al menos 2 caracteres.",
      field: "name",
    };
  }

  if (name.length > NAME_MAX_LENGTH) {
    return {
      error: "El nombre no puede superar los 80 caracteres.",
      field: "name",
    };
  }

  if (email.length > EMAIL_MAX_LENGTH || !isValidEmail(email)) {
    return {
      error: "Introduce un correo electrónico válido.",
      field: "email",
    };
  }

  const passwordErrors = getPasswordErrors(password);

  if (passwordErrors.length > 0) {
    return {
      error: passwordErrors[0],
      field: "password",
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    /*
     * El índice @unique en Prisma es la protección real frente
     * a registros concurrentes con el mismo correo.
     */
    if (isPrismaUniqueConstraintError(error)) {
      return {
        error: EMAIL_ALREADY_REGISTERED_MESSAGE,
        field: "email",
      };
    }

    console.error("ERROR_CREANDO_USUARIO", error);

    return {
      error:
        "No se pudo crear la cuenta. Inténtalo de nuevo más tarde.",
    };
  }

  redirect("/login?registered=1");
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
   * Siempre devolvemos la misma respuesta: evita revelar si existe
   * una cuenta asociada al correo introducido.
   */
  if (!email || !isValidEmail(email)) {
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
   * Solo almacenamos el hash del token en la base de datos.
   * El token original solo existe en el enlace enviado por correo.
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

  const resetUrl = new URL(
    "/reset-password",
    getAppUrl()
  );

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

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error(
      "ERROR_ENVIANDO_EMAIL_RECUPERACION",
      error
    );

    /*
     * Si el envío falla, anulamos el token que acabamos de crear.
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