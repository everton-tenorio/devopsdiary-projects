# STAGE 1: builder
FROM node:22-alpine AS builder
WORKDIR /build

# 1 - Install (dev e prod)
COPY app/package.json app/package-lock.json ./
RUN npm ci

# 2 - Build
COPY app/ .
COPY app/src/index.html .
RUN npm run build

# 3 - Remove devDependencies
RUN npm prune --production

# STAGE 2: runtime
FROM gcr.io/distroless/nodejs22-debian12

WORKDIR /app

# non-root user
USER nonroot

# Copy final files and deps production
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/index.html ./dist/index.html
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./
COPY --from=builder /build/health.js ./

# Healthcheck
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["/nodejs/bin/node", "health.js"]

# prod
CMD ["dist/app.js"]
LABEL maintainer="github.com/everton-tenorio" \
      version="1.0" \
      description="Aplicação Express otimizada"

