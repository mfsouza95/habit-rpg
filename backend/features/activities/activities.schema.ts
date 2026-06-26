import { z } from 'zod';

export const ActivityEntrySchema = z.object({
    category: z.string().min(1),
    activity: z.string().min(1),
    note: z.string().optional()
})

export type ActivityEntry = z.infer<typeof ActivityEntrySchema>;