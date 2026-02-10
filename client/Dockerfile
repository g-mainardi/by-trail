# ==========================================
# STAGE 1: Builder (Node + Vite)
# ==========================================
FROM node:22-slim AS builder

WORKDIR /app

# Copy package manifests first for caching
COPY package*.json ./
COPY client/package.json ./client/
COPY shared/package.json ./shared/

# Install ALL workspaces from root
RUN npm install --ignore-scripts

# Copy source code
COPY shared ./shared
COPY client ./client

# --- HANDLE BUILD ARGUMENTS ---
ARG VITE_SERVER_URL
ARG VITE_PORT
ARG VITE_SOCKET_URL

# Transfer build arguments to environment variables
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_PORT=$VITE_PORT
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

# Compile (generate /app/client/dist)
RUN npm run build:shared
RUN npm run build:client

# ==========================================
# STAGE 2: Production Runner (Nginx)
# ==========================================
FROM nginx:stable-alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Create entrypoint script to handle dynamic config
COPY client/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Use custom nginx config
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from Builder stage
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Nginx listening port
EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]