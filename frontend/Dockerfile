# Simple single-stage Dockerfile for Next.js frontend
FROM node:20-bookworm-slim

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source and build
COPY . .
RUN npm run build

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
