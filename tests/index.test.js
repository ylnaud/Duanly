const {
  compileTemplate,
  compileLinks,
  primeImport,
  IMPORTS,
  ACTIVE_CLASS
} = require('../src');

const wrapper = (x = '') => `<html>
  <body>
    ${x}
  </body>
</html>`;

const header = (x = '') => `<header>
  <a href="/">Home</a>
  ${x}
</header>`;

const footer = () => `<footer>
  &copy; 2019
</footer>`;

const testImport = file => `${IMPORTS}${file}`;

describe('Slot compilation', () => {
  test('Zero compilation', () => {
    const input = wrapper('<h1>Test</h1>');

    const output = compileTemplate(input);

    expect(output).toBe(input);
  });

  test('Basic slot filling', () => {
    const content = 'Content';

    const input = wrapper('<duanly-slot />');
    const desiredOutput = wrapper(content);

    const output = compileTemplate(input, { default: content });

    expect(output).toBe(desiredOutput);
  });

  test('<duanly-slot/> tag', () => {
    const content = 'Content';

    const input = wrapper('<duanly-slot/>');
    const desiredOutput = wrapper(content);

    const output = compileTemplate(input, { default: content });

    expect(output).toBe(desiredOutput);
  });

  test('<duanly-slot></duanly-slot> tag', () => {
    const content = 'Content';

    const input = wrapper('<duanly-slot></duanly-slot>');
    const desiredOutput = wrapper(content);

    const output = compileTemplate(input, { default: content });

    expect(output).toBe(desiredOutput);
  });

  test('Basic slot with whitespace', () => {
    const content = 'Content\nNewline';

    const input = wrapper('<duanly-slot />');
    const desiredOutput = wrapper(content);

    const output = compileTemplate(input, { default: content });

    expect(output).toBe(desiredOutput);
  });

  test('Basic slot with HTML', () => {
    const content = '<p>Paragraph</p>';

    const input = wrapper('<duanly-slot />');
    const desiredOutput = wrapper(content);

    const output = compileTemplate(input, { default: content });

    expect(output).toBe(desiredOutput);
  });

  test('Default slot content', () => {
    const defaultContent = 'Default content';

    const input = wrapper(`<duanly-slot>${defaultContent}</duanly-slot>`);
    const desiredOutput = wrapper(defaultContent);

    const output = compileTemplate(input);

    expect(output).toBe(desiredOutput);
  });

  test('Named slot', () => {
    const namedContent = 'Named content';

    const input = wrapper(`<duanly-slot name="named" />`);
    const desiredOutput = wrapper(namedContent);

    const output = compileTemplate(input, { named: namedContent });

    expect(output).toBe(desiredOutput);
  });

  test('Named slot with underscores', () => {
    const namedContent = 'Named content';

    const input = wrapper(`<duanly-slot name="named_slot" />`);
    const desiredOutput = wrapper(namedContent);

    const output = compileTemplate(input, { named_slot: namedContent });

    expect(output).toBe(desiredOutput);
  });

  test('Named slot with spaceless tag', () => {
    const namedContent = 'Named content';

    const input = wrapper(`<duanly-slot name="named"/>`);
    const desiredOutput = wrapper(namedContent);

    const output = compileTemplate(input, { named: namedContent });

    expect(output).toBe(desiredOutput);
  });

  test('Named slot with full tag', () => {
    const namedContent = 'Named content';

    const input = wrapper(`<duanly-slot name="named"></duanly-slot>`);
    const desiredOutput = wrapper(namedContent);

    const output = compileTemplate(input, { named: namedContent });

    expect(output).toBe(desiredOutput);
  });

  test('Named slot with default content tag and named content', () => {
    const namedContent = 'Named content';

    const input = wrapper(
      `<duanly-slot name="named">Default content</duanly-slot>`
    );
    const desiredOutput = wrapper(namedContent);

    const output = compileTemplate(input, { named: namedContent });

    expect(output).toBe(desiredOutput);
  });

  test('Named slot with default content tag and named content', () => {
    const defaultContent = 'Default content';

    const input = wrapper(
      `<duanly-slot name="named">${defaultContent}</duanly-slot>`
    );
    const desiredOutput = wrapper(defaultContent);

    const output = compileTemplate(input, {
      named: ''
    });

    expect(output).toBe(desiredOutput);
  });
});

