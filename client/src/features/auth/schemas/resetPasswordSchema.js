import {z} from "zod";

export const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password kam se kam 6 characters ka ho"),
    confirmPassword: z.string().min(6, "Password kam se kam 6 characters ka ho"),
});

