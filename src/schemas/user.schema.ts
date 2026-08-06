import { z } from "zod";

export const registerUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(60),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;


export const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(60),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;