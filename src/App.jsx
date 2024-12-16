import React, { useState } from 'react';
import CADPredictionForm from './components/CADPredictionForm';
import CADPatient from './components/CADPatient';
import QnAForm from './components/QnAForm'; // Import your QnA form
import './index.css';

function App() {
  const [userType, setUserType] = useState(null); // null means no choice yet
  const [activeComponent, setActiveComponent] = useState(null); // null means form not shown yet

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    if (type === 'clinician') {
      setActiveComponent('prediction');
    } else if (type === 'patient') {
      setActiveComponent('patient');
    }
  };

  return (
    <div>
      {userType === null ? (
        <QnAForm onSelect={handleUserTypeSelection} /> // Show the QnA form first
      ) : (
        <>
          <div className="mb-4">
            <button 
              onClick={() => setUserType(null)}  // Allow the user to go back and select again
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Change User Type
            </button>
          </div>

          <div className="flex items-center justify-center">
            {activeComponent === 'prediction' ? (
              <CADPredictionForm />
            ) : (
              <CADPatient />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
