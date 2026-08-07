FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY src ./src

# Non-root; the container is expected to run with a read-only root filesystem.
USER node

EXPOSE 3000

CMD ["node", "src/index.js"]
