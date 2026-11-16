# arslan-official.github.io

Portfolio for Muhammad Arsalan Qureshi — penetration tester and red team operator.

## Structure

```
index.html      portfolio
nasa/           verification page for the NASA VDP findings (linked from the resume)
style.css       single stylesheet for both pages
script.js       hero graph, reveals, viewer, navigation
assets/         full-resolution proof images (opened in the viewer)
assets/thumbs/  small versions the page loads up front
Profile.webp    portrait
favicon.png
Muhammad_Arsalan_Qureshi_Resume.pdf
```

## Deploy

Push to `main`. GitHub Pages serves from the repo root:

- portfolio → `https://arslan-official.github.io/`
- NASA page → `https://arslan-official.github.io/nasa/`

The resume PDF links to the NASA page, so that path must stay as-is.

## Files to delete from the old repo

The demo GIFs are ~15 MB and are no longer referenced:
`keylogger.gif`, `rbackdoor.gif`, `phishing.gif`, `arpspoof.gif`, `networkscanner.gif`

## Assets

Everything is WebP, in two sizes:

| Folder | Width | Used for |
|---|---|---|
| `assets/thumbs/` | 340–760 px | what the page actually loads |
| `assets/` | 1200–1500 px | full resolution, fetched only when a document is opened |

The page loads the thumbnails; clicking a certificate or letter pulls the
full-size file on demand. On a 390 px phone the whole page is about **308 KB**
(it was 1565 KB with single-size JPEGs).

To swap an image, replace both the `assets/` and `assets/thumbs/` copy, keeping
the filename, and update the `width`/`height` attributes on that `<img>` if the
proportions change.

## Notes on the build

- Motion is driven by `IntersectionObserver` with a 2.6 s failsafe, and every
  hidden-before-reveal state is scoped to `html.js`. If scripts fail or are
  blocked, the page renders fully rather than blank.
- `prefers-reduced-motion` turns off the hero canvas, reveals, tilt and pulses.
- The hero canvas pauses when scrolled out of view or when the tab is hidden.
- Every `<img>` carries `width`/`height`, so nothing reflows while images load.
- WebP only. Supported by every browser since 2020; there is no JPEG fallback.
