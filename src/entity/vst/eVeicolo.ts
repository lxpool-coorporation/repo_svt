import { enumStato } from '../enum/enumStato';
import { enumVeicoloTipo } from '../enum/enumVeicoloTipo';

class eVeicolo {
  //id numerico, tipo, targa, stato
  private id: number;
  private tipo: enumVeicoloTipo;
  private targa: string;
  private stato: enumStato;

  constructor(
    id: number,
    tipo: enumVeicoloTipo,
    targa: string,
    stato: enumStato,
  ) {
    this.id = id;
    this.tipo = tipo;
    this.targa = targa;
    this.stato = stato;
  }

  static fromJSON(data: any): eVeicolo {
    return new eVeicolo(data.id, data.tipo, data.targa, data.stato);
  }

  // Metodi Getters
  get_id(): number {
    return this.id;
  }
  get_tipo(): enumVeicoloTipo {
    return this.tipo;
  }
  get_targa(): string {
    return this.targa;
  }
  get_stato(): enumStato {
    return this.stato;
  }

  // Metodi Setters
  set_id(id: number): void {
    this.id = id;
  }
  set_tipo(tipo: enumVeicoloTipo): void {
    this.tipo = tipo;
  }
  set_targa(targa: string): void {
    this.targa = targa;
  }
  set_stato(stato: enumStato): void {
    this.stato = stato;
  }
}

export { eVeicolo };
