const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const WebSocket = require('ws');
const path = require('path');
const crypto = require('crypto'); // para gerar identificador único

const app = express();
app.use(express.json());

const wss = new WebSocket.Server({ port: 3002 }, () => {
  console.log('WebSocket running at ws://localhost:3002');
});

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  let currentContainer = null;
  const sessionId = crypto.randomBytes(8).toString('hex');
  const userDir = path.join(__dirname, '..', 'temp', sessionId);
  fs.mkdirSync(userDir, { recursive: true });

  ws.on('message', (msg) => {
    try {
      const parsed = JSON.parse(msg);

      if (parsed.type === 'code') {
        const filePath = path.join(userDir, 'main.flx');
        fs.writeFileSync(filePath, parsed.code);

        if (currentContainer) {
          currentContainer.kill();
          currentContainer = null;
        }

        const dockerCmd = spawn('docker', [
          'run',
          '--rm',
          '-i',
          '--memory=128m',
          '--cpus=0.5',
          '-v', `${userDir}:/code`,
          '--name', `flexa_${sessionId}`,
          'flexa-interpreter-image',
          '/code/main.flx'
        ]);

        currentContainer = dockerCmd;

        const timeout = setTimeout(() => {
          if (currentContainer) {
            currentContainer.kill();
            currentContainer = null;
          }
        }, 5000);

        dockerCmd.stdout.on('data', (data) => {
          ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
        });

        dockerCmd.stderr.on('data', (data) => {
          ws.send(JSON.stringify({ type: 'error', data: data.toString() }));
        });

        dockerCmd.on('close', (code) => {
          clearTimeout(timeout);
          ws.send(JSON.stringify({ type: 'exit', code }));
        });
      }

      if (parsed.type === 'input' && currentContainer) {
        currentContainer.stdin.write(parsed.data + '\n');
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    if (currentContainer) currentContainer.kill();
    fs.rmSync(userDir, { recursive: true, force: true });
  });
});

app.get('/', (req, res) => {
  res.send('Flexa Web IDE is online');
});

app.listen(3001, () => {
  console.log('HTTP server running at http://localhost:3001');
});
