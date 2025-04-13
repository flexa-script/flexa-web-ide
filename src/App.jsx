import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import './App.css';

function App() {
  const [code, setCode] = useState('// Código Flexa aqui\nprintln("Hello!");\nvar name = read("What\'s your name? ");\nprintln("Hello, " + name + \'!\');\n');
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const socketRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3002');
    socketRef.current = socket;

    socket.onopen = () => console.log('WebSocket conectado');

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'output' || msg.type === 'error') {
        appendToTerminal(msg.data);
      } else if (msg.type === 'exit') {
        appendToTerminal(`\n[Processo encerrado com código ${msg.code}]\n`);
      }
    };

    socket.onclose = () => console.log('WebSocket desconectado');

    return () => socket.close();
  }, []);

  const appendToTerminal = (text) => {
    setTerminalLines(prev => [...prev, ...text.split('\n')]);
    setTimeout(() => {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, 50);
  };

  const handleRun = () => {
    setTerminalLines([]);
    socketRef.current.send(JSON.stringify({
      type: 'code',
      code
    }));
  };

  const handleTerminalKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = currentInput;
      setTerminalLines(prev => [...prev, `> ${input}`]);
      socketRef.current.send(JSON.stringify({
        type: 'input',
        data: input
      }));
      setCurrentInput('');
    }
  };

  return (
    <div className="ide-container">
    <div className="topbar">
      <button className="run-btn" onClick={handleRun}>▶ Executar</button>
    </div>

    <div className="editor-container">
      <Editor
        height="100%"
        defaultLanguage="plaintext"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
      />
    </div>

    <div className="terminal-container" ref={terminalRef}>
      {terminalLines.map((line, index) => (
        <div key={index} className="terminal-line">{line}</div>
      ))}
      <div className="terminal-input-line">
        <span className="terminal-prompt">&gt;</span>
        <input
          type="text"
          value={currentInput}
          onChange={e => setCurrentInput(e.target.value)}
          onKeyDown={handleTerminalKeyDown}
          className="terminal-input"
        />
      </div>
    </div>
  </div>
  );
}

export default App;
