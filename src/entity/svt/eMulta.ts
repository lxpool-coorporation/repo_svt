class eMulta {
  //id numerico, Multa, id_policy, id_path_bollettino
  private id: number;
  private id_transito: number | null;
  private id_policy: number | null;
  private speed_delta: number | null;
  private path_bollettino: string | null;

  constructor(
    id: number,
    id_transito: number | null,
    id_policy: number | null,
    speed_delta: number | null,
    path_bollettino: string | null,
  ) {
    this.id = id;
    this.id_transito = id_transito;
    this.id_policy = id_policy;
    this.speed_delta = speed_delta;
    this.path_bollettino = path_bollettino;
  }

  static fromJSON(data: any): eMulta {
    return new eMulta(
      data.id,
      data.id_transito,
      data.id_policy,
      data.speed_delta,
      data.path_bollettino,
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
  get_speed_delta(): number | null {
    return this.speed_delta;
  }
  get_path_bollettino(): string | null {
    return this.path_bollettino;
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
  set_speed_delta(speed_delta: number): void {
    this.speed_delta = speed_delta;
  }
  set_path_bollettino(path_bollettino: string): void {
    this.path_bollettino = path_bollettino;
  }
}

export { eMulta };
