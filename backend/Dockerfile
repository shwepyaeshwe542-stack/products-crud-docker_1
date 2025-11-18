# Stage 1: Build Stage
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema and seed files
COPY prisma ./prisma/

# Install Dependencies
RUN npm install

# FIX: Set environment variable to bypass checksum errors during Prisma generation
# This resolves the "500 Internal Server Error" when downloading the query engine.
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Generate Prisma Client (must run after npm install)
RUN npx prisma generate

# Copy application code
COPY . .

# Create the uploads directory for file storage
RUN mkdir -p uploads

# The server runs on port 4000
EXPOSE 4000

# Start the application
CMD ["npm", "start"]