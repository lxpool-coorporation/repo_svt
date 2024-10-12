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
- **Bollettino**

## Logica di Business

### Gestione delle Operazioni Asincrone con RabbitMQ

Il sistema utilizza **RabbitMQ** per gestire operazioni asincrone, migliorando l'efficienza e la scalabilità:

- **Elaborazione OCR**: Le immagini dei transiti vengono elaborate in modo asincrono per estrarre la targa.
- **Generazione Documenti**: La creazione di bollettini di pagamento e altri documenti è gestita tramite code.
- **Gestione della Logica di Business**: Operazioni come il calcolo delle infrazioni e l'associazione di dati mancanti vengono gestite in modo asincrono.

### Gestione dei Transiti con Dati Mancanti

- **Transiti tramite Immagine**: Quando un transito viene inserito tramite immagine, il sistema utilizza l'OCR per estrarre la targa. Se il **tipo di veicolo** non è noto, il sistema non può generare multe finché l'operatore non aggiorna i dati.
- **Veicoli senza Automobilista Associato**: Se un veicolo nuovo non ha un automobilista associato, il sistema non può generare il bollettino della multa finché l'operatore non effettua l'associazione.

### Gestione dei Dati Mancanti e Integrazione Futuristica

- Il sistema è predisposto per **interfacciarsi con API esterne** per acquisire dati mancanti come le condizioni meteo e il tipo di veicolo.
- Attualmente, quando vengono rilevate situazioni con dati mancanti, il sistema **inserisce messaggi in code specifiche** per essere aggiornati in seguito dall'operatore o da processi automatici futuri.

### Applicazione del Fattore Meteo

- Il sistema tiene conto delle **condizioni meteo** per determinare il limite di velocità applicabile.
- Il limite più basso viene considerato lungo l'intera tratta.

### Tolleranza sulla Velocità

- È applicata una **tolleranza del 5%** sulla velocità rilevata, con un minimo di 5 km/h.

### Classificazione delle Sanzioni

Le multe sono classificate in base all'entità del superamento del limite:

- **Fino a 10 km/h**: Sanzione amministrativa.
- **Tra 10 km/h e 40 km/h**: Sanzione e decurtazione punti.
- **Tra 40 km/h e 60 km/h**: Sanzione, decurtazione punti e sospensione della patente.
- **Oltre 60 km/h**: Sanzione, decurtazione punti e sospensione della patente.

### Aggravanti

- **Recidiva**: Aumento della sanzione per infrazioni ripetute.
- **Orario Notturno**: Maggiorazione delle multe tra le 22:00 e le 7:00.

## Design Pattern Utilizzati

- **Chain of Responsibility**: Per la gestione modulare delle richieste HTTP.
  - **Implementazione**: Ogni middleware (es. autenticazione, validazione, logging) è strutturato come un "anello" nella catena di responsabilità.
- **Singleton**: Per gestire un'unica istanza delle connessioni a componenti condivisi.
  - **Implementazione**:
    - **DatabaseConnection**: Gestisce la connessione a MySQL attraverso Sequelize.
    - **RedisClient**: Fornisce un'unica connessione a Redis.
    - **RabbitMQConnection**: Gestisce la connessione a RabbitMQ.
    - **Logger**: Utilizza Winston per il logging.
- **Builder**: Per la costruzione di oggetti complessi come `Transito`.
- **Repository**: Per separare la logica di business dall'accesso ai dati.
- **Ereditarietà**: Per estendere funzionalità condivise tra classi correlate.
  - **Implementazione**:
    - **Multa**: Classe base che contiene gli attributi comuni a tutte le multe.
    - **MultaSpeedControl**: Estende `Multa` aggiungendo attributi specifici per le infrazioni di controllo velocità.
    - **Policy**: Classe base per le politiche di infrazione.
    - **PolicySpeedControl**: Estende `Policy` per le politiche specifiche del controllo velocità.
    - **PolicySanction**: Classe base per le sanzioni associate alle politiche.
    - **PolicySanctionSpeedControl**: Estende `PolicySanction` per le sanzioni specifiche del controllo velocità.

## Configurazione Personalizzabile di Permessi e Profili

Il sistema permette di configurare **permessi di lettura o scrittura** sui vari componenti (varchi, transiti, tratte, veicoli, multe, bollettini) e di associarli ai profili utente disponibili (Operatore, Varco, Automobilista), rendendo l'applicazione altamente personalizzabile e adattabile a diverse esigenze.

## Casi d'Uso

### Attori Principali

- **Operatore**
- **Varco**
- **Automobilista**

### Casi d'Uso per l'Operatore

1. **Gestione Varchi (CRUD)**
   - Creare, leggere, aggiornare ed eliminare varchi.
2. **Gestione Tratte (CRUD)**
   - Creare, leggere, aggiornare ed eliminare tratte.
3. **Gestione Veicoli (CRUD)**
   - Inserire, leggere, aggiornare ed eliminare veicoli.
4. **Inserimento Transiti**
   - Inserire transiti manualmente o tramite immagine (OCR).
5. **Gestione Transiti (CRUD)**
   - Leggere, aggiornare ed eliminare transiti.
6. **Visualizzazione Transiti Illeggibili**
   - Ottenere la lista dei transiti illeggibili e gestire le correzioni.
7. **Generazione Automatica di Multe**
   - Il sistema genera automaticamente multe per superamento della velocità media.
8. **Ricerca Multe**
   - Ottenere le multe associate a una o più targhe.
9. **Scaricamento Bollettino di Pagamento**
   - Scaricare il PDF del bollettino con QR-code per il pagamento.

