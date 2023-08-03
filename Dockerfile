# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install the project dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the project files to the container
COPY . .

# Build the NestJS application (you might need to adjust the build command based on your project's setup)
RUN yarn build

# Expose the port that your NestJS application listens on (adjust this if your app listens on a different port)
EXPOSE 3000

# Run the NestJS application in production mode
CMD ["node", "dist/main"]