# Imagen base con Node y soporte para Puppeteer
FROM node:18-slim

# Evita errores de puppeteer y canvas
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Instala dependencias del sistema para Puppeteer + canvas
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxtst6 \
  libjpeg-dev \
  libpango1.0-0 \
  libgif-dev \
  build-essential \
  python3 \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Crea directorio de trabajo
WORKDIR /app

# Copia dependencias
COPY package*.json ./

# Instala dependencias Node.js
RUN npm install

# Copia todo el proyecto
COPY . .

# Exponer el puerto de Express
EXPOSE 3000

# Comando para correr el bot
CMD ["node", "index.js"]
