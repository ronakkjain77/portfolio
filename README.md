# ronakkjain77.github.io/portfolio

Personal site for **Ronak Lodha** — Senior Data Analyst at Iksula, Mumbai.

Live: <https://ronakkjain77.github.io/portfolio/>

---

## What this is

A hand-built static site. No framework, no build step, no dependencies to keep
patched. Three files do the work:

```
index.html        all content and markup
styles/main.css   design tokens + components
scripts/main.js   theme, nav, reveals, counters, command palette
```

Editing content means editing `index.html`. That's deliberate — the previous
version was a downloaded template with a SCSS build chain, and it rotted.

## Running it locally

There is nothing to install. Any static server works:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly from the file
system also works, though relative paths behave better over HTTP.

## Deploying

GitHub Pages serves `main` from the repository root. Push to `main` and the live
site updates — no build, no action, no artifact step.

## Design system

Everything is driven by custom properties at the top of `styles/main.css`.
Change a token there and it propagates through the whole page, both themes.

### Colour

Dark is the default; light is a selected counterpart, not an inverted flip. The
theme follows the OS unless the visitor picks one, which is remembered in
`localStorage`.

| Role | Dark | Light |
| --- | --- | --- |
| Page / surface / raised | `#0a0c10` · `#0f1116` · `#15181f` | `#faf9f7` · `#ffffff` · `#f2f1ed` |
| Text / dim / faint | `#eceef2` · `#9aa2ae` · `#6b7482` | `#15171a` · `#55595f` · `#7c818a` |
| Accent | `#f2b45c` | `#8f5208` |

Every text-on-surface pair was checked against WCAG AA: body text clears 4.5:1
in both themes (dark accent sits at 10.3:1, light accent at 5.5:1), and
supporting text clears 3:1.

### Chart series

Charts use a four-slot categorical palette, generated in OKLCH and validated for
colour-vision-deficiency separation:

| Slot | Dark | Light |
| --- | --- | --- |
| 1 | `#b67700` | `#af7100` |
| 2 | `#009c86` | `#009580` |
| 3 | `#8372e0` | `#7e6cd9` |
| 4 | `#d55661` | `#ce505b` |

Both sets sit inside their theme's OKLCH lightness band, clear the chroma floor,
and pass adjacent-pair CVD separation (worst ΔE 12.3 dark / 12.4 light against a
target of 8) plus the normal-vision floor. **The first three slots also pass
all-pairs**, so any chart where every series can touch every other — scatter,
bubble, small multiples — caps at three series and folds the rest into "Other".
Assign slots in fixed order; never cycle them.

A single-series mark uses the brand accent rather than slot 1, since there is no
separation problem to solve and the accent reads better against the surface.

### Type

- **Instrument Serif** — display headings and figures
- **Instrument Sans** — body and UI
- **JetBrains Mono** — dates, labels, metadata, chart text

### Motion

Reveal-on-scroll, count-up figures and chart draw-in all sit behind
`prefers-reduced-motion: reduce`, which disables them outright rather than
shortening them.

## Accessibility notes

- Semantic landmarks, a skip link, and a visible focus ring everywhere
- Case studies are native `<details>` — they open, expand and print without JS
- The whole page is readable with JavaScript disabled; JS only adds behaviour
- Charts carry `role="img"` with a descriptive `aria-label`
- Series identity is never colour-alone: every multi-series chart has a legend
- Zero horizontal overflow down to 320px

## Keyboard

| Key | Action |
| --- | --- |
| `/` or `⌘K` / `Ctrl+K` | Open the jump-to palette |
| `↑` `↓` | Move through results |
| `Enter` | Go |
| `Esc` | Close |

## Content sources

Career history, dates and role detail come from Ronak's résumé — served at
`assets/resume.pdf` and the source of truth — supplemented by his LinkedIn
(<https://www.linkedin.com/in/ronak-lodha>) where the résumé is abbreviated for
space (the Vitara Enterprises internship and the BCG GenAI certificate are on
both LinkedIn and this site, but not on the one-page résumé).

Clients are named on this site only where the name is already public or
explicitly cleared: Google appears because it is on Ronak's public LinkedIn
profile. Every other client is described by category.

Quantitative claims on the site are limited to figures Ronak can stand behind.
Where a chart illustrates a method rather than real client numbers it is labelled
**Illustrative** and carries a note saying so — please keep that convention if
you add case studies.

## Updating

**New role or job change** — add a `<li class="tl__i">` at the top of the `#path`
timeline and move the `tl__i--live` class onto it; update the `#now` section, the
`<title>`, the meta description and the JSON-LD `jobTitle`/`worksFor`.

**New case study** — copy a `<details class="rec">` block in `#work`, renumber
`.rec__idx`, and keep the `name="rec"` attribute so only one opens at a time.

**New résumé** — replace `assets/resume.pdf`, keeping the filename.

**Photo** — `assets/img/ronak-480.jpg` and `ronak-880.jpg`. The source is
circle-masked, so the layout clips it to a circle; a rectangular photo would need
the `border-radius` on `.hero__portrait img` removed.
