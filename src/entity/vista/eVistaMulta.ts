import { enumMeteoTipo } from '../enum/enumMeteoTipo';
import { eVeicolo } from '../svt/eVeicolo';
import { eVistaTratta } from './eVistaTratta';

class eVistaMulta {
  //id numerico, Multa, veicolo, id_path_bollettino
  private id: number;
  private tratta: eVistaTratta;
  private veicolo: eVeicolo;
  private meteo: enumMeteoTipo;
  private velocita_media: number;
  private velocita_delta: number;

  constructor(
    id: number,
    tratta: eVistaTratta,
    veicolo: eVeicolo,
    meteo: enumMeteoTipo,
    velocita_media: number,
    velocita_delta: number,
  ) {
    this.id = id;
    this.tratta = tratta;
    this.veicolo = veicolo;
    (this.meteo = meteo), (this.velocita_media = velocita_media);
    this.velocita_delta = velocita_delta;
  }

}

export { eVistaMulta };
