# AGENTS.md

## Project state

Single-package Vite + React 19 + TypeScript SPA implementing the MVP described in `PLAN.md`:
MaterialUI for UI, Redux Toolkit + react-redux for state, and the Trelly REST API as the data source.
There is no router, no RTK Query, and no local persistence — the API is the source of truth.

## Structure

Feature-Sliced Design over layers `app → pages → features → entities → shared` (no `widgets` layer
until a self-contained block needs one). Imports go strictly downward; slices on the same layer never
import each other.

- A slice exposes its public API via `index.ts`; `ui`, `model`, `api`, `lib`, `config` are internal.
  `app` and `shared` have segments, not slices.
- Aliases `@app`, `@pages`, `@features`, `@entities`, `@shared` are declared once in
  `tsconfig.app.json` (`compilerOptions.paths`) and reused by Vite via `resolve.tsconfigPaths`; never
  repeat them in `resolve.alias`.
- Cross layers by alias only. `no-restricted-imports` matches alias paths, so a relative
  `../../pages/...` silently bypasses the FSD check.
- Folders `kebab-case`, component files `PascalCase`. Add a slice on first real use rather than
  scaffolding placeholders.
- `app` keeps providers and the theme; `shared` keeps the API client, the typed environment config
  (`shared/config/env.ts`), and the Redux store with its typed hooks (`shared/lib/store`).

## Environment

`shared/config/env.ts` is the only reader of `import.meta.env`. It requires `VITE_API_URL`,
`VITE_AUTH_TOKEN`, and `VITE_API_KEY` (see `.env.example`) and fails fast when any of them is empty.
Keep secrets in `.env.local`, which is git-ignored; never commit real tokens or add env access
elsewhere.

## Commands

`README.md` is the single list of pnpm scripts; `pnpm check` is what `pre-push` runs. There is no test
runner and no CI: do not invent test commands or add tooling unasked. Fix a failing hook instead of
bypassing it with `--no-verify`.

## Commits

Conventional Commits: `<type>(<scope>): <subject>`, imperative, lowercase, at most 72 characters.
Types `feat`, `fix`, `refactor`, `chore`, `docs`; scope optional and single (`todo`, `storage`, `ui`,
`deps`, `build`). One logical change per commit; keep dependency and build changes as `chore(deps)` /
`chore(build)`.

## Toolchain quirks

- React Compiler runs via `@rolldown/plugin-babel`; skip manual `useMemo`/`useCallback`.
- TypeScript 7 with `verbatimModuleSyntax` and `erasableSyntaxOnly`: type-only imports need
  `import type`; no enums, namespaces, or constructor parameter properties.
- One owner per check: `tsc` for types, oxlint for React/a11y/imports/FSD, oxfmt for style. Do not
  duplicate a tsconfig rule in oxlint, and never add style rules to oxlint.
- oxfmt with `semi: false` and `singleQuote: true`; run `pnpm format` instead of hand-fixing style.
  Editor setup is local and not committed: `.vscode/` is intentionally git-ignored. If you use VS
  Code, install the Oxc extension and set `editor.defaultFormatter` to `oxc.oxc-vscode` and
  `editor.formatOnSave` to `true`, including for `[jsonc]`: the Oxc extension maps `.oxlintrc.json`
  and `.oxfmtrc.json` to the `jsonc` language, and the built-in JSON formatter reflows arrays
  differently, which makes `pnpm format:check` fail after a save.
- UI comes from MaterialUI 9 with Emotion; style with MUI components, the `sx` prop, and the theme in
  `app/styles/theme.ts`. Icons come from `@mui/icons-material`. No Tailwind, CSS modules,
  preprocessor, or a second styling library.
