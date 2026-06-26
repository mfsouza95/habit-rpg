import { ActivityEntry } from "./activities.schema";

export default function calculateActivity(data: ActivityEntry): ActivityEntry & {xpEarned: number} {
    let xpEarned = 100;

    if (data.note && data.note.length > 0){
        xpEarned += 50;
        if(data.note === "Neymar JR"){
            xpEarned += 1000;
        }
    }
    return {...data, xpEarned};
}