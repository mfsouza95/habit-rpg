import { useEffect, useState } from 'react';
import './App.css';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import type { Activity } from '../types';

const url = import.meta.env.VITE_API_URL;

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch(`${url}/activities`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load activities');
        return response.json();
      })
      .then(setActivities)
      .catch((error) => console.error(error));
  }, []);

  function handleSubmitted(activity: Activity) {
    setActivities((prev) => [activity, ...prev]);
    setIsOpen(false);
  }

  return (
    <>
      <div className='flex justify-center items-center w-screen h-screen'>
        <div className='flex flex-col items-center border-2 border-white rounded-xl w-196 h-196 text-white p-4'>
          <button className='cursor-pointer border-2 rounded-lg p-2 hover:bg-gray-600' onClick={() => setIsOpen(true)}>
            Add Activity
          </button>
          <div className='mt-4 w-full'>
            <ActivityList activities={activities} />
          </div>
        </div>
      </div>
      {isOpen && <ActivityForm setIsOpen={setIsOpen} onSubmitted={handleSubmitted} />}
    </>
  )
}

export default App
