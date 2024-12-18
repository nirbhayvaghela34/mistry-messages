import {z} from "zod";

export const SendMessageSchema = z.object({
    content: z.string().min(5, {message: "Content must be at leat 5 characters."})
}); 