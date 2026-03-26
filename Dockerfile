# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

# Não embute .env local: o contexto ignora .env* via .dockerignore.
# Força build sem VITE_* no bundle; a API vem só do env em runtime (entrypoint).
ENV VITE_API_URL="" VITE_API_DOMAIN=""

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

RUN apk add --no-cache jq \
  && rm /etc/nginx/conf.d/default.conf

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
