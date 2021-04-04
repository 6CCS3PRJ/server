FROM keymetrics/pm2:latest-alpine

WORKDIR /usr/6CCS3PRJ/server/

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=prod

# Bundle app source
COPY . .

EXPOSE 4683
ENV DOCKER_ENV=true

# generate feature and heat-map cache on first startup
ENV CACHE_ON_STARTUP=true

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]

