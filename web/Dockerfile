FROM node:18-alpine

WORKDIR /app

COPY ./uku-app ./uku-app
COPY ./uku-backend ./uku-backend

RUN npm install -g concurrently

WORKDIR /app/uku-app
RUN npm install

RUN npm run build

WORKDIR /app/uku-backend
RUN npm install

WORKDIR /app

EXPOSE 3000

CMD concurrently \
  "cd ./uku-backend && node server.js" \
  "cd ./uku-app && npm run start"