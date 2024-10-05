import { enumStato } from '../enum/enumStato';
import { enumPolicyTipo } from '../enum/enumPolicyTipo';

class ePolicy {
  //id numerico, Policy, descrizione, id_stato
  private id: number;
  private cod: string | null;
  private descrizione: string | null;
  private tipo: enumPolicyTipo | null;
  private stato: enumStato | null;

  constructor(
    id: number,
    cod: string | null,
    descrizione: string | null,
    tipo: enumPolicyTipo | null,
    stato: enumStato | null,
  ) {
    this.id = id;
    this.cod = cod;
    this.descrizione = descrizione;
    this.tipo = tipo;
    this.stato = stato;
  }

  static fromJSON(data: any): ePolicy {
    return new ePolicy(
      data.id,
      data.cod,
      data.descrizione,
      data.tipo,
      data.stato,
    );
  }

  // Metodi Getters
  get_id(): number {
    return this.id;
  }
  get_cod(): string | null {
    return this.cod;
  }
  get_descrizione(): string | null {
    return this.descrizione;
  }
  get_tipo(): enumPolicyTipo | null {
    return this.tipo;
  }
  get_stato(): enumStato | null {
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
  set_tipo(tipo: enumPolicyTipo): void {
    this.tipo = tipo;
  }
  set_stato(stato: enumStato): void {
    this.stato = stato;
  }
}

export { ePolicy };
