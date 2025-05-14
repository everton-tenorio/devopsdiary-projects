# Stage 1: Build
FROM node:22-alpine AS builder

ENV NODE_ENV=development

WORKDIR /build

COPY app/package.json app/package-lock.json ./
# Instala todas as dependências, incluindo devDependencies
RUN npm ci
COPY app/ . 
COPY app/src/index.html .
RUN npm run build
# RUN npm run test

# Stage 2: Runtime
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache curl

# non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copiar binários e artefatos
COPY --from=builder /build/dist /app/dist/
COPY --from=builder /build/index.html /app/dist/index.html
COPY --from=builder /build/package.json /app/
COPY --from=builder /build/node_modules /app/node_modules 

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:3000/ || exit 1

CMD ["node", "dist/app.js"]

LABEL maintainer="github.com/everton-tenorio" \
      version="1.0" \
      description="Aplicação Express"
