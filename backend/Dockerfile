# Stage 1: Build Stage
# FIX: Switching to node:18-slim to resolve networking/library issues with Prisma downloads
FROM node:18-slim

# Set working directory inside the container
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

# Wait for database, run migrations, seed, then start
# The sleep 10 gives the DB container a head start before the migration/seed commands run.
CMD ["sh", "-c", "sleep 10 && npx prisma migrate deploy && npx prisma db seed && npm start"]