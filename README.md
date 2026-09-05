# Canann Impact Initiative — Website

The official website for Canann Impact Initiative, a Nigerian nonprofit delivering food assistance, educational support, healthcare services, and emergency relief to vulnerable communities across Nigeria.

**Live site:** [canann-ng-85fo.vercel.app](https://canann-ng-85fo.vercel.app)

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Typography:** Onest

## Project Structure

app/about-us - About page
app/blog - Blog section
app/causes - Causes listing
app/contact - Contact and donation forms
app/globals.css - Design tokens and base styles
components/Nav.tsx, Footer.tsx - Shared layout components
components/home - Homepage-specific components
lib/ - Utility functions
public/ - Static assets

## Design System

Primary accent: green #39a46b. Dark background with a clear text hierarchy. Responsive spacing driven by CSS clamp() via the shared .section class.

## Getting Started

1. Clone the repo: git clone https://github.com/akintolaadeyi-gif/canann-ng.git then cd canann-ng
2. Install dependencies: npm install
3. Run the dev server: npm run dev
4. Open http://localhost:3000 in your browser.

## Deployment

Deployed on Vercel.

## License

MIT