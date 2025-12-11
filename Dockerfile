FROM node:latest

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install

COPY . /usr/src/bot

CMD ["sh", "npm", "run", "commands", "&&", "npm", "run", "prod"]

