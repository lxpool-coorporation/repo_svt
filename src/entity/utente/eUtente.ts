import { enumStato } from '../enum/enumStato';

class eUtente {
  //id numerico, profilo, identificativo, id_stato
  private id: number;
  private identificativo!: string;
  private stato: enumStato;

  constructor(id: number, identificativo: string, stato: enumStato) {
    this.id = id;
    this.set_identificativo(identificativo);
    this.stato = stato;
  }

  static fromJSON(data: any): eUtente {
    return new eUtente(data.id, data.identificativo, data.stato);
  }

  // Metodi Getters
  get_id(): number {
    return this.id;
  }
  get_identificativo(): string {
    return this.identificativo;
  }
  get_stato(): enumStato {
    return this.stato;
  }

  // Metodi Setters
  set_id(id: number): void {
    this.id = id;
  }
  set_identificativo(identificativo: string): void {
    this.identificativo = identificativo.toUpperCase();
  }
  set_stato(stato: enumStato): void {
    this.stato = stato;
  }
}

export { eUtente };
