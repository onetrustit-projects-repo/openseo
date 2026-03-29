# OpenSEO Dockerfile - Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN npm ci && npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S openseo && \
    adduser -S openseo -u 1001

# Copy built frontend from builder
COPY --from=builder /app/frontend/dist ./frontend/dist

# Copy API source
COPY --from=builder /app/api ./api

# Set ownership
RUN chown -R openseo:openseo /app

USER openseo

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "api/src/index.js"]
