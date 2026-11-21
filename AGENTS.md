# AGENTS.md

## Project state

Single-package Vite + React 19 + TypeScript SPA. Despite the name, it is still the Vite starter
template: `src/App.tsx` contains demo content only, and there is no todo domain logic, state
management, persistence, or routing yet. Build the feature rather than assuming it exists.

Entry path: `index.html` → `src/main.tsx` → `src/App.tsx`. Global theme tokens live in
`src/index.css`; component styles in `src/App.css`; static assets in `src/assets/` and `public/`.
SVG icons are referenced from the sprite: `<use href="/icons.svg#<id>">`.

## Commands

- `pnpm dev` — Vite dev server.
- `pnpm build` — `tsc -b && vite build`; this is also the only typecheck.
- `pnpm exec tsc -b` — typecheck alone (reuses `node_modules/.tmp` build info).
- `pnpm lint` — oxlint, not ESLint (config: `.oxlintrc.json`).
- `pnpm preview` — serve the production build.

There is no test runner, no CI, and no formatter config. Do not invent test commands or add tooling
unasked. Use pnpm only; `pnpm-lock.yaml` is the lockfile.

## Commits

Conventional Commits, trimmed down: no release tooling, no changelog, no `BREAKING CHANGE` footers.

Format: `<type>(<scope>): <subject>`. Subject in imperative mood, lowercase, no trailing period;
the whole line at most 72 characters.

- Types: `feat`, `fix`, `refactor`, `chore`, `docs`. Add others (`test`, `perf`, `style`) only when
  the project actually needs them.
- Scope is optional and single: `todo`, `storage`, `ui`, `deps`, `build`.
- Body is optional, separated by a blank line, explains why rather than what, wrapped at 72 columns.
- One logical change per commit; drive-by refactors go in their own commit.
- `chore` is not a catch-all: dependency bumps are `chore(deps): ...`, build config is
  `chore(build): ...`.
- Do not push `WIP` commits to `main`; amend while the change is still in progress.

Examples:

    feat(todo): add create and delete actions
    feat(storage): persist tasks in localStorage
    fix(todo): keep input focus after adding a task
    refactor(state): move task list into a reducer
    chore(deps): bump vite to 8.3.6
    docs: document commit convention

## Toolchain quirks

- React Compiler is active through `@rolldown/plugin-babel` in `vite.config.ts` and memoizes
  automatically; avoid manual `useMemo`/`useCallback` unless there is a concrete reason. It also
  makes dev/build startup slower than a plain Vite template.
- TypeScript 7 with `verbatimModuleSyntax` and `erasableSyntaxOnly`: type-only imports must use
  `import type`; no enums, namespaces, or constructor parameter properties.
- `noUnusedLocals` and `noUnusedParameters` are on, so leftover code fails `pnpm build`.
- Styling is plain CSS with native nesting — no Tailwind, CSS modules, or preprocessor. Colors and
  fonts come from CSS variables in `src/index.css`, with dark mode via `prefers-color-scheme`.
