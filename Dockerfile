FROM node:20-alpine

WORKDIR /app

# Copia solo archivos de dependencias primero para aprovechar caché
COPY package.json package-lock.json ./

# Instala solo dependencias de producción en la imagen final
RUN npm ci --omit=dev && npm cache clean --force

# Copia el código fuente necesario
COPY src ./src

# Variables de entorno y puerto
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

USER node

CMD ["node", "src/app.js"]
