# Use Node.js environment
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# For Production --------------
ARG VITE_SERVER_URL
ARG VITE_SOCKET_URL

ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
# -----------------------------

# Expose Vite default port
EXPOSE 5173

# Start Vite
# --host: to make Vite listen even outside the container (from browser)
CMD ["npm", "run", "dev", "--", "--host"]