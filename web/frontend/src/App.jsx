import React, { useState } from 'react';
import TimerDashboard from './components/TimerDashboard';
import TimerForm from './components/TimerForm';

/**
 * Main Application component with simple routing logic.
 * Allows switching between the Dashboard and the Creation Form.
 */
const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Logic to navigate between pages
  const navigateToDashboard = () => setCurrentPage('dashboard');
  const navigateToCreate = () => setCurrentPage('create');

  return (
    <>
      {currentPage === 'dashboard' ? (
        <TimerDashboard onCreateClick={navigateToCreate} />
      ) : (
        <TimerForm onBack={navigateToDashboard} />
      )}
    </>
  );
};

export default App;
