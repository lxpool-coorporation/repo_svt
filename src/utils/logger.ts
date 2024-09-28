import { appendFileSync, existsSync, mkdirSync } from "fs";
import dotenv from "dotenv";
import path from "path";

// Carica le variabili d'ambiente da un file .env
dotenv.config();

// Funzione per ottenere la data nel formato yyyyMMdd
const getFormattedDate = (): { year: string, month: string, day: string, fullDate: string } => {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const fullDate = `${year}${month}${day}`;
    return { year, month, day, fullDate };
};

// Percorso della directory principale dei file di log dalla variabile d'ambiente o usa un valore di default
const mainLogDirectory = process.env.LOG_DIRECTORY || "./logs";

// Genera il percorso della directory nel formato [yyyy]/[MM]/log_[yyyyMMdd].log
const generateLogFilePath = (): string => {
    const { year, month, fullDate } = getFormattedDate();
    const logDirectoryPath = path.join(mainLogDirectory, year, month);

    if (!existsSync(logDirectoryPath)) {
        mkdirSync(logDirectoryPath, { recursive: true });
    }

    return path.join(logDirectoryPath, `log_${fullDate}.log`);
};

// Percorso completo del file di log
const logFilePath = generateLogFilePath();

// Definizione della modalità di output (file, console, entrambi)
const logOutputMode = process.env.LOG_OUTPUT_MODE || "both";

// Definizione del livello di log corrente
const currentLogLevel: Importance = (process.env.LOG_LEVEL as Importance) || "info";

// Mappa i livelli di log in valori numerici per confrontarli
const logLevelPriority: { [key in Importance]: number } = {
    info: 0,
    warning: 1,
    error: 2
};

// Definizione del tipo per l'importanza del log
type Importance = "info" | "warning" | "error";

// Creazione della classe Logger
class Logger {
    private logLevel: Importance;

    constructor(logLevel: Importance) {
        this.logLevel = logLevel;
    }

    // Funzione per loggare i messaggi
    private log(importance: Importance, message: string) {
        if (logLevelPriority[importance] >= logLevelPriority[this.logLevel]) {
            const date = new Date();
            const logMessage = `${date.getHours()} : ${date.getMinutes()} | ${importance.toUpperCase()} | ${message}\n`;

            // Scrittura su console
            if (logOutputMode === "console" || logOutputMode === "both") {
                console.log(logMessage);
            }

            // Scrittura su file
            if (logOutputMode === "file" || logOutputMode === "both") {
                try {
                    appendFileSync(logFilePath, logMessage, { encoding: 'utf-8' });
                } catch (err) {
                    console.error("Errore durante la scrittura su file:", err);
                }
            }
        }
    }

    // Metodo per log di livello info
    public info(message: string) {
        this.log("info", message);
    }

    // Metodo per log di livello warning
    public warning(message: string) {
        this.log("warning", message);
    }

    // Metodo per log di livello error
    public error(message: string, error?: Error) {
        let errorMessage = message;
        if (error) {
            errorMessage += ` - ${error.message}`;
        }
        this.log("error", errorMessage);
    }
}

// Istanziazione del logger con il livello corrente
const logger = new Logger(currentLogLevel);

export default logger;