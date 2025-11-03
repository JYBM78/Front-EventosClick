# Etapa 1: Construcción del proyecto Angular
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration production

# Etapa 2: Servir el build con NGINX
FROM nginx:alpine
COPY --from=build /app/dist/front-eventos-click /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
