---
id: HUB751
type: spec
commits:
  - sha: 55ad80e78ab5d6aec924a49a6fe59c713026304d
    message: Fix SvelteKit adapter configuration warning by using adapter-static
---

# Fix Build Warning for Svelte Kit Adapter Configuration

Fix the build warning `> Using @sveltejs/adapter-auto
  Could not detect a supported production environment. See https://svelte.dev/docs/kit/adapters to learn how to configure your app to run on the platform of your choosing`

## Implementation Notes

Since the application only serves static assets via a reverse proxy (nginx or similar), use `@sveltejs/adapter-static`:

1. Install `@sveltejs/adapter-static` to `devDependencies`
2. Update `svelte.config.js` to import and use `@sveltejs/adapter-static` instead of `@sveltejs/adapter-auto`
3. The build will generate static files in the `build/` directory
4. Verify the build warning no longer appears when running `npm run build`
