# arslan-official.github.io

Portfolio for Muhammad Arsalan Qureshi — penetration tester and red team operator.

## Structure

```
index.html      portfolio
nasa/           verification page for the NASA VDP findings (linked from the resume)
style.css       single stylesheet for both pages
script.js       hero graph, reveals, viewer, navigation
assets/         certificate and proof images
Profile.jpg     portrait
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

## Assets in place

| File | Shown on |
|---|---|
| `cert-cpts.jpg` | Credentials |
| `cert-synack.jpg` | Credentials |
| `cert-cnsp.jpg` | Credentials |
| `cert-google.jpg` | Credentials |
| `cert-pso.jpg` | Credentials |
| `nasa-p1-lor.jpg`, `nasa-p2-lor.jpg` | Record + NASA page |
| `nasa-hall-of-fame.jpg` | Record + NASA page |
| `nasa-p1-crowdstream.jpg`, `nasa-p2-crowdstream.jpg` | NASA page |

All resized and recompressed; the whole `assets/` folder is about 1.3 MB.
To swap one, keep the filename and the page picks it up.

## Notes on the build

- Motion is driven by `IntersectionObserver` with a 2.6 s failsafe, and every
  hidden-before-reveal state is scoped to `html.js`. If scripts fail or are
  blocked, the page renders fully rather than blank.
- `prefers-reduced-motion` turns off the hero canvas, reveals, tilt and pulses.
- The hero canvas pauses when scrolled out of view or when the tab is hidden.
