# ===============================
# Etapa 1: Construcción del proyecto Angular
# ===============================
FROM node:22-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Construir la aplicación Angular para producción
RUN npm run build --configuration production

# ===============================
# Etapa 2: Servir el build con NGINX
# ===============================
FROM nginx:alpine

# Definir puerto esperado por Cloud Run
ENV PORT=8080

# Copiar build de Angular al directorio de Nginx
COPY --from=build /app/dist/front-eventos-click /usr/share/nginx/html

# Cambiar el puerto de Nginx de 80 a 8080 dinámicamente
RUN sed -i 's/listen 80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Exponer el puerto para Cloud Run
EXPOSE 8080

# Comando para mantener Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
