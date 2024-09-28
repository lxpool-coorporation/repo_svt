import { createLogger, format, transports } from "winston";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

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

    if (!fs.existsSync(logDirectoryPath)) {
        fs.mkdirSync(logDirectoryPath, { recursive: true });
    }

    return path.join(logDirectoryPath, `log_${fullDate}.log`);
};

// Definizione della modalità di output (file, console, entrambi)
const logOutputMode = process.env.LOG_OUTPUT_MODE || "both";

// Definizione del livello di log corrente
const currentLogLevel = process.env.LOG_LEVEL || "info";

// Configura il logger di Winston
const logger = createLogger({
    level: currentLogLevel,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `${timestamp} | ${level.toUpperCase()} | ${message}`)
    ),
    transports: [
        // Scrittura su file
        ...(logOutputMode === "file" || logOutputMode === "both"
            ? [new transports.File({ filename: generateLogFilePath(), handleExceptions: true })]
            : []),
        // Scrittura su console
        ...(logOutputMode === "console" || logOutputMode === "both"
            ? [new transports.Console({ handleExceptions: true })]
            : []),
    ],
    exitOnError: false, // Non fermare l'esecuzione dell'applicazione in caso di errori
});

// Esportazione del logger
export default logger;
