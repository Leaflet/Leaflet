# Leaflet

Leaflet aims to stay simple, lightweight and fast. Prefer the smallest change that solves the problem, keep new API
minimal, and consider whether a feature belongs in a plugin rather than core.

Plain ES modules with JSDoc types; there is no compile step for `src`. The API reference is generated from the JSDoc
comments, so treat comments on public options, methods and events as user-facing docs. Indent with tabs.

## Commands

- `npm test -- spec/suites/path/to/FooSpec.js`: run one spec file (specs run in real browsers through Vitest).
  `npm test` runs them all in headless Chromium; set `TEST_BROWSER=firefox` or `webkit` for other browsers.
- `npm run lint`: ESLint (`npm run lintfix` fixes what it can).
- `npm run typecheck`: tsc over the JSDoc types. `npm run test:types` checks the type tests in `spec/types`.
- `npm run lint:docs`: flags public API without a JSDoc description and other reference problems.
- `npm run build`: bundle into `dist/` and emit the type declarations.
- `npm run debug`: serve the repo for manual testing with the pages in `debug/`.

Run lint, typecheck and the relevant specs before calling a change done; also run `lint:docs` when the public API
changes. For work on the website (`docs/`) or releases, see `CONTRIBUTING.md`.
