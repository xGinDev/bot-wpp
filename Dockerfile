    # Usa una imagen base con Node.js y Chromium (necesario para whatsapp-web.js)
    FROM node:18-bullseye-slim

    # Instala dependencias del sistema para Puppeteer y Canvas
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

    # Crea y configura el directorio de trabajo
    WORKDIR /app

    # Copia archivos de dependencias primero (para cache eficiente)
    COPY package.json package-lock.json ./

    # Instala dependencias (incluyendo chromium como dependencia explícita)
    RUN npm install --production --no-optional

    # Copia el resto de archivos
    COPY . .

    # Expone el puerto del servidor Express
    EXPOSE 3000

    # Comando de inicio (ejecuta tanto el bot como el servidor)
    CMD ["node", "index.js"]


    WORKDIR /app

    # Copia TODOS los archivos (incluyendo .wwebjs_auth si existe localmente)
    COPY . .

    # Crea una carpeta para la sesión si no existe (permisos)
    RUN mkdir -p .wwebjs_auth && \
        chown -R node:node .wwebjs_auth

    # Ejecuta como usuario no-root (mejores prácticas)
    USER node

    CMD ["node", "index.js"]