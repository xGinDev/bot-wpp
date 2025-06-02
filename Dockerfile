# Usa imagen oficial de Node.js con soporte para Chromium
FROM node:18-bullseye-slim

# Instala dependencias del sistema para Puppeteer/Chromium
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils && \
    rm -rf /var/lib/apt/lists/*

# Configura el directorio de trabajo
WORKDIR /app

# 1. Copia solo los archivos de dependencias primero (para cache eficiente)
COPY package.json package-lock.json ./

# 2. Instala dependencias de producción
RUN npm install --production --no-optional

# 3. Copia el resto del código (incluyendo .wwebjs_auth si existe)
COPY . .

# 4. Prepara la carpeta de sesión de WhatsApp
RUN mkdir -p .wwebjs_auth && \
    chown -R node:node .wwebjs_auth

# 5. Cambia a usuario no-root (seguridad)
USER node

# Puerto expuesto (Railway lo maneja automáticamente)
EXPOSE 3000

# Comando de inicio
CMD ["node", "index.js"]