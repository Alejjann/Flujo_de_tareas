"use server";

import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function requestPasswordReset(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error("Introduce tu correo electrónico.");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: cleanEmail,
    },
  });

  /*
   * No mostramos si el correo existe o no.
   * Esto evita revelar qué correos tienen cuenta.
   */
  if (!user) {
    return {
      success: true,
      message:
        "Si existe una cuenta con ese correo, recibirás un enlace para recuperar la contraseña.",
    };
  }

  // Crear token aleatorio
  const resetToken = crypto
    .randomBytes(32)
    .toString("hex");

  // El token caduca en 30 minutos
  const resetTokenExpiry = new Date(
    Date.now() + 1000 * 60 * 30
  );

  // Guardar token en la base de datos
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const resetUrl =
    `${appUrl}/reset-password?token=${resetToken}`;

  // Comprobar configuración de Gmail
  if (
    !process.env.GMAIL_USER ||
    !process.env.GMAIL_APP_PASSWORD
  ) {
    console.error(
      "Faltan GMAIL_USER o GMAIL_APP_PASSWORD en .env.local"
    );

    throw new Error(
      "El sistema de correo no está configurado correctamente."
    );
  }

  // Crear conexión con Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // Enviar correo
  try {
    await transporter.sendMail({
      from: `"FlowDesk" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: "Recupera tu contraseña - FlowDesk",

      html: `
        <div
          style="
            margin: 0;
            padding: 40px 20px;
            background: #020617;
            font-family: Arial, sans-serif;
          "
        >

          <div
            style="
              max-width: 520px;
              margin: 0 auto;
              padding: 32px;
              background: #0f172a;
              border: 1px solid #1e293b;
              border-radius: 20px;
              color: white;
            "
          >

            <h1
              style="
                margin: 0 0 10px;
                color: #22d3ee;
                font-size: 28px;
              "
            >
              FlowDesk
            </h1>

            <h2
              style="
                margin: 0 0 20px;
                color: white;
              "
            >
              Recuperación de contraseña
            </h2>

            <p
              style="
                color: #94a3b8;
                line-height: 1.6;
              "
            >
              Hola ${user.name || "usuario"},
            </p>

            <p
              style="
                color: #94a3b8;
                line-height: 1.6;
              "
            >
              Hemos recibido una solicitud para cambiar
              la contraseña de tu cuenta de FlowDesk.
            </p>

            <p
              style="
                color: #94a3b8;
                line-height: 1.6;
              "
            >
              Pulsa el siguiente botón para crear una
              nueva contraseña:
            </p>

            <div
              style="
                margin: 30px 0;
                text-align: center;
              "
            >

              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 14px 24px;
                  background: #06b6d4;
                  color: #020617;
                  text-decoration: none;
                  border-radius: 10px;
                  font-weight: bold;
                "
              >
                Cambiar contraseña
              </a>

            </div>

            <p
              style="
                color: #64748b;
                font-size: 13px;
                line-height: 1.6;
              "
            >
              Este enlace caducará en 30 minutos.
            </p>

            <p
              style="
                color: #64748b;
                font-size: 13px;
                line-height: 1.6;
              "
            >
              Si no has solicitado cambiar tu contraseña,
              puedes ignorar este correo.
            </p>

            <hr
              style="
                margin: 30px 0;
                border: 0;
                border-top: 1px solid #1e293b;
              "
            />

            <p
              style="
                margin: 0;
                color: #475569;
                font-size: 12px;
                text-align: center;
              "
            >
              © ${new Date().getFullYear()} FlowDesk
            </p>

          </div>
        </div>
      `,
    });

    console.log(
      `Correo de recuperación enviado a ${user.email}`
    );
  } catch (error) {
    console.error(
      "Error enviando correo con Gmail:",
      error
    );

    throw new Error(
      "No se pudo enviar el correo de recuperación."
    );
  }

  return {
    success: true,
    message:
      "Si existe una cuenta con ese correo, recibirás un enlace para recuperar la contraseña.",
  };
}