FROM node:alpine
WORKDIR /app
COPY . .
RUN npm i --omit=dev
CMD [ "npm", "start" ]