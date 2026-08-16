const chokidar = require('chokidar');
const connect = require('connect');
const serveStatic = require('serve-static');

const { ROOT, OUTPUT, PORT } = require('./config');

/**
 * Dev mode: watch the project for changes, re-running `task` on each one,
 * and serve the compiled output over HTTP.
 */
const startDevServer = task => {
  const watchRoot = ROOT.endsWith('/')
    ? ROOT.substring(0, ROOT.length - 1)
    : ROOT;
  const ignored = (OUTPUT.endsWith('/')
    ? OUTPUT.substring(0, OUTPUT.length - 1)
    : OUTPUT
  ).replace('./', '');

  const watcher = chokidar.watch(watchRoot, { ignored, ignoreInitial: true });
  watcher.on('change', task);
  watcher.on('add', task);
  watcher.on('unlink', task);

  connect()
    .use(serveStatic(OUTPUT))
    .listen(PORT, function() {
      console.log(`Duanly running on http://localhost:${PORT}`);
    });
};

module.exports = { startDevServer };
