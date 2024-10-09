class eVistaVarco {
  //id numerico, Varco, descrizione, id_stato
  private id: number;
  private cod: string;
  private descrizione: string;

  constructor(id: number, cod: string, descrizione: string) {
    this.id = id;
    this.cod = cod;
    this.descrizione = descrizione;
  }

  static fromJSON(data: any): eVistaVarco {
    return new eVistaVarco(data.id, data.cod, data.descrizione);
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
}

export { eVistaVarco };
