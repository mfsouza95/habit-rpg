import { z } from 'zod';

export const ActivityEntrySchema = z.object({
    category: z.string().min(1).trim(),
    activity: z.string().min(1).trim(),
    note: z.string().trim().optional()
})

export type ActivityEntry = z.infer<typeof ActivityEntrySchema>;