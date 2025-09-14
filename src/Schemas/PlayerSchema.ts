import { z } from "zod";

export const PlayerSchema = z.object({
  name: z.string().min(2, "El nombre no puede estar vacio"),
  
});