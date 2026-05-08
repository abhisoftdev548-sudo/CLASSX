import {z} from "zod";

export const forgetPasswordSchema = z.object({
    email: z.string().email("Valid email address daalein"),
});

