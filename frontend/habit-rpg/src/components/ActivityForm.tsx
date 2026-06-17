import { useState } from 'react';
import type { ActivityFormProps, ActivityEntry } from '../../types';

const emptyActivityEntry = {
  category: '',
  activity: '',
  note: ''
}

export default function ActivityForm({setIsOpen}: ActivityFormProps){
    const [activityEntry, setActivityEntry] = useState<ActivityEntry>(emptyActivityEntry);

    function handleActivityChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void{
        setActivityEntry({...activityEntry, [e.target.name]: e.target.value})
    }    

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>): void{
        e.preventDefault();
        console.log(activityEntry);
    }

    return(
        <>
            <div className= 'fixed inset-0 flex justify-center items-center w-screen h-screen'>
                <div className="p-4 text-white font-bold border-purple-700 border-2 rounded-lg w-5xl h-fit bg-gray-800">
                    <div className="flex items-center justify-center text-4xl">
                        <h1 className="">Submit Activity</h1>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit} className="">
                            <div className="flex flex-col p-4">
                                <label htmlFor="" className="pb-2">
                                    Category                                    
                                </label>
                                <input type="text" name='category' value={activityEntry.category} className="border rounded border-white" onChange={handleActivityChange}/>
                            </div>
                            <div className="flex flex-col p-4">
                                <label htmlFor="" className="pb-2">
                                    Activity
                                </label>
                                <input type="text" name='activity' value={activityEntry.activity}  className="border rounded border-white" onChange={handleActivityChange}/>
                            </div>
                            <div className="flex flex-col p-4">
                                <label htmlFor="" className="pb-2">
                                    Notes
                                </label>
                                <textarea name='note' value={activityEntry.note} className="border rounded border-white" onChange={handleActivityChange}/>
                            </div>
                            <div className="flex items-center justify-end">
                                <input type="submit" value="Submit" className="p-4 m-4 border-purple-600 border-2 rounded-lg cursor-pointer hover:bg-purple-950"/>
                                <input type="button" value="Close" className="p-4 m-4 border-purple-600 border-2 rounded-lg cursor-pointer hover:bg-purple-950" onClick={() => setIsOpen(false)}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}