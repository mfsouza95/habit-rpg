import { Request, Response } from 'express';
import { ActivityEntrySchema } from './activities.schema';
import { calculateActivity, getActivities } from './activities.service';

export async function createActivity(req: Request, res: Response){
    const result = ActivityEntrySchema.safeParse(req.body)
    if (!result.success){
        console.error(result.error);
        res.status(400).json({error: 'Invalid request body'});
        return;
    }
    try {
        res.json(await calculateActivity(result.data));
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Error posting the entry'})
    }
    return;
}

export async function listActivities(req: Request, res: Response){
    try {
        res.json(await getActivities());
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Error fetching activities'})
    }
    return;
}