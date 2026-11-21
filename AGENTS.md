# AGENTS.md

## Project state

Single-package Vite + React 19 + TypeScript SPA. Despite the name, it is still the Vite starter
template: `src/app/App.tsx` contains demo content only, and there is no todo domain logic, state
management, persistence, or routing yet. Build the feature rather than assuming it exists.

Entry path: `index.html` → `src/app/main.tsx` → `src/app/App.tsx`. Global theme tokens live in
`src/app/styles/index.css`; static assets in `public/`. SVG icons, once added, are referenced from
the sprite: `<use href="/icons.svg#<id>">`.

## Structure

Lightweight Feature-Sliced Design: layers `app`, `pages`, `features`, `entities`, `shared`. There is
no `widgets` layer until a self-contained block actually needs one.

    src/
      app/       entry point, root component, global styles
      pages/     one slice per page
      features/  one slice per product action
      entities/  one slice per business entity
      shared/    reusable code detached from the domain; segments only

Empty layer directories are kept in git with `.gitkeep`; add a slice on first real use rather than
scaffolding placeholders.

- Imports go strictly downward: `app → pages → features → entities → shared`. Slices on the same
  layer never import each other.
- A slice exposes its public API through `index.ts`; the `ui`, `model`, `api`, `lib`, `config`
  segments stay internal. `app` and `shared` have no slices, only segments.
- Slice and segment folders are `kebab-case`; component files are `PascalCase`.
- Aliases mirror the layers: `@app`, `@pages`, `@features`, `@entities`, `@shared`. They are defined
  once in `tsconfig.app.json` under `compilerOptions.paths` and Vite picks them up via
  `resolve.tsconfigPaths`; do not duplicate them in `resolve.alias`.
- Use relative imports inside a slice; aliases are for crossing layer boundaries.

## Commands

- `pnpm dev` — Vite dev server.
- `pnpm build` — `tsc -b && vite build`.
- `pnpm typecheck` — `tsc -b` (also runs inside `pnpm lint` and `pnpm build`; reuses
  `node_modules/.tmp` build info).
- `pnpm lint` — `oxlint && tsc -b`, not ESLint (config: `.oxlintrc.json`); oxlint runs first because
  it is the faster check.
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
  fonts come from CSS variables in `src/app/styles/index.css`, with dark mode via
  `prefers-color-scheme`. Aliased imports inside CSS require listing `src/**/*.css` in the tsconfig
  `include` array.
