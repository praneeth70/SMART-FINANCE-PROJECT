# Use Node.js version 22
FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 5000
EXPOSE 5000

# Command to run the app
CMD [ "node", "src/index.js" ]