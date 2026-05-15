import { z } from "zod";

export const joinClassFormSchema = z.object({
  joinCode: z.string()
    .min(6, "Code is too short") 
    .max(100)
    .trim()
    .toUpperCase()
    // Zod se bhi start check kar sakte ho (Optional but good)
    .refine((val) => /^(TCH|STD)-/i.test(val), {
      message: "Code must start with  STD- or TCH-"
    }),
  branch: z.string().optional()
}).superRefine((data, ctx) => {
  // Agar STD- se start ho to branch mandatory hai
  if (data.joinCode.startsWith('STD-') && !data.branch?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['branch'],
      message: 'Branch is required for student enrollment'
    });
  }
});