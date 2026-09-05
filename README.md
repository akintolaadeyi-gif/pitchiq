# PitchIQ

An AI-powered sports insights dashboard built with Next.js, TypeScript, Supabase, and Anthropic's Claude SDK.

**Live demo:** [pitchiq-ten.vercel.app](https://pitchiq-ten.vercel.app)

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Backend / Database:** Supabase
- **AI:** Anthropic's Claude SDK for AI-assisted analysis
- **Styling:** PostCSS
- **Linting:** ESLint

## Features

- AI-assisted analysis powered by Claude
- Supabase-backed data layer for persistence and querying
- Built on the Next.js App Router with a fully typed TypeScript codebase

## Getting Started

1. Clone the repo: git clone https://github.com/akintolaadeyi-gif/pitchiq.git then cd pitchiq
2. Install dependencies: npm install
3. Set up your environment variables — copy .env.example (if present) to .env.local and fill in your own Supabase and Anthropic credentials.
4. Run the dev server: npm run dev
5. Open http://localhost:3000 in your browser.

## Project Structure

src/ - Application source code
public/ - Static assets
AGENTS.md - Notes on how Claude agents are used in this project
CLAUDE.md - Claude-specific project context/instructions

## Deployment

Deployed on Vercel.

## License

MIT