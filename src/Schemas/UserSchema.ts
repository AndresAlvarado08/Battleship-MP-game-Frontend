import { z } from "zod";

export const UserSchema = z.object({
  username: z.string().min(2, "El nombre de usuario debe tener al menos 2 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});