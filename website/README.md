# simsustech website

The company site for [simsustech](https://www.simsus.tech), built with the
[simple-site-generator](https://github.com/simsustech/simple-site-generator)
kit: Vitrify + Quasar, prerendered to static HTML, verified before it is
served.

The site is also the kit's proof of concept — it is the first real project built
on the rewritten generator, and every defect found here has been fixed upstream
in the kit.

## Commands

```bash
pnpm install
pnpm run dev            # dev server
pnpm run build          # prerender into dist/static
pnpm run check          # validate every page's frontmatter
pnpm run verify         # SEO surface + byte budgets + Lighthouse
pnpm run lint           # oxlint
pnpm run format:check   # oxfmt
```

`pnpm run verify` is the gate. It fails on a broken SEO surface (a missing
description, two titles, unparseable JSON-LD, more than one `<h1>`) or on an
exceeded byte budget, and it reports failing Lighthouse audits by name. It needs
a Chromium binary: `CHROME_PATH=/usr/bin/chromium pnpm run verify`.

## What to look at every month

Self-hosted Umami answers one question well, and it is not "how many people
visited". Open **Events → `contact-intent`** and read three things:

| Look at                                       | It means                                           | If it is wrong                                                                                           |
| --------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Which `page` produced the event               | That page made someone act                         | A page with visits and no events is not convincing — add proof or the price drivers, not a bigger button |
| `channel: email` vs `contact-page`            | Someone opened a mail client, or only went looking | Many `contact-page` and few `email` means the contact page asks for too much before it gives anything    |
| The `subject`, for instance "Website enquiry" | Which service is being asked for                   | Traffic on a service page with no matching subject means the offer is unclear, not that nobody wants it  |

The honest limits: a `mailto:` click is not a lead. The only real count is the
replies that arrive, so keep that number by hand next to the events. If events
rise while replies do not, the friction is in the mail itself; if replies arrive
and meetings do not, the problem is not on the site at all.

Two rules for the cadence, both from the research this site's copy follows:
**change one thing per sales cycle and compare periods** — at a few hundred
visits a month, a test cannot reach significance, so an A/B result would be
noise dressed as evidence — and judge a change on qualified conversations, not
on visits.

## Previewing the build locally

`dist/static` is plain files, so extensionless URLs — `/website` for
`website.html` — need a rewrite, and `caddy file-server` has no `try_files`
option: it answers 404 for every page URL. Use the same shape the deployed config
uses:

```caddyfile
:8090 {
	root * /absolute/path/to/website/dist/static
	encode gzip
	try_files {path}.html {path}
	file_server
	handle_errors {
		root * /absolute/path/to/website/dist/static
		@notFound expression {err.status_code} == 404
		rewrite @notFound /404.html
		file_server
	}
}
```

```bash
caddy run --config /path/to/that/Caddyfile --adapter caddyfile
```

The `root` must be absolute. Ending `try_files` in a file (`/404.html`, or
`/index.html` as the scaffold used to) serves missing pages with a 200, which is
a soft 404; `handle_errors` keeps the status honest and still shows the site's own
404 page. `dist/static/Caddyfile` is the deployed copy — running it directly works
too, once its host name and `/srv/...` root are changed.

## Content

Pages are Markdown in `src/pages/**` with YAML frontmatter — the contract is in
the kit's `AGENTS.md`. `id`, `title` and `description` are required; `tags`
(`menu`, `footer`, `contact`) decide where a page appears, and `order` sorts the
menu.

The Dutch pages live under `src/pages/nl/` as `nl/`-prefixed ids (`nl/about`),
which is the path they are served at (`/nl/about`). `src/router/routes.ts`
derives each page's language and its `alternates` from that prefix, so every page
gets an hreflang cluster, a language switch in the header, and the menu of its
own language — a Dutch page shows `Diensten`, not the English `Services` that
leads to `/services`. So a Dutch page needs the `nl/` id **and** the same `tags`
and `order` as its English twin: without the tags it is linked from nowhere but
the language switch, and without the order it lands in the glob's order rather
than the twin's. Each language's own home page (`home`, `nl`) sorts first — see
`isRootPage`. Adding a whole language means adding its BCP-47 tag to the
`LANGUAGE`/`LANGUAGE_LABEL` maps there, its root page id to `isRootPage`, and the
card band's heading to `CARDS_HEADING`.

Site-wide facts — the title, origin, colours, email and the `Organization`
structured data — live in the `ssg` block of `vitrify.config.ts`, not in pages.
Never hand-write `<head>` tags: the kit's `useSeo` builds them from the
frontmatter and that config.

## Dependencies on the kit

The kit is published, so `package.json` pins released versions:

```json
"@simple-site-generator/templates": "^0.2.0",
"simple-site-generator": "^0.2.0",
"unocss-preset-quasar": "^0.7.4",
"vitrify": "^0.30.0"
```

Two of them are load-bearing rather than routine:

- `@simple-site-generator/templates` must stay at `0.2.0` or later. `0.1.20`
  predates the rewrite — its `dist/` ships `documentation`, `one-page`,
  `personal` and `small-business` and no `plain` module, so a site importing
  `@simple-site-generator/templates/plain` does not resolve.
- `unocss-preset-quasar` needs `0.7.4` or later for the QMarkdown dark-mode fix
  (BUG-085). Before it, dark mode renders body text in the page colour.

No sibling checkouts are required, and CI installs from the registry like any
other project. To work on the kit itself, point the relevant specifier at its
local path and reinstall: pnpm copies `file:` dependencies instead of symlinking
them, so `pnpm install --force` is needed after every kit change or the site
keeps building against a stale copy. Put the released version back before
committing.

## Type checking

`pnpm exec tsc --noEmit` is clean, and is a gate alongside `ssg verify`. The
kit ships type declarations for `@simple-site-generator/templates` (its `types/`
surface, emitted next to the built JavaScript), and the app scaffold no longer
carries the `rootDir` that used to make `tsc` reject `vitrify.config.ts`, so the
website needs no local `declare module` shim.
