FROM node:18

WORKDIR /usr/src/app
COPY package*.json ./

ENV TZ=Asia/Seoul

RUN apt-get update
RUN apt-get install tzdata
RUN npm install -g pm2
RUN npm install

COPY . ./

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]