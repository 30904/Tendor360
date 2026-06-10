import { spawn } from 'node:child_process';

process.env.PLAYWRIGHT_BASE_URL = 'https://tender360.smart-aiapps.com';
process.env.PLAYWRIGHT_API_URL = 'https://tender360.smart-aiapps.com/api';
process.env.PLAYWRIGHT_SKIP_WEBSERVER = '1';

const child = spawn('npx', ['playwright', 'test', '--project=setup', '--project=auth', '--project=chromium'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

child.on('exit', (code) => process.exit(code ?? 1));
