# Stage 1: Build
FROM node:20-buster AS build

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-ita \ 
    libopencv-dev \
    build-essential \
    cmake \
    pkg-config \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Crea una directory di lavoro
WORKDIR /app

# Installa curl e mysql-client se necessario
RUN apt-get update && \
    apt-get install -y --no-install-recommends bash curl default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

# Copia solo i file di dipendenza per sfruttare la cache
#COPY package*.json .
ENV OPENCV4NODEJS_DISABLE_AUTOBUILD=1
ENV OPENCV_INCLUDE_DIR=/usr/local/include
ENV OPENCV_LIB_DIR=/usr/lib/x86_64-linux-gnu

# Copia il package.json e installa le dipendenze di Node.js
COPY src/ ./src/
COPY package.json *.config.mjs *.config.cjs *.config.js *.setup.mjs *.setup.cjs *.setup.js tsconfig.json ./

# Installa tutte le dipendenze, inclusi i dev dependencies
RUN npm install opencv4nodejs --build-from-source
RUN npm install 

# Compila il progetto TypeScript
RUN npm run build

# Esegui i test (opzionale, rimuovi se preferisci eseguire i test separatamente)
#RUN npm test <-- eseguiti dalla pipeline ci.yml

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh && chown -R node:node /wait-for-it.sh
#RUN chmod +x /wait-for-it.sh

# Crea la directory logs e imposta i permessi
RUN mkdir -p logs && chown -R node:node logs

# Definisce l'utente non root per migliorare la sicurezza
USER node


CMD ["/wait-for-it.sh", "svt-db:3306", "--", "sh", "-c", "npm run migrate-and-seed && npm run dev"]
