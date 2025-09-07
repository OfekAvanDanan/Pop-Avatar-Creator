import React from 'react';
import './App.css';
import Avatar from './components/Avatar';
import { parseAvatarString } from './lib/avatar';

function App() {
  const [input, setInput] = React.useState<string>(
    '#ffffff,#c2272d,#e8bda7,1,1,3,1,1,1,1,0,0,0,1'
  );

  const cfg = React.useMemo(() => parseAvatarString(input), [input]);

  return (
    <div className="App" style={{ padding: 24 }}>
      <h2>Avatar Demo</h2>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div>
          <Avatar config={cfg} width={170} height={221} />
        </div>
        <div style={{ minWidth: 420 }}>
          <div style={{ marginBottom: 8 }}>Enter avatar string:</div>
          <input
            style={{ width: '100%', padding: 8, fontFamily: 'monospace' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
            Format: {'<bg-color>,<body-color>,<skin-color>,<face-type>,<hair-type>,<clothing-type>,<faceTexture>,<CenterClothing>,<RightClothing>,<LeftClothing>,<Eyes>,<Nose>,<Mouth>,<Glasses>'}
          </div>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', marginTop: 12 }}
          >
            Learn React
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
