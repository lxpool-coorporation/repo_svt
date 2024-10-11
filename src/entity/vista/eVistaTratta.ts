import { enumStato } from '../enum/enumStato';
import { eVarco } from '../svt/eVarco';
import { eVistaTransito } from './eVistaTransito';

class eVistaTratta {
  //id numerico, tratta, descrizione, id_stato
  private id: number;
  private cod: string;
  private descrizione: string;
  private transito_ingresso: eVistaTransito;
  private transito_uscita: eVistaTransito;
  private distanza: number;
  private stato: enumStato;

  constructor(
    id: number,
    cod: string,
    descrizione: string,
    transito_ingresso: eVistaTransito,
    transito_uscita: eVistaTransito,
    distanza: number,
    stato: enumStato,
  ) {
    this.id = id;
    this.cod = cod;
    this.descrizione = descrizione;
    this.transito_ingresso = transito_ingresso;
    this.transito_uscita = transito_uscita;
    this.distanza = distanza;
    this.stato = stato;
  }
}

export { eVistaTratta };
