// ePolicySpeedControl.ts
import { enumPolicyTipo } from '../enum/enumPolicyTipo';
import { ePolicy } from './ePolicy';
import { enumStato } from '../enum/enumStato';
import { enumMeteoTipo } from '../enum/enumMeteoTipo';
import { enumVeicoloTipo } from '../enum/enumVeicoloTipo';

export class ePolicySpeedControl extends ePolicy {
  private meteo: enumMeteoTipo;
  private veicolo: enumVeicoloTipo;
  private speed_limit: number;

  constructor(
    id: number,
    cod: string,
    descrizione: string,
    tipo: enumPolicyTipo,
    stato: enumStato,
    meteo: enumMeteoTipo,
    veicolo: enumVeicoloTipo,
    speed_limit: number,
  ) {
    super(id, cod, descrizione, tipo, stato);
    this.meteo = meteo;
    this.veicolo = veicolo;
    this.speed_limit = speed_limit;
  }

  static fromJSON(data: any): ePolicySpeedControl {
    return new ePolicySpeedControl(
      data.id,
      data.cod,
      data.descrizione,
      data.tipo,
      data.stato,
      data.meteo,
      data.veicolo,
      data.speed_limit,
    );
  }

  // Metodi Getters
  get_meteo(): enumMeteoTipo {
    return this.meteo;
  }
  get_veicolo(): enumVeicoloTipo {
    return this.veicolo;
  }
  get_speed_limit(): number {
    return this.speed_limit;
  }

  // Metodi Setters
  set_meteo(meteo: enumMeteoTipo): void {
    this.meteo = meteo;
  }
  set_veicolo(veicolo: enumVeicoloTipo): void {
    this.veicolo = veicolo;
  }
  set_speed_limit(speed_limit: number): void {
    this.speed_limit = speed_limit;
  }
}
