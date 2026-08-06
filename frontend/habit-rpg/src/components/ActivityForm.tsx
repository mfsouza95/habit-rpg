import { useState } from 'react';
import type { ActivityFormProps, ActivityEntry, Activity } from '../../types';

const url = import.meta.env.VITE_API_URL;

const emptyActivityEntry = {
  category: '',
  activity: '',
  note: ''
}

export default function ActivityForm({setIsOpen, onSubmitted}: ActivityFormProps){
    const [activityEntry, setActivityEntry] = useState<ActivityEntry>(emptyActivityEntry);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleActivityChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void{
        setActivityEntry({...activityEntry, [e.target.name]: e.target.value})
    }    

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void>{
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const response = await fetch(`${url}/activities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(activityEntry)
            });
            if(!response.ok) throw new Error('Failed to submit activity');
            const data: Activity = await response.json();
            onSubmitted(data);
            setActivityEntry(emptyActivityEntry);
        } catch (error) {
            setError('Could not submit activity. Please try again.');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
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
                                <label htmlFor="category" className="pb-2">
                                    Category                                    
                                </label>
                                <input type="text" name='category' id='category' value={activityEntry.category} className="border rounded border-white" onChange={handleActivityChange}/>
                            </div>
                            <div className="flex flex-col p-4">
                                <label htmlFor="activity" className="pb-2">
                                    Activity
                                </label>
                                <input type="text" name='activity' id='activity' value={activityEntry.activity}  className="border rounded border-white" onChange={handleActivityChange}/>
                            </div>
                            <div className="flex flex-col p-4">
                                <label htmlFor="notes" className="pb-2">
                                    Notes
                                </label>
                                <textarea name='note' id='notes' value={activityEntry.note} className="border rounded border-white" onChange={handleActivityChange}/>
                            </div>
                            {error && <p role="alert" className="px-4 text-red-400">{error}</p>}
                            <div className="flex items-center justify-end">
                                <input type="submit" value="Submit" disabled={submitting} className="p-4 m-4 border-purple-600 border-2 rounded-lg cursor-pointer hover:bg-purple-950 disabled:cursor-not-allowed disabled:opacity-50"/>
                                <input type="button" value="Close" className="p-4 m-4 border-purple-600 border-2 rounded-lg cursor-pointer hover:bg-purple-950" onClick={() => setIsOpen(false)}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
