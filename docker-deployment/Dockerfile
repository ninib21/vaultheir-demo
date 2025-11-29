# VaultHeir Demo - Production Docker Image
# Multi-stage build for optimized image size

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --legacy-peer-deps
RUN cd backend && npm ci

# Stage 2: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js frontend
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY --from=deps /app/backend/node_modules ./node_modules
COPY backend/ .

# Build NestJS backend
RUN npm run build

# Stage 4: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 vaultheir

# Copy frontend build
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/.next/standalone ./
COPY --from=frontend-builder /app/.next/static ./.next/static

# Copy backend build
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package.json ./backend/

# Copy investor documents
COPY --from=frontend-builder /app/public/investor-documents ./public/investor-documents

USER vaultheir

EXPOSE 3000 3001

# Start script will be defined in docker-compose
CMD ["node", "server.js"]
