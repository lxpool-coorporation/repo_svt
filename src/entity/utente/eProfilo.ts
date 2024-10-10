import { enumProfiloTipo } from '../enum/enumProfiloTipo';
import { enumStato } from '../enum/enumStato';

class eProfilo {
  //id numerico, profilo, descrizione, id_stato
  private id: number;
  private cod: string;
  private descrizione: string;
  private enum_profilo: enumProfiloTipo;
  private stato: enumStato;

  constructor(
    id: number,
    cod: string,
    descrizione: string,
    enum_profilo: enumProfiloTipo,
    stato: enumStato,
  ) {
    this.id = id;
    this.cod = cod;
    this.descrizione = descrizione;
    this.enum_profilo = enum_profilo;
    this.stato = stato;
  }

  static fromJSON(data: any): eProfilo {
    return new eProfilo(
      data.id,
      data.cod,
      data.descrizione,
      data.enum_profilo,
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
  get_enum_profilo(): string {
    return this.enum_profilo;
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
  set_enum_profilo(enum_profilo: enumProfiloTipo): void {
    this.enum_profilo = enum_profilo;
  }
  set_stato(stato: enumStato): void {
    this.stato = stato;
  }
}

export { eProfilo };
