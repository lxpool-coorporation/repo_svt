#!/bin/bash

set -e  # Ferma lo script in caso di errori

# Controlla se il file .migrated esiste
if [ ! -f /usr/app/.migrated ]; then
  echo "Eseguo le migrazioni e il seeding del database..."

  # Attendi che il database sia pronto
  /wait-for-it.sh svt-db:3306 --timeout=60 --strict -- echo "Database è pronto"

  # Esegui le migrazioni
  npm run migrate

  # Esegui il seed (opzionale)
  npm run seed

  # Crea un file di flag per indicare che le migrazioni sono state eseguite
  touch /usr/app/.migrated

  echo "Migrazioni completate."
else
  echo "Migrazioni già eseguite. Saltando."
fi

# Avvia l'applicazione
npm start