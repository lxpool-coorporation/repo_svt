import { eVistaVarco } from './eVistaVarco';

class eVistaTratta {
  //id numerico, tratta, descrizione, id_stato
  private id: number;
  private cod: string;
  private descrizione: string;
  private varco_ingresso: eVistaVarco;
  private varco_uscita: eVistaVarco;
  private distanza: number;

  constructor(
    id: number,
    cod: string,
    descrizione: string,
    varco_ingresso: eVistaVarco,
    varco_uscita: eVistaVarco,
    distanza: number,
  ) {
    this.id = id;
    this.cod = cod;
    this.descrizione = descrizione;
    this.varco_ingresso = varco_ingresso;
    this.varco_uscita = varco_uscita;
    this.distanza = distanza;
  }

  static fromJSON(data: any): eVistaTratta {
    return new eVistaTratta(
      data.id,
      data.cod,
      data.descrizione,
      data.varco_ingresso,
      data.varco_uscita,
      data.distanza,
    );
  }

  // Metodi Getters
  get_id(): number {
    return this.id;
  }
  get_cod(): string {
    return this.cod;
  }
  get_descrizione(): string {
    return this.descrizione;
  }
  get_varco_ingresso(): eVistaVarco {
    return this.varco_ingresso;
  }
  get_varco_uscita(): eVistaVarco {
    return this.varco_uscita;
  }
  get_distanza(): number {
    return this.distanza;
  }

  // Metodi Setters
  set_id(id: number): void {
    this.id = id;
  }
  set_cod(cod: string): void {
    this.cod = cod;
  }
  set_descrizione(descrizione: string): void {
    this.descrizione = descrizione;
  }
  set_varco_ingresso(varco_ingresso: eVistaVarco): void {
    this.varco_ingresso = varco_ingresso;
  }
  set_varco_uscita(varco_uscita: eVistaVarco): void {
    this.varco_uscita = varco_uscita;
  }
  set_distanza(distanza: number): void {
    this.distanza = distanza;
  }
}

export { eVistaTratta };
