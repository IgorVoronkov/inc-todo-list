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

## Environment

Copy `.env.example` to `.env.local` and fill in the values: `VITE_AUTH_TOKEN` and `VITE_API_KEY`
come from https://apihub.it-incubator.io, `VITE_API_URL` already points at the Trelly API. All three
variables are required — the app refuses to start when one of them is empty. `.env.local` is
git-ignored; never commit real tokens.

## Git hooks

`pnpm install` installs husky hooks. Commits run oxlint and oxfmt on staged files through
lint-staged; pushes run `pnpm check`.
