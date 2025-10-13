---
id: LNW387
type: ref-impl
specs:
  - id: XCN825
    path: /specs/project-setup.md
impl:
  id: KIT939
  path: /impls/svelte.md
commits:
  - sha: 86c36c84506fea28cf08cb7f72d80f2028d15cda
    message: Add lock file changes
  - sha: 1153f0981f8f3604ce7263697d371b7abddeab46
    message: >-
      Set up Svelte project infrastructure with working webpage and development
      tooling
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

## Implementation Results

### Challenges and Solutions

1. **SvelteKit CLI Tool Change**: The original `pnpm create svelte@latest` command was deprecated in favor of `npx sv create`. Had to adapt to the new CLI tool and its parameters.

2. **ESLint Configuration Issues**:
   - Initial ESLint setup had dependency issues (missing `@eslint/js`)
   - Generated files in `.svelte-kit/` directory were being linted, causing hundreds of errors
   - Svelte parser configuration required additional `svelte-eslint-parser` package
   - **Solution**: Added proper ignore patterns for generated directories and configured the Svelte parser correctly

3. **Directory Structure Conflict**: The create command initially prompted about the non-empty directory due to existing `docs/` and `.claude/` folders. Used echo piping to automatically confirm.

### Final Verification

All verification steps completed successfully:

- ✅ Git status shows proper file ignoring (node_modules, .svelte-kit not showing)
- ✅ Development server runs on `pnpm dev`
- ✅ Static build produces optimized output with `pnpm build`
- ✅ Playwright tests pass in all browsers (Chromium, Firefox, WebKit)
- ✅ Pre-commit hooks work correctly (format, lint, build all executed)
- ✅ Code formatting and linting commands work without errors

### Package Scripts Created

```json
{
	"format": "prettier --write .",
	"lint": "eslint .",
	"test": "playwright test"
}
```

The project now has a fully functional SvelteKit setup with TypeScript, comprehensive linting/formatting, automated testing, and git hooks as specified in the requirements.
