const { spawn } = require('child_process');

const commands = [
  ['backend', 'npm run dev:server'],
  ['frontend', 'npm run dev:client']
];

const children = commands.map(([name, command]) => {
  const child = spawn(command, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  });

  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`${name} dev server exited with code ${code}`);
      process.exitCode = code;
    }
  });

  return child;
});

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
};

process.on('SIGINT', () => {
  shutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  shutdown();
  process.exit(0);
});
