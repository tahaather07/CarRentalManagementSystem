FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3001

ENV PORT=3001

CMD ["node", "index.js"] 