# syntax=docker/dockerfile:1
FROM node:22-alpine AS build

WORKDIR /app

# Copy and install client deps, then build
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build

# --- Production stage ---
FROM node:22-alpine

WORKDIR /app

# Copy server source and install production deps IN the server directory
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server source code
COPY server/src ./server/src

# Copy built client
COPY --from=build /app/client/dist ./client/dist

# SQLite data directory
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=5000
ENV DB_PATH=/app/data/qrcode.sqlite

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-5000}/api/health || exit 1

CMD ["node", "server/src/index.js"]
