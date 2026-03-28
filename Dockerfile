FROM node:22-slim AS build

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Copy workspace root files for pnpm install
COPY app/package.json app/pnpm-lock.yaml app/pnpm-workspace.yaml app/tsconfig.base.json ./

# Copy package.json for each workspace package
COPY app/frontend/package.json frontend/package.json
COPY app/backend/package.json backend/package.json
COPY app/shared/package.json shared/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY app/frontend frontend
COPY app/shared shared
COPY app/eslint-rules eslint-rules

# Build frontend (skip tsc — already validated locally, avoids Docker path issues with monorepo types)
RUN pnpm --filter frontend exec vite build

# --- Production stage: serve static files with a lightweight server ---
FROM node:22-slim

WORKDIR /app
RUN npm install -g serve@14

COPY --from=build /app/frontend/dist ./dist

EXPOSE 3000
CMD ["sh", "-c", "serve dist -s -l tcp://0.0.0.0:${PORT:-3000}"]
