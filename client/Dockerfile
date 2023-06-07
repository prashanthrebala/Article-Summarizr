# Use a Node 16 base image
FROM node:19-alpine

# Set the working directory to /app inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy only necessary app files
COPY dist ./dist

# Set the env to "production"
ENV NODE_ENV production

# Expose the port on which the app will be running
EXPOSE 5011

# Start the app
CMD ["node", "dist/index.js"]
