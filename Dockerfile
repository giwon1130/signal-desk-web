FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./
ENV API_UPSTREAM=http://signal-desk-api:8091/api/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
