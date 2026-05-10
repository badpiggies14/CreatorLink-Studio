# CreatorLink Studio

CreatorLink Studio is a bright, premium, animated frontend-only SaaS demo for an all-in-one creator portfolio and bio-link platform. It includes a polished landing page, functional bio-link and portfolio builders, dashboard mockup, public profile preview, contact inquiry flow, mock auth, pricing, FAQ, and a cinematic product reel.

## Features

- Premium light-mode SaaS landing page with glass cards, pastel gradients, soft shadows, and airy spacing
- Animated hero, floating creator cards, dashboard mockups, template cards, pricing, testimonials, FAQ, and footer
- Functional bio-link builder with localStorage persistence, active toggles, reorder controls, and live preview
- Functional portfolio manager with editable project cards, gradient thumbnails, categories, and stack tags
- Public creator profile preview with theme selector, bio links, featured projects, and copy-link action
- Contact inquiry form saved to localStorage and surfaced in dashboard activity
- Optional Supabase persistence for links, projects, theme, and inquiries
- Profile photo upload with optional Supabase Storage persistence
- Mock sign in, sign up, forgot password, toast messages, and persisted demo login
- Creator AI Assistant demo using local frontend logic with no API key required
- Product reel section built with CSS and JavaScript scene animation
- Responsive layout for mobile, tablet, desktop, and large screens
- No external images, paid APIs, or runtime dependencies

## Tech Stack

This version is delivered as a dependency-free production demo:

- HTML
- CSS
- JavaScript
- LocalStorage
- Supabase REST API
- Static HTML deployment with a local Node.js preview server

The structure can be migrated later to Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Lucide React, and chart libraries if a full package toolchain is introduced.

## Plugin Usage Notes

- Figma: used as the design-system direction for the light SaaS visual language. No target Figma file was provided, so the system was implemented directly in code.
- GitHub: the project was inspected locally and kept commit-ready. The local Git command has trouble with the Windows path that contains a space, so no Git operation was forced.
- Hugging Face: not required for runtime assets. All visuals are local CSS, gradients, mock UI cards, and generated shapes.
- Remotion and HyperFrames: no renderer or package setup was required. The requested product walkthrough is implemented as a frontend motion reel fallback.
- OpenAI Developers: no API key is required. The Creator AI Assistant is a local mock demo.

## Supabase Setup

The database schema has been created in this Supabase project:

```text
https://wuwvdeqbgjnjxxbhwaie.supabase.co
```

Tables:

- `creator_profiles`
- `creator_links`
- `creator_projects`
- `creator_inquiries`

Storage bucket:

- `avatars` - public bucket for profile photos, 5MB limit, JPG/PNG/WebP

To enable live Supabase persistence in the browser, open `supabase-config.js` and paste your Supabase anon public key:

```js
window.CREATORLINK_SUPABASE = {
  url: "https://wuwvdeqbgjnjxxbhwaie.supabase.co",
  anonKey: "PASTE_YOUR_SUPABASE_ANON_KEY_HERE",
  appUrl: ""
};
```

If the anon key is blank, the app automatically falls back to localStorage so the demo still works.

## Public Profile Route

The demo profile is available at:

```text
http://localhost:3000/u/mayamakes/
```

For production, set `appUrl` in `supabase-config.js` to your public app URL, for example `https://creator.link`. Profile links will then use `/u/mayamakes` on that domain.

## Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Use another port on Windows PowerShell:

```powershell
$env:PORT=4000; npm run dev
```

## Build / Validation

```bash
node scripts/validate.js
```

This verifies that required files exist and that the HTML references the app assets.

## Demo Auth

Use any email and password in the mock auth modal. Credentials are not sent anywhere; a demo login state is saved in localStorage.
