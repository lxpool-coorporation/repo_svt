import { enumStato } from '../enum/enumStato';

class eTratta {
  //id numerico, tratta, descrizione, id_stato
  private id: number;
  private cod: string;
  private descrizione: string;
  private id_varco_ingresso: number;
  private id_varco_uscita: number;
  private distanza: number;
  private stato: enumStato;

  constructor(
    id: number,
    cod: string,
    descrizione: string,
    id_varco_ingresso: number,
    id_varco_uscita: number,
    distanza: number,
    stato: enumStato,
  ) {
    this.id = id;
    this.cod = cod;
    this.descrizione = descrizione;
    this.id_varco_ingresso = id_varco_ingresso;
    this.id_varco_uscita = id_varco_uscita;
    this.distanza = distanza;
    this.stato = stato;
  }

  static fromJSON(data: any): eTratta {
    return new eTratta(
      data.id,
      data.cod,
      data.descrizione,
      data.id_varco_ingresso,
      data.id_varco_uscita,
      data.distanza,
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
  get_id_varco_ingresso(): number {
    return this.id_varco_ingresso;
  }
  get_id_varco_uscita(): number {
    return this.id_varco_uscita;
  }
  get_distanza(): number {
    return this.distanza;
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
  set_id_varco_ingresso(id_varco_ingresso: number): void {
    this.id_varco_ingresso = id_varco_ingresso;
  }
  set_id_varco_uscita(id_varco_uscita: number): void {
    this.id_varco_uscita = id_varco_uscita;
  }
  set_distanza(distanza: number): void{
    this.distanza = distanza;
  }
  set_stato(stato: enumStato): void {
    this.stato = stato;
  }
}

export { eTratta };
