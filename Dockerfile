FROM node:18-bullseye-slim

# Instala dependencias del sistema
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

WORKDIR /app

# Copia solo package.json primero (si package-lock.json no existe)
COPY package.json ./

# Instala dependencias
RUN npm install --production --no-optional

# Copia el resto de archivos
COPY . .

# Prepara carpeta de sesión
RUN mkdir -p .wwebjs_auth && \
    chown -R node:node .wwebjs_auth

USER node

EXPOSE 3000
CMD ["node", "index.js"]