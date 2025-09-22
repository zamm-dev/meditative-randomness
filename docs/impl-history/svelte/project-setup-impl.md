---
id: LNW387
type: ref-impl
specs:
  - id: XCN825
    path: /docs/specs/project-setup.md
impl:
  id: KIT939
  path: /docs/impls/svelte.md
---

# Implementation Plan: Project Setup for Svelte

This implementation plan sets up the basic project infrastructure and tooling for the Svelte implementation of Meditative Randomness according to spec XCN825.

## Goals

Set up a SvelteKit project with all required development commands and git hooks as specified in XCN825:
- Command to format all code
- Command to lint the code
- Command to run all tests
- Command to run a live debuggable version of the website
- Command to build a static deployable version of the website
- Git hooks for commit (lint, format, build) and push (tests)
- Proper .gitignore for the tech stack
- Working webpage that builds and runs (without functionality yet)

## Tasks

1. Initialize SvelteKit project using `pnpm create svelte@latest .`
2. Choose TypeScript variant with ESLint and Prettier
3. Install dependencies with `pnpm install`
4. Install additional tooling:
   - `@playwright/test` for testing
   - `lefthook` for git hooks
5. Configure package.json scripts:
   - `format`: Format all code
   - `lint`: Lint the code
   - `test`: Run all tests
   - `dev`: Run live debuggable version
   - `build`: Build static deployable version
6. Create basic "Meditative Randomness" page with placeholder content
7. Add a simple test to verify the page loads
8. Create `.lefthook.yml` with hooks:
   - Pre-commit: run lint, format, and build
   - Pre-push: run tests
9. Ensure proper `.gitignore` is in place
10. Install git hooks with `pnpm lefthook install`

## Verification Steps

1. Check `git status` to verify gitignore works correctly
2. Run `pnpm dev` to verify live site works
3. Run `pnpm build` to verify static build works
4. Run `pnpm test` to verify tests pass
5. Make a test commit to verify pre-commit hooks run successfully

## Commit Strategy

Single commit containing the complete project infrastructure setup with working webpage.

**Commit message:** "Set up Svelte project infrastructure with working webpage and development tooling"
