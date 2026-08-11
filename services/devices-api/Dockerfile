FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY src ./src

# Run as the non-root user that ships with the node image.
USER node

EXPOSE 3001

CMD ["node", "src/index.js"]
