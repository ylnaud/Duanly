const patterns = require('./patterns');
const { hasLinks, cleanPath, isCurrentPage, isParentPage } = require('./helpers');
const { ACTIVE_CLASS } = require('./config');

/**
 * `<duanly-link>` compilation — turns smart links into plain `<a>` tags,
 * adding an active class / aria-current for the current or parent page.
 */
const compileLinks = (body, path) => {
  let m;
  let copy;

  if (!hasLinks(body)) {
    return body;
  }

  copy = body;
  while ((m = patterns.links.exec(body)) !== null) {
    if (m.index === patterns.links.lastIndex) {
      patterns.links.lastIndex++;
    }

    let [find, attr1 = '', to, attr2 = '', content] = m;
    let replace = '';
    let attributes = [`href="${to}"`, attr1, attr2]
      .map(x => x.trim())
      .filter(Boolean)
      .join(' ');

    const isCurrent = isCurrentPage(to, path);
    if (isCurrent || isParentPage(to, path)) {
      if (attributes.includes('class="')) {
        attributes = attributes.replace('class="', `class="${ACTIVE_CLASS} `);
      } else {
        attributes += ` class="${ACTIVE_CLASS}"`;
      }

      if (isCurrent) {
        attributes += ' aria-current="page"';
      }
    }

    replace = `<a ${attributes}>${content}</a>`;
    copy = copy.replace(find, replace);
  }
  body = copy;

  return body;
};

module.exports = { compileLinks };
