# Project SVT - Speed Violation Tracker

## Obiettivo del Progetto
Realizzazione di un progetto per il monitoraggio e la gestione di infrazioni di velocità dei veicoli su tratte autostradali.

Attraverso l'utilizzo di varchi autostradali geolocalizzati, muniti di strumenti per il tracciamento delle targhe dei veicoli, il sistema permetterà la memorizzazione dei transiti su base data/ora - targa oltre che dell'immagine del veicolo immortalata al momento del passaggio, salvando anche le informazioni relative alle condizioni meteorologiche, per permettere il calcolo delle infrazioni in relazione ai limiti di velocità presenti al momento del passaggio.

Il sistema consente di:

- Gestire veicoli con limiti di velocità differenti.
- Modellare varchi con posizioni geografiche note.
- Inserire transiti con data, ora e targa del veicolo su una tratta autostradale.
- Gestire le condizioni meteorologiche al momento del transito.
- Generare automaticamente multe per superamento della velocità media tra varchi.
- Configurare permessi di accesso personalizzati per profili utente, rendendo il sistema flessibile.

## Architettura del Sistema
Il progetto è strutturato seguendo un'architettura a livelli che comprende:

- **API Routes**: Gestione delle rotte e middleware.
- **Controller**: Gestione delle richieste HTTP e delle risposte.
- **Service**: Contiene la logica di business dell'applicazione.
- **Repository**: Interfaccia tra i servizi e i DAO.
- **DAO (Data Access Object)**: Gestione delle operazioni CRUD.
- **ORM (Sequelize)**: Mappatura degli oggetti sul database.
- **Database**: MySQL per la persistenza dei dati.

## Componenti Implementati
Sono stati implementati i seguenti componenti, riflettendo la struttura su tutti gli strati dell'applicazione:

- **Utente/Profilo/Permessi**: Gestione utenti, profili e permessi.
- **Varco**
- **Tratta**
- **Veicolo**
- **Transito**
- **Policy**
- **Sanzioni**
- **Multa**

## Logica di Business

### Applicazione del Fattore Meteo
Il sistema tiene conto delle condizioni meteo per determinare il limite di velocità applicabile. Il limite più basso viene considerato lungo l'intera tratta.

### Tolleranza sulla Velocità
È applicata una tolleranza del 5% sulla velocità rilevata, con un minimo di 5 km/h.

### Classificazione delle Sanzioni
Le multe sono classificate in base all'entità del superamento del limite:

- **Fino a 10 km/h**: Sanzione amministrativa.
- **Tra 10 km/h e 40 km/h**: Sanzione e decurtazione punti.
- **Tra 40 km/h e 60 km/h**: Sanzione, decurtazione punti e sospensione della patente.
- **Oltre 60 km/h**: Sanzione, decurtazione punti e sospensione della patente.

### Aggravanti
- **Recidiva**: Aumento della sanzione per infrazioni ripetute.
- **Orario Notturno**: Maggiorazione delle multe tra le 22:00 e le 7:00.

### Riconoscimento del Tipo di Veicolo
Il sistema riconosce il tipo di veicolo in base alla targa, applicando limiti di velocità appropriati.

## Design Pattern Utilizzati
- **Chain of Responsibility**: Per la gestione modulare delle richieste HTTP.
  - **Implementazione**: Ogni middleware (es. autenticazione, validazione, logging) è strutturato come un "anello" nella catena di responsabilità.
- **Singleton**: Per gestire un'unica istanza delle connessioni a componenti condivisi come il database e Redis.
   - Implementazione:
     - DatabaseConnection: Gestisce la connessione a MySQL attraverso Sequelize.
     - RedisClient: Fornisce un'unica connessione a Redis.
     - RabbitMQConnection: Gestisce la connessione a RabbitMQ.
     - Logger: Utilizza Winston per il logging.
- **Builder**: Per la costruzione di oggetti complessi come `Transito`.
- **Repository**: Per separare la logica di business dall'accesso ai dati.
- **Ereditarietà**: Per estendere funzionalità condivise tra classi correlate.
  - Implementazione:
      - Multa: Classe base che contiene gli attributi comuni a tutte le multe.
      - MultaSpeedControl: Estende Multa aggiungendo attributi specifici per le infrazioni di controllo velocità.
      - Policy: Classe base per le politiche di infrazione.
      - PolicySpeedControl: Estende Policy per le politiche specifiche del controllo velocità.
      - PolicySanction: Classe base per le sanzioni associate alle politiche.
      - PolicySanctionSpeedControl: Estende PolicySanction per le sanzioni specifiche del controllo velocità.

## Configurazione Personalizzabile di Permessi e Profili
Il sistema permette di configurare permessi di lettura o scrittura sui vari componenti (varchi, transiti, tratte, veicoli, multe, bollettini) e di associarli ai profili utente disponibili (Operatore, Varco, Automobilista), rendendo l'applicazione altamente personalizzabile e adattabile a diverse esigenze.

## Enums Utilizzati
Gli Enums sono stati creati come elementi stabili del progetto per rappresentare valori costanti e predefiniti:

- **enumMeteoTipo**: sereno, pioggia.

- **enumMultaStato**: in attesa, elaborata.

- **enumPermessoCategoria**: varco, transito, tratta, veicolo,  multa, bollettino.

- **enumPermessoTipo**: lettura, scrittura.

- **enumPolicyTipo**: speed_control.

- **enumStato attivo**:  disattivo.

- **enumTransitoStato**: in_attesa, acquisito, elaborato.

- **enumVeicoloTipo**: autoveicoli, motoveicoli, camion.

