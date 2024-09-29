// src/__tests__/index.test.ts
import logger from '../utils/logger-winston';

// Mock del logger-winston
jest.mock('../utils/logger-winston', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

describe('Index', () => {
  beforeAll(() => {
    // Importa il file che vuoi testare dopo aver mockato il logger
    // Questo assicura che il mock sia applicato prima dell'esecuzione del codice
    require('../index');
  });

  it('should log "app started" on startup', () => {
    const infoMock = logger.info as jest.Mock;
    expect(infoMock).toHaveBeenCalledWith('app started');
  });
});
