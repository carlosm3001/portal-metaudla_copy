# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Construye el frontend
RUN npm run build

# Expone el puerto en el que corre el servidor
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "start"]