# ==========================================
# STAGE 1: Builder
# ==========================================
FROM node:22-slim AS builder

WORKDIR /app

# Copy package manifests first for caching
COPY package*.json ./
COPY server/package.json ./server/
COPY shared/package.json ./shared/

# Install shared dependencies
WORKDIR /app/shared
RUN npm install --ignore-scripts

# Install server dependencies
WORKDIR /app/server
COPY server/package.json ./
RUN npm install --ignore-scripts

# Copy source code
WORKDIR /app
COPY shared ./shared
COPY server ./server

# Build project (TypeScript -> JavaScript in /dist)
WORKDIR /app/server
RUN npm run build

# ==========================================
# STAGE 2: Production Runner
# ==========================================
FROM node:22-slim AS runner

WORKDIR /app/server

# Copy package manifests first for caching
COPY server/package.json ./

# Install only production dependecies
RUN npm install --omit=dev

# todo serve davvero? Se tsc-alias risolve i path nella dist, potremmo non averne bisogno qui.
# Copy shared project if needed runtime
WORKDIR /app
COPY shared ./shared

# Copy compiled assets from the Builder stage
WORKDIR /app/server
COPY --from=builder /app/server/dist ./dist

# Environment variable for production and port exposure
ENV NODE_ENV=production
EXPOSE ${PORT:-3000}

# Default Command: point to compiled file
CMD ["npm", "start"]