import { z } from 'zod';

export const ActivityEntrySchema = z.object({
    category: z.string().trim().min(1),
    activity: z.string().trim().min(1),
    note: z.string().trim().optional()
})

export type ActivityEntry = z.infer<typeof ActivityEntrySchema>;