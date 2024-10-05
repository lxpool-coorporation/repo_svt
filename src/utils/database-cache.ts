import { createClient } from 'redis';
import logger from './logger-winston';

// Configura Redis usando la stringa di connessione
const redisUrl = `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

class databaseCache {
  private static instance: ReturnType<typeof createClient> | null = null;

  private constructor() {}

  public static async getInstance(): Promise<ReturnType<typeof createClient>> {
    if (!databaseCache.instance) {
      databaseCache.instance = createClient({
        url: redisUrl,
      });

      // Gestione degli errori
      databaseCache.instance.on('error', (err) => {
        logger.error('Redis error: ', err);
      });

      // Connessione a Redis
      try {
        await databaseCache.instance.connect();
        logger.info('Connesso a Redis');
      } catch (err) {
        logger.error('Errore durante la connessione a Redis: ', err);
      }
    }
    return databaseCache.instance;
  }

}

export default databaseCache;
