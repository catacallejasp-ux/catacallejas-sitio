# First run

You generated a site from [astro-template](https://github.com/cris-achiardi/astro-template). Two
things matter now. The rest can wait until you need them.

```sh
pnpm install
pnpm dev
```

That works already — Node 22.12 or newer, nothing to configure. The site is at
`http://localhost:4321`.

---

## Do these two

### 1. Set `site` in `astro.config.mjs`

Uncomment the line and put your real address there, with no trailing slash:

```js
site: 'https://your-domain.com',
```

Until you do, your pages have no canonical link and links you share have no preview URL. Nothing
warns you about it, which is why it is first.
([ADR 0003](./docs/ADR/0003-absolute-url-metadata-requires-a-configured-site.md) explains why it is
not filled in for you.)

### 2. Replace the favicon

`public/favicon.svg` is a grey placeholder — a rounded square with a dot. Drop your own SVG in with
the same filename. It flips colour automatically in dark mode, so a single-colour mark works best.

---

## When you get to it

**Rename the project.** `package.json` → `"name"`, and the title at the top of `README.md`.

**Rewrite or delete `docs/documentation/`.** Those five pages explain _the template_, not your site.
Left alone they become the most confidently wrong documentation you own.

**Keep `docs/ADR/`.** The four records in there describe decisions **your site now owns** — ADR 0001
is why your pages have no default margins. Add your own starting at 0005; do not renumber, and
supersede instead of editing. [`docs/ADR/README.md`](./docs/ADR/README.md) has the rules.

**Update `LICENSE`** — it is MIT, copyright Cris Morales. Change the holder, change the licence, or
delete it if the site is private.

**Leave `typescript` at `^6`.** It is held back on purpose; version 7 breaks `pnpm check`
([ADR 0002](./docs/ADR/0002-typescript-is-pinned-to-the-6-x-line.md)).

**There is no `favicon.ico`.** Modern browsers use the SVG. Add an `.ico` or PNG set only if Safari
before 16.4 or older crawlers matter to you.

---

## What CI does, and does not, do

Pushing runs a type check and a build. If either fails, the site is genuinely broken. Nothing else
can turn it red — formatting is not checked, and an old Node version will not refuse to install
([ADR 0004](./docs/ADR/0004-nothing-blocks-a-first-run-except-a-broken-build.md)).

`pnpm format` tidies everything up whenever you feel like it. It is never required.

---

## Then delete this file

And the link to it from the README.
