# Use a lightweight Node image (Alpine Linux)
FROM node:22-slim

# Set the working directory to the MONOREPO ROOT
WORKDIR /app

# Copy dependency files first (Layer Caching)
COPY package*.json ./

# Copy the workspace package.json files
COPY server/package.json ./server/
COPY shared/package.json ./shared/

# Install dependencies
RUN npm install

# Copy source code for shared and server
COPY shared ./shared
COPY server ./server

# Switch context to server to run commands easily
WORKDIR /app/server

# Expose the port used by Express (ensure it matches your index.ts)
EXPOSE ${PORT:-3000}

# Startup command for development (use nodemon if available in scripts)
CMD ["npm", "run", "start:dev"]