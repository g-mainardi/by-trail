# Use Node.js environment
FROM node:22-slim

# Set the working directory to the MONOREPO ROOT
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy the workspace package.json files
COPY client/package.json ./client/
COPY shared/package.json ./shared/

# Install dependencies
RUN npm install

# Copy source code for shared and client
COPY shared ./shared
COPY client ./client

# Switch context to client to run commands easily
WORKDIR /app/client

# For Production --------------
ARG VITE_SERVER_URL
ARG VITE_SOCKET_URL

ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
# -----------------------------

# Expose Vite default port
EXPOSE ${VITE_PORT:-5173}

# Start Vite
# --host: to make Vite listen even outside the container (from browser)
CMD ["npm", "run", "dev", "--", "--host"]