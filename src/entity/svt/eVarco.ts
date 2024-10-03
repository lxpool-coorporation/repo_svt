import { enumStato } from '../enum/enumStato';

class eVarco {
  //id numerico, Varco, descrizione, id_stato
  private id: number;
  private cod: string;
  private descrizione: string;
  private latitudine: number;
  private longitudine: number;
  private stato: enumStato;

  constructor(
    id: number,
    cod: string,
    descrizione: string,
    latitudine: number,
    longitudine: number,
    stato: enumStato,
  ) {
    this.id = id;
    this.cod = cod;
    this.descrizione = descrizione;
    this.latitudine = latitudine;
    this.longitudine = longitudine;
    this.stato = stato;
  }

  static fromJSON(data: any): eVarco {
    return new eVarco(
      data.id,
      data.cod,
      data.descrizione,
      data.latitudine,
      data.longitudine,
      data.stato,
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
  get_latitudine(): number {
    return this.latitudine;
  }
  get_longitudine(): number {
    return this.longitudine;
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
  set_descrizione(descrizione: string): void {
    this.descrizione = descrizione;
  }
  set_latitudine(latitudine: number): void {
    this.latitudine = latitudine;
  }
  set_longitudine(longitudine: number): void {
    this.longitudine = longitudine;
  }
  set_stato(stato: enumStato): void {
    this.stato = stato;
  }
}

export { eVarco };
