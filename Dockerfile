FROM node:18-bullseye-slim

# Instala dependencias de Chromium
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wget libgbm-dev libxshmfence-dev libglib2.0-0 libnss3 libatk1.0-0 \
    libatk-bridge2.0-0 libx11-xcb1 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Configura variables para Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copia e instala dependencias
COPY package.json .
RUN npm install --production --no-optional

# Copia el código y prepara la sesión
COPY . .
RUN mkdir -p .wwebjs_auth && \
    chown -R node:node .wwebjs_auth && \
    chmod -R 755 .wwebjs_auth

USER node

EXPOSE 3000
CMD ["node", "index.js"]