describe('Import compilation', () => {
  test('A basic import', () => {
    primeImport(testImport('header.html'), header());

    const desiredOutput = header();
    const output = compileTemplate('<duanly-import src="header" />');

    expect(output).toBe(desiredOutput);
  });

  test('Multiple imports', () => {
    primeImport(testImport('header.html'), header());
    primeImport(testImport('footer.html'), footer());

    const content = '<p>Content</p>';

    const desiredOutput = `${header()}
      ${content}
    ${footer()}`;

    const output = compileTemplate(`<duanly-import src="header" />
      ${content}
    <duanly-import src="footer"/>`);

    expect(output).toBe(desiredOutput);
  });

  test('A basic import with a slot', () => {
    primeImport(testImport('header.html'), header('<duanly-slot />'));
    const content = '<p>Content</p>';

    const desiredOutput = header(content);
    const output = compileTemplate(`<duanly-import src="header">
      ${content}
    </duanly-import>`);

    expect(output).toBe(desiredOutput);
  });

  test('A basic import with a default slot', () => {
    const content = '<p>Content</p>';
    primeImport(
      testImport('header.html'),
      header(`<duanly-slot>${content}</duanly-slot>`)
    );

    const desiredOutput = header(content);
    const output = compileTemplate(`<duanly-import src="header" />`);

    expect(output).toBe(desiredOutput);
  });

  test('A basic import with a named slot', () => {
    primeImport(
      testImport('header.html'),
      header(`<duanly-slot name="headerName" />`)
    );
    const content = '<h1>Header</h1>';

    const desiredOutput = header(content);
    const output = compileTemplate(`<duanly-import src="header">
      <duanly-template name="headerName">
        ${content}
      </duanly-template>
    </duanly-import>`);

    expect(output).toBe(desiredOutput);
  });

  test('Named and unnamed slots', () => {
    primeImport(
      testImport('header.html'),
      header(`<duanly-slot name="headerName" />
    <duanly-slot />`)
    );
    const content = '<h1>Header</h1>';

    const desiredOutput = header(`${content}
    ${content}`);
    const output = compileTemplate(`<duanly-import src="header">
      <duanly-template name="headerName">
        ${content}
      </duanly-template>
      ${content}
    </duanly-import>`);

    expect(output).toBe(desiredOutput);
  });

  test('Default named slots', () => {
    const defaultContent = '<h1>Header</h1>';
    primeImport(
      testImport('header.html'),
      header(`<duanly-slot name="headerName">${defaultContent}</duanly-slot>`)
    );

    const desiredOutput = header(defaultContent);
    const output = compileTemplate(`<duanly-import src="header" />`);

    expect(output).toBe(desiredOutput);
  });
});

describe('Markdown compilation', () => {
  test('A heading', () => {
    primeImport(testImport('about.md'), '# About us');

    const desiredOutput = '<h1 id="about-us">About us</h1>';
    const output = compileTemplate(
      '<duanly-import src="about" as="markdown" />'
    );

    expect(output).toBe(desiredOutput);
  });

  test('Multiline markdown', () => {
    primeImport(
      testImport('about.md'),
      `# About us
Content is **great**.`
    );

    const desiredOutput = `<h1 id="about-us">About us</h1>
<p>Content is <strong>great</strong>.</p>`;

    const output = compileTemplate(
      '<duanly-import src="about" as="markdown" />'
    );

    expect(output).toBe(desiredOutput);
  });

  test('Multiline markdown with code block', () => {
    primeImport(
      testImport('code.md'),
      `<duanly-import src="snippet" as="markdown" />`
    );

    primeImport(
      testImport('snippet.md'),
      `# Example code block

\`\`\`html
<article>
  <duanly-import src="code" as="markdown" />
</article>
\`\`\`
`
    );
    const desiredOutput = `<h1 id="example-code-block">Example code block</h1>
<pre><code class="language-html">&lt;article&gt;
  &lt;duanly-import src=&quot;code&quot; as=&quot;markdown&quot; /&gt;
&lt;/article&gt;
</code></pre>`;

    const output = compileTemplate(
      '<duanly-import src="code" as="markdown" />'
    );

    expect(output).toBe(desiredOutput);
  });
});

