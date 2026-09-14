"use server";

import crypto from "crypto";

import { resend } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

const GENERIC_SUCCESS_MESSAGE =
  "Si existe una cuenta con ese correo, te hemos enviado un enlace para restablecer la contraseña.";

function hashResetToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function getAppUrl() {
  const appUrl =
    process.env.NEXTAUTH_URL ||
    process.env.APP_URL ||
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

export async function requestPasswordReset(emailInput: string) {
  const email = emailInput.trim().toLowerCase();


  if (!email) {
    return {
      success: true,
      message: GENERIC_SUCCESS_MESSAGE,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    return {
      success: true,
      message: GENERIC_SUCCESS_MESSAGE,
    };
  }

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

  const safeName = user.name ? escapeHtml(user.name) : "";

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

    Crea una contraseña nueva desde este enlace:
    ${resetUrl.toString()}

    Este enlace caduca en 30 minutos y solo puede utilizarse una vez.

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
                  Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
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
      "ERROR ENVIANDO EMAIL DE RECUPERACIÓN CON RESEND:",
      error
    );

    
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
    message: GENERIC_SUCCESS_MESSAGE,
  };
}