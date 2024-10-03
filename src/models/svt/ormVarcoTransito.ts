import { ormVarco } from './ormVarco';
import { ormTransito } from './ormTransito';

export class ormVarcoTransito extends ormVarco {
  // Metodi di associazione manuale per la tipizzazione degli Transiti
  public addTransito!: (
    Transito: ormTransito | ormTransito[],
    options?: any,
  ) => Promise<void>;
  public getTransiti!: (options?: any) => Promise<ormTransito[]>;
  public setTransiti!: (
    Transiti: ormTransito[],
    options?: any,
  ) => Promise<void>;
  public removeTransiti!: (
    Transiti: ormTransito[],
    options?: any,
  ) => Promise<void>;
}
