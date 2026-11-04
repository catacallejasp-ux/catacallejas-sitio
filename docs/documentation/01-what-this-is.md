# 1. What this is

A starting point for an Astro website. It builds, it deploys, and it renders one heading — that is
the whole of it, on purpose.

## What ships

- **Astro 7**, configured with nothing. `astro.config.mjs` is an empty `defineConfig({})`.
- **A CSS reset**, as a file in `src/styles/` rather than a dependency. This is the one real opinion
  in the template, and [ADR 0001](../ADR/0001-the-base-layer-is-a-vendored-css-reset.md) explains
  why.
- **One layout and one page.** `BaseLayout.astro` is the `<html>` shell; `index.astro` uses it.
- **A working toolchain**: strict TypeScript with a checker that runs, Prettier, and CI that runs
  both plus the build on every push.
- **This documentation, and the decision records behind it.**

## What deliberately does not ship

No component library, no design tokens, no fonts, no colour palette, no dark mode, no navigation, no
example blog, no analytics, no image pipeline, no UI framework.

That emptiness is the design, not an unfinished state. A template that guesses at those things costs
more to strip out than it saved by including them, and the guesses are usually wrong for the next
site. Everything named above is either a `pnpm astro add` command or twenty lines you write once —
see [Adding to it](./04-adding-to-it.md).

## The one thing to do first

Open `src/styles/reset.css` and read it. It is eighty-odd lines, it is the file that decides what
your page looks like before you have written any CSS, and it is yours to edit. Most surprises during
the first hour of a new site are explained by a rule in that file.

## Getting it running

```sh
pnpm install
pnpm dev
```

The dev server prints a local URL, usually `http://localhost:4321`. Every other command is in the
[README](../../README.md).
