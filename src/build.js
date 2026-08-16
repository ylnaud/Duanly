const fs = require('fs');
const { performance } = require('perf_hooks');

const {
  createFolder,
  readDir,
  readFile,
  writeFile,
  copyFile,
  clearOutputFolder
} = require('./fs-utils');
const { compileTemplate, prepareImports } = require('./compiler');
const { compileLinks } = require('./links');
const {
  ROOT,
  IMPORTS,
  CONTENT,
  OUTPUT_LOCAL,
  excludedFolders,
  primeExcludedFiles
} = require('./config');

/**
 * Walks a folder, compiling every `.html` file and copying everything else
 * (recursing into subfolders) into the matching output path.
 */
const compileFolder = async (localFolder, localPublicFolder) => {
  const fullFolderPath = `${ROOT}${localFolder}`;
  const fullPublicPath = `${ROOT}${localPublicFolder}`;

  if (localPublicFolder) {
    await createFolder(fullPublicPath);
  }

  return new Promise((resolve, reject) => {
    fs.readdir(fullFolderPath, async (err, files) => {
      if (err) {
        return reject(`Folder: ${fullFolderPath} doesn't exist`);
      }

      Promise.all(
        files
          .filter(x => {
            return !excludedFolders.find(y => x.startsWith(y));
          })
          .map(async localFilePath => {
            const fullFilePath = `${fullFolderPath}${localFilePath}`;
            const fullPublicFilePath = `${fullPublicPath}${localFilePath}`;
            const fullLocalFilePath = `/${localFolder}${localFilePath}`;

            if (localFilePath.endsWith('.html')) {
              return readFile(fullFilePath)
                .then(compileTemplate)
                .then(body => compileLinks(body, fullLocalFilePath))
                .then(body => writeFile(fullPublicFilePath, body));
            }

            return new Promise((resolve, reject) => {
              fs.stat(fullFilePath, async (err, stat) => {
                if (err) {
                  return reject(err);
                }

                if (stat && stat.isDirectory()) {
                  await compileFolder(
                    `${localFolder}${localFilePath}/`,
                    `${OUTPUT_LOCAL}/${localFolder}${localFilePath}/`
                  );
                } else {
                  await copyFile(fullFilePath, fullPublicFilePath);
                }
                return resolve();
              });
            });
          })
      )
        .then(resolve)
        .catch(reject);
    });
  });
};

/**
 * Full build: clear the output folder, cache all imports/content, then
 * compile the whole site into it.
 */
const compileFiles = async () => {
  try {
    await readDir(IMPORTS);
  } catch (e) {
    console.error(`No ${IMPORTS} folder found`);
    return;
  }

  try {
    const start = performance.now();

    await clearOutputFolder();
    await prepareImports(IMPORTS);

    if (IMPORTS !== CONTENT) {
      try {
        await readDir(CONTENT);
        await prepareImports(CONTENT);
      } catch (e) {}
    }

    await compileFolder('', `${OUTPUT_LOCAL}/`);

    const end = performance.now();

    console.log(`Compiled in ${Math.ceil(end - start)}ms`);
  } catch (e) {
    console.log(e);
  }
};

const excludeGitIgnoreContents = async () => {
  try {
    const ignore = await readFile('./.gitignore');
    ignore
      .split('\n')
      .map(x => (x.endsWith('/') ? x.substring(0, x.length - 1) : x))
      .map(x => (x.startsWith('/') ? x.substring(1, x.length) : x))
      .filter(Boolean)
      .forEach(primeExcludedFiles);
  } catch (e) {}
};

module.exports = {
  compileFiles,
  excludeGitIgnoreContents
};
