import prisma from '../../shared/prisma';
import { ActivityEntry } from './activities.schema';

export async function saveActivity(data: ActivityEntry & {xpEarned: number}){
    const result = await prisma.activityLog.create({
        data:{
            category: data.category,
            activity: data.activity,
            note: data.note,
            xpEarned: data.xpEarned
        }
    });
    return result;
}