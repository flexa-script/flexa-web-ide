const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function runFlexaInDocker(userId, code, callback) {
  const tempDir = path.join(__dirname, '..', 'temp', userId);
  fs.mkdirSync(tempDir, { recursive: true });

  const filePath = path.join(tempDir, `${Date.now()}-main.flx`);
  fs.writeFileSync(filePath, code);

  // const dockerCmd = `docker run --rm -v ${tempDir}:/code flexa-runner /code/main.flx`;
  const dockerCmd = `docker run --rm -i -t -v ${userDir}:/code --name flexa_${sessionId} flexa-interpreter-image /code/main.flx`;


  exec(dockerCmd, (error, stdout, stderr) => {
    if (error) return callback(stderr || error.message);
    return callback(null, stdout);
  });
}

module.exports = runFlexaInDocker;
