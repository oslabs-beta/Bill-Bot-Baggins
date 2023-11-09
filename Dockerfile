FROM node:16.13
WORKDIR /usr/src/app
COPY * /usr/src/app/
RUN npm install
COPY . .
# RUN npm start
EXPOSE 3000
CMD ["node", "./salesforce-webhook/src/server/server.ts", "./stripe-webhook/route.js"]