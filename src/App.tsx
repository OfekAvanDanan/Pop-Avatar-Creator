import React from 'react';
import './App.css';
import AvatarBuilder from './components/AvatarBuilder';

function App() {
  return (
    <div className="App" style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <AvatarBuilder />
    </div>
  );
}

export default App;
