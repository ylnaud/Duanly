require('dotenv').config();

/**
 * Environment variables
 */
const getEnv = (argKey, envKey) => {
  return (
    process.env[envKey] ||
    (process.argv.find(x => x.startsWith(argKey)) || '').replace(argKey, '')
  );
};

const isWatching = process.argv.includes('--watch');

const ROOT = getEnv('--root=', 'DUANLY_ROOT') || './';
const PORT = Number(getEnv('--port=', 'DUANLY_PORT')) || 8080;

const IMPORTS_LOCAL = getEnv('--imports=', 'DUANLY_IMPORTS') || '_imports';
const IMPORTS = `${ROOT}${IMPORTS_LOCAL}/`;

const CONTENT_LOCAL = getEnv('--content=', 'DUANLY_CONTENT') || '_imports';
const CONTENT = `${ROOT}${CONTENT_LOCAL}/`;

const OUTPUT_LOCAL = getEnv('--output=', 'DUANLY_OUTPUT') || 'public';
const OUTPUT = `${ROOT}${OUTPUT_LOCAL}/`;

const ACTIVE_CLASS =
  getEnv('--active-class=', 'DUANLY_ACTIVE_CLASS') || 'active';

const EXCLUDE = (getEnv('--exclude=', 'DUANLY_EXCLUDE') || '')
  .split(',')
  .map(x => x.trim())
  .filter(Boolean);

const VERBOSE = false;

const excludedFolders = [
  '.git',
  '.DS_Store',
  '.prettierrc',
  'node_modules',
  'package.json',
  'package-lock.json',
  IMPORTS_LOCAL,
  OUTPUT_LOCAL,
  ...EXCLUDE
];

const primeExcludedFiles = name => {
  if (!excludedFolders.includes(name)) {
    excludedFolders.push(name);
  }
};

module.exports = {
  isWatching,
  ROOT,
  PORT,
  IMPORTS_LOCAL,
  IMPORTS,
  CONTENT_LOCAL,
  CONTENT,
  OUTPUT_LOCAL,
  OUTPUT,
  ACTIVE_CLASS,
  EXCLUDE,
  VERBOSE,
  excludedFolders,
  primeExcludedFiles
};
