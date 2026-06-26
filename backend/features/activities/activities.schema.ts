import { z } from 'zod';

export const ActivityEntrySchema = z.object({
    category: z.string(),
    activity: z.string(),
    note: z.string().optional()
})

export type ActivityEntry = z.infer<typeof ActivityEntrySchema>;