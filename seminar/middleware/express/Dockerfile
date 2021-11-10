FROM node:14-alpine

WORKDIR /usr/src/expressjs

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8085
ENTRYPOINT ["node", "app.js"]