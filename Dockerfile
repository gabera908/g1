# syntax=docker/dockerfile:1
FROM node:22-alpine AS build

WORKDIR /app

# Copy server deps
COPY server/package*.json ./server/
RUN cd server && npm ci

# Copy client deps and build
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build

# --- Production stage ---
FROM node:22-alpine

WORKDIR /app

# Copy server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server ./server

# Copy built client into server's expected path
COPY --from=build /app/client/dist ./server/../client/dist

# SQLite data directory
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=5000
ENV DB_PATH=/app/data/qrcode.sqlite

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server/src/index.js"]
