FROM node:lts-alpine3.14

WORKDIR /app

COPY . /app

RUN npm install

CMD [ "node", "dist/index.js" ]