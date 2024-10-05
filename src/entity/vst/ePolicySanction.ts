import { enumPolicyTipo } from '../enum/enumPolicyTipo';
import { enumStato } from '../enum/enumStato';

class ePolicySanction {
  //id numerico, PolicySanction, descrizione, id_stato
  private id: number;
  private tipo_policy: enumPolicyTipo | null;
  private cod: string | null;
  private descrizione: string | null;
  private costo_min: number | null;
  private costo_max: number | null;
  private costo_punti_patente: number | null;
  private stato: enumStato | null;

  constructor(
    id: number,
    tipo_policy: enumPolicyTipo | null,
    cod: string | null,
    descrizione: string | null,
    costo_min: number | null,
    costo_max: number | null,
    costo_punti_patente: number | null,
    stato: enumStato | null,
  ) {
    this.id = id;
    this.tipo_policy = tipo_policy;
    this.cod = cod;
    this.descrizione = descrizione;
    this.costo_min = costo_min;
    this.costo_max = costo_max;
    this.costo_punti_patente = costo_punti_patente;
    this.stato = stato;
  }

  static fromJSON(data: any): ePolicySanction {
    return new ePolicySanction(
      data.id,
      data.tipo_policy,
      data.cod,
      data.descrizione,
      data.costo_min,
      data.costo_max,
      data.costo_punti_patente,
      data.stato,
    );
  }

  // Metodi Getters
  get_id(): number {
    return this.id;
  }
  get_tipo_policy(): enumPolicyTipo | null {
    return this.tipo_policy;
  }
  get_cod(): string | null {
    return this.cod;
  }
  get_descrizione(): string | null {
    return this.descrizione;
  }
  get_costo_min(): number | null {
    return this.costo_min;
  }
  get_costo_max(): number | null {
    return this.costo_max;
  }
  get_costo_punti_patente(): number | null {
    return this.costo_punti_patente;
  }
  get_stato(): enumStato | null {
    return this.stato;
  }

  // Metodi Setters
  set_id(id: number): void {
    this.id = id;
  }
  set_tipo_policy(tipo_policy: enumPolicyTipo): void {
    this.tipo_policy = tipo_policy;
  }
  set_cod(cod: string): void {
    this.cod = cod;
  }
  set_descrizione(descrizione: string): void {
    this.descrizione = descrizione;
  }
  set_costo_min(costo_min: number): void {
    this.costo_min = costo_min;
  }
  set_costo_max(costo_max: number): void {
    this.costo_max = costo_max;
  }
  set_costo_punti_patente(costo_punti_patente: number): void {
    this.costo_punti_patente = costo_punti_patente;
  }
  set_stato(stato: enumStato): void {
    this.stato = stato;
  }
}

export { ePolicySanction };
