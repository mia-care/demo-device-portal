# --- build stage ---
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src

RUN npm run build

# --- runtime stage ---
FROM nginx:1.27-alpine

# Serve as the unprivileged "nginx" user that ships with the image.
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Ensure writable dirs for the non-root user (pid + temp live under /tmp).
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && touch /tmp/nginx.pid \
    && chown nginx:nginx /tmp/nginx.pid

USER nginx

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
