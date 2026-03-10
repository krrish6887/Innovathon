import { useState } from 'react';
import LandingPage from './components/LandingPage';
import VirtualLab from './components/3d/VirtualLab';
import Dashboard from './components/Dashboard';

function App() {
  const [inLab, setInLab] = useState(false);

  return (
    <div className="app-container">
      {!inLab && <LandingPage onEnterLab={() => setInLab(true)} />}

      {inLab && (
        <>
          <VirtualLab />
          <Dashboard onExit={() => setInLab(false)} />
        </>
      )}
    </div>
  );
}

export default App;
