import { enumVeicoloTipo } from '../enum/enumVeicoloTipo';

class eVistaVeicolo {
  //id numerico, tipo, targa, stato
  private id: number;
  private tipo: enumVeicoloTipo;
  private targa: string;

  constructor(id: number, tipo: enumVeicoloTipo, targa: string) {
    this.id = id;
    this.tipo = tipo;
    this.targa = targa;
  }

  static fromJSON(data: any): eVistaVeicolo {
    return new eVistaVeicolo(data.id, data.tipo, data.targa);
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
}

export { eVistaVeicolo };
