# Simple production Dockerfile for Fastify backend
FROM node:20-bookworm-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source
COPY . .

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=5000

EXPOSE 5000

CMD ["npm", "start"]
