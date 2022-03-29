FROM node:latest AS development

WORKDIR /dalba-de/chat/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli@latest

COPY . .

RUN npm run build

EXPOSE 4200