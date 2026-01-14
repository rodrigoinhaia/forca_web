import { z } from "zod";

export const createWordSchema = z.object({
  word: z
    .string()
    .min(2, "Palavra deve ter pelo menos 2 caracteres")
    .max(100, "Palavra muito longa")
    .regex(/^[A-ZÁÉÍÓÚÇÃÕÊÔ]+$/i, "Palavra deve conter apenas letras"),
  category: z.string().optional(),
  difficulty: z.enum(["facil", "medio", "dificil"]).optional(),
});

export const updateWordSchema = createWordSchema.partial();

export type CreateWordInput = z.infer<typeof createWordSchema>;
export type UpdateWordInput = z.infer<typeof updateWordSchema>;
