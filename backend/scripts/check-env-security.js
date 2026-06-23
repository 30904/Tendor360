#!/usr/bin/env node
/**
 * Guards against committing secret-bearing env files or obvious API keys.
 * Run: npm run security:check-env
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');
const BACKEND = path.join(__dirname, '..');

const FORBIDDEN_TRACKED_PATTERNS = [
  /^backend\/\.env$/,
  /^backend\/\.env\.local$/,
  /^backend\/\.env\.production$/,
  /^\.env$/,
  /^\.env\.local$/
];

const SECRET_LINE_PATTERNS = [
  /GEMINI_API_KEY\s*=\s*AIza[0-9A-Za-z_-]{20,}/,
  /OPENAI_API_KEY\s*=\s*sk-[0-9A-Za-z_-]{20,}/,
  /SMTP_PASS\s*=\s*\S+/,
  /JWT_(ACCESS|REFRESH)_SECRET\s*=\s*(?!change_me|your_)\S{8,}/,
  /MONGO_URI\s*=\s*mongodb(\+srv)?:\/\/[^:]+:[^@]+@/
];

function fail(message) {
  console.error(`\n❌ Secret security check failed:\n${message}\n`);
  process.exit(1);
}

function checkGitignore() {
  const gitignorePath = path.join(ROOT, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fail('.gitignore is missing');
  }

  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  if (!gitignore.includes('.env')) {
    fail('.gitignore must include `.env` to block credential commits');
  }

  try {
    const ignored = execSync('git check-ignore -v backend/.env', {
      cwd: ROOT,
      encoding: 'utf8'
    }).trim();
    if (!ignored) {
      fail('backend/.env is not ignored by git');
    }
    console.log('✅ backend/.env is gitignored');
  } catch {
    fail('backend/.env is not ignored by git');
  }
}

function checkTrackedEnvFiles() {
  let tracked = [];
  try {
    tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' })
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    console.warn('⚠️  Not a git repo — skipping tracked-file scan');
    return;
  }

  const forbidden = tracked.filter((file) =>
    FORBIDDEN_TRACKED_PATTERNS.some((pattern) => pattern.test(file.replace(/\\/g, '/')))
  );

  if (forbidden.length > 0) {
    fail(`Secret env files are tracked in git:\n  - ${forbidden.join('\n  - ')}`);
  }
  console.log('✅ No secret .env files tracked in git');
}

function checkStagedSecrets() {
  let staged = [];
  try {
    staged = execSync('git diff --cached --name-only', { cwd: ROOT, encoding: 'utf8' })
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return;
  }

  if (staged.length === 0) return;

  for (const relPath of staged) {
    const normalized = relPath.replace(/\\/g, '/');
    if (FORBIDDEN_TRACKED_PATTERNS.some((pattern) => pattern.test(normalized))) {
      fail(`Attempting to commit secret env file: ${relPath}`);
    }

    const absPath = path.join(ROOT, relPath);
    if (!fs.existsSync(absPath) || fs.statSync(absPath).isDirectory()) continue;

    const content = fs.readFileSync(absPath, 'utf8');
    for (const pattern of SECRET_LINE_PATTERNS) {
      if (pattern.test(content)) {
        fail(`Staged file appears to contain live credentials: ${relPath}`);
      }
    }
  }
  console.log('✅ No live credentials detected in staged files');
}

function checkExampleExists() {
  const examplePath = path.join(BACKEND, '.env.example');
  if (!fs.existsSync(examplePath)) {
    fail('backend/.env.example is missing — add a placeholder template for developers');
  }
  console.log('✅ backend/.env.example present');
}

checkGitignore();
checkExampleExists();
checkTrackedEnvFiles();
checkStagedSecrets();
console.log('\n✅ Environment secret checks passed\n');
