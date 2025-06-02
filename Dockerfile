FROM node:18-slim

# Instala librerías necesarias para canvas y puppeteer
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    chromium \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Directorio de trabajo
WORKDIR /app

# Copia package.json e instala dependencias
COPY package*.json ./
RUN npm install

# 🔧 Instala PM2 globalmente
RUN npm install -g pm2

# Copia el resto del código
COPY . .

# Variables de entorno de PM2 (opcional para monitoreo remoto)
ENV PM2_PUBLIC_KEY=61gb1q2ruggk4l3
ENV PM2_SECRET_KEY=i9x3rirful1novw

# Expone el puerto del bot
EXPOSE 3001

# Comando para iniciar el bot con PM2
CMD ["pm2-runtime", "index.js"]
