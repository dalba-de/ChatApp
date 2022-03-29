FROM node:latest

WORKDIR /dalba-de/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g @nestjs/cli@latest

COPY . .

RUN npm run build

EXPOSE 3000