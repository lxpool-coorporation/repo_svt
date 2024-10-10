import { enumBollettinoStato } from '../enum/enumBollettinoStato';

class eBollettino {
  //id numerico, Policy, uuid, id_stato
  private id: number;
  private id_multa: number;
  private uuid: string;
  private importo: number;
  private path_bollettino: string | null;
  private stato: enumBollettinoStato;

  constructor(
    id: number,
    id_multa: number,
    uuid: string,
    importo: number,
    path_bollettino: string | null,
    stato: enumBollettinoStato,
  ) {
    this.id = id;
    this.id_multa = id_multa;
    this.uuid = uuid;
    this.importo = importo;
    this.path_bollettino = path_bollettino;
    this.stato = stato;
  }

  static fromJSON(data: any): eBollettino {
    return new eBollettino(
      data.id,
      data.id_multa,
      data.uuid,
      data.importo,
      data.path_bollettino,
      data.stato,
    );
  }

  // Metodi Getters
  get_id(): number {
    return this.id;
  }
  get_id_multa(): number {
    return this.id_multa;
  }
  get_uuid(): string {
    return this.uuid;
  }
  get_importo(): number {
    return this.importo;
  }
  get_path_bollettino(): string | null {
    return this.path_bollettino;
  }
  get_stato(): enumBollettinoStato | null {
    return this.stato;
  }

  // Metodi Setters
  set_id(id: number): void {
    this.id = id;
  }
  set_id_multa(id_multa: number): void {
    this.id_multa = id_multa;
  }
  set_uuid(uuid: string): void {
    this.uuid = uuid;
  }
  set_importo(importo: number): void {
    this.importo = importo;
  }
  set_path_bollettino(path_bollettino: string | null) {
    this.path_bollettino = path_bollettino;
  }
  set_stato(stato: enumBollettinoStato): void {
    this.stato = stato;
  }
}

export { eBollettino };
