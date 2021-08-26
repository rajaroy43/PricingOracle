FROM node:lts-alpine3.14

WORKDIR /app

COPY . /app

RUN yarn install
RUN npx tsc

CMD [ "node", "dist/index.js" ]