describe('Link compilation', () => {
  test('A link', () => {
    const input = `<duanly-link to="/example/">Example Link</duanly-link>`;
    const desiredOutput = `<a href="/example/">Example Link</a>`;
    const output = compileLinks(input);

    expect(output).toBe(desiredOutput);
  });

  test('Multiple links', () => {
    const input = `
      <duanly-link to="/example-1/">Example Link 1</duanly-link>
      <duanly-link to="/example-2/">Example Link 2</duanly-link>
      <duanly-link to="/example-3/">Example Link 3</duanly-link>
      `;
    const desiredOutput = `
      <a href="/example-1/">Example Link 1</a>
      <a href="/example-2/">Example Link 2</a>
      <a href="/example-3/">Example Link 3</a>
      `;
    const output = compileLinks(input);

    expect(output).toBe(desiredOutput);
  });

  test('A link to identical current path', () => {
    const input = `<duanly-link to="/example/index.html">Example</duanly-link>`;
    const path = '/example/index.html';

    const desiredOutput = `<a href="/example/index.html" class="${ACTIVE_CLASS}" aria-current="page">Example</a>`;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('A link to start of current path', () => {
    const input = `<duanly-link to="/example/">Example</duanly-link>`;
    const path = '/example/index.html';

    const desiredOutput = `<a href="/example/" class="${ACTIVE_CLASS}" aria-current="page">Example</a>`;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('A link to a parent path', () => {
    const input = `<duanly-link to="/example/">Example</duanly-link>`;
    const path = '/example/foo/index.html';

    const desiredOutput = `<a href="/example/" class="${ACTIVE_CLASS}">Example</a>`;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('Multiple links, with 1 current', () => {
    const path = '/example-1/';
    const input = `
      <duanly-link to="/example-1/">Example Link 1</duanly-link>
      <duanly-link to="/example-2/">Example Link 2</duanly-link>
      <duanly-link to="/example-3/">Example Link 3</duanly-link>
      `;
    const desiredOutput = `
      <a href="/example-1/" class="${ACTIVE_CLASS}" aria-current="page">Example Link 1</a>
      <a href="/example-2/">Example Link 2</a>
      <a href="/example-3/">Example Link 3</a>
      `;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('Multiple links, with 1 parent', () => {
    const path = '/example-1/foo/index.html';
    const input = `
      <duanly-link to="/example-1/">Example Link 1</duanly-link>
      <duanly-link to="/example-2/">Example Link 2</duanly-link>
      <duanly-link to="/example-3/">Example Link 3</duanly-link>
      `;
    const desiredOutput = `
      <a href="/example-1/" class="${ACTIVE_CLASS}">Example Link 1</a>
      <a href="/example-2/">Example Link 2</a>
      <a href="/example-3/">Example Link 3</a>
      `;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('Home link, current', () => {
    const path = '/index.html';
    const input = `
      <duanly-link to="/">Home</duanly-link>
      `;
    const desiredOutput = `
      <a href="/" class="${ACTIVE_CLASS}" aria-current="page">Home</a>
      `;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('Home link, not current', () => {
    const path = '/about/index.html';
    const input = `
      <duanly-link to="/">Home</duanly-link>
      `;
    const desiredOutput = `
      <a href="/" class="${ACTIVE_CLASS}">Home</a>
      `;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('Link to partial, not current', () => {
    const path = '/about/index.html';
    const input = `
      <duanly-link to="/#subscribe">Subscribe</duanly-link>
      `;
    const desiredOutput = `
      <a href="/#subscribe" class="${ACTIVE_CLASS}">Subscribe</a>
      `;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('Link with front-loaded classes', () => {
    const path = '/index.html';
    const input = `
      <duanly-link class="my-class" to="/">Home</duanly-link>
      `;
    const desiredOutput = `
      <a href="/" class="${ACTIVE_CLASS} my-class" aria-current="page">Home</a>
      `;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('Link with back-loaded classes', () => {
    const path = '/index.html';
    const input = `
      <duanly-link to="/" class="my-class">Home</duanly-link>
      `;
    const desiredOutput = `
      <a href="/" class="${ACTIVE_CLASS} my-class" aria-current="page">Home</a>
      `;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('Link with other attributes', () => {
    const path = '/index.html';
    const input = `
      <duanly-link to="/" id="an-id">Home</duanly-link>
      `;
    const desiredOutput = `
      <a href="/" id="an-id" class="${ACTIVE_CLASS}" aria-current="page">Home</a>
      `;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('Link with ids and classes', () => {
    const path = '/index.html';
    const input = `
      <duanly-link to="/" class="my-class" id="an-id">Home</duanly-link>
      `;
    const desiredOutput = `
      <a href="/" class="${ACTIVE_CLASS} my-class" id="an-id" aria-current="page">Home</a>
      `;
    const output = compileLinks(input, path);

    expect(output).toBe(desiredOutput);
  });

  test('Link with href, rather than to', () => {
    const input = `
      <duanly-link href="/example-1/">Example Link 1</duanly-link>
      `;
    const desiredOutput = `
      <a href="/example-1/">Example Link 1</a>
      `;
    const output = compileLinks(input);

    expect(output).toBe(desiredOutput);
  });
});
