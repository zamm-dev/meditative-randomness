---
id: KIT939
type: implementation
---

# Svelte Implementation of Meditative Randomness

This is the Svelte implementation of Meditative Randomness for the web.

## Development Setup

### Prerequisites

- Node.js (latest LTS)
- pnpm package manager

### Installation

```bash
pnpm install
```

### Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm format` - Format all code
- `pnpm lint` - Lint code

### Project Structure

```
src/
├── routes/          # SvelteKit routes
├── lib/            # Shared components and utilities
├── app.html        # HTML template
└── app.d.ts        # TypeScript declarations

tests/              # Playwright tests
```

### Git Hooks

Pre-commit hooks automatically run:

- Code formatting
- Linting
- Production build

Pre-push hooks run:

- All tests

To install hooks: `pnpm lefthook install`

### Testing

Uses Playwright for end-to-end testing with Chromium, Firefox, and WebKit browsers.
