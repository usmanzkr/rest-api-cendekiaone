# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable for MySQL connection
ENV MYSQL_HOST=mysql
ENV MYSQL_USER=cendekiaone
ENV MYSQL_PASSWORD=cendekiaone
ENV MYSQL_DATABASE=db_cendekiaone

# Run Sequelize migrations before starting the application
RUN npx sequelize-cli db:migrate

# Command to run the application
CMD ["npm", "run", "dev"]

