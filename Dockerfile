# Stage 1: Build
FROM node:16-alpine AS build

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo i file di dipendenza per sfruttare la cache
#COPY package*.json .
COPY . ./

# Installa tutte le dipendenze, inclusi i dev dependencies
RUN npm install

# Compila il progetto TypeScript
RUN npm run build

# Esegui i test (opzionale, rimuovi se preferisci eseguire i test separatamente)
#RUN npm test <-- eseguiti dalla pipeline ci.yml

# Installa curl e mysql-client se necessario
RUN apk add --no-cache bash curl mysql-client
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh && chown -R node:node /wait-for-it.sh
#RUN chmod +x /wait-for-it.sh

# Crea la directory logs e imposta i permessi
RUN mkdir -p logs && chown -R node:node logs

# Definisce l'utente non root per migliorare la sicurezza
USER node

# Stage 2: Production
FROM node:16-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di dipendenza
COPY package.json package-lock.json ./

# Installa solo le dipendenze di produzione
RUN npm install --only=production

# Copia i file compilati dalla fase di build
COPY --from=build /app/dist ./dist

# Installa curl e mysql-client se necessario
RUN apk add --no-cache bash curl mysql-client
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh && chown -R node:node /wait-for-it.sh

# Crea la directory logs e imposta i permessi
RUN mkdir -p logs && chown -R node:node logs

# Definisce l'utente non root per migliorare la sicurezza
USER node

# Comando per avviare l'applicazione
#CMD ["node", "dist/index.js"]
CMD ["/wait-for-it.sh", "svt-db:3306", "--", "node", "dist/index.js"]
