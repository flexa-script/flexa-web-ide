import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import './App.css';

function App() {
  const [code, setCode] = useState(`// Visit https://flexa-script.github.io/ for docs

println("Hello!");
var name = read("What\'s your name? ");
println("Hello, " + name + \'!\');
`);
  const [consoleText, setConsoleText] = useState('');
  const [inputStart, setInputStart] = useState(0);
  const [allowInput, setAllowInput] = useState(false);
  const socketRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3002');
    socketRef.current = socket;

    socket.onopen = () => console.log('WebSocket connected');

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'output' || msg.type === 'error') {
        appendToConsole(msg.data);
      } else if (msg.type === 'exit') {
        setAllowInput(false);
        appendToConsole(`\nProcess closed with code ${msg.code}]\n`);
      }
    };

    socket.onclose = () => console.log('WebSocket desconectado');

    return () => socket.close();
  }, []);

  const appendToConsole = (text) => {
    setConsoleText(prev => {
      const newText = prev + text;
      setTimeout(() => {
        setInputStart(newText.length);
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newText.length, newText.length);
      }, 0);
      return newText;
    });
  };

  const handleRun = () => {
    setAllowInput(true);
    setConsoleText('');
    setInputStart(0);
    socketRef.current.send(JSON.stringify({
      type: 'code',
      code
    }));
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length < inputStart) return;

    setConsoleText(prev => {
      const fixed = prev.slice(0, inputStart);
      return fixed + value.slice(inputStart);
    });
  };

  const handleKeyDown = (e) => {
    if (!allowInput){
      e.preventDefault();
      return;
    }

    const cursorPos = textareaRef.current.selectionStart;

    // prevent move cursor to before current input
    if (cursorPos < inputStart) {
      e.preventDefault();
      textareaRef.current.setSelectionRange(consoleText.length, consoleText.length);
    }

    if (e.key === 'Backspace' && cursorPos <= inputStart) {
      e.preventDefault();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const input = consoleText.slice(inputStart);
      socketRef.current.send(JSON.stringify({
        type: 'input',
        data: input
      }));
      appendToConsole('\n');
    }
  };

  return (
    <div className="ide-container">
      <div className="topbar">
        <button className="run-btn" onClick={handleRun}>▶ Run</button>
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

      <textarea
        ref={textareaRef}
        value={consoleText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="terminal-textarea"
        spellCheck={false}
      />
    </div>
  );
}

export default App;
