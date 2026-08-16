# Duanly

## The little static site generator

Duanly is a tiny lil' static site generator. It's a progressive tool designed to sit atop your already brilliant HTML. In essence, Duanly is HTML + partials with slots thrown in for good measure.

If you've ever had to make a change to every header on a totally static website, you'll know how cumbersome and error-prone it is to copy and paste the changes through all the files. That's where Duanly comes in. Duanly lets you move that header into a single, importable file, and helps you include it everywhere you need it.

- [Read the getting started guide](example/index.html)
- [Slots explanation](example/slots/index.html)
- [Command line options](example/_imports/options.md)

```bash
# Works now — installs directly from GitHub
$ npm install github:ylnaud/Duanly

# (coming soon — npm registry publish pending)
# $ npm install duanly

# Build the site
$ duanly

# Run Duanly in dev mode
$ duanly --watch
```

## Tags

- `<duanly-import src="..." />` — import a partial HTML or Markdown file
- `<duanly-slot />` / `<duanly-slot name="..." />` — named and default slots
- `<duanly-template name="...">...</duanly-template>` — fill a named slot
- `<duanly-link to="...">...</duanly-link>` — a smart link that adds an active class/`aria-current` for the current or parent page

## Credits

Duanly is a rescue and rebrand of [Sergey](https://github.com/trys/sergey), originally created by [Trys Mudford](https://www.trysmudford.com). The upstream project was archived and unmaintained, so this fork carries the engine forward under a new name, with updated dependencies. Released under the MIT License — see [LICENSE](LICENSE).
