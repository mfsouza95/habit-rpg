import { Request, Response } from 'express';
import { ActivityEntrySchema } from './activities.schema';

export default function createActivity(req: Request, res: Response): void{
    const result = ActivityEntrySchema.safeParse(req.body)
    if (!result.success){
        console.error(result.error);
        res.status(400).json({error: 'Invalid request body'});
        return;
    }
    res.json({ data: result.data })
}