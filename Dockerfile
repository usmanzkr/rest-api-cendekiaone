# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
ADD package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
ADD . .

CMD node index.js