## Documentazione

Nella cartella "documentazione" è presente la parte inerente gli schemi di progetto:
### Schema del database:
![DB Schema](./images/DB_schema.png)
### Diagramma dei casi d'uso:
![Diagramma dei Casi d'Uso](./images/UML_UC_useCases.png)
### Diagrammi delle sequenze:
![Autenticazione JWT](./images/UML_DS_autenticazione_jwt.png)
![Ricerca multe](./images/UML_DS_ricerca_multe.png)

## Test del Progetto

### Utilizzo di Postman
È stata fornita una collection di Postman per testare le API del progetto. La collection include richieste per:

  - Autenticazione e generazione del token JWT.
  - Gestione di varchi, tratte, veicoli, transiti e multe.
  - Esempi di inserimento transiti con immagini per l'OCR.

### Importare la Collection
  - Aprire Postman.
  - Cliccare su Import.
  - Selezionare il file TutorAutostradale.postman_collection.json presente nella cartella postman.

### Eseguire i Test
  - Assicurarsi che l'applicazione sia in esecuzione.
  - Aggiornare le variabili di ambiente nella collection se necessario (es. token JWT, URL di base).
  - Eseguire le richieste nella sequenza suggerita o secondo le necessità.

## Esecuzione di Test Automatici con Newman
È possibile eseguire i test della collection tramite Newman:

```bash
newman run postman/svt-app.postman_collection.json
```
## Immagini di Esempio
Nella cartella images sono presenti immagini di esempio per testare l'inserimento di transiti tramite OCR. Queste immagini contengono targhe simulate per consentire la verifica del riconoscimento tramite Tesseract OCR.

## Avvio del Progetto

### Prerequisiti
- Docker e Docker Compose installati.
- Node.js v14+ e npm (opzionale se si desidera eseguire l'applicazione senza Docker).

### Configurazione

#### Esempio di File `.env`
Creare un file `.env` nella root del progetto con le seguenti variabili d'ambiente di esempio:

```bash
# Ambiente
NODE_ENV=development
APP_ENV=development

# Configurazione Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=svt-user
DB_PASS=svt-password
DB_NAME=svt-db

# Configurazione Log
LOG_DIRECTORY=./logs/
LOG_LEVEL=info
LOG_OUTPUT_MODE=console

# Configurazione Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_CACHE_TIMEOUT=3600

# Configurazione MySQL
MYSQL_DATABASE=svt-db
MYSQL_USER=svt-user
MYSQL_PASSWORD=svt-password
MYSQL_ROOT_PASSWORD=svt-root-password

# Configurazione RabbitMQ
RABBITMQ_URL=amqp://localhost
RABBITMQ_QUEUE=svt-queue

# Altre configurazioni
SERVER_PORT=3000
JWT_PRIVATE_KEY=.keys/jwtRS256.key
JWT_PUBLIC_KEY=.keys/jwtRS256.key.pub
JWT_TOKEN_EXPIRED=1h

```

Il progetto include un file docker-compose.yml che configura l'applicazione e i servizi associati (MySQL, Redis, RabbitMQ). 

```bash
services:
  app:
    build: .
    command: ["/wait-for-it.sh", "svt-db:3306", "--", "node", "dist/index.js"]
    volumes:
      - ./dist:/usr/src/app/dist/
      - ./.keys/:/app/.keys/
    ports:
      - "3000:3000"
    environment:
      - APP_ENV=${APP_ENV}
      - NODE_ENV=${NODE_ENV}
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
      - DB_NAME=${DB_NAME}
      - LOG_DIRECTORY=${LOG_DIRECTORY}
      - LOG_LEVEL=${LOG_LEVEL}
      - LOG_OUTPUT_MODE=${LOG_OUTPUT_MODE}
      - REDIS_HOST=${REDIS_HOST}
      - REDIS_PORT=${REDIS_PORT}
      - REDIS_CACHE_TIMEOUT=${REDIS_CACHE_TIMEOUT}
      - SERVER_PORT=${SERVER_PORT}
      - JWT_PRIVATE_KEY=${JWT_PRIVATE_KEY}
      - JWT_PUBLIC_KEY=${JWT_PUBLIC_KEY}
      - JWT_TOKEN_EXPIRED=${JWT_TOKEN_EXPIRED}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
    depends_on:
      - svt-db
      - svt-redis_cache
      - svt-rabbitmq
    networks:
      - app_network

  svt-db:
    image: mysql:8.0
    container_name: svt-db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app_network

  svt-redis_cache:
    image: "redis:latest"
    container_name: svt-redis_cache
    ports:
      - "6379:6379"
    networks:
      - app_network

  svt-rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    networks:
      - app_network

networks:
  app_network:
    driver: bridge

volumes:
  db_data:
```
  
Avvio con Docker Compose
Avviare i servizi:
```bash
docker-compose up -d
```
Verificare lo stato dei container:
```bash
docker-compose ps
```
Accedere al container dell'applicazione:
```bash
docker-compose exec app sh
```
Preparazione della base dati:
```bash
npx sequelize db:migrate
npx sequelize db:seed:all
```

Avvio Manuale (senza Docker)
```bash
Installare le dipendenze:
npm install
```
Avviare i servizi di MySQL, Redis e RabbitMQ manualmente.

Avviare l'applicazione:
```bash
npm run start
```
L'applicazione sarà disponibile su http://localhost:3000.


### Licenza
Questo progetto è distribuito sotto la licenza MIT. Vedi il file LICENSE per maggiori dettagli.

### Contatti
lxpool86@gmail.com
