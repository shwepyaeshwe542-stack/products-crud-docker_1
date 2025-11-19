FROM node:18-slim

# Install OpenSSL 3.x for Prisma compatibility
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client with proper binary target
RUN npx prisma generate

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 4000

# Wait for database, run migrations, seed, then start
CMD ["sh", "-c", "sleep 10 && npx prisma migrate deploy && npx prisma db seed && npm start"]