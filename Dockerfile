FROM node:alpine

WORKDIR /app

COPY package.json .
RUN npm install

COPY index.js .

ENTRYPOINT node index.js