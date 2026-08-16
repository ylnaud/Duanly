const { marked } = require('marked');
const { gfmHeadingId } = require('marked-gfm-heading-id');

marked.use(gfmHeadingId());

const patterns = require('./patterns');
const { formatContent, getKey, hasImports } = require('./helpers');
const { readFile, getAllFiles } = require('./fs-utils');
const { CONTENT, IMPORTS } = require('./config');

/**
 * Slot + import + markdown compilation — the core templating engine.
 */
const cachedImports = {};

const prepareImports = async folder => {
  const fileNames = await getAllFiles(folder);
  const bodies = await Promise.all(fileNames.map(readFile));
  fileNames.forEach((path, i) => primeImport(path, bodies[i]));
};

const primeImport = (path, body) => {
  cachedImports[path] = body;
};

const getSlots = content => {
  // Extract templates first
  const slots = {
    default: formatContent(content) || ''
  };

  // Search content for templates
  let m;
  while ((m = patterns.templates.exec(content)) !== null) {
    if (m.index === patterns.templates.lastIndex) {
      patterns.templates.lastIndex++;
    }

    const [find, name, data] = m;
    if (name !== 'default') {
      // Remove it from the default content
      slots.default = slots.default.replace(find, '');
    }

    // Add it as a named slot
    slots[name] = formatContent(data);
  }

  slots.default = formatContent(slots.default);

  return slots;
};

const compileSlots = (body, slots) => {
  let m;
  let copy;

  // Complex named slots
  copy = body;
  while ((m = patterns.complexNamedSlots.exec(body)) !== null) {
    if (m.index === patterns.complexNamedSlots.lastIndex) {
      patterns.complexNamedSlots.lastIndex++;
    }

    const [find, name, fallback] = m;
    copy = copy.replace(find, slots[name] || fallback || '');
  }
  body = copy;

  // Simple named slots
  while ((m = patterns.simpleNamedSlots.exec(body)) !== null) {
    if (m.index === patterns.simpleNamedSlots.lastIndex) {
      patterns.simpleNamedSlots.lastIndex++;
    }

    const [find, name] = m;
    copy = copy.replace(find, slots[name] || '');
  }
  body = copy;

  // Complex Default slots
  while ((m = patterns.complexDefaultSlots.exec(body)) !== null) {
    if (m.index === patterns.complexDefaultSlots.lastIndex) {
      patterns.complexDefaultSlots.lastIndex++;
    }

    const [find, fallback] = m;
    copy = copy.replace(find, slots.default || fallback || '');
  }
  body = copy;

  // Simple default slots
  body = body.replace(patterns.simpleDefaultSlots, slots.default);

  return body;
};

const compileImport = (body, pattern) => {
  let m;
  // Simple imports
  while ((m = pattern.exec(body)) !== null) {
    if (m.index === pattern.lastIndex) {
      pattern.lastIndex++;
    }

    let [find, key, htmlAs = '', content = ''] = m;
    let replace = '';

    if (htmlAs === 'markdown') {
      replace = formatContent(
        marked.parse(cachedImports[getKey(key, '.md', CONTENT)] || '')
      );
    } else {
      replace = cachedImports[getKey(key, '.html', IMPORTS)] || '';
    }

    const slots = getSlots(content);

    // Recurse
    replace = compileTemplate(replace, slots);
    body = body.replace(find, replace);
  }

  return body;
};

const compileTemplate = (body, slots = { default: '' }) => {
  body = compileSlots(body, slots);

  if (!hasImports(body)) {
    return body;
  }

  body = compileImport(body, patterns.simpleImports);
  body = compileImport(body, patterns.complexImports);

  return body;
};

module.exports = {
  prepareImports,
  primeImport,
  compileTemplate
};
