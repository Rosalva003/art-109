# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

This is a **static web art/portfolio** repository for Art 109 course work. It contains standalone HTML/CSS/JavaScript pages (portfolios, tutorials, net art, p5.js demos) deployed via GitHub Pages. There is **no backend, database, build step, or package manager**.

## Cursor Cloud specific instructions

### Services

| Service | Required | How to run |
|---------|----------|------------|
| Static HTTP server | **Yes** | `python3 -m http.server 5512` from repo root (port 5512 matches `.vscode/settings.json`) |
| Browser | **Yes** | For manual/interactive testing |
| External CDNs | **For some pages** | Google Fonts and p5.js load from CDNs on `star-website/` and some portfolio pages; network access needed for full fidelity |

Do **not** open HTML files via `file://` — `localStorage` and relative asset paths behave inconsistently. Always serve over HTTP.

### Lint / test / build

There are **no** npm/pip dependencies, ESLint/Prettier configs, test runners, or CI workflows. Verification is manual: serve the site and open pages in a browser.

### Smoke-test entry points

After starting the server, verify these URLs return HTTP 200 and core interactivity works:

- `http://localhost:5512/index.html` — mental health landing page
- `http://localhost:5512/art-109/digitalburnbook/index.html` — type text, click **BURN ENTRY**, toggle dark/light theme
- `http://localhost:5512/star-website/index.html` — mouse star trail, shape picker, color palette, theme toggle
- `http://localhost:5512/net-art/index.html` — click the eye to reveal the surveillance overlay
- `http://localhost:5512/art-109/portfolio/index.html` — portfolio navigation and gallery

### Known asset-path issues (pre-existing)

Some pages reference assets at paths that do not match the repo layout (e.g. root `index.html` → `images/Itsok.jpg`, `css/dom/index.html` → `jss/main.js`). These do not block setup; fix only when working on those specific pages.

### Optional stub

`art-109/tutorials/nodedrawingapp/server.js` is a non-functional stub (`console.log` only) and is not required for local development.
