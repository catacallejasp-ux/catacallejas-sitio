# 3. The base layer

Before any CSS is written, a browser is already styling your page from its own built-in stylesheet.
Those defaults are not neutral — they are decades of accumulated compatibility, and several of them
actively get in the way. The reset replaces them with a set of defaults chosen on purpose.

## What it actually changes

| The rule                                   | What it fixes                                                                     |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| `box-sizing: border-box` on everything     | Width means width. Padding and borders stop making elements wider than you asked. |
| `margin: 0` on everything                  | No inherited spacing. Every gap in your site is one you wrote.                    |
| `line-height: 1.5` on `body`               | A fixed, readable value instead of one derived from the font's own metrics.       |
| `display: block; max-width: 100%` on media | Kills the mysterious few-pixel gap under images, and stops them overflowing.      |
| `font: inherit` on form controls           | Inputs and buttons finally use your font instead of the system one.               |
| `overflow-wrap: break-word` on text        | A long URL wraps instead of pushing the layout sideways.                          |
| `text-wrap: balance` / `pretty`            | Headings split evenly across lines; paragraphs avoid single-word last lines.      |
| `#root, #__next { isolation: isolate }`    | Nothing, here. It's for React/Next mount nodes and is inert in Astro — see below. |

## The consequence people trip on

`* { margin: 0 }` means an unstyled page looks **wrong**, not plain. Headings sit flush against
paragraphs, and lists have no room around them. That is the reset working as intended: it removes
spacing you did not choose so that all remaining spacing is deliberate. Write your own in
`global.css`.

If that trade is not the one you want, the reset is a file in your repo — delete the rule. Which
brings us to the part that matters most.

## It is yours

`src/styles/reset.css` is a copy, not a dependency. Nothing installs it and nothing will update it.
Edit it freely — that is the intended use, and it is why the file is vendored in the first place.

There are two consequences, and the second is easy to forget:

- **You will never get upstream fixes.** The reset is maintained at
  [joshwcomeau.com](https://www.joshwcomeau.com/css/custom-css-reset/) and has gained rules over the
  years. None of them will arrive here. Worth re-reading the source occasionally.
- **The two dead rules are deliberate.** `#root` and `#__next` do nothing in an Astro site. They
  stay so the file matches upstream exactly, which is what makes it diffable. Once you have edited
  the file, that reason is spent — delete them if you like.

The full reasoning, including the alternatives that were rejected, is
[ADR 0001](../ADR/0001-the-base-layer-is-a-vendored-css-reset.md).

## Building on top of it

`global.css` is the layer above:

```css
@import './reset.css';

:root {
  --color-text: #1a1a1a;
  --color-bg: #ffffff;
  --font-sans: system-ui, sans-serif;
}

body {
  color: var(--color-text);
  background: var(--color-bg);
  font-family: var(--font-sans);
}
```

That block ships commented out. Uncomment it, change the values, and you have a design system's
worth of starting point — which is as far as this template goes on purpose.
