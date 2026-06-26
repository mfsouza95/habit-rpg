import { useState } from 'react';
import './App.css';
import ActivityForm from './components/ActivityForm';

// async function getData() {
//   const url = "http://localhost:3000/health"
//   try{
//     const response = await fetch(url);
//     if (!response.ok){
//       throw new Error(`Response status: ${response.status}`);
//     }
//     const result = await response.json();
//     alert(result.ok); 
//   } catch (error: any) {
//     console.error(error.message); 
//   }
// }

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className='flex justify-center items-center w-screen h-screen'>
        <div className='flex items-center justify-center border-2 border-white rounded-xl h-196 w-196 text-white'>
          <button className='cursor-pointer border-2 rounded-lg p-2 hover:bg-gray-600' onClick={() => setIsOpen(true)}>
            Add Activity
          </button>
        </div>
      </div>
      {isOpen && <ActivityForm setIsOpen = {setIsOpen}/>}
    </>
  )
}

export default App
