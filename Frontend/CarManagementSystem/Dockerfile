FROM node:18-alpine AS build
ARG VITE_API_BASE_URL_ARG
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL_ARG

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 