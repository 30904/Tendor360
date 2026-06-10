import { spawn } from 'node:child_process';

process.env.PLAYWRIGHT_API_PORT = '5025';
process.env.PLAYWRIGHT_API_URL = 'http://localhost:5025/api';
process.env.PLAYWRIGHT_SKIP_WEBSERVER = '1';

const child = spawn(
  'npx',
  ['playwright', 'test', '--project=setup', '--project=auth', '--project=chromium'],
  { stdio: 'inherit', shell: true, env: process.env }
);

child.on('exit', (code) => process.exit(code ?? 1));
