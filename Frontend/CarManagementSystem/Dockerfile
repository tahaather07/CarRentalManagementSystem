FROM node:18-alpine AS build
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY .env ./
COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 