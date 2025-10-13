# Use Node 20 on Alpine (small but needs OpenSSL + glibc)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install required system packages for Prisma + OpenSSL
RUN apk add --no-cache openssl1.1-compat libstdc++ bash

# Copy only package.json and lock file first (for caching)
COPY package*.json ./

# Copy Prisma schema (needed for generate)
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of your backend source code
COPY . .

# Create uploads directory if not exists
RUN mkdir -p uploads

# Expose backend port
EXPOSE 4000

# Start command — apply migrations then run the app
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
