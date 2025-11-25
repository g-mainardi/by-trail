# Use a lightweight Node image (Alpine Linux)
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first (Layer Caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port used by Express (ensure it matches your index.js)
EXPOSE 3000

# Startup command for development (use nodemon if available in scripts)
CMD ["npm", "run", "start:dev"]