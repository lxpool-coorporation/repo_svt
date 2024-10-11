import { enumMeteoTipo } from '../enum/enumMeteoTipo';
import { enumTransitoStato } from '../enum/enumTransitoStato';
import { eVarco } from '../svt/eVarco';
import { eVeicolo } from '../svt/eVeicolo';

class eVistaTransito {
  //id numerico, Varco, descrizione, id_stato
  private id: number;
  private data_transito: Date;
  private speed: number | null;
  private speed_real: number | null;
  private varco: eVarco;
  private meteo: enumMeteoTipo | null;
  private veicolo: eVeicolo | null;
  private path_immagine: string | null;
  private stato: enumTransitoStato;

  constructor(
    id: number,
    data_transito: Date,
    speed: number | null = null,
    speed_real: number | null = null,
    varco: eVarco,
    meteo: enumMeteoTipo | null = null,
    veicolo: eVeicolo,
    path_immagine: string | null = null,
    stato: enumTransitoStato,
  ) {
    this.id = id;
    this.data_transito = data_transito;
    this.speed = speed;
    this.speed_real = speed_real;
    this.varco = varco;
    this.meteo = meteo;
    this.veicolo = veicolo;
    this.path_immagine = path_immagine;
    this.stato = stato;
  }
}

export { eVistaTransito };
