import { z } from "zod";

export const createUrlSchema = z.object({
    originalUrl: z.string().url(),
    customSlug: z.string().min(3).max(20).optional(),
    expiresAt: z.coerce.date().optional(),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>


/* const result = createUrlSchema.safeParse({
    originalUrl: "https://example.com",
    customSlug: "my-link",
})

if(!result.success) {
    console.log(result.error.issues);
} else {
    console.log(result.data);
} */

export const redirectParamsSchema = z.object({
  slug: z.string().min(3).max(20),
});

export type RedirectParams = z.infer<typeof redirectParamsSchema>;