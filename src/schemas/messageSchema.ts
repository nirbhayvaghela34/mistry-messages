import {z} from 'zod';

export const messageSchema = z.object({
    content: z.string()
    .min(10, "content must be at least 10 charaters.")
    .max(300, "content must beno longer than 300 charaters"),
})
    