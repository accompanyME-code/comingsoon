# accompanyME — coming-soon landing

A static landing page for accompanyME, capturing waitlist signups from two audiences: **accompanists** (supply side) and **clients** (students, parents, music teachers).

## What's here

```
dist/
├── index.html        Entry point — renders the responsive landing page
├── landing.css       All styles (page + form + responsive rules)
├── shared.jsx        Form components (postcode autofill, success state, …)
├── variants.jsx      The V2 "Split Decision" landing component
└── brand/
    ├── colors_and_type.css   Design tokens + base typography
    ├── fonts/                DM Sans (local TTFs, all weights)
    └── assets/               Logo files (monogram + wordmark, light + dark)
```

Fonts:
- **DM Sans** is served locally from `brand/fonts/`.
- **Fraunces** (display) is loaded from Google Fonts at the top of `colors_and_type.css`.

React + Babel are loaded from unpkg CDNs at runtime — no build step required.

## Running locally

The site is fully static. Open any local HTTP server in this folder, e.g.

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Opening `index.html` directly via `file://` will work for most things but the JSX scripts may be blocked by browser CORS. A local server is more reliable.

## Deploying

### Option 1 — GitHub Pages (simplest, free)

1. Push this folder to a GitHub repo (see "Putting this in GitHub" below).
2. In your repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Pick the branch (e.g. `main`) and folder (`/dist` or `/` depending on where you pushed the files).
4. After a minute, your site is live at `https://<username>.github.io/<repo>/`.

### Option 2 — Netlify or Vercel (custom domains, instant deploys)

1. Sign up at [netlify.com](https://netlify.com) or [vercel.com](https://vercel.com).
2. Connect your GitHub repo. Set the publish directory to `dist` (or wherever the files live).
3. No build command is needed — it's static.
4. Add your custom domain (e.g. `accompanyme.co`) from the project settings.

### Option 3 — Cloudflare Pages

Same idea — connect the repo, set the output directory, ship.

## Putting this in GitHub

```bash
# from a terminal, in this folder:
git init
git add .
git commit -m "Initial commit — accompanyME coming-soon landing"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

If you don't have a repo yet, create one first at https://github.com/new (leave it empty — no README/gitignore).

## Wiring up the form

Both the accompanist and client forms currently call `onSubmit(data)` and show a success state in-page. To actually send the data somewhere, edit `variants.jsx` — the `submit` and `close` handlers in `V2Split`.

Common backends:
- **Formspree / Tally / Basin** — paste an endpoint URL, done.
- **Mailchimp / ConvertKit / Beehiiv** — add their JS embed and let it own the form.
- **Your own API** — `fetch('/api/waitlist', { method: 'POST', body: JSON.stringify(data) })`.

The postcode autofill data is mocked in `shared.jsx` (`POSTCODES`) — extend it as needed or swap in a real Australia Post lookup.

## Going to production

Before launch:
- Replace the unpkg CDN React/Babel scripts with a real bundler (Vite, esbuild) so visitors don't pay the Babel-in-browser startup cost (~150KB) every page load.
- Swap React's `development.js` for `production.min.js` (already done in `index.html`).
- Add analytics (Plausible, Fathom, or GA) — drop a single script tag in `<head>`.
- Set up a real form backend (see above).
- Add favicons in the standard sizes (32, 192, 512, apple-touch-icon).

## Credits

Design + build: in-house. Brand: accompanyME (Sydney, NSW).
