---
id: KNC057
type: ref-impl
specs:
  - id: HUB751
    path: /spec-history/fix-adapter-warning.md
impl:
  id: KIT939
  path: /impls/svelte.md
commits:
  - sha: 3551c45d99711aaf6dd9f818b6c7375fd8c842f5
    message: Fix SvelteKit adapter configuration warning by using adapter-static
---

# Fix Adapter Warning Implementation

## Implementation Approach

Switched from `@sveltejs/adapter-auto` to `@sveltejs/adapter-static` to eliminate the build warning about not detecting a supported production environment.

### Key Changes

1. **Package Installation**: Added `@sveltejs/adapter-static` to devDependencies using `pnpm add -D @sveltejs/adapter-static`
2. **Adapter Configuration**: Updated `svelte.config.js` to import and use `adapter-static` instead of `adapter-auto`
3. **Prerender Configuration**: Created `src/routes/+layout.js` with `export const prerender = true` to mark all routes as prerenderable

### Important Discovery

**Critical**: `adapter-static` requires all routes to be explicitly marked as prerenderable. Without the `+layout.js` file exporting `prerender = true`, the build fails with:

```
@sveltejs/adapter-static: all routes must be fully prerenderable, but found the following routes that are dynamic:
  - src/routes/
```

The application has no dynamic server-side rendering requirements, so all routes can be safely prerendered. Adding `export const prerender = true` to the root layout file (`src/routes/+layout.js`) enables this globally.

### Testing Verification

- Build completes successfully with no adapter warnings
- All 63 E2E tests pass (across Chromium, Firefox, and WebKit)
- Pre-commit hooks (build, format, lint) all pass
