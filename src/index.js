#!/usr/bin/env node

const { OUTPUT, ROOT, isWatching, CONTENT, IMPORTS, ACTIVE_CLASS } = require('./config');
const { compileFiles, excludeGitIgnoreContents } = require('./build');
const { compileTemplate, primeImport } = require('./compiler');
const { compileLinks } = require('./links');
const { startDevServer } = require('./server');

/**
 * Entry point: compile the site once, then (if --watch was passed) keep
 * recompiling on change and serve the output.
 */
const duanlyRuntime = async () => {
  if (!OUTPUT.startsWith('./')) {
    console.error('DANGER! Make sure you start the root with a ./');
    return;
  }

  if (!ROOT.endsWith('/')) {
    console.error('Make sure you end the root with a /');
    return;
  }

  await excludeGitIgnoreContents();
  await compileFiles();

  if (isWatching) {
    startDevServer(() => compileFiles());
  }
};

module.exports = {
  duanlyRuntime,
  compileTemplate,
  compileLinks,
  primeImport,
  CONTENT,
  IMPORTS,
  ACTIVE_CLASS
};
