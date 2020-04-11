FROM node:12.13.0-alpine


WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm install --production

COPY . /opt/app

CMD [ "npm", "run", "start" ]