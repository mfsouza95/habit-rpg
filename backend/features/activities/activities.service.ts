import { saveActivity } from "./activities.repository";
import { ActivityEntry } from "./activities.schema";

export async function calculateActivity(data: ActivityEntry){
    let xpEarned = 100;

    if (data.note && data.note.length > 0){
        xpEarned += 50;
        if(data.note === "Neymar JR"){
            xpEarned += 1000;
        }
    }

    return await saveActivity({...data, xpEarned})
}