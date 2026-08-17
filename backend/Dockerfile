# Use the official Node.js 18 LTS Bullseye image (includes build tools needed for native ONNX runtime binaries)
FROM node:18-bullseye

# Set environment to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache layer
COPY package*.json ./

# Install dependencies (including production-only to minimize size)
RUN npm ci --only=production

# Copy the rest of the application files
COPY . .

# Expose the default backend port (2259)
EXPOSE 2259

# Start the Express server
CMD ["node", "server.js"]
