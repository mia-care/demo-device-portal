# --- build stage ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src

RUN npm run build

# --- runtime stage ---
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server.js ./server.js
COPY --from=build /app/dist ./dist

# Non-root; the container is expected to run with a read-only root filesystem.
USER node

EXPOSE 8080

CMD ["node", "server.js"]
