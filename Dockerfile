# Usa l'immagine ufficiale di Node.js
FROM node:18-alpine

# Imposta la directory di lavoro nell'interno del container
WORKDIR /usr/

# Copia il file package.json e package-lock.json nella directory di lavoro
COPY package*.json .
COPY .env .

# Installa le dipendenze
RUN npm install

# Installo nodemon per agevolare lo sviluppo dell'applicazione
RUN npm install -g nodemon

# Copia il resto dell'applicazione nella directory di lavoro
#COPY ./dist . --> utilizzo condivisione cartella con file per nodemon

WORKDIR /usr/src/app

# Definisci il comando di avvio dell'applicazione
CMD ["nodemon", "dist/index.js"]
