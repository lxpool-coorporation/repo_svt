import { ormProfilo } from './ormProfilo';
import { ormPermesso } from './ormPermesso';

export class ormPermessoProfilo extends ormPermesso {
  // Metodi di associazione manuale per la tipizzazione
  public addProfili!: (
    profilo: ormProfilo | ormProfilo[],
    options?: any,
  ) => Promise<void>;
  public getProfili!: (options?: any) => Promise<ormProfilo[]>;
  public setProfili!: (profili: ormProfilo[], options?: any) => Promise<void>;
  public removeProfili!: (
    profili: ormProfilo[],
    options?: any,
  ) => Promise<void>;
}
