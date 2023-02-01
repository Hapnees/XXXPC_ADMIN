FROM node

WORKDIR /app/admin

COPY package.json .
RUN yarn install
COPY . .

EXPOSE 3001

CMD ["yarn", "start"]
