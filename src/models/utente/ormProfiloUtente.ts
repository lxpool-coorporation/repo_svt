import { ormProfilo } from './ormProfilo';
import { ormUtente } from './ormUtente';

export class ormProfiloUtente extends ormProfilo {
  // Metodi di associazione manuale per la tipizzazione degli utenti
  public addUtente!: (
    utente: ormUtente | ormUtente[],
    options?: any,
  ) => Promise<void>;
  public getUtenti!: (options?: any) => Promise<ormUtente[]>;
  public setUtenti!: (utenti: ormUtente[], options?: any) => Promise<void>;
  public removeUtenti!: (utenti: ormUtente[], options?: any) => Promise<void>;
}
