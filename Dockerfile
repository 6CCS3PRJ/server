FROM node:latest

# Create app directory
WORKDIR /usr/6CCS3PRJ/server/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --only=prod
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 4683
CMD [ "npm","run", "dev" ]
