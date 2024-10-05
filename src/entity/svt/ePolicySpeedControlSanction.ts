import { enumStato } from '../enum/enumStato';
import { enumVeicoloTipo } from '../enum/enumVeicoloTipo';

class ePolicySpeedControlSanction {
  //id numerico, PolicySpeedControlSanction, descrizione, id_stato
  private id: number;
  private id_policy: number;
  private veicolo: enumVeicoloTipo;
  private cod: string;
  private descrizione: string;
  private speed_min: number;
  private speed_max: number;
  private costo_min: number;
  private costo_max: number;
  private licenza_punti: number;
  private stato: enumStato;

  constructor(
    id: number,
    id_policy: number,
    veicolo: enumVeicoloTipo,
    cod: string,
    descrizione: string,
    speed_min: number,
    speed_max: number,
    costo_min: number,
    costo_max: number,
    licenza_punti: number,
    stato: enumStato,
  ) {
    this.id = id;
    (this.id_policy = id_policy), (this.veicolo = veicolo), (this.cod = cod);
    (this.descrizione = descrizione),
      (this.speed_min = speed_min),
      (this.speed_max = speed_max),
      (this.costo_min = costo_min),
      (this.costo_max = costo_max),
      (this.licenza_punti = licenza_punti),
      (this.stato = stato);
  }

  static fromJSON(data: any): ePolicySpeedControlSanction {
    return new ePolicySpeedControlSanction(
      data.id,
      data.id_policy,
      data.veicolo,
      data.cod,
      data.descrizione,
      data.speed_min,
      data.speed_max,
      data.costo_min,
      data.costo_max,
      data.licenza_punti,
      data.stato,
    );
  }

  // Metodi Getters
  get_id(): number {
    return this.id;
  }
  get_id_policy() {
    return this.id_policy;
  }
  get_veicolo() {
    return this.veicolo;
  }
  get_cod(): string {
    return this.cod;
  }
  get_descrizione(): string {
    return this.descrizione;
  }
  get_speed_min(): number {
    return this.speed_min;
  }
  get_speed_max(): number {
    return this.speed_max;
  }
  get_costo_min(): number {
    return this.costo_min;
  }
  get_costo_max(): number {
    return this.costo_max;
  }
  get_licenza_punti(): number {
    return this.licenza_punti;
  }
  get_stato(): enumStato {
    return this.stato;
  }

  // Metodi Setters
  set_id(id: number): void {
    this.id = id;
  }
  set_id_policy(id_policy: number): void {
    this.id_policy = id_policy;
  }
  set_veicolo(veicolo: enumVeicoloTipo): void {
    this.veicolo = veicolo;
  }
  set_cod(cod: string): void {
    this.cod = cod;
  }
  set_descrizione(descrizione: string): void {
    this.descrizione = descrizione;
  }
  set_speed_min(speed_min: number): void {
    this.speed_min = speed_min;
  }
  set_speed_max(speed_max: number): void {
    this.speed_max = speed_max;
  }
  set_costo_min(costo_min: number): void {
    this.costo_min = costo_min;
  }
  set_costo_max(costo_max: number): void {
    this.costo_max = costo_max;
  }
  set_licenza_punti(licenza_punti: number): void {
    this.licenza_punti = licenza_punti;
  }
  set_stato(stato: enumStato): void {
    this.stato = stato;
  }
}

export { ePolicySpeedControlSanction };
