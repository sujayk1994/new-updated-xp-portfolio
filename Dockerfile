FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/static ./static

RUN npm ci --omit=dev

USER nodejs

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

CMD ["node", "build/index.js"]
