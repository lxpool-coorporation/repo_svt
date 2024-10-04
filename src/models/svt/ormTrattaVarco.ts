import { ormTratta } from './ormTratta';
import { ormVarco } from './ormVarco';

export class ormTrattaVarco extends ormTratta {
  // Metodi di associazione manuale per la tipizzazione degli utenti

  public getVarchi!: (options?: any) => Promise<ormVarco[]>;
}