### Casi d'Uso per il Varco

1. **Inserimento Transiti**
   - Inserire transiti fornendo dati via JSON o tramite immagine (OCR).

### Casi d'Uso per l'Automobilista

1. **Visualizzazione Multe**
   - Ottenere le multe associate ai propri veicoli.
2. **Scaricamento Bollettino di Pagamento**
   - Scaricare il PDF del bollettino con QR-code per il pagamento.

### Casi d'Uso Comuni

1. **Autenticazione (JWT)**
   - Login per ottenere un token JWT per le rotte protette.

## Enums Utilizzati

Gli Enums sono stati creati come elementi stabili del progetto per rappresentare valori costanti e predefiniti:

- **enumBollettinoStato**: richiesto, emesso, pagato
- **enumExportFormato**: json
- **enumMeteoTipo**: sereno, pioggia.
- **enumMultaStato**: indefinito, in_attesa, elaborata.
- **enumPermessoCategoria**: varco, transito, tratta, veicolo, multa, bollettino.
- **enumPermessoTipo**: lettura, scrittura.
- **enumPolicyTipo**: speed_control.
- **enumProfiloTipo**: operatore, automobilista, varco.
- **enumStato**: attivo, disattivo.
- **enumTransitoStato**: in_attesa, acquisito, elaborato.
- **enumVeicoloStato**: in_attesa, acquisito.
- **enumVeicoloTipo**: automobile, motoveicoli, camion, indefinito.

## Documentazione

### Schema del Database

- [DB Schema]

### Diagramma dei Casi d'Uso

- [Diagramma dei Casi d'Uso](documentazione/UML/UML_UC_useCases.png)

### Diagrammi delle Sequenze

1. **Gestione Varchi (CRUD)**
   - [Creare, leggere, aggiornare ed eliminare varchi](documentazione/UML/Diagrammi_Sequenza/008_generic_CRUD.png)
2. **Gestione Tratte (CRUD)**
   - (Creare, leggere, aggiornare ed eliminare tratte](documentazione/UML/Diagrammi_Sequenza/008_generic_CRUD.png)
3. **Gestione Veicoli (CRUD)**
   - [Inserire, leggere, aggiornare ed eliminare veicoli](documentazione/UML/Diagrammi_Sequenza/008_generic_CRUD.png)
4. **Inserimento Transiti**
   - [Inserire transiti manualmente o tramite immagine (OCR)](documentazione/UML/Diagrammi_Sequenza/001_inserimento_transito.png)
5. **Gestione Transiti (CRUD)**
   - [Leggere, aggiornare ed eliminare transiti](documentazione/UML/Diagrammi_Sequenza/005_aggiornamento_transito_illeggibile.png)
6. **Visualizzazione Transiti Illeggibili**
   - [Ottenere la lista dei transiti illeggibili e gestire le correzioni](documentazione/UML/Diagrammi_Sequenza/004_visualizzazione_transiti_illeggibili.png)
7. **Generazione Automatica di Multe**
   - [Il sistema genera automaticamente multe per superamento della velocità media](documentazione/UML/Diagrammi_Sequenza/003_generazione_automatica_multa.png)
8. **Ricerca Multe**
   - [Ottenere le multe associate a una o più targhe](documentazione/UML/Diagrammi_Sequenza/006_ricerca_multe.png)
9. **Scaricamento Bollettino di Pagamento**
   - [Scaricare il PDF del bollettino con QR-code per il pagamento](documentazione/UML/Diagrammi_Sequenza/007_download_bollettino.png)

## Test del Progetto

### Utilizzo di Postman
È stata fornita una collection di Postman per testare le API del progetto. La collection include richieste per:

  - Autenticazione e generazione del token JWT.
  - Gestione di varchi, tratte, veicoli, transiti e multe.
  - Esempi di inserimento transiti con immagini per l'OCR.

### Importare la Collection
  - Aprire Postman.
  - Cliccare su Import.
  - Selezionare il file [repo_svt_env.postman_environment.json](postman/repo_svt_env.postman_environment.json) per caricare le variabili preset.
  - Selezionare il file [repo_svt_env.postman_collection.json](postman/repo_svt_env.postman_collection.json) per caricare la collezione.

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
Nella cartella **"documentazione/esempi_target/"** sono presenti immagini di esempio per testare l'inserimento di transiti tramite OCR. Queste immagini contengono targhe simulate per consentire la verifica del riconoscimento tramite Tesseract OCR.

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
IMAGE_PATH='/app/repository/images'
IMAGE_FILE='./app/repository/docs'
IMAGE_TYPE='/jpeg|jpg|png/'


```
  
Avvio con Docker Compose
Lo stack è composto da tre diversi componenti docker-compose che vanno avviati nel seguente ordine:

   - **docker-compose_env.yml**
     - necessario per avviare i conteiner di servizio mysql/redis/rabbitmq
     - comando: docker compose -f docker-compose_env.yml up --build
   - **docker-compose_dbi.yml**  
     - necessario per effettuare le migrazioni e i seed (da avviare solo per startup dell'applicativo)
     - comando: docker compose -f docker-compose_dbi.yml up --build
   - **docker-compose_app.yml**
     - necessario per avviare l'app principale
     - comando: docker compose -f docker-compose_app.yml up --build


L'applicazione sarà disponibile su http://localhost:3000.


### Licenza
Questo progetto è distribuito sotto la licenza MIT. Vedi il file LICENSE per maggiori dettagli.

### Contatti
lxpool86@gmail.com
