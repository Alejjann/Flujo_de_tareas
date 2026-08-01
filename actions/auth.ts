import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre es demasiado corto"),
  email: z.email("Correo electrónico no válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});