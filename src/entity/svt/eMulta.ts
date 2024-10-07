import { enumMultaStato } from '../enum/enumMultaStato';
import { enumPolicyTipo } from '../enum/enumPolicyTipo';

class eMulta {
  //id numerico, Multa, id_policy, id_path_bollettino
  private id: number;
  private id_transito: number | null;
  private id_policy: number | null;
  private tipo_policy: enumPolicyTipo | null;
  private id_automobilista: number | null;
  private is_notturno: boolean | null;
  private is_recidivo: boolean | null;
  private path_bollettino: string | null;
  private stato: enumMultaStato | null;

  constructor(
    id: number,
    id_transito: number | null,
    id_policy: number | null,
    tipo_policy: enumPolicyTipo | null,
    id_automobilista: number | null,
    is_notturno: boolean | null,
    is_recidivo: boolean | null,
    path_bollettino: string | null,
    stato: enumMultaStato | null,
  ) {
    this.id = id;
    this.id_transito = id_transito;
    this.id_policy = id_policy;
    (this.tipo_policy = tipo_policy),
      (this.id_automobilista = id_automobilista);
    this.is_notturno = is_notturno;
    this.is_recidivo = is_recidivo;
    this.path_bollettino = path_bollettino;
    this.stato = stato;
  }

  static fromJSON(data: any): eMulta {
    return new eMulta(
      data.id,
      data.id_transito,
      data.id_policy,
      data.tipo_policy,
      data.id_automobilista,
      data.is_notturno,
      data.is_recidivo,
      data.path_bollettino,
      data.stato,
    );
  }

  // Metodi Getters
  get_id(): number {
    return this.id;
  }
  get_id_transito(): number | null {
    return this.id_transito;
  }
  get_id_policy(): number | null {
    return this.id_policy;
  }
  get_tipo_policy(): enumPolicyTipo | null {
    return this.tipo_policy;
  }
  get_id_automobilista(): number | null {
    return this.id_automobilista;
  }
  get_is_notturno(): boolean | null {
    return this.is_notturno;
  }
  get_is_recidivo(): boolean | null {
    return this.is_recidivo;
  }
  get_path_bollettino(): string | null {
    return this.path_bollettino;
  }
  get_stato(): enumMultaStato | null {
    return this.stato;
  }

  // Metodi Setters
  set_id(id: number): void {
    this.id = id;
  }
  set_id_transito(id_transito: number): void {
    this.id_transito = id_transito;
  }
  set_id_policy(id_policy: number): void {
    this.id_policy = id_policy;
  }
  set_tipo_policy(tipo_policy: enumPolicyTipo): void {
    this.tipo_policy = tipo_policy;
  }
  set_id_automobilista(id_automobilista: number): void {
    this.id_automobilista = id_automobilista;
  }
  set_id_notturno(is_notturno: boolean): void {
    this.is_notturno = is_notturno;
  }
  set_is_recidivo(is_recidivo: boolean): void {
    this.is_recidivo = is_recidivo;
  }
  set_path_bollettino(path_bollettino: string): void {
    this.path_bollettino = path_bollettino;
  }
  set_stato(stato: enumMultaStato): void {
    this.stato = stato;
  }
}

export { eMulta };
