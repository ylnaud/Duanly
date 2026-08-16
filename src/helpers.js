const patterns = require('./patterns');

/**
 * Pure string/path helpers shared by the compiler and link modules.
 */
const formatContent = x => x.replace(patterns.whitespace, '');

const getKey = (key, ext = '.html', folder = '') => {
  const file = key.endsWith(ext) ? key : `${key}${ext}`;
  return `${folder}${file}`;
};

const hasImports = x => x.includes('<duanly-import');
const hasLinks = x => x.includes('<duanly-link');

const cleanPath = path => path.replace('index.html', '').split('#')[0];
const isCurrentPage = (ref, path) => path && cleanPath(path) === cleanPath(ref);
const isParentPage = (ref, path) =>
  path && cleanPath(path).startsWith(cleanPath(ref));

module.exports = {
  formatContent,
  getKey,
  hasImports,
  hasLinks,
  cleanPath,
  isCurrentPage,
  isParentPage
};
