# ==========================================
# STAGE 1: Builder
# ==========================================
FROM node:22-slim AS builder

WORKDIR /app

# Copy package manifests first for caching
COPY package*.json ./
COPY server/package.json ./server/
COPY shared/package.json ./shared/

# Install ALL workspaces from root
RUN npm install --ignore-scripts

# Copy source code
COPY shared ./shared
COPY server ./server

# Build project (TypeScript -> JavaScript in /dist)
RUN npm run build:shared
RUN npm run build:server

# ==========================================
# STAGE 2: Production Runner
# ==========================================
FROM node:22-slim AS runner

WORKDIR /app/server

# Copy ALL package.json and install from root
WORKDIR /app
COPY package*.json ./
COPY server/package.json ./server/
COPY shared/package.json ./shared/

RUN npm install --workspace=server --workspace=shared --omit=dev --ignore-scripts

# todo serve davvero? Se tsc-alias risolve i path nella dist, potremmo non averne bisogno qui.
# Copy shared project if needed runtime
COPY shared ./shared

# Copy compiled assets from the Builder stage
WORKDIR /app/server
COPY --from=builder /app/server/dist ./dist

# Environment variable for production and port exposure
ENV NODE_ENV=production
EXPOSE ${PORT:-3000}

# Default Command: point to compiled file
CMD ["npm", "start"]