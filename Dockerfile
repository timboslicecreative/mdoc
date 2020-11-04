# MDoc Documentation Framework
FROM node:14-alpine

# Setup workdir
WORKDIR /usr/src/app

# Copy source
COPY src/package*.json ./

# Install packages
RUN npm install

# Copy source
COPY src ./

# Expose port for webserver
EXPOSE 5000

CMD ["npm", "run", "start"]