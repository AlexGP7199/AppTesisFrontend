FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint-env.sh /docker-entrypoint.d/40-env.sh
RUN chmod +x /docker-entrypoint.d/40-env.sh

COPY --from=build /app/dist/AppTesisFrontend/browser /usr/share/nginx/html

EXPOSE 80
