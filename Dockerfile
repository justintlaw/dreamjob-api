FROM node:14.17.0-alpine3.13
ENV NODE_ENV production
WORKDIR /app
# RUN npm install --production
COPY . .
RUN ls
# RUN npm install
EXPOSE 3001

CMD [ "node", "server.js" ]