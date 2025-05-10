# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./
COPY package-lock.json ./

# Install dependencies for production
# Using npm ci for a cleaner, more reliable build from package-lock.json
RUN npm ci --omit=dev

# Copy the rest of the application code into the container
COPY . .

# Make port 3001 available to the world outside this container
# The .env file can override this if PORT is set there
EXPOSE 3001

# Define environment variable for the port (optional, can be set at runtime)
ENV PORT=3001

# Run index.js when the container launches
CMD ["node", "index.js"] 