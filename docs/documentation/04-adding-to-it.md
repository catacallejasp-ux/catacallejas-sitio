# 4. Adding to it

## There is no Vite to install

Astro **is** a Vite application. Vite is its dev server and its bundler, shipped as a dependency of
`astro` itself — you can see it in the build output:

```
[vite] ✓ built in 641ms
```

So there is no separate Vite to add and no `vite.config.ts` to write. If you ever need Vite options
— a plugin, an alias, a define — they go inside the Astro config, which passes them through:

```js
export default defineConfig({
  vite: {
    resolve: { alias: { '@': '/src' } },
  },
});
```

Installing `vite` yourself would put a second copy in `node_modules`, possibly on a different
version than the one Astro is using. Don't.

## Integrations are one command

```sh
pnpm astro add react      # or vue, svelte, solid, preact
pnpm astro add tailwind
pnpm astro add sitemap
pnpm astro add mdx
```

Each installs its own dependencies and edits `astro.config.mjs` for you. It shows the diff and asks
before writing.

## About React specifically

Adding React does not make this a React site. Astro renders every component to HTML at build time
and ships no JavaScript unless you ask for it, per component:

```astro
<Counter />
<!-- rendered to HTML, zero JS shipped -->
<Counter client:load />
<!-- hydrated immediately -->
<Counter client:visible />
<!-- hydrated when it scrolls into view -->
```

The default is the first one. A React component with no `client:*` directive is a build-time
template, which is usually what you want and is why "add React" costs nothing on pages that don't
interact.

## Things worth adding early, if you need them at all

| Want                        | Do                                                                          |
| --------------------------- | --------------------------------------------------------------------------- |
| A blog, or any content      | `src/content/` + content collections — typed frontmatter, no dependency     |
| Optimised images            | Astro's built-in `<Image />` from `astro:assets` — already there            |
| A second page               | Add a file to `src/pages/`. That's it.                                      |
| Site-wide `<head>` metadata | Add props to `BaseLayout.astro`; it already takes `title` and `description` |
| A deploy target             | `pnpm astro add vercel` / `netlify` / `cloudflare`                          |

## If it changes how the site is built, write it down

Adding a UI framework, a styling system, or a deploy adapter is the kind of choice that is obvious
today and baffling in six months. [The next page](./05-how-decisions-get-recorded.md) covers where
that goes — it takes about ten minutes and the template already has the folder for it.
