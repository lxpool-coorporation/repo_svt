import { enumPermessoCategoria } from '../enum/enumPermessoCategoria';
import { enumPermessoTipo } from '../enum/enumPermessoTipo';
import { enumStato } from '../enum/enumStato';

class ePermesso {
  //id numerico, profilo, descrizione, id_stato
  private id: number;
  private categoria: enumPermessoCategoria;
  private tipo: enumPermessoTipo;
  private cod: string;
  private descrizione: string;
  private stato: enumStato;

  constructor(
    id: number,
    categoria: enumPermessoCategoria,
    tipo: enumPermessoTipo,
    cod: string,
    descrizione: string,
    stato: enumStato,
  ) {
    this.id = id;
    this.categoria = categoria;
    this.tipo = tipo;
    this.cod = cod;
    this.descrizione = descrizione;
    this.stato = stato;
  }

  static fromJSON(data: any): ePermesso {
    return new ePermesso(
      data.id,
      data.categoria,
      data.tipo,
      data.cod,
      data.descrizione,
      data.stato,
    );
  }

  // Metodi Getters
  get_id(): number {
    return this.id;
  }
  get_categoria(): enumPermessoCategoria {
    return this.categoria;
  }
  get_tipo(): enumPermessoTipo {
    return this.tipo;
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
  set_categoria(categoria: enumPermessoCategoria) {
    this.categoria = categoria;
  }
  set_tipo(tipo: enumPermessoTipo): void {
    this.tipo = tipo;
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

export { ePermesso };
