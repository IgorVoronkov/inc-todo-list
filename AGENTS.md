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
  `no-restricted-imports` only matches alias paths, so a relative `../../pages/...` from another
  layer escapes `pnpm lint` — never cross layers with relative paths, always use the alias.

## Commands

- `pnpm dev` — Vite dev server.
- `pnpm build` — `tsc -b && vite build`.
- `pnpm typecheck` — `tsc -b` (also runs inside `pnpm lint` and `pnpm build`; reuses
  `node_modules/.tmp` build info).
- `pnpm lint` — `oxlint && tsc -b`, not ESLint (config: `.oxlintrc.json`); oxlint runs first because
  it is the faster check.
- `pnpm format` — format the whole repo with oxfmt (config: `.oxfmtrc.json`).
- `pnpm format:check` — report files that are not formatted.
- `pnpm check` — `pnpm lint && pnpm format:check`; the gate the pre-push hook runs.
- `pnpm preview` — serve the production build.

There is no test runner and no CI. Do not invent test commands or add tooling unasked. Use pnpm only;
`pnpm-lock.yaml` is the lockfile.

## Git hooks

`pnpm install` runs `prepare`, which installs husky hooks from `.husky/`:

- `pre-commit` runs lint-staged (config: `lint-staged.config.js`): `oxlint --fix` then `oxfmt` on
  staged JS/TS files, and `oxfmt` on staged CSS, HTML, JSON, Markdown and YAML files.
- `pre-push` runs `pnpm check`; type errors and formatting issues cannot be scoped to staged files,
  so they are caught here rather than on commit.

A failing hook means the change is not ready: fix the cause instead of bypassing it with
`--no-verify`.

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
- Checks have one owner each: `tsc` covers types and unused code, oxlint covers React,
  accessibility, import cycles and FSD boundaries (alias imports only), oxfmt covers style. Do not
  add an oxlint rule for something tsconfig already enforces, and never add style rules to oxlint.
- Formatting is oxfmt with `semi: false` and `singleQuote: true`; run `pnpm format` instead of
  hand-fixing style. Editor setup is local and not committed: `.vscode/` is intentionally
  git-ignored. If you use VS Code, install the Oxc extension and set `editor.defaultFormatter` to
  `oxc.oxc-vscode` and `editor.formatOnSave` to `true`, including for `[jsonc]`: the Oxc extension
  maps `.oxlintrc.json` and `.oxfmtrc.json` to the `jsonc` language, and the built-in JSON formatter
  reflows arrays differently, which makes `pnpm format:check` fail after a save.
- Styling is plain CSS with native nesting — no Tailwind, CSS modules, or preprocessor. Colors and
  fonts come from CSS variables in `src/app/styles/index.css`, with dark mode via
  `prefers-color-scheme`. Aliased imports inside CSS require listing `src/**/*.css` in the tsconfig
  `include` array.
