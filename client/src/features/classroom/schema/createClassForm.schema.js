import {z} from 'zod'

export const createClassFormSchema = z.object({
    className: z.string().min(2).max(100).trim(),
    classSubject: z.string().min(2).max(100).trim(),
    classSession: z.string().min(2).max(100).trim(),
    classAvatar: z.any()
})