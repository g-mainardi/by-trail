# Use Node.js environment
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite default port
EXPOSE 5173

# Start Vite
# --host: to make Vite listen even outside the container (from browser)
CMD ["npm", "run", "dev", "--", "--host"]