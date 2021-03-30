FROM node:current-alpine3.13

WORKDIR /usr/6CCS3PRJ/server/

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=prod

# Bundle app source
COPY . .

EXPOSE 4683
CMD [ "npm","run", "dev" ]