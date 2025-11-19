FROM node:18-alpine

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema and seed files
COPY prisma ./prisma/

# Install Dependencies
RUN npm install

# Generate Prisma Client 
RUN npx prisma generate

# Copy application code
COPY . .

# Create the uploads directory for file storage
RUN mkdir -p uploads

# The server runs on port 4000
EXPOSE 4000

# Wait for database, run migrations, then start
CMD ["sh", "-c", "sleep 15 && npx prisma migrate deploy && npm start"]