FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl1.1-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .
RUN mkdir -p uploads

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
