# Dockerfile

# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app using npm
CMD ["npm", "run", "start:dev"]
