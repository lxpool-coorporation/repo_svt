import { enumStato } from '../enum/enumStato';

class eProfilo {
  //id numerico, profilo, descrizione, id_stato
  private id: number;
  private cod: string;
  private descrizione: string;
  private stato: enumStato;

  constructor(id: number, cod: string, descrizione: string, stato: enumStato) {
    this.id = id;
    this.cod = cod;
    this.descrizione = descrizione;
    this.stato = stato;
  }

  static fromJSON(data: any): eProfilo {
    return new eProfilo(data.id, data.cod, data.descrizione, data.stato);
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
  get_stato(): enumStato {
    return this.stato;
  }

  // Metodi Setters
  set_id(id: number): void {
    this.id = id;
  }
  set_cod(cod: string): void {
    this.cod = cod;
  }
  set_codiceFiscale(descrizione: string): void {
    this.descrizione = descrizione;
  }
  set_stato(stato: enumStato): void {
    this.stato = stato;
  }
}

export { eProfilo };
