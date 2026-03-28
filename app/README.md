# App

Pnpm monorepo managed with Turborepo. Three packages: `frontend`, `backend`, and `shared`.

## Get started

Run this project in the devcontainer, then:

```sh
pnpm -r i
```

Start the dev servers:

```sh
# Start frontend
cd frontend && pnpm dev

# Start backend (separate terminal)
cd backend && pnpm dev
```

## Testing

Frontend tests use Vitest + Playwright (browser mode). Install Playwright first:

```sh
pnpm exec playwright install-deps chromium
pnpm exec playwright install
```

Run tests:

```sh
pnpm --filter="frontend" test
pnpm --filter="backend" test
```
