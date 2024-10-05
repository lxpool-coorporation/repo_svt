// ePolicySanctionSpeedControl.ts
import { enumStato } from '../enum/enumStato';
import { ePolicySanction } from './ePolicySanction';
import { enumPolicyTipo } from '../enum/enumPolicyTipo';

export class ePolicySanctionSpeedControl extends ePolicySanction {
  private speed_min: number;
  private speed_max: number;

  constructor(
    id: number,
    tipo: enumPolicyTipo | null,
    cod: string | null,
    descrizione: string | null,
    costo_min: number | null,
    costo_max: number | null,
    costo_punti_patente: number | null,
    stato: enumStato | null,
    speed_min: number,
    speed_max: number,
  ) {
    super(
      id,
      tipo,
      cod,
      descrizione,
      costo_min,
      costo_max,
      costo_punti_patente,
      stato,
    );
    this.speed_min = speed_min;
    this.speed_max = speed_max;
  }

  static fromJSON(data: any): ePolicySanctionSpeedControl {
    return new ePolicySanctionSpeedControl(
      data.id,
      data.tipo,
      data.cod,
      data.descrizione,
      data.costo_min,
      data.costo_max,
      data.costo_punti_patente,
      data.stato,
      data.speed_min,
      data.speed_max,
    );
  }

  // Metodi Getters
  get_speed_min(): number {
    return this.speed_min;
  }
  get_speed_max(): number {
    return this.speed_max;
  }

  // Metodi Setters
  set_speed_min(speed_min: number): void {
    this.speed_min = speed_min;
  }
  set_speed_max(speed_max: number): void {
    this.speed_max = speed_max;
  }
}
