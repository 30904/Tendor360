const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const DEV_JWT_ACCESS = 'tender360_dev_access_secret_key_2024_velioniq_ai_suite';
const DEV_JWT_REFRESH = 'tender360_dev_refresh_secret_key_2024_velioniq_ai_suite';

/** Env keys that must never be logged or committed. */
const SECRET_ENV_KEYS = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'GEMINI_API_KEY',
  'OPENAI_API_KEY',
  'SMTP_PASS',
  'EMAIL_APP_PASSWORD',
  'MS_GRAPH_CLIENT_SECRET',
  'GOVWIN_API_KEY',
  'SAM_GOV_API_KEY',
  'SALESFORCE_ACCESS_TOKEN'
];

function resolveEnvPath() {
  if (process.env.DOTENV_CONFIG_PATH) {
    return path.resolve(process.env.DOTENV_CONFIG_PATH);
  }
  return path.join(__dirname, '../../.env');
}

function shouldLoadDotenvFile(envPath) {
  if (process.env.LOAD_DOTENV === 'false') return false;
  if (!fs.existsSync(envPath)) return false;
  if (process.env.LOAD_DOTENV === 'true') return true;

  if (process.env.NODE_ENV === 'production') {
    // Prefer host-injected secrets; only fall back to .env for local prod mimic.
    const hasHostSecrets = Boolean(process.env.MONGO_URI && process.env.JWT_ACCESS_SECRET);
    return !hasHostSecrets;
  }

  return true;
}

function applyDevelopmentDefaults() {
  if (process.env.NODE_ENV === 'production') return;

  if (!process.env.JWT_ACCESS_SECRET) {
    process.env.JWT_ACCESS_SECRET = DEV_JWT_ACCESS;
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    process.env.JWT_REFRESH_SECRET = DEV_JWT_REFRESH;
  }
}

function validateProductionEnvironment({ loadedFromFile }) {
  if (process.env.NODE_ENV !== 'production') return;

  const errors = [];

  if (!process.env.MONGO_URI) {
    errors.push('MONGO_URI is required in production');
  }
  if (!process.env.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET === DEV_JWT_ACCESS) {
    errors.push('JWT_ACCESS_SECRET must be a strong unique value (not the dev default)');
  }
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === DEV_JWT_REFRESH) {
    errors.push('JWT_REFRESH_SECRET must be a strong unique value (not the dev default)');
  }

  if (errors.length > 0) {
    throw new Error(
      `Production environment validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    );
  }

  if (loadedFromFile) {
    console.warn(
      '⚠️  Production secrets were loaded from a .env file on disk. ' +
        'Use host-managed environment variables or a secrets manager instead.'
    );
  }
}

/**
 * Load environment variables. In production, prefers injected host env vars;
 * local .env is only read when NODE_ENV is not production (or LOAD_DOTENV=true).
 */
function loadEnvironment() {
  const envPath = resolveEnvPath();
  const loadedFromFile = shouldLoadDotenvFile(envPath);

  if (loadedFromFile) {
    dotenv.config({ path: envPath });
  }

  applyDevelopmentDefaults();
  validateProductionEnvironment({ loadedFromFile });

  return { loadedFromFile, envPath };
}

function getSafeEnvSummary() {
  const keys = [
    'NODE_ENV',
    'PORT',
    'MONGO_URI',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'GEMINI_API_KEY',
    'OPENAI_API_KEY',
    'SMTP_HOST',
    'SMTP_USER',
    'CORS_ORIGIN'
  ];

  return Object.fromEntries(keys.map((key) => [key, process.env[key] ? 'Set' : 'Not set']));
}

module.exports = {
  SECRET_ENV_KEYS,
  loadEnvironment,
  getSafeEnvSummary
};
