# inc-todo-list

Todo list SPA built with Vite, React 19 and TypeScript.

## Commands

- `pnpm dev` — start the Vite dev server.
- `pnpm build` — typecheck and build for production.
- `pnpm typecheck` — run the TypeScript typecheck.
- `pnpm preview` — serve the production build.
- `pnpm lint` — run oxlint, then the typecheck.
- `pnpm format` — format the repo with oxfmt.
- `pnpm format:check` — report files that are not formatted.
- `pnpm check` — run `pnpm lint` and `pnpm format:check`.

## Git hooks

`pnpm install` installs husky hooks. Commits run oxlint and oxfmt on staged files through
lint-staged; pushes run `pnpm check`.
