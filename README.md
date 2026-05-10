# CreatorLink Studio

CreatorLink Studio is a bright, premium, animated frontend-only SaaS demo for an all-in-one creator portfolio and bio-link platform. It includes a polished landing page, functional bio-link and portfolio builders, dashboard mockup, public profile preview, contact inquiry flow, mock auth, pricing, FAQ, and a cinematic product reel.

## Features

- Premium light-mode SaaS landing page with glass cards, pastel gradients, soft shadows, and airy spacing
- Animated hero, floating creator cards, dashboard mockups, template cards, pricing, testimonials, FAQ, and footer
- Functional bio-link builder with localStorage persistence, active toggles, reorder controls, and live preview
- Functional portfolio manager with editable project cards, gradient thumbnails, categories, and stack tags
- Public creator profile preview with theme selector, bio links, featured projects, and copy-link action
- Contact inquiry form saved to localStorage and surfaced in dashboard activity
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
- Node.js static server

The structure can be migrated later to Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Lucide React, and chart libraries if a full package toolchain is introduced.

## Plugin Usage Notes

- Figma: used as the design-system direction for the light SaaS visual language. No target Figma file was provided, so the system was implemented directly in code.
- GitHub: the project was inspected locally and kept commit-ready. The local Git command has trouble with the Windows path that contains a space, so no Git operation was forced.
- Hugging Face: not required for runtime assets. All visuals are local CSS, gradients, mock UI cards, and generated shapes.
- Remotion and HyperFrames: no renderer or package setup was required. The requested product walkthrough is implemented as a frontend motion reel fallback.
- OpenAI Developers: no API key is required. The Creator AI Assistant is a local mock demo.

## Development

```bash
node server.js
```

Open:

```text
http://localhost:3000
```

Use another port on Windows PowerShell:

```powershell
$env:PORT=4000; node server.js
```

## Build / Validation

```bash
node scripts/validate.js
```

This verifies that required files exist and that the HTML references the app assets.

## Demo Auth

Use any email and password in the mock auth modal. Credentials are not sent anywhere; a demo login state is saved in localStorage.
