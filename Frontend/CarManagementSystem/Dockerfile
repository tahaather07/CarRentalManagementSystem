# Stage 1: Build the application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
# Note: Copy nginx.conf before this if it's in the root of the build context
# Or ensure it's copied specifically if it's in a subdirectory
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets (optional, as our conf replaces default)
# RUN rm -rf ./* 
# It's generally safer to leave this out if you provide a full default.conf
# or ensure your custom config doesn't rely on any default includes that might be removed.

# Copy built assets from the build stage
COPY --from=build /app/dist .

# Expose port 80
EXPOSE 80

# Start Nginx and serve the application
CMD ["nginx", "-g", "daemon off;"] 