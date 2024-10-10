import { enumMultaStato } from '../enum/enumMultaStato';
import { enumPolicyTipo } from '../enum/enumPolicyTipo';
import { eMulta } from './eMulta';

class eMultaSpeedControl extends eMulta {
  private speed: number;
  private speed_real: number;
  private speed_limit: number;
  private speed_delta: number;

  constructor(
    id: number,
    id_transito: number | null,
    id_policy: number | null,
    id_policy_type: enumPolicyTipo | null,
    id_automobilista: number | null,
    is_notturno: boolean | null,
    is_recidivo: boolean | null,
    stato: enumMultaStato | null,
    speed: number,
    speed_real: number,
    speed_limit: number,
    speed_delta: number,
  ) {
    super(
      id,
      id_transito,
      id_policy,
      id_policy_type,
      id_automobilista,
      is_notturno,
      is_recidivo,
      stato,
    );
    this.speed = speed;
    this.speed_real = speed_real;
    this.speed_limit = speed_limit;
    this.speed_delta = speed_delta;
  }

  static fromJSON(data: any): eMultaSpeedControl {
    return new eMultaSpeedControl(
      data.id,
      data.id_transito,
      data.id_policy,
      data.id_policy_type,
      data.id_automobilista,
      data.speed,
      data.speed_real,
      data.speed_limit,
      data.speed_delta,
      data.is_notturno,
      data.is_recidivo,
      data.stato,
    );
  }

  get_speed(): number {
    return this.speed;
  }
  get_speed_real(): number {
    return this.speed_real;
  }
  get_speed_limit(): number {
    return this.speed_limit;
  }
  get_speed_delta(): number {
    return this.speed_delta;
  }

  set_speed(speed: number): void {
    this.speed = speed;
  }
  set_speed_real(speed_real: number): void {
    this.speed_real = speed_real;
  }
  set_speed_limit(speed_limit: number): void {
    this.speed_limit = speed_limit;
  }
  set_speed_delta(speed_delta: number): void {
    this.speed_delta = speed_delta;
  }
}

export { eMultaSpeedControl };
