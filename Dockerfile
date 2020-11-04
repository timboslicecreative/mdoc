# Shekal Documentation Framework using Plate
FROM node:14-alpine

ENV NODE_ENV=development

WORKDIR /usr/src/app

# Copy source
COPY documentation/src/package*.json ./

# Install paclages
RUN npm install

# Copy source
COPY documentation/src ./

#COPY source/apis/documentation ./document/apis
#COPY source/webapp/documentation ./document/webapp

EXPOSE 8888
CMD ["npm", "run", "start"]