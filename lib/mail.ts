import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendResetPasswordEmail(
  email: string,
  token: string
) {
  const baseUrl =
    process.env.NEXTAUTH_URL || "http://localhost:3000";

  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"FlowDesk" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Restablecer contraseña - FlowDesk",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #0f172a;
        color: white;
        border-radius: 15px;
      ">
        <h1 style="color:#06b6d4;">
          FlowDesk
        </h1>

        <h2>
          Restablecer contraseña
        </h2>

        <p style="color:#cbd5e1;">
          Hemos recibido una solicitud para cambiar
          la contraseña de tu cuenta.
        </p>

        <p style="color:#cbd5e1;">
          Pulsa el siguiente botón para crear una
          nueva contraseña:
        </p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            margin-top:20px;
            padding:14px 24px;
            background:#06b6d4;
            color:white;
            text-decoration:none;
            border-radius:10px;
            font-weight:bold;
          "
        >
          Cambiar contraseña
        </a>

        <p style="
          margin-top:30px;
          color:#64748b;
          font-size:13px;
        ">
          Este enlace caduca en 1 hora.
        </p>
      </div>
    `,
  });